import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/Header'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { UploadCloud, FolderPlus } from 'lucide-react'

export default async function DrivePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      {/* Üst Bar */}
      <Header userEmail={user.email} />

      {/* Ana Gövde */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Başlık ve Eylemler */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-text-primary tracking-tight">
              Dosyalarım
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Tüm dosyalarınız ve klasörleriniz
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <FolderPlus className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>Yeni Klasör</span>
            </Button>
            <Button variant="primary" size="sm">
              <UploadCloud className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>Dosya Yükle</span>
            </Button>
          </div>
        </div>

        {/* Boş Durum İskeleti */}
        <div className="flex-1 flex items-center justify-center py-12">
          <EmptyState
            title="Bu klasörde henüz dosya yok"
            description="Dosya yüklemek için yukarıdaki Dosya Yükle butonunu kullanabilir veya yeni bir klasör oluşturabilirsiniz."
            className="w-full max-w-lg"
          />
        </div>
      </main>
    </div>
  )
}
