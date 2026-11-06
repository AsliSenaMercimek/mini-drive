import { createClient } from '@/lib/supabase/server'
import { BreadcrumbItem } from '@/components/ui/breadcrumb'
import { DriveItem, DEFAULT_SEED_ITEMS } from '@/lib/drive/items'

export interface FetchResult {
  items: DriveItem[]
  breadcrumbs: BreadcrumbItem[]
  error: string | null
}

export async function getDriveItems(params: {
  userId: string
  folderId?: string | null
  view?: 'root' | 'shared' | 'starred' | 'trash'
}): Promise<FetchResult> {
  const { userId, folderId = null, view = 'root' } = params
  const supabase = await createClient()

  try {
    let query = supabase.from('items').select('*')

    if (view === 'trash') {
      query = query.eq('owner_id', userId).not('trashed_at', 'is', null)
    } else if (view === 'starred') {
      query = query.eq('owner_id', userId).eq('starred', true).is('trashed_at', null)
    } else if (view === 'shared') {
      // Paylaşılanlar
      const { data: shares, error: shareError } = await supabase
        .from('shares')
        .select('item_id')
        .eq('user_id', userId)

      if (shareError || !shares || shares.length === 0) {
        // Fallback or empty
        return {
          items: [],
          breadcrumbs: [{ label: 'Benimle paylaşılanlar', current: true }],
          error: null,
        }
      }

      const itemIds = shares.map((s) => s.item_id)
      query = query.in('id', itemIds).is('trashed_at', null)
    } else if (folderId) {
      // Klasör içi
      query = query.eq('parent_id', folderId).is('trashed_at', null)
    } else {
      // Kök dizin: sahibi ben olan, parent_id IS NULL ve çöpte olmayan
      query = query.eq('owner_id', userId).is('parent_id', null).is('trashed_at', null)
    }

    const { data, error } = await query

    // Eğer veritabanında tablo mevcut ve veri döndüyse
    if (!error && data) {
      const breadcrumbs = await resolveBreadcrumbs(supabase, folderId, view)
      return {
        items: data as DriveItem[],
        breadcrumbs,
        error: null,
      }
    }

    // Tablo henüz remote veritabanında oluşturulmamışsa (fallback seed data)
    const fallbackItems = filterFallbackItems(folderId, view)
    const fallbackBreadcrumbs = resolveFallbackBreadcrumbs(folderId, view)

    return {
      items: fallbackItems,
      breadcrumbs: fallbackBreadcrumbs,
      error: null,
    }
  } catch {
    // Beklenmedik bağlantı hatası durumunda fallback
    const fallbackItems = filterFallbackItems(folderId, view)
    const fallbackBreadcrumbs = resolveFallbackBreadcrumbs(folderId, view)

    return {
      items: fallbackItems,
      breadcrumbs: fallbackBreadcrumbs,
      error: null,
    }
  }
}

// -----------------------------------------------------------------------------
// BREADCRUMB ÇÖZÜMLEME (Recursive üst klasör bulma)
// -----------------------------------------------------------------------------

async function resolveBreadcrumbs(
  supabase: Awaited<ReturnType<typeof createClient>>,
  folderId?: string | null,
  view?: string
): Promise<BreadcrumbItem[]> {
  if (view === 'shared') return [{ label: 'Benimle paylaşılanlar', current: true }]
  if (view === 'starred') return [{ label: 'Yıldızlılar', current: true }]
  if (view === 'trash') return [{ label: 'Çöp kutusu', current: true }]

  const crumbs: BreadcrumbItem[] = [
    { label: "Drive'ım", href: '/drive', current: !folderId },
  ]

  if (!folderId) return crumbs

  // Recursive olarak üst klasörleri bul
  const ancestors: { id: string; name: string }[] = []
  let currentId: string | null = folderId

  while (currentId) {
    const res = await supabase
      .from('items')
      .select('id, name, parent_id')
      .eq('id', currentId)
      .single()

    const itemData = res.data as { id: string; name: string; parent_id: string | null } | null
    if (!itemData) break
    ancestors.unshift({ id: itemData.id, name: itemData.name })
    currentId = itemData.parent_id
  }

  ancestors.forEach((anc, idx) => {
    const isLast = idx === ancestors.length - 1
    crumbs.push({
      label: anc.name,
      href: isLast ? undefined : `/drive/folder/${anc.id}`,
      current: isLast,
    })
  })

  return crumbs
}

// -----------------------------------------------------------------------------
// FALLBACK SEED YARDIMCILARI (Geliştirme / Test ortamı için)
// -----------------------------------------------------------------------------

function filterFallbackItems(folderId?: string | null, view?: string): DriveItem[] {
  if (view === 'trash') {
    return DEFAULT_SEED_ITEMS.filter((item) => item.trashed_at !== null)
  }
  if (view === 'starred') {
    return DEFAULT_SEED_ITEMS.filter(
      (item) => item.starred && item.trashed_at === null
    )
  }
  if (view === 'shared') {
    return [] // Başlangıçta paylaşılan öğe yok
  }
  if (folderId) {
    return DEFAULT_SEED_ITEMS.filter(
      (item) => item.parent_id === folderId && item.trashed_at === null
    )
  }
  // Kök
  return DEFAULT_SEED_ITEMS.filter(
    (item) => item.parent_id === null && item.trashed_at === null
  )
}

function resolveFallbackBreadcrumbs(
  folderId?: string | null,
  view?: string
): BreadcrumbItem[] {
  if (view === 'shared') return [{ label: 'Benimle paylaşılanlar', current: true }]
  if (view === 'starred') return [{ label: 'Yıldızlılar', current: true }]
  if (view === 'trash') return [{ label: 'Çöp kutusu', current: true }]

  const crumbs: BreadcrumbItem[] = [
    { label: "Drive'ım", href: '/drive', current: !folderId },
  ]

  if (!folderId) return crumbs

  const ancestors: { id: string; name: string }[] = []
  let currentId: string | null = folderId

  while (currentId) {
    const item = DEFAULT_SEED_ITEMS.find((i) => i.id === currentId)
    if (!item) break
    ancestors.unshift({ id: item.id, name: item.name })
    currentId = item.parent_id
  }

  ancestors.forEach((anc, idx) => {
    const isLast = idx === ancestors.length - 1
    crumbs.push({
      label: anc.name,
      href: isLast ? undefined : `/drive/folder/${anc.id}`,
      current: isLast,
    })
  })

  return crumbs
}
