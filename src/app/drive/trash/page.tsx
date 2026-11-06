import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDriveItems } from '@/lib/drive/data'
import { DriveView } from '@/components/drive/DriveView'

export default async function TrashPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { items, breadcrumbs, error } = await getDriveItems({
    userId: user.id,
    view: 'trash',
  })

  return (
    <DriveView
      items={items}
      breadcrumbs={breadcrumbs}
      error={error}
      emptyTitle="Çöp kutusu boş"
      emptyDescription="Sildiğiniz dosya ve klasörler burada saklanır."
    />
  )
}
