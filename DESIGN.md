# Mini Drive — Tasarım Sistemi ve Arayüz Kılavuzu (UI Kit)

> **Amaç:** Mini Drive projesindeki TÜM ekranlar yalnızca bu tasarım sistemine ve bileşenlerine dayanır.  
> **Referans Hissi:** Linear, Vercel, Notion, Apple Files gibi sakin, hızlı, güven veren ve araç hissi uyandıran bir işlevsellik. Dekoratif değil, her pikseli bir amaca hizmet eden arayüz.

---

## 1. Temel İlkeler ve "AI Slop" Yasağı

Arayüzde **kesinlikle yapılmayacaklar**:
- **YOK:** Mor/mavi gradyanlar, neon ışıklar, parlayan (glow) efektler ve cam efekti (glassmorphism).
- **YOK:** Hap gibi aşırı yuvarlatılmış köşeler (`rounded-full` sadece dairesel avatarlar içindir).
- **YOK:** Her kartın altına kalın, bulanık gölgeler yığmak.
- **YOK:** Emoji ikonlar. Yalnızca `lucide-react` (tüm ikonlarda `strokeWidth={1.75}`).
- **YOK:** Her şeyi iç içe kartlara ve kutulara boğmak.
- **YOK:** Ortalanmış, pazarlama veya SaaS landing sayfası havası veren büyük hero başlıklar.
- **YOK:** Sisteme dahil olmayan rastgele hex kodları, keyfi padding veya margin değerleri.

---

## 2. Tasarım Token'ları (Design Tokens)

Tüm renkler ve değişkenler `app/globals.css` içinde CSS değişkenleri olarak tanımlanmıştır. Kod içerisinde doğrudan hex renk yazılmaz.

### Renk Paleti

| Token | Açık Tema (Light) | Koyu Tema (Dark) | Kullanım Alanı |
|---|---|---|---|
| `--bg-base` | `#fcfcfd` | `#111214` | Ana sayfa zemini |
| `--bg-surface` | `#ffffff` | `#18191c` | Kartlar, tablolar, paneller |
| `--bg-subtle` | `#f4f4f6` | `#202226` | İkincil alanlar, hover durumları |
| `--bg-active` | `#eaebef` | `#2a2d33` | Seçili satırlar, basılı butonlar |
| `--border-subtle`| `#eeeff2` | `#25272e` | İnce ayırıcı çizgiler |
| `--border-default`| `#dcdfe4` | `#353841` | Standart bileşen kenarlıkları |
| `--border-strong` | `#aab0b9` | `#545965` | Odaklanan veya vurgulanan kenarlıklar |
| `--text-primary` | `#121417` | `#ededf0` | Başlıklar ve birincil okunabilir metin |
| `--text-secondary`| `#535763` | `#9aa0ac` | Açıklamalar ve etiketler |
| `--text-tertiary` | `#848a97` | `#696f7c` | Zaman damgaları, meta veriler, pasif ikonlar |
| `--accent` | `#3358d4` | `#4f75f2` | Sakin çivit/mavi vurgu rengi, 2px focus halkası |
| `--accent-hover` | `#2645b2` | `#6385f5` | Vurgu butonu hover |
| `--accent-subtle`| `#eef2ff` | `#18223d` | Seçili satır/rozet hafif zemin |
| `--success` | `#15803d` | `#4ade80` | Başarılı durumlar (soluk, ölçülü yeşil) |
| `--warning` | `#b45309` | `#fbbf24` | Bekleme ve dikkat durumları (kehribar) |
| `--danger` | `#b91c1c` | `#f87171` | Silme, hata ve kritik uyarılar (ölçülü kırmızı) |

### Tipografi Ölçeği

Tek font ailesi: **Geist** (`next/font/google`).  
Sadece 2 ağırlık: **400** (normal) ve **500** (medium).

| Boyut | Sınıf | Satır Yüksekliği | Harf Aralığı | Kullanım |
|---|---|---|---|---|
| **20px** | `text-xl` | 1.25 | `-0.022em` | Sayfa ve ana bölüm başlıkları |
| **16px** | `text-base` | 1.30 | `-0.015em` | Modal ve panel başlıkları |
| **14px** | `text-sm` | 1.45 | `-0.010em` | Standart metin, butonlar, form girişleri |
| **13px** | `text-[13px]` | 1.40 | `-0.008em` | Dosya satırları, yan menü öğeleri |
| **12px** | `text-xs` | 1.35 | `0` | Zaman damgaları, boyutlar, rozetler |

### Köşe Yarıçapı (Border Radius)

Yalnızca 3 değer kullanılır:
- **Küçük (`rounded-sm` / `6px`):** Butonlar, giriş alanları, etiketler, menü öğeleri.
- **Orta (`rounded-md` / `8px`):** Açılır menüler, dosya ızgara kartları, bilgi panelleri.
- **Büyük (`rounded-lg` / `12px`):** Dialog / Modal pencereleri.
*(Avatar gibi tam yuvarlak gereken elemanlar hariç hap/pill kullanılmaz).*

