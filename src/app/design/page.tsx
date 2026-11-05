"use client";

import * as React from "react";
import {
  Sun,
  Moon,
  Search,
  Plus,
  Trash2,
  FolderPlus,
  Share2,
  Download,
  MoreHorizontal,
  FileText,
  Clock,
  Sparkles,
  HardDrive,
  Check,
  UploadCloud,
  Layers,
  Palette,
  Type,
  LayoutGrid,
  Command,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Kbd } from "@/components/ui/kbd";
import { FileIcon, FileType } from "@/components/ui/file-icon";
import { FileRow, FileItem } from "@/components/ui/file-row";
import { FileCard } from "@/components/ui/file-card";
import { SidebarItem } from "@/components/ui/sidebar-item";
import { StorageMeter } from "@/components/ui/storage-meter";
import { UploadPanel, UploadItem } from "@/components/ui/upload-panel";

export default function DesignSystemPage() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { toast } = useToast();

  // State for interactive component demos
  const [checkboxState, setCheckboxState] = React.useState(true);
  const [switchState, setSwitchState] = React.useState(true);
  const [selectedFileRowId, setSelectedFileRowId] = React.useState<string>("row-2");
  const [selectedCardId, setSelectedCardId] = React.useState<string>("card-1");
  const [showUploadPanel, setShowUploadPanel] = React.useState(true);

  // Trigger an initial demonstration toast so it is visible immediately
  React.useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "Tasarım Sistemi hazır",
        description: "WCAG AA uyumlu, token tabanlı Mini Drive UI kiti aktif.",
        variant: "success",
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [toast]);

  // Demo file list
  const sampleFiles: FileItem[] = [
    {
      id: "row-1",
      name: "Tasarım Dokümantasyonu",
      type: "folder",
      updatedAt: "Bugün 14:20",
      size: "—",
      isFolder: true,
    },
    {
      id: "row-2",
      name: "Q4_Mali_Rapor.pdf",
      type: "pdf",
      updatedAt: "Dün 09:15",
      size: "2.4 MB",
    },
    {
      id: "row-3",
      name: "ürün-tanıtım-ekranı.png",
      type: "image",
      updatedAt: "28 Eki",
      size: "1.1 MB",
    },
    {
      id: "row-4",
      name: "schema.prisma",
      type: "code",
      updatedAt: "25 Eki",
      size: "14 KB",
    },
  ];

  const uploadItems: UploadItem[] = [
    {
      id: "up-1",
      name: "arşiv-yedek-2026.zip",
      type: "archive",
      progress: 68,
      status: "uploading",
      size: "42.8 MB / 64 MB",
    },
    {
      id: "up-2",
      name: "müşteri_sözleşmesi.pdf",
      type: "pdf",
      progress: 100,
      status: "completed",
      size: "1.2 MB",
    },
    {
      id: "up-3",
      name: "video_analiz.mp4",
      type: "video",
      progress: 25,
      status: "error",
      size: "340 MB",
      errorMessage: "Ağ bağlantısı zaman aşımına uğradı",
    },
  ];

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      {/* Top sticky navigation bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-13 px-6 border-b border-border-default bg-bg-surface/90 backdrop-blur-[2px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-7 w-7 rounded-[6px] bg-accent text-accent-text font-medium text-xs">
            MD
          </div>
          <div>
            <h1 className="text-sm font-medium text-text-primary tracking-tight leading-none">
              Mini Drive Tasarım Sistemi
            </h1>
            <p className="text-[11px] text-text-tertiary mt-0.5 leading-none">
              v1.0 • Doğruluk Kaynağı (Single Source of Truth)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              toast({
                title: "Tasarım Sistemi senkronize",
                description: "Tüm token'lar ve kurallar hazır.",
                variant: "success",
              })
            }
          >
            Toast Testi
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowUploadPanel(!showUploadPanel)}
          >
            {showUploadPanel ? "Yükleme Panelini Gizle" : "Yükleme Panelini Göster"}
          </Button>

          <div className="h-4 w-px bg-border-default mx-1" />

          {/* Theme Switcher Button */}
          <Button
            size="sm"
            variant="secondary"
            onClick={toggleTheme}
            className="gap-1.5"
          >
            {resolvedTheme === "dark" ? (
              <>
                <Sun className="h-3.5 w-3.5 text-warning" strokeWidth={1.75} />
                <span>Açık Tema</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-text-secondary" strokeWidth={1.75} />
                <span>Koyu Tema</span>
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        {/* Intro Banner */}
        <section className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-bg-subtle text-text-secondary text-xs border border-border-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>Sakin • Hızlı • Güven Veren • İşlevsel</span>
          </div>
          <h2 className="text-xl font-medium tracking-tight text-text-primary">
            Arayüz Kılavuzu ve UI Bileşen Seti
          </h2>
          <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
            Mini Drive için tüm ekranlar ve durumlar bu sisteme dayanır.
            Gereksiz katmanlar, abartılı gölgeler veya gradyanlar içermez. Her piksel
            ve bileşen dosya yönetimi işlevine hizmet eder.
          </p>
        </section>

        {/* 1. Design Tokens */}
        <section id="tokens" className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
            <Palette className="h-4 w-4 text-accent" strokeWidth={1.75} />
            <h3 className="text-base font-medium text-text-primary tracking-tight">
              1. Tasarım Token&apos;ları (Design Tokens)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Surface & Background */}
            <div className="rounded-[8px] border border-border-default bg-bg-surface p-3.5 space-y-2.5">
              <h4 className="text-xs font-medium text-text-secondary">Yüzey &amp; Zemin</h4>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-1.5 rounded-[6px] bg-bg-base border border-border-subtle text-xs">
                  <span className="font-mono text-[11px]">bg-base</span>
                  <span className="text-[11px] text-text-tertiary">Zemin</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-[6px] bg-bg-surface border border-border-subtle text-xs">
                  <span className="font-mono text-[11px]">bg-surface</span>
                  <span className="text-[11px] text-text-tertiary">Kart / Panel</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-[6px] bg-bg-subtle border border-border-subtle text-xs">
                  <span className="font-mono text-[11px]">bg-subtle</span>
                  <span className="text-[11px] text-text-tertiary">Hover / İkincil</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-[6px] bg-bg-active border border-border-subtle text-xs">
                  <span className="font-mono text-[11px]">bg-active</span>
                  <span className="text-[11px] text-text-tertiary">Seçili / Basılı</span>
                </div>
              </div>
            </div>

            {/* Typography Colors */}
            <div className="rounded-[8px] border border-border-default bg-bg-surface p-3.5 space-y-2.5">
              <h4 className="text-xs font-medium text-text-secondary">Metin Hiyerarşisi</h4>
              <div className="space-y-1.5">
                <div className="p-1.5 rounded-[6px] bg-bg-subtle text-xs">
                  <p className="text-text-primary font-medium">text-primary (Birincil)</p>
                  <p className="text-[11px] font-mono text-text-tertiary">#121417 / #ededf0</p>
                </div>
                <div className="p-1.5 rounded-[6px] bg-bg-subtle text-xs">
                  <p className="text-text-secondary">text-secondary (İkincil)</p>
                  <p className="text-[11px] font-mono text-text-tertiary">#535763 / #9aa0ac</p>
                </div>
                <div className="p-1.5 rounded-[6px] bg-bg-subtle text-xs">
                  <p className="text-text-tertiary">text-tertiary (Üçüncül / Pasif)</p>
                  <p className="text-[11px] font-mono text-text-tertiary">#848a97 / #696f7c</p>
                </div>
              </div>
            </div>

            {/* Borders & Elevation */}
            <div className="rounded-[8px] border border-border-default bg-bg-surface p-3.5 space-y-2.5">
              <h4 className="text-xs font-medium text-text-secondary">Kenarlık &amp; Yarıçap</h4>
              <div className="space-y-2 text-xs">
                <div className="p-2 border border-border-subtle rounded-[6px]">
                  <span className="font-mono text-[11px]">border-subtle (1px)</span>
                </div>
                <div className="p-2 border border-border-default rounded-[8px]">
                  <span className="font-mono text-[11px]">border-default (8px)</span>
                </div>
                <div className="p-2 border border-border-strong rounded-[12px]">
                  <span className="font-mono text-[11px]">border-strong (12px)</span>
                </div>
              </div>
            </div>

            {/* Accent & Status */}
            <div className="rounded-[8px] border border-border-default bg-bg-surface p-3.5 space-y-2.5">
              <h4 className="text-xs font-medium text-text-secondary">Vurgu &amp; Durum</h4>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-1.5 rounded-[6px] bg-accent text-accent-text text-xs">
                  <span className="font-medium">accent (Indigo/Mavi)</span>
                  <span className="text-[10px] font-mono">2px focus</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-[6px] bg-success-subtle text-success border border-success-border text-xs">
                  <span>success (Başarı)</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-[6px] bg-warning-subtle text-warning border border-warning-border text-xs">
                  <span>warning (Uyarı)</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-[6px] bg-danger-subtle text-danger border border-danger-border text-xs">
                  <span>danger (Hata)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Typography Scale */}
        <section id="typography" className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
            <Type className="h-4 w-4 text-accent" strokeWidth={1.75} />
            <h3 className="text-base font-medium text-text-primary tracking-tight">
              2. Tipografi Ölçeği (Geist / Inter)
            </h3>
          </div>

          <div className="rounded-[8px] border border-border-default bg-bg-surface divide-y divide-border-subtle">
            <div className="p-3.5 flex items-baseline justify-between">
              <div>
                <p className="text-xl font-medium tracking-tight text-text-primary">
                  20px — Sayfa ve Bölüm Başlığı (Display / Title)
                </p>
                <p className="text-xs text-text-tertiary mt-0.5">
                  font-medium (500) • tracking-tight (-0.022em) • line-height: 1.25
                </p>
              </div>
              <span className="text-xs font-mono text-text-tertiary">20px</span>
            </div>

            <div className="p-3.5 flex items-baseline justify-between">
              <div>
                <p className="text-base font-medium tracking-tight text-text-primary">
                  16px — Kart Başlığı ve Modal Başlıkları (Section Header)
                </p>
                <p className="text-xs text-text-tertiary mt-0.5">
                  font-medium (500) • tracking-tight (-0.015em) • line-height: 1.3
                </p>
              </div>
              <span className="text-xs font-mono text-text-tertiary">16px</span>
            </div>

            <div className="p-3.5 flex items-baseline justify-between">
              <div>
                <p className="text-sm font-normal text-text-primary">
                  14px — Standart Gövde Metni, Form Alanları ve Düğmeler (Base Body)
                </p>
                <p className="text-xs text-text-tertiary mt-0.5">
                  font-normal (400) &amp; font-medium (500) • line-height: 1.45
                </p>
              </div>
              <span className="text-xs font-mono text-text-tertiary">14px</span>
            </div>

            <div className="p-3.5 flex items-baseline justify-between">
              <div>
                <p className="text-[13px] font-normal text-text-primary">
                  13px — Dosya Yöneticisi Satırları, Yan Menü ve Yoğun Tablolar (Compact)
                </p>
                <p className="text-xs text-text-tertiary mt-0.5">
                  font-normal (400) &amp; font-medium (500) • line-height: 1.4
                </p>
              </div>
              <span className="text-xs font-mono text-text-tertiary">13px</span>
            </div>

            <div className="p-3.5 flex items-baseline justify-between">
              <div>
                <p className="text-xs text-text-secondary">
                  12px — Yardımcı Bilgiler, Zaman Damgaları, Rozetler ve Kısayollar (Caption)
                </p>
                <p className="text-xs text-text-tertiary mt-0.5">
                  font-normal (400) &amp; font-medium (500) • line-height: 1.35
                </p>
              </div>
              <span className="text-xs font-mono text-text-tertiary">12px</span>
            </div>
          </div>
        </section>

        {/* 3. Base UI Components */}
        <section id="components" className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
            <LayoutGrid className="h-4 w-4 text-accent" strokeWidth={1.75} />
            <h3 className="text-base font-medium text-text-primary tracking-tight">
              3. Temel UI Bileşenleri (components/ui/)
            </h3>
          </div>

          {/* Buttons & Icon Buttons */}
          <div className="rounded-[8px] border border-border-default bg-bg-surface p-4 space-y-4">
            <h4 className="text-xs font-medium text-text-secondary">
              Button &amp; IconButton — Durumlar: Normal, Hover, Loading, Disabled
            </h4>

            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="primary">Birincil (Primary)</Button>
              <Button variant="secondary">İkincil (Secondary)</Button>
              <Button variant="ghost">Hayalet (Ghost)</Button>
              <Button variant="danger">Tehlikeli (Danger)</Button>

              <div className="h-4 w-px bg-border-default" />

              <Button variant="primary" size="sm">
                Küçük (sm)
              </Button>
              <Button variant="secondary" size="md">
                Orta (md)
              </Button>

              <div className="h-4 w-px bg-border-default" />

              <Button variant="secondary" loading>
                Yükleniyor
              </Button>
              <Button variant="secondary" disabled>
                Pasif
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-border-subtle">
              <span className="text-xs text-text-tertiary mr-2">IconButton:</span>
              <IconButton aria-label="Ara" variant="secondary">
                <Search className="h-4 w-4" strokeWidth={1.75} />
              </IconButton>
              <IconButton aria-label="Ekle" variant="primary">
                <Plus className="h-4 w-4" strokeWidth={1.75} />
              </IconButton>
              <IconButton aria-label="İndir" variant="ghost">
                <Download className="h-4 w-4" strokeWidth={1.75} />
              </IconButton>
              <IconButton aria-label="Sil" variant="danger">
                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
              </IconButton>
              <IconButton aria-label="Yükleniyor" variant="secondary" loading />
              <IconButton aria-label="Pasif" variant="secondary" disabled>
                <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
              </IconButton>
            </div>
          </div>

          {/* Form Controls: Input, Select, Checkbox, Switch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Inputs & Selects */}
            <div className="rounded-[8px] border border-border-default bg-bg-surface p-4 space-y-3.5">
              <h4 className="text-xs font-medium text-text-secondary">
                Giriş Alanları (Input &amp; Select)
              </h4>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Normal Giriş (Prefix İkonlu)
                  </label>
                  <Input
                    placeholder="Dosya veya klasör ara..."
                    prefixIcon={<Search className="h-3.5 w-3.5" strokeWidth={1.75} />}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Hata Durumu (Error state)
                  </label>
                  <Input
                    defaultValue="gecersiz_dosya_adi?.txt"
                    error
                    suffixIcon={<span className="text-[11px] text-danger">Geçersiz karakter</span>}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Pasif Alan (Disabled)
                  </label>
                  <Input defaultValue="salt-okunur-alan" disabled />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Seçim Kutusu (Select)
                  </label>
                  <Select defaultValue="name">
                    <SelectTrigger>
                      <SelectValue placeholder="Sıralama ölçütü" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Ada göre sırala</SelectItem>
                      <SelectItem value="date">Değiştirilme tarihine göre</SelectItem>
                      <SelectItem value="size">Boyuta göre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Checkbox, Switch & Badges */}
            <div className="rounded-[8px] border border-border-default bg-bg-surface p-4 space-y-3.5">
              <h4 className="text-xs font-medium text-text-secondary">
                Seçim &amp; Durum (Checkbox, Switch, Badge)
              </h4>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="chk-demo"
                    checked={checkboxState}
                    onCheckedChange={(c) => setCheckboxState(Boolean(c))}
                  />
                  <label htmlFor="chk-demo" className="text-xs text-text-primary cursor-pointer select-none">
                    Tüm alt klasörleri ve gizli öğeleri dahil et
                  </label>
                </div>

                <div className="flex items-center gap-2 opacity-50 pointer-events-none">
                  <Checkbox checked disabled />
                  <span className="text-xs text-text-secondary select-none">
                    Devre dışı bırakılmış seçenek
                  </span>
                </div>

                <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-text-primary">Otomatik yedekleme</p>
                    <p className="text-[11px] text-text-tertiary">Değişiklikleri anında senkronize et</p>
                  </div>
                  <Switch
                    checked={switchState}
                    onCheckedChange={setSwitchState}
                    aria-label="Otomatik yedekleme"
                  />
                </div>

                <div className="pt-2 border-t border-border-subtle">
                  <p className="text-xs font-medium text-text-secondary mb-2">Rozetler (Badges)</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="default">Varsayılan</Badge>
                    <Badge variant="accent">Vurgulu</Badge>
                    <Badge variant="success">Tamamlandı</Badge>
                    <Badge variant="warning">Beklemede</Badge>
                    <Badge variant="danger">Başarısız</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menus, Dialog & Interactive Popovers */}
          <div className="rounded-[8px] border border-border-default bg-bg-surface p-4 space-y-4">
            <h4 className="text-xs font-medium text-text-secondary">
              Açılır Menüler &amp; Modal (DropdownMenu, ContextMenu, Dialog, Tooltip)
            </h4>

            <div className="flex flex-wrap items-center gap-3">
              {/* Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary">
                    İşlem Menüsü
                    <MoreHorizontal className="h-3.5 w-3.5 ml-1.5" strokeWidth={1.75} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    Yeni Klasör
                    <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Dosya Yükle
                    <DropdownMenuShortcut>⌘U</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem danger>
                    Çöp Kutusuna Gönder
                    <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Context Menu right click trigger */}
              <ContextMenu>
                <ContextMenuTrigger className="flex h-8 items-center px-3 rounded-[6px] border border-dashed border-border-default text-xs text-text-secondary bg-bg-subtle/50 select-none cursor-context-menu">
                  Sağ tıkla (Context Menu)
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Önizle</ContextMenuItem>
                  <ContextMenuItem>Bağlantıyı Kopyala</ContextMenuItem>
                  <ContextMenuItem>Yeniden Adlandır</ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem danger>Kalıcı Olarak Sil</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>

              {/* Tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost">Tooltip Üzerine Gel</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Kısayol: ⌘K ile arama yap</p>
                </TooltipContent>
              </Tooltip>

              {/* Dialog / Modal */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="primary">Yeni Klasör Oluştur (Modal)</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Yeni Klasör</DialogTitle>
                    <DialogDescription>
                      Mevcut dizin içerisine eklenecek klasörün adını belirleyin.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-2">
                    <Input placeholder="Klasör adı" defaultValue="Proje Belgeleri" autoFocus />
                  </div>
                  <DialogFooter>
                    <Button variant="ghost">İptal</Button>
                    <Button variant="primary">Oluştur</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Navigation, Progress & Utilities (Tabs, Breadcrumb, Progress, Skeleton, Kbd) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-[8px] border border-border-default bg-bg-surface p-4 space-y-3.5">
              <h4 className="text-xs font-medium text-text-secondary">
                Navigasyon &amp; Kısayollar (Breadcrumb, Tabs, Kbd)
              </h4>

              <div className="space-y-3">
                <Breadcrumb
                  items={[
                    { label: "Dosyalarım" },
                    { label: "Müşteriler" },
                    { label: "2026 Tasarımları", current: true },
                  ]}
                />

                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">Tümü</TabsTrigger>
                    <TabsTrigger value="documents">Belgeler</TabsTrigger>
                    <TabsTrigger value="media">Medya</TabsTrigger>
                    <TabsTrigger value="shared">Paylaşılanlar</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="text-xs text-text-secondary p-1">
                    Aktif sekme: Tümü listesi
                  </TabsContent>
                </Tabs>

                <div className="pt-2 border-t border-border-subtle flex items-center gap-2">
                  <span className="text-xs text-text-secondary">Klavye Kısayolları (Kbd):</span>
                  <Kbd>⌘K</Kbd>
                  <Kbd>Esc</Kbd>
                  <Kbd>↵</Kbd>
                  <Kbd>⇧⌘P</Kbd>
                </div>
              </div>
            </div>

            <div className="rounded-[8px] border border-border-default bg-bg-surface p-4 space-y-3.5">
              <h4 className="text-xs font-medium text-text-secondary">
                Geri Bildirim &amp; Yükleniyor (Progress, Skeleton, Avatar)
              </h4>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>Dosya yükleniyor</span>
                    <span className="font-mono text-[11px]">75%</span>
                  </div>
                  <Progress value={75} />
                </div>

                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] text-text-tertiary">Skeleton (Yüklenme durumu):</p>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-7 w-7 rounded-[4px]" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-2.5 w-1/2" />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border-subtle flex items-center gap-3">
                  <span className="text-xs text-text-secondary">Avatar:</span>
                  <Avatar size="sm">
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <Avatar size="md">
                    <AvatarFallback>MD</AvatarFallback>
                  </Avatar>
                  <Avatar size="lg">
                    <AvatarFallback>AG</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State Showcase */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-text-secondary">
              Boş Durum (EmptyState) — Sakin, Kısa, Ünlemsiz Türkçe Metin
            </h4>
            <EmptyState
              title="Bu klasörde henüz dosya yok"
              description="Yeni bir dosya yüklemek veya klasör eklemek için yukarıdaki butonları kullanabilirsiniz."
              action={
                <Button variant="secondary" size="sm">
                  <UploadCloud className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.75} />
                  Dosya Yükle
                </Button>
              }
            />
          </div>
        </section>

        {/* 4. App-Specific Components */}
        <section id="app-components" className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
            <Layers className="h-4 w-4 text-accent" strokeWidth={1.75} />
            <h3 className="text-base font-medium text-text-primary tracking-tight">
              4. Mini Drive Uygulamasına Özel Bileşenler
            </h3>
          </div>

          {/* FileIcon Set */}
          <div className="rounded-[8px] border border-border-default bg-bg-surface p-4 space-y-3">
            <div>
              <h4 className="text-xs font-medium text-text-primary">
                FileIcon — Türe Göre İkon Ailesi (Tekil Muted Renk Dili)
              </h4>
              <p className="text-[11px] text-text-tertiary">
                Gereksiz gökkuşağı renkleri yok. Sade, net ve işlevsel stroke: 1.75.
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3 text-center">
              {[
                { type: "folder", label: "Klasör" },
                { type: "document", label: "Belge" },
                { type: "pdf", label: "PDF" },
                { type: "spreadsheet", label: "Tablo" },
                { type: "image", label: "Görsel" },
                { type: "video", label: "Video" },
                { type: "audio", label: "Ses" },
                { type: "code", label: "Kod" },
                { type: "archive", label: "Arşiv" },
              ].map((item) => (
                <div
                  key={item.type}
                  className="flex flex-col items-center justify-center p-2 rounded-[6px] bg-bg-subtle/50 border border-border-subtle"
                >
                  <FileIcon type={item.type as FileType} size="md" />
                  <span className="text-[11px] text-text-secondary mt-1.5">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FileRow (List view) */}
          <div className="rounded-[8px] border border-border-default bg-bg-surface overflow-hidden">
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border-default bg-bg-subtle/40">
              <span className="text-xs font-medium text-text-primary">
                FileRow (Liste Görünümü — Kompakt 38px Satır Yüksekliği)
              </span>
              <span className="text-[11px] text-text-tertiary font-mono">
                Linear / Finder tarzı hover &amp; seçim
              </span>
            </div>

            {/* List Header */}
            <div className="flex items-center h-7 px-3 text-[11px] font-medium text-text-tertiary bg-bg-surface border-b border-border-subtle select-none">
              <div className="w-5 shrink-0" />
              <div className="w-6 shrink-0" />
              <div className="flex-1">Ad</div>
              <div className="w-28 shrink-0 hidden sm:block">Son Değişiklik</div>
              <div className="w-20 shrink-0 text-right hidden md:block">Boyut</div>
              <div className="w-20 shrink-0" />
            </div>

            {/* Rows */}
            <div className="divide-y divide-border-subtle">
              {sampleFiles.map((file) => (
                <FileRow
                  key={file.id}
                  file={file}
                  selected={selectedFileRowId === file.id}
                  onSelect={(sel) =>
                    setSelectedFileRowId(sel ? file.id : "")
                  }
                  onOpen={(f) =>
                    toast({
                      title: "Dosya açıldı",
                      description: f.name,
                      variant: "default",
                    })
                  }
                  onDownload={(f) =>
                    toast({
                      title: "İndirme başlatıldı",
                      description: f.name,
                      variant: "success",
                    })
                  }
                />
              ))}
            </div>
          </div>

          {/* FileCard (Grid view) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium text-text-secondary">
                FileCard (Izgara / Grid Görünümü)
              </h4>
              <span className="text-[11px] text-text-tertiary">
                Tıklanabilir, seçilebilir kartlar
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sampleFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  selected={selectedCardId === file.id}
                  onSelect={(sel) =>
                    setSelectedCardId(sel ? file.id : "")
                  }
                  onOpen={(f) =>
                    toast({
                      title: "Dosya açıldı",
                      description: f.name,
                      variant: "default",
                    })
                  }
                />
              ))}
            </div>
          </div>

          {/* Sidebar & StorageMeter showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sidebar navigation preview */}
            <div className="md:col-span-1 rounded-[8px] border border-border-default bg-bg-surface p-3 space-y-1">
              <p className="text-[11px] font-medium text-text-tertiary px-2 pb-1 uppercase tracking-wider">
                Yan Menü (SidebarItem)
              </p>
              <SidebarItem
                icon={<HardDrive className="h-4 w-4" strokeWidth={1.75} />}
                label="Dosyalarım"
                badge={142}
                active
              />
              <SidebarItem
                icon={<Clock className="h-4 w-4" strokeWidth={1.75} />}
                label="Son Kullanılanlar"
              />
              <SidebarItem
                icon={<Share2 className="h-4 w-4" strokeWidth={1.75} />}
                label="Paylaşılanlar"
                badge={6}
              />
              <SidebarItem
                icon={<Trash2 className="h-4 w-4" strokeWidth={1.75} />}
                label="Çöp Kutusu"
              />
            </div>

            {/* StorageMeter preview */}
            <div className="md:col-span-2 flex flex-col justify-center rounded-[8px] border border-border-default bg-bg-surface p-4">
              <StorageMeter
                usedBytes={15247133900}
                totalBytes={21474836480}
                planName="Pro 20 GB"
                onUpgrade={() =>
                  toast({
                    title: "Depolama planı",
                    description: "Depolama yükseltme ekranı açılıyor.",
                  })
                }
              />
            </div>
          </div>
        </section>

        {/* Floating UploadPanel Demo */}
        {showUploadPanel && (
          <UploadPanel
            items={uploadItems}
            onCancelItem={(id) =>
              toast({
                title: "İptal edildi",
                description: `Öğe ${id} yüklemesi durduruldu.`,
                variant: "warning",
              })
            }
            onClose={() => setShowUploadPanel(false)}
          />
        )}
      </main>
    </div>
  );
}
