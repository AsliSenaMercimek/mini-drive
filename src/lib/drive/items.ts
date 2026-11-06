import { FileType } from "@/components/ui/file-icon";

export interface DriveItem {
  id: string;
  owner_id: string;
  parent_id: string | null;
  name: string;
  kind: 'file' | 'folder';
  mime_type?: string | null;
  size?: number | null;
  starred: boolean;
  trashed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export function resolveFileType(
  kind: string,
  mimeType?: string | null,
  name?: string
): FileType {
  if (kind === 'folder') return 'folder';

  const ext = name?.split('.').pop()?.toLowerCase();
  if (ext) {
    if (ext === 'pdf') return 'pdf';
    if (['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes(ext)) return 'image';
    if (['mp4', 'mov', 'webm', 'mkv'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) return 'audio';
    if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) return 'archive';
    if (['xlsx', 'xls', 'csv'].includes(ext)) return 'spreadsheet';
    if (['doc', 'docx', 'txt', 'md', 'rtf'].includes(ext)) return 'document';
    if (['ts', 'tsx', 'js', 'jsx', 'json', 'py', 'html', 'css', 'sql', 'sh'].includes(ext)) return 'code';
  }

  if (mimeType) {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'archive';
    if (mimeType.includes('sheet') || mimeType.includes('excel') || mimeType.includes('csv')) return 'spreadsheet';
    if (mimeType.includes('word') || mimeType.includes('text/')) return 'document';
  }

  return 'generic';
}

export function formatFileSize(bytes?: number | null): string {
  if (bytes === undefined || bytes === null || bytes === 0) return '—';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

// Fallback seed verileri (Veritabanında henüz items tablosu yoksa geliştirici/test için devreye girer)
export const DEFAULT_SEED_ITEMS: DriveItem[] = [
  {
    id: "f1000000-0000-0000-0000-000000000001",
    owner_id: "default",
    parent_id: null,
    name: "Belgeler",
    kind: "folder",
    mime_type: null,
    size: 0,
    starred: false,
    trashed_at: null,
    created_at: "2026-11-01T10:00:00Z",
    updated_at: "2026-11-05T12:00:00Z",
  },
  {
    id: "f1000000-0000-0000-0000-000000000002",
    owner_id: "default",
    parent_id: null,
    name: "Görseller",
    kind: "folder",
    mime_type: null,
    size: 0,
    starred: false,
    trashed_at: null,
    created_at: "2026-11-01T11:00:00Z",
    updated_at: "2026-11-04T15:30:00Z",
  },
  {
    id: "f1000000-0000-0000-0000-000000000003",
    owner_id: "default",
    parent_id: null,
    name: "Projeler",
    kind: "folder",
    mime_type: null,
    size: 0,
    starred: true,
    trashed_at: null,
    created_at: "2026-11-02T09:00:00Z",
    updated_at: "2026-11-06T01:00:00Z",
  },
  {
    id: "f1000000-0000-0000-0000-000000000004",
    owner_id: "default",
    parent_id: null,
    name: "Boş Klasör",
    kind: "folder",
    mime_type: null,
    size: 0,
    starred: false,
    trashed_at: null,
    created_at: "2026-11-03T14:00:00Z",
    updated_at: "2026-11-03T14:00:00Z",
  },
  {
    id: "f2000000-0000-0000-0000-000000000001",
    owner_id: "default",
    parent_id: "f1000000-0000-0000-0000-000000000003", // Projeler içinde
    name: "2026 Tasarımları",
    kind: "folder",
    mime_type: null,
    size: 0,
    starred: false,
    trashed_at: null,
    created_at: "2026-11-02T10:00:00Z",
    updated_at: "2026-11-05T18:00:00Z",
  },
  // Kök dosyaları
  {
    id: "d1000000-0000-0000-0000-000000000001",
    owner_id: "default",
    parent_id: null,
    name: "Şirket Sunumu.pdf",
    kind: "file",
    mime_type: "application/pdf",
    size: 2516582,
    starred: true,
    trashed_at: null,
    created_at: "2026-11-03T08:00:00Z",
    updated_at: "2026-11-05T11:20:00Z",
  },
  {
    id: "d1000000-0000-0000-0000-000000000002",
    owner_id: "default",
    parent_id: null,
    name: "Finansal Rapor.xlsx",
    kind: "file",
    mime_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 860160,
    starred: false,
    trashed_at: null,
    created_at: "2026-11-04T09:30:00Z",
    updated_at: "2026-11-04T09:30:00Z",
  },
  {
    id: "d1000000-0000-0000-0000-000000000003",
    owner_id: "default",
    parent_id: null,
    name: "Logo_Master.svg",
    kind: "file",
    mime_type: "image/svg+xml",
    size: 46080,
    starred: false,
    trashed_at: null,
    created_at: "2026-11-01T15:00:00Z",
    updated_at: "2026-11-01T15:00:00Z",
  },
  {
    id: "d1000000-0000-0000-0000-000000000004",
    owner_id: "default",
    parent_id: null,
    name: "Toplantı Notları.txt",
    kind: "file",
    mime_type: "text/plain",
    size: 12288,
    starred: false,
    trashed_at: null,
    created_at: "2026-11-05T16:45:00Z",
    updated_at: "2026-11-05T16:45:00Z",
  },
  // Belgeler içindeki dosyalar
  {
    id: "d2000000-0000-0000-0000-000000000001",
    owner_id: "default",
    parent_id: "f1000000-0000-0000-0000-000000000001",
    name: "Müşteri Sözleşmesi.pdf",
    kind: "file",
    mime_type: "application/pdf",
    size: 1153433,
    starred: true,
    trashed_at: null,
    created_at: "2026-11-02T11:00:00Z",
    updated_at: "2026-11-04T14:10:00Z",
  },
  {
    id: "d2000000-0000-0000-0000-000000000002",
    owner_id: "default",
    parent_id: "f1000000-0000-0000-0000-000000000001",
    name: "Protokol Tutanakları.docx",
    kind: "file",
    mime_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 327680,
    starred: false,
    trashed_at: null,
    created_at: "2026-11-03T13:20:00Z",
    updated_at: "2026-11-03T13:20:00Z",
  },
  // Görseller içindeki dosyalar
  {
    id: "d3000000-0000-0000-0000-000000000001",
    owner_id: "default",
    parent_id: "f1000000-0000-0000-0000-000000000002",
    name: "Banner_Desktop.png",
    kind: "file",
    mime_type: "image/png",
    size: 3984588,
    starred: false,
    trashed_at: null,
    created_at: "2026-11-04T10:00:00Z",
    updated_at: "2026-11-04T10:00:00Z",
  },
  {
    id: "d3000000-0000-0000-0000-000000000002",
    owner_id: "default",
    parent_id: "f1000000-0000-0000-0000-000000000002",
    name: "Ekran_Görüntüsü.png",
    kind: "file",
    mime_type: "image/png",
    size: 972800,
    starred: false,
    trashed_at: null,
    created_at: "2026-11-05T08:15:00Z",
    updated_at: "2026-11-05T08:15:00Z",
  },
  // Projeler > 2026 Tasarımları içindeki dosyalar
  {
    id: "d4000000-0000-0000-0000-000000000001",
    owner_id: "default",
    parent_id: "f2000000-0000-0000-0000-000000000001",
    name: "Mini_Drive_Mimari.pdf",
    kind: "file",
    mime_type: "application/pdf",
    size: 1887436,
    starred: true,
    trashed_at: null,
    created_at: "2026-11-05T14:30:00Z",
    updated_at: "2026-11-05T14:30:00Z",
  },
  {
    id: "d4000000-0000-0000-0000-000000000002",
    owner_id: "default",
    parent_id: "f2000000-0000-0000-0000-000000000001",
    name: "Arayüz_Bileşenleri.zip",
    kind: "file",
    mime_type: "application/zip",
    size: 15204352,
    starred: false,
    trashed_at: null,
    created_at: "2026-11-05T16:00:00Z",
    updated_at: "2026-11-05T16:00:00Z",
  },
  // Çöp kutusu dosyaları
  {
    id: "d5000000-0000-0000-0000-000000000001",
    owner_id: "default",
    parent_id: null,
    name: "Eski_Taslak.txt",
    kind: "file",
    mime_type: "text/plain",
    size: 4096,
    starred: false,
    trashed_at: "2026-11-04T07:00:00Z",
    created_at: "2026-10-20T10:00:00Z",
    updated_at: "2026-11-04T07:00:00Z",
  },
  {
    id: "d5000000-0000-0000-0000-000000000002",
    owner_id: "default",
    parent_id: null,
    name: "Eski_Arşiv.zip",
    kind: "file",
    mime_type: "application/zip",
    size: 5242880,
    starred: false,
    trashed_at: "2026-11-02T12:00:00Z",
    created_at: "2026-10-15T09:00:00Z",
    updated_at: "2026-11-02T12:00:00Z",
  },
];
