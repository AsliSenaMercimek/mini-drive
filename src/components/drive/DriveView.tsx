'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  List,
  LayoutGrid,
  Search,
  Folder,
  UploadCloud,
  AlertCircle,
} from 'lucide-react'
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb'
import { Input } from '@/components/ui/input'
import { IconButton } from '@/components/ui/icon-button'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { FileRow, FileItem } from '@/components/ui/file-row'
import { FileCard } from '@/components/ui/file-card'
import { Skeleton } from '@/components/ui/skeleton'
import { DriveItem, resolveFileType, formatFileSize, formatDate } from '@/lib/drive/items'

interface DriveViewProps {
  items: DriveItem[]
  breadcrumbs: BreadcrumbItem[]
  loading?: boolean
  error?: string | null
  emptyTitle?: string
  emptyDescription?: string
}

export function DriveView({
  items,
  breadcrumbs,
  loading = false,
  error = null,
  emptyTitle = 'Bu klasörde henüz dosya yok',
  emptyDescription = 'Dosya yüklemek için aşağıdaki butonu kullanabilirsiniz.',
}: DriveViewProps) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // 1. Sıralama: Önce klasörler, sonra dosyalar; her biri alfabetik
  const sortedItems = [...items].sort((a, b) => {
    if (a.kind === 'folder' && b.kind !== 'folder') return -1
    if (a.kind !== 'folder' && b.kind === 'folder') return 1
    return a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' })
  })

  // 2. Arama filtresi
  const filteredItems = sortedItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 3. FileItem formatına dönüştürme
  const fileItems: FileItem[] = filteredItems.map((item) => ({
    id: item.id,
    name: item.name,
    type: resolveFileType(item.kind, item.mime_type, item.name),
    updatedAt: formatDate(item.updated_at),
    size: item.kind === 'folder' ? undefined : formatFileSize(item.size),
    isFolder: item.kind === 'folder',
  }))

  function handleOpen(file: FileItem) {
    if (file.isFolder) {
      router.push(`/drive/folder/${file.id}`)
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full p-4 sm:p-6 overflow-y-auto">
      {/* Üst Tek Satırlık Araç Çubuğu (Toolbar) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle shrink-0">
        {/* Sol: Breadcrumb */}
        <div className="min-w-0">
          <Breadcrumb
            items={breadcrumbs}
            onItemClick={(item) => {
              if (item.href) router.push(item.href)
            }}
          />
        </div>

        {/* Sağ: Arama Kutusu & Görünüm Geçişi */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-48 sm:w-56">
            <Input
              placeholder="Dosyalarda ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefixIcon={<Search className="h-3.5 w-3.5" strokeWidth={1.75} />}
            />
          </div>

          <div className="flex items-center border border-border-default rounded-[6px] p-0.5 bg-bg-surface">
            <IconButton
              size="sm"
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              onClick={() => setViewMode('list')}
              aria-label="Liste görünümü"
              title="Liste görünümü"
              className={viewMode === 'list' ? 'bg-bg-active text-text-primary' : ''}
            >
              <List className="h-3.5 w-3.5" strokeWidth={1.75} />
            </IconButton>
            <IconButton
              size="sm"
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              onClick={() => setViewMode('grid')}
              aria-label="Izgara görünümü"
              title="Izgara görünümü"
              className={viewMode === 'grid' ? 'bg-bg-active text-text-primary' : ''}
            >
              <LayoutGrid className="h-3.5 w-3.5" strokeWidth={1.75} />
            </IconButton>
          </div>
        </div>
      </div>

      {/* İçerik Alanı */}
      <div className="flex-1 pt-4 min-h-0 flex flex-col">
        {/* Yükleniyor Durumu (Skeleton) */}
        {loading && (
          <div className="space-y-2 py-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 h-[38px] px-3 border-b border-border-subtle"
              >
                <Skeleton className="h-4 w-4 rounded-[4px]" />
                <Skeleton className="h-4 flex-1 rounded-[4px]" />
                <Skeleton className="h-4 w-24 rounded-[4px] hidden sm:block" />
                <Skeleton className="h-4 w-16 rounded-[4px] hidden md:block" />
              </div>
            ))}
          </div>
        )}

        {/* Hata Durumu */}
        {!loading && error && (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="max-w-md w-full p-4 rounded-[8px] border border-danger-border bg-danger-subtle text-danger flex items-start gap-3">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" strokeWidth={1.75} />
              <div className="text-xs">
                <p className="font-medium">Veriler yüklenirken bir sorun oluştu</p>
                <p className="mt-0.5 text-danger/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Boş Durum (EmptyState) */}
        {!loading && !error && fileItems.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-12">
            <EmptyState
              icon={<Folder className="h-5 w-5 text-text-tertiary" strokeWidth={1.75} />}
              title={emptyTitle}
              description={emptyDescription}
              action={
                <Button variant="primary" size="sm">
                  <UploadCloud className="h-3.5 w-3.5" strokeWidth={1.75} />
                  <span>Dosya yükle</span>
                </Button>
              }
              className="w-full max-w-sm"
            />
          </div>
        )}

        {/* Dolu Liste / Izgara Durumu */}
        {!loading && !error && fileItems.length > 0 && (
          <>
            {viewMode === 'list' ? (
              <div className="flex flex-col min-w-0">
                {/* Tablo Başlık Satırı */}
                <div className="flex items-center h-8 px-3 gap-3 text-[11px] font-medium text-text-tertiary border-b border-border-subtle select-none">
                  <div className="w-4 shrink-0" />
                  <div className="w-5 shrink-0" />
                  <div className="flex-1 min-w-0">Ad</div>
                  <div className="w-28 shrink-0 hidden sm:block">Değiştirilme</div>
                  <div className="w-20 shrink-0 text-right hidden md:block">Boyut</div>
                  <div className="w-16 shrink-0" />
                </div>

                {/* Satırlar */}
                <div className="divide-y-0" role="table">
                  {fileItems.map((file) => (
                    <FileRow
                      key={file.id}
                      file={file}
                      selected={selectedId === file.id}
                      onSelect={(sel) => setSelectedId(sel ? file.id : null)}
                      onOpen={handleOpen}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Izgara Görünümü */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
                {fileItems.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    selected={selectedId === file.id}
                    onSelect={(sel) => setSelectedId(sel ? file.id : null)}
                    onOpen={handleOpen}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
