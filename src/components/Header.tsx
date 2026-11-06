'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HardDrive, LogOut, Sun, Moon, Menu } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { useToast } from '@/components/ui/toast'
import { useTheme } from '@/components/ThemeProvider'

interface HeaderProps {
  userEmail?: string | null
  onMenuClick?: () => void
}

export function Header({ userEmail, onMenuClick }: HeaderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { resolvedTheme, toggleTheme } = useTheme()
  const [loggingOut, setLoggingOut] = useState(false)
  const supabase = createClient()

  async function handleSignOut() {
    try {
      setLoggingOut(true)
      await supabase.auth.signOut()
      toast({
        title: 'Çıkış yapıldı',
        description: 'Oturumunuz sonlandırıldı.',
        variant: 'default',
      })
      router.push('/login')
      router.refresh()
    } catch {
      setLoggingOut(false)
      toast({
        title: 'Çıkış yapılamadı',
        description: 'Lütfen tekrar deneyin.',
        variant: 'error',
      })
    }
  }

  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : '?'

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-bg-surface">
      <div className="flex h-12 w-full items-center justify-between px-3 sm:px-6">
        {/* Sol Alan: Menü Butonu (Mobilde) + Logo / Marka */}
        <div className="flex items-center gap-2">
          {onMenuClick && (
            <IconButton
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              aria-label="Menüyü aç"
              className="md:hidden"
            >
              <Menu className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
            </IconButton>
          )}

          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-[6px] border border-border-default bg-bg-subtle text-text-primary">
              <HardDrive className="h-3.5 w-3.5" strokeWidth={1.75} />
            </div>
            <span className="text-sm font-medium text-text-primary tracking-tight">
              Mini Drive
            </span>
          </div>
        </div>

        {/* Sağ Alan: Tema, Kullanıcı Bilgisi, Çıkış Butonu */}
        <div className="flex items-center gap-2 sm:gap-3">
          <IconButton
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={resolvedTheme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
            title={resolvedTheme === 'dark' ? 'Açık tema' : 'Koyu tema'}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
            ) : (
              <Moon className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
            )}
          </IconButton>

          {userEmail && (
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                <AvatarFallback>{initial}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-text-secondary max-w-[100px] sm:max-w-[200px] truncate hidden xs:inline">
                {userEmail}
              </span>
            </div>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={handleSignOut}
            loading={loggingOut}
            disabled={loggingOut}
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">Çıkış Yap</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
