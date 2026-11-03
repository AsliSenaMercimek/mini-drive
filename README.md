<div align="center">

# ☁️ Mini Drive

**Next.js 16, Supabase ve PostgreSQL ile Güçlendirilmiş Modern Bulut Depolama Platformu**

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-blue?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br />

<p align="center">
  <b>Mini Drive</b>; Google Drive deneyimini modern web standartlarıyla buluşturan, yüksek güvenlikli, ölçeklenebilir ve tam yetkilendirmeli bir açık kaynak bulut depolama çözümüdür.
</p>

[✨ Özellikler](#-özellikler) • [🏗️ Mimari](#️-mimari-ve-güvenlik) • [🚀 Hızlı Başlangıç](#-hızlı-başlangıç) • [🗄️ Veritabanı Şeması](#️-veritabanı-şeması) • [🗺️ Yol Haritası](#️-yol-haritası)

---

</div>

## 🌟 Öne Çıkan Özellikler

- **🔐 Güçlü Kimlik Doğrulama (Supabase SSR & Auth):**
  - Next.js Middleware ve Server-Side Cookie desteğiyle korunan rotalar.
  - E-posta / Şifre ile kayıt, güvenli oturum açma, oturum yenileme ve çıkış.
  - Şık hata yönetimi ve Türkçe hata mesajı çevirisi.

- **📁 Hiyerarşik Dosya ve Klasör Mimarisi:**
  - İç içe sınırsız derinlikte klasör oluşturma ve ağaç hiyerarşisi (`parent_id`).
  - Dosya ve klasör ayrımı, MIME türü desteği, dinamik boyut takibi.

- **🛡️ Kurumsal Seviye RLS & Rekürsif İzin Mirası:**
  - PostgreSQL **Row Level Security (RLS)** ile veri izolasyonu.
  - Rekürsif CTE (`has_item_access`) fonksiyonu sayesinde bir üst klasöre verilen erişim hakkının (viewer/editor) tüm alt klasör ve dosyalara otomatik ve güvenli yansıması.
  - Direkt ve dolaylı izin denetimleri (Yetkisiz kullanıcılar hiçbir sorguyla başkalarının verilerine erişemez).

- **⚡ Güvenli Nesne Depolama (Supabase Storage):**
  - Dosyalar için özel ayrılmış `drive-files` depolama kovası (bucket).
  - Storage nesnelerine yönelik RLS entegrasyonu; sadece yetkili kullanıcılar dosyaları indirebilir veya görüntüleyebilir.

- **⭐ Favoriler & 🗑️ Çöp Kutusu (Soft Delete):**
  - Dosyaları anında favorilere ekleme ve kolay erişim.
  - Kalıcı silme öncesi kurtarılabilir çöp kutusu (`trashed_at`) yapısı.

- **🎨 Modern & Responsive Arayüz:**
  - Tailwind CSS v4 ile sıfır konfigürasyon, ultra hızlı render.
  - Lucide Icons ile modern, temiz ve estetik görsel dil.
  - Mobil, tablet ve masaüstü uyumlu esnek tasarım.

---

## 🏗️ Mimari ve Güvenlik

Mini Drive, modern "Full-Stack Serverless" mimarisini temel alır:

```text
┌────────────────────────────────────────────────────────┐
│               İstemci & Tarayıcı (Next.js)              │
│  - /drive (Dashboard)  - /login (Auth)  - Components   │
└───────────────────────────┬────────────────────────────┘
                            │
               HTTPS / SSR Middleware (Cookie)
                            │
┌───────────────────────────▼────────────────────────────┐
│                    Supabase Backend                    │
│                                                        │
│  ┌─────────────────────────┐  ┌──────────────────────┐ │
│  │      Supabase Auth      │  │   Supabase Storage   │ │
│  │ (JWT, Session, Cookies) │  │    (drive-files)     │ │
│  └────────────┬────────────┘  └──────────┬───────────┘ │
│               │                          │             │
│  ┌────────────▼──────────────────────────▼───────────┐ │
│  │              PostgreSQL Veritabanı                │ │
│  │  - public.items (Dosya & Klasör hiyerarşisi)      │ │
│  │  - public.shares (Kullanıcı yetkileri & roller)   │ │
│  │  - has_item_access() (Recursive CTE RLS motoru)   │ │
│  └───────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

## 🗄️ Veritabanı Şeması

Veritabanı ilişkileri ve güvenlik kuralları `supabase/migrations/` altında versiyonlanmıştır:

### 1. `items` Tablosu
| Kolon | Tip | Açıklama |
|---|---|---|
| `id` | `uuid` (PK) | Benzersiz öğe kimliği |
| `owner_id` | `uuid` (FK) | Dosya/klasör sahibi (`auth.users.id`) |
| `parent_id` | `uuid` (FK) | Üst klasör ID'si (Hiyerarşi için) |
| `name` | `text` | Dosya veya klasör adı |
| `kind` | `text` | `'file'` veya `'folder'` |
| `mime_type` | `text` | Dosya MIME tipi (örn: `image/png`, `application/pdf`) |
| `size` | `bigint` | Bayt cinsinden dosya boyutu |
| `storage_path` | `text` | Supabase Storage dosya konumu |
| `starred` | `boolean` | Favori durumu |
| `trashed_at` | `timestamptz` | Çöp kutusuna taşınma zamanı (Soft Delete) |

### 2. `shares` Tablosu
| Kolon | Tip | Açıklama |
|---|---|---|
| `id` | `uuid` (PK) | Paylaşım kimliği |
| `item_id` | `uuid` (FK) | Paylaşılan öğe |
| `user_id` | `uuid` (FK) | Paylaşılan hedef kullanıcı |
| `role` | `text` | İzin seviyesi: `'viewer'` veya `'editor'` |

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18.17+ veya Node.js 20+
- npm, pnpm veya yarn
- Bir [Supabase](https://supabase.com) hesabı veya yerel [Supabase CLI](https://supabase.com/docs/guides/cli)

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/AsliSenaMercimek/mini-drive.git
cd mini-drive
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Çevre Değişkenlerini (Environment Variables) Ayarlayın
`.env.local.example` dosyasını `.env.local` olarak kopyalayın:

```bash
cp .env.local.example .env.local
```

Supabase kontrol panelinizden (`Project Settings -> API`) aldığınız anahtarları doldurun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://proje-referansiniz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon-key-degeriniz
SUPABASE_SERVICE_ROLE_KEY=service-role-key-degeriniz
```

### 4. Veritabanı Şemasını ve Migration'ları Uygulayın
Supabase SQL Editor üzerinden `supabase/migrations/20261103175600_create_mini_drive_schema.sql` dosyasının içeriğini çalıştırabilir veya Supabase CLI ile uygulayabilirsiniz:

```bash
npx supabase db push
```

> **Önemli:** Migration dosyası `drive-files` adında özel bir storage bucket'ı oluşturur ve gerekli RLS politikalarını otomatik tanımlar.

### 5. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin. Sistem sizi otomatik olarak giriş sayfasına yönlendirecektir.

---

## 📂 Proje Dizin Yapısı

```text
mini-drive/
├── public/                 # Statik varlıklar ve ikonlar
├── src/
│   ├── app/                # Next.js App Router sayfaları
│   │   ├── auth/           # Auth callback & SSR endpointleri
│   │   ├── drive/          # Ana bulut depolama paneli
│   │   ├── login/          # Giriş & Kayıt formu
│   │   ├── layout.tsx      # Kök sayfa düzeni
│   │   └── page.tsx        # /drive yönlendirici kök sayfa
│   ├── components/         # Yeniden kullanılabilir UI bileşenleri (Header vb.)
│   ├── lib/
│   │   └── supabase/       # İstemci, sunucu ve middleware Supabase entegrasyonları
│   └── middleware.ts       # Rota koruma ve oturum kontrol middleware'i
├── supabase/
│   ├── config.toml         # Supabase CLI konfigürasyonu
│   └── migrations/         # SQL tabloları, RLS ve fonksiyon migrationları
├── .env.local.example      # Örnek çevre değişkenleri
├── package.json            # Proje bağımlılıkları ve scriptler
├── tailwind.config.ts      # Tailwind CSS yapılandırması
└── tsconfig.json           # TypeScript yapılandırması
```

---

## 🗺️ Yol Haritası

- [x] Next.js 16 + Tailwind CSS v4 + TypeScript temeli
- [x] Supabase Auth & SSR Cookie Middleware entegrasyonu
- [x] PostgreSQL Şeması, İndeksler ve Recursive CTE RLS Yetkilendirmesi
- [x] Supabase Storage Bucket & Storage RLS politikaları
- [x] Türkçe kimlik doğrulama arayüzü (Giriş & Kayıt)
- [ ] Sürükle-Bırak (Drag & Drop) dosya ve klasör yükleme
- [ ] Dosya önizleme (Görseller, PDF, Video, Kod dosyaları)
- [ ] Kullanıcılar arası dosya/klasör paylaşım modalı
- [ ] Dosya arama ve filtreleme motoru

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır. Özgürce kullanabilir, geliştirebilir ve katkıda bulunabilirsiniz.

---

<div align="center">
  Geliştirici: <b>Aslı Sena Mercimek</b> • Açık kaynak topluluğu için sevgiyle geliştirildi ❤️
</div>
