'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { HardDrive, LogOut, User as UserIcon } from 'lucide-react'

interface HeaderProps {
  userEmail?: string | null
}

export function Header({ userEmail }: HeaderProps) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const supabase = createClient()

  async function handleSignOut() {
    try {
      setLoggingOut(true)
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (err) {
      console.error('Çıkış hatası:', err)
      setLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / Marka */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Mini Drive
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              Bulut Depolama
            </span>
          </div>
        </div>

        {/* Kullanıcı Bilgisi ve Çıkış Butonu */}
        <div className="flex items-center gap-3">
          {userEmail && (
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase">
                {userEmail.charAt(0)}
              </span>
              <span className="max-w-[150px] sm:max-w-[220px] truncate">
                {userEmail}
              </span>
            </div>
          )}

          <button
            onClick={handleSignOut}
            disabled={loggingOut}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-red-600 disabled:opacity-50"
            title="Oturumu Kapat"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">
              {loggingOut ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