### Gölgeler ve Derinlik

- Normal elemanlarda gölge **yoktur**. Yüzey ayrımı 1px ince kenarlık ve ton farkı (`--border-subtle` / `--border-default`) ile sağlanır.
- **Açılır Menü / Tooltip:** `--shadow-dropdown` (`0 4px 12px rgba(0,0,0,0.05)`).
- **Modal / Dialog:** `--shadow-modal` (`0 12px 28px rgba(0,0,0,0.08)`).

### Hareket ve Geçişler (Motion)

- **Süre:** 120 ms (hızlı etkileşimler) ile 160 ms (açılır paneller).
- **Eğri:** `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out).
- Yalnızca durum değişimlerinde (hover, focus, açılma/kapanma) kullanılır. Süs amaçlı floating/bouncing animasyon yasaktır.
- `prefers-reduced-motion` sistemde zorunlu olarak sıfırlanır.

---

## 3. Bileşen Kullanım Kuralları

### `Button` & `IconButton`
- **Primary:** Sayfada sadece bir ana eylem için (Örn: "Dosya Yükle", "Klasör Oluştur").
- **Secondary:** Standart araç çubuğu ve filtre düğmeleri.
- **Ghost:** Satır içi eylemler, liste kapatma ve ikincil araçlar.
- **Danger:** Yalnızca kalıcı silme veya geri alınamaz işlemler.
- **Loading:** Spinner ikonu ile buton metni yerini korur, buton devre dışı kalır.

### `FileRow` (Dosya Yöneticisi Satırı)
- Kompakt satır yüksekliği: **38px**.
- Checkbox varsayılan olarak gizlidir; hover yapıldığında veya satır seçildiğinde görünür.
- Çift tıklama: Klasör içerisine girer veya dosyayı önizler.
- Enter tuşu: Seçili dosyayı açar.
- Sağdaki eylem butonları hover durumunda görünür.

### `FileCard` (Izgara Görünümü)
- Sade kart gövdesi (`rounded-[8px]`, `border-border-default`).
- Büyük renkli süsler yerine ortalanmış, türe özel sade `FileIcon`.
- Hover ile eylem menüsü ve seçim kutusu açığa çıkar.

### `FileIcon`
- `folder`, `document`, `pdf`, `spreadsheet`, `image`, `video`, `audio`, `code`, `archive`.
- Renkler gökkuşağı gibi parlamaz; sakin slate ve nötr renk ailesine aittir. Yalnızca klasör hafif çivit vurgusu taşır.

### `UploadPanel`
- Sağ alt köşede yüzen kompakt panel.
- Bireysel dosyaların yüzdesi, genel yükleme durumu, hata açıklaması ve küçültme/kapatma desteği sunar.

### `StorageMeter`
- Kullanılan ve toplam disk kapasitesini temiz bir çubuk ve yüzde ile gösterir.

---

## 4. Yazım Tonu (Copywriting Guidelines)

Tüm metinler için katı kurallar:
1. **Kısa ve net:** Gereksiz laf kalabalığı yapılmaz.
2. **Sakin ve ölçülü:** Ünlem işareti (`!`) ASLA kullanılmaz. Heyecan veya yapay neşe yaratılmaz.
3. **Türkçe:** Terimler tutarlı ve doğal Türkçeyle yazılır.

### Standart Metin Şablonları

| Durum | Doğru Kullanım | Hatalı Kullanım (YASAK) |
|---|---|---|
| Boş Klasör | "Bu klasörde henüz dosya yok" | "Harika! Burada hiç dosya yok! Hemen yükle!" |
| Arama Boş | "Sonuç bulunamadı" | "Üzgünüz, aradığınızı bulamadık :(" |
| Dosya Yükleniyor | "3 dosya yükleniyor" | "Dosyalarınız ışık hızında yükleniyor!" |
| Başarılı Yükleme | "Yükleme tamamlandı" | "Harika iş! Dosyalarınız başarıyla yüklendi!" |
| Hata Durumu | "Dosya yüklenemedi. Bağlantınızı kontrol edin." | "Eyvah! Bir hata meydana geldi!" |
| Silme Onayı | "Bu dosya çöp kutusuna taşınacak." | "Emin misiniz??? Bu işlem geri alınamaz!" |
| Depolama Dolu | "Depolama alanı dolmak üzere." | "DİKKAT! Hafızanız tükeniyor!" |

---

## 5. Doğruluk Kaynağı: `/design` Sayfası

Sistemdeki tüm token'lar, bileşenlerin tüm durumları (normal, hover, focus, disabled, loading, hata) ve açık/koyu tema görünümü `/design` rotası üzerinden anlık olarak doğrulanabilir.
