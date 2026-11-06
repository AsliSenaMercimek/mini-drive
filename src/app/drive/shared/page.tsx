import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDriveItems } from '@/lib/drive/data'
import { DriveView } from '@/components/drive/DriveView'

export default async function SharedPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { items, breadcrumbs, error } = await getDriveItems({
    userId: user.id,
    view: 'shared',
  })

  return (
    <DriveView
      items={items}
      breadcrumbs={breadcrumbs}
      error={error}
      emptyTitle="Benimle paylaşılan dosya yok"
      emptyDescription="Diğer kullanıcıların sizinle paylaştığı dosyalar burada görünür."
    />
  )
}
