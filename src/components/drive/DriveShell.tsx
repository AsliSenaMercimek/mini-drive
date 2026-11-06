'use client'

import * as React from 'react'
import { useState } from 'react'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/drive/Sidebar'
import { X } from 'lucide-react'
import { IconButton } from '@/components/ui/icon-button'

interface DriveShellProps {
  userEmail?: string | null
  children: React.ReactNode
}

export function DriveShell({ userEmail, children }: DriveShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg-base flex flex-col h-screen overflow-hidden">
      {/* Üst Bar */}
      <Header
        userEmail={userEmail}
        onMenuClick={() => setMobileMenuOpen(true)}
      />

      <div className="flex-1 flex w-full overflow-hidden relative">
        {/* Masaüstü Sidebar (240px, belirgin kenarlık yok, bg-bg-subtle) */}
        <Sidebar className="hidden md:flex border-r border-border-subtle/50" />

        {/* Mobil Drawer Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sidebar Drawer */}
            <div className="relative z-50 w-[240px] max-w-[80vw] bg-bg-subtle h-full flex flex-col shadow-modal animate-in slide-in-from-left duration-150">
              <div className="flex items-center justify-between p-3 border-b border-border-subtle">
                <span className="text-xs font-medium text-text-primary">
                  Menü
                </span>
                <IconButton
                  variant="ghost"
                  size="sm"
                  aria-label="Menüyü kapat"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
                </IconButton>
              </div>

              <Sidebar
                className="w-full flex-1"
                onItemClick={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Ana İçerik Alanı */}
        <div className="flex-1 flex flex-col min-w-0 bg-bg-base overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
