# Mini Drive - Proje Kuralları ve Prensipleri

Bu proje, Google Drive benzeri bir bulut dosya depolama uygulamasıdır ("Mini Drive").

## Teknoloji Yığını
- **Frontend / Fullstack:** Next.js (App Router, TypeScript, Tailwind CSS)
- **Backend / Veritabanı:** Supabase (Auth, Postgres, Storage, Row Level Security)
- **İkon Kütüphanesi:** lucide-react
- **Dil:** Arayüz tamamen Türkçe

## Temel Mimari Kuralları
1. **Veri Modeli (items tablosu):**
   - Hem dosya hem klasör tek bir `items` tablosunda tutulur (`kind`: `'file'` veya `'folder'`).
   - Hiyerarşi `parent_id` (foreign key -> `items.id`) ile kurulur. Kök dizindeki öğelerin `parent_id` değeri `NULL` olur.
2. **Güvenlik ve Yetkilendirme (RLS):**
   - Tüm yetki kontrolü Postgres Row Level Security (RLS) ile yapılır.
   - `service_role` key kesinlikle istemci (client-side) tarafında kullanılmaz.
3. **Storage Yapılandırması:**
   - Storage bucket'ı private (gizli) olacaktır.
   - Dosya yolu (storage path) `{user_id}/{item_id}` formatında olacaktır.
4. **Silme Mekanizması (Çöp Kutusu):**
   - Silme işlemi önce çöp kutusuna taşır (`trashed_at` zaman damgası güncellenir).
   - Kalıcı silme işlemi yalnızca çöp kutusundan gerçekleştirilir.
5. **Veritabanı Değişiklikleri (Migrations):**
   - Veritabanı şeması ve RLS değişiklikleri `supabase/migrations/` altında SQL migration dosyası olarak oluşturulur ve takip edilir.
6. **Derleme ve Kalite Güvencesi:**
   - Her görev sonunda `npm run build` hatasız şekilde başarılı olmalıdır.
