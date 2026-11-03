import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/Header'
import {
  Folder,
  UploadCloud,
  FolderPlus,
  Share2,
  Star,
  Trash2,
  HardDrive,
} from 'lucide-react'

export default async function DrivePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Üst Bar */}
      <Header userEmail={user.email} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Sol Menü (Sidebar) */}
        <aside className="w-56 shrink-0 hidden md:flex flex-col gap-1">
          <div className="mb-4">
            <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition">
              <UploadCloud className="h-4 w-4" />
              <span>Yeni Yükle</span>
            </button>
          </div>

          <nav className="space-y-1">
            <a
              href="#my-drive"
              className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700"
            >
              <HardDrive className="h-4 w-4" />
              <span>Dosyalarım</span>
            </a>
            <a
              href="#shared"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
            >
              <Share2 className="h-4 w-4" />
              <span>Benimle Paylaşılanlar</span>
            </a>
            <a
              href="#starred"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
            >
              <Star className="h-4 w-4" />
              <span>Yıldızlılar</span>
            </a>
            <a
              href="#trash"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
            >
              <Trash2 className="h-4 w-4" />
              <span>Çöp Kutusu</span>
            </a>
          </nav>
        </aside>

        {/* Ana İçerik */}
        <main className="flex-1 flex flex-col">
          {/* Başlık Çubuğu */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dosyalarım</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Hoş geldiniz, <span className="font-medium text-gray-700">{user.email}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition">
                <FolderPlus className="h-4 w-4 text-blue-600" />
                <span>Yeni Klasör</span>
              </button>
            </div>
          </div>

          {/* Dosya / Klasör Listesi Boş Durumu */}
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
              <Folder className="h-8 w-8 stroke-1" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              Henüz burada hiçbir dosya veya klasör yok
            </h3>
            <p className="mt-1 max-w-sm text-xs sm:text-sm text-gray-500">
              Dosya yüklemek için &ldquo;Yeni Yükle&rdquo; butonunu kullanabilir veya bir klasör oluşturabilirsiniz.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
