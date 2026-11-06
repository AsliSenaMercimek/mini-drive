'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HardDrive, Share2, Star, Trash2 } from 'lucide-react'
import { SidebarItem } from '@/components/ui/sidebar-item'
import { StorageMeter } from '@/components/ui/storage-meter'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
  onItemClick?: () => void
}

export function Sidebar({ className, onItemClick }: SidebarProps) {
  const pathname = usePathname()

  const isMyDrive = pathname === '/drive' || pathname.startsWith('/drive/folder')
  const isShared = pathname === '/drive/shared'
  const isStarred = pathname === '/drive/starred'
  const isTrash = pathname === '/drive/trash'

  return (
    <aside
      className={cn(
        "w-[240px] shrink-0 flex flex-col justify-between bg-bg-subtle p-3 select-none",
        className
      )}
    >
      {/* Üst Kısım: Menü Öğeleri */}
      <nav className="flex flex-col gap-1 w-full" aria-label="Drive Gezintisi">
        <Link href="/drive" onClick={onItemClick} className="w-full">
          <SidebarItem
            icon={<HardDrive className="h-4 w-4" strokeWidth={1.75} />}
            label="Drive'ım"
            active={isMyDrive}
          />
        </Link>

        <Link href="/drive/shared" onClick={onItemClick} className="w-full">
          <SidebarItem
            icon={<Share2 className="h-4 w-4" strokeWidth={1.75} />}
            label="Benimle paylaşılanlar"
            active={isShared}
          />
        </Link>

        <Link href="/drive/starred" onClick={onItemClick} className="w-full">
          <SidebarItem
            icon={<Star className="h-4 w-4" strokeWidth={1.75} />}
            label="Yıldızlılar"
            active={isStarred}
          />
        </Link>

        <Link href="/drive/trash" onClick={onItemClick} className="w-full">
          <SidebarItem
            icon={<Trash2 className="h-4 w-4" strokeWidth={1.75} />}
            label="Çöp kutusu"
            active={isTrash}
          />
        </Link>
      </nav>

      {/* Alt Kısım: StorageMeter (Sahte değerle) */}
      <div className="pt-4">
        <StorageMeter
          usedBytes={3.8 * 1024 * 1024 * 1024} // 3.8 GB
          totalBytes={15 * 1024 * 1024 * 1024} // 15 GB
          planName="Ücretsiz"
        />
      </div>
    </aside>
  )
}
