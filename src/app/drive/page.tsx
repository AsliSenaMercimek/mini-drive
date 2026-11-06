import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDriveItems } from '@/lib/drive/data'
import { DriveView } from '@/components/drive/DriveView'

export default async function DrivePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { items, breadcrumbs, error } = await getDriveItems({
    userId: user.id,
    view: 'root',
  })

  return (
    <DriveView
      items={items}
      breadcrumbs={breadcrumbs}
      error={error}
      emptyTitle="Bu klasörde henüz dosya yok"
      emptyDescription="Dosya yüklemek için yukarıdaki Dosya Yükle butonunu kullanabilir veya yeni bir klasör oluşturabilirsiniz."
    />
  )
}
