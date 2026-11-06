-- ==============================================================================
-- Mini Drive: Geliştirme ve Test için Örnek Veri (Seed SQL)
-- ==============================================================================
-- Not: Bu dosya yalnızca geliştirme ve test amaçlıdır.
-- Gerçek dosya yüklemesi yapmadan klasör hiyerarşisi, breadcrumb,
-- arama, yıldızlılar ve çöp kutusu senaryolarını test etmek için kullanılır.
-- ==============================================================================

do $$
declare
  target_user_id uuid;
  folder_docs_id uuid := gen_random_uuid();
  folder_images_id uuid := gen_random_uuid();
  folder_projects_id uuid := gen_random_uuid();
  folder_designs_id uuid := gen_random_uuid();
  folder_empty_id uuid := gen_random_uuid();
begin
  -- İlk kullanıcıyı bul veya authenticated kullanıcıyı seç
  select id into target_user_id from auth.users order by created_at asc limit 1;

  if target_user_id is null then
    raise notice 'Kullanıcı bulunamadı. Lütfen önce en az bir hesap oluşturun.';
    return;
  end if;

  raise notice 'Seed verileri şu kullanıcıya ekleniyor: %', target_user_id;

  -- 1. KÖK KLASÖRLER (parent_id: null, trashed_at: null)
  insert into public.items (id, owner_id, parent_id, name, kind, mime_type, size, starred, trashed_at)
  values
    (folder_docs_id, target_user_id, null, 'Belgeler', 'folder', null, 0, false, null),
    (folder_images_id, target_user_id, null, 'Görseller', 'folder', null, 0, false, null),
    (folder_projects_id, target_user_id, null, 'Projeler', 'folder', null, 0, true, null),
    (folder_empty_id, target_user_id, null, 'Boş Klasör', 'folder', null, 0, false, null)
  on conflict (id) do nothing;

  -- 2. ALT KLASÖR (Projeler -> 2026 Tasarımları)
  insert into public.items (id, owner_id, parent_id, name, kind, mime_type, size, starred, trashed_at)
  values
    (folder_designs_id, target_user_id, folder_projects_id, '2026 Tasarımları', 'folder', null, 0, false, null)
  on conflict (id) do nothing;

  -- 3. KÖK DÜZEYİ DOSYALAR (parent_id: null, trashed_at: null)
  insert into public.items (owner_id, parent_id, name, kind, mime_type, size, starred, trashed_at)
  values
    (target_user_id, null, 'Şirket Sunumu.pdf', 'file', 'application/pdf', 2516582, true, null),
    (target_user_id, null, 'Finansal Rapor.xlsx', 'file', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 860160, false, null),
    (target_user_id, null, 'Logo_Master.svg', 'file', 'image/svg+xml', 46080, false, null),
    (target_user_id, null, 'Toplantı Notları.txt', 'file', 'text/plain', 12288, false, null);

  -- 4. "Belgeler" İÇİNDEKİ DOSYALAR
  insert into public.items (owner_id, parent_id, name, kind, mime_type, size, starred, trashed_at)
  values
    (target_user_id, folder_docs_id, 'Müşteri Sözleşmesi.pdf', 'file', 'application/pdf', 1153433, true, null),
    (target_user_id, folder_docs_id, 'Protokol Tutanakları.docx', 'file', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 327680, false, null);

  -- 5. "Görseller" İÇİNDEKİ DOSYALAR
  insert into public.items (owner_id, parent_id, name, kind, mime_type, size, starred, trashed_at)
  values
    (target_user_id, folder_images_id, 'Banner_Desktop.png', 'file', 'image/png', 3984588, false, null),
    (target_user_id, folder_images_id, 'Ekran_Görüntüsü.png', 'file', 'image/png', 972800, false, null);

  -- 6. "Projeler > 2026 Tasarımları" İÇİNDEKİ DOSYALAR
  insert into public.items (owner_id, parent_id, name, kind, mime_type, size, starred, trashed_at)
  values
    (target_user_id, folder_designs_id, 'Mini_Drive_Mimari.pdf', 'file', 'application/pdf', 1887436, true, null),
    (target_user_id, folder_designs_id, 'Arayüz_Bileşenleri.zip', 'file', 'application/zip', 15204352, false, null);

  -- 7. ÇÖP KUTUSUNDAKİ DOSYALAR (trashed_at IS NOT NULL)
  insert into public.items (owner_id, parent_id, name, kind, mime_type, size, starred, trashed_at)
  values
    (target_user_id, null, 'Eski_Taslak.txt', 'file', 'text/plain', 4096, false, now() - interval '2 days'),
    (target_user_id, null, 'Eski_Arşiv.zip', 'file', 'application/zip', 5242880, false, now() - interval '4 days');

  raise notice 'Seed verileri başarıyla oluşturuldu.';
end;
$$;
