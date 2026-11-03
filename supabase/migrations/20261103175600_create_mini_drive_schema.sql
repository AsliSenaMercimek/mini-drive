-- ==============================================================================
-- Mini Drive: Veritabanı Şeması, RLS Politikaları, Fonksiyonlar ve Storage
-- ==============================================================================

-- 1. "items" TABLOSU VE İNDEKSLERİ
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  parent_id uuid references public.items(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  kind text not null check (kind in ('file', 'folder')),
  mime_type text,
  size bigint default 0,
  storage_path text,
  starred boolean not null default false,
  trashed_at timestamptz default null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- İndeksler
create index if not exists idx_items_owner_id on public.items(owner_id);
create index if not exists idx_items_parent_id on public.items(parent_id);
create index if not exists idx_items_trashed_at on public.items(trashed_at);
create index if not exists idx_items_owner_parent_trashed on public.items(owner_id, parent_id, trashed_at);
create index if not exists idx_items_storage_path on public.items(storage_path);
create index if not exists idx_items_kind on public.items(kind);

-- 2. "shares" TABLOSU VE İNDEKSLERİ
create table if not exists public.shares (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('viewer', 'editor')),
  created_at timestamptz not null default now(),
  constraint shares_item_user_unique unique (item_id, user_id)
);

-- İndeksler
create index if not exists idx_shares_item_id on public.shares(item_id);
create index if not exists idx_shares_user_id on public.shares(user_id);

-- 3. ERİŞİM KONTROL FONKSİYONU (RECURSIVE CTE, SECURITY DEFINER, SET search_path)
create or replace function public.has_item_access(
  target_item_id uuid,
  need_edit boolean default false,
  check_user_id uuid default auth.uid()
)
returns boolean
language plpgsql
security definer
stable
set search_path = public, auth
as $$
declare
  is_accessible boolean;
begin
  if target_item_id is null or check_user_id is null then
    return false;
  end if;

  -- 1. Hızlı erişim: Öğenin doğrudan sahibi ise tam yetkilidir
  if exists (
    select 1
    from public.items
    where id = target_item_id and owner_id = check_user_id
  ) then
    return true;
  end if;

  -- 2. Recursive CTE: Öğenin kendisi veya herhangi bir üst klasörü
  -- bana ait mi ya da benimle paylaşılmış mı?
  with recursive item_hierarchy as (
    -- Anchor: Hedef öğe
    select id, owner_id, parent_id
    from public.items
    where id = target_item_id

    union all

    -- Recursive: Yukarı doğru üst klasörler (ancestors)
    select p.id, p.owner_id, p.parent_id
    from public.items p
    inner join item_hierarchy h on p.id = h.parent_id
  )
  select exists (
    select 1
    from item_hierarchy h
    where h.owner_id = check_user_id
       or exists (
         select 1
         from public.shares s
         where s.item_id = h.id
           and s.user_id = check_user_id
           and (not need_edit or s.role = 'editor')
       )
  ) into is_accessible;

  return coalesce(is_accessible, false);
end;
$$;

-- 4. RLS POLİTİKALARI (items ve shares)
alter table public.items enable row level security;
alter table public.shares enable row level security;

-- items SELECT: Öğeye veya üst klasörüne erişim yetkisi olanlar
drop policy if exists "items_select_policy" on public.items;
create policy "items_select_policy"
on public.items for select
to authenticated
using (
  public.has_item_access(id, false, auth.uid())
);

-- items INSERT: owner_id kullanıcı olmalı ve parent_id varsa o klasöre editor yetkisi olmalı
drop policy if exists "items_insert_policy" on public.items;
create policy "items_insert_policy"
on public.items for insert
to authenticated
with check (
  owner_id = auth.uid()
  and (
    parent_id is null
    or (
      exists (
        select 1 from public.items p
        where p.id = items.parent_id
          and p.kind = 'folder'
          and public.has_item_access(p.id, true, auth.uid())
      )
    )
  )
);

-- items UPDATE: Öğeye düzenleme (editor/owner) yetkisi olanlar
drop policy if exists "items_update_policy" on public.items;
create policy "items_update_policy"
on public.items for update
to authenticated
using (
  public.has_item_access(id, true, auth.uid())
)
with check (
  public.has_item_access(id, true, auth.uid())
  and (
    parent_id is null
    or exists (
      select 1 from public.items p
      where p.id = items.parent_id
        and p.kind = 'folder'
        and public.has_item_access(p.id, true, auth.uid())
    )
  )
);

-- items DELETE: Yalnızca öğe sahibi silebilir
drop policy if exists "items_delete_policy" on public.items;
create policy "items_delete_policy"
on public.items for delete
to authenticated
using (
  owner_id = auth.uid()
);

-- shares RLS Politikaları
drop policy if exists "shares_select_policy" on public.shares;
create policy "shares_select_policy"
on public.shares for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1 from public.items i
    where i.id = shares.item_id
      and i.owner_id = auth.uid()
  )
);

drop policy if exists "shares_insert_policy" on public.shares;
create policy "shares_insert_policy"
on public.shares for insert
to authenticated
with check (
  exists (
    select 1 from public.items i
    where i.id = shares.item_id
      and i.owner_id = auth.uid()
  )
);

drop policy if exists "shares_update_policy" on public.shares;
create policy "shares_update_policy"
on public.shares for update
to authenticated
using (
  exists (
    select 1 from public.items i
    where i.id = shares.item_id
      and i.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.items i
    where i.id = shares.item_id
      and i.owner_id = auth.uid()
  )
);

drop policy if exists "shares_delete_policy" on public.shares;
create policy "shares_delete_policy"
on public.shares for delete
to authenticated
using (
  exists (
    select 1 from public.items i
    where i.id = shares.item_id
      and i.owner_id = auth.uid()
  )
);

-- 5. TRIGGER: KLASÖRÜ KENDİ ALTINA TAŞIMAYI ENGELLEME VE updated_at GÜNCELLEMESİ
create or replace function public.handle_item_before_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_ancestor_id uuid;
begin
  -- updated_at alanını otomatik güncelle
  NEW.updated_at := now();

  -- parent_id değiştiyse döngü kontrolü yap
  if NEW.parent_id is not null and (OLD.parent_id is null or NEW.parent_id <> OLD.parent_id) then
    -- 1. Kendisini doğrudan kendi içine taşıyamaz
    if NEW.id = NEW.parent_id then
      raise exception 'Bir öğe kendi içerisine taşınamaz.';
    end if;

    -- 2. Hedef üst öğe geçerli bir klasör olmalıdır
    if not exists (select 1 from public.items where id = NEW.parent_id and kind = 'folder') then
      raise exception 'Hedef üst öğe bir klasör olmalıdır.';
    end if;

    -- 3. Döngü tespiti: NEW.parent_id'nin üst atalarında NEW.id var mı?
    with recursive parent_chain as (
      select id, parent_id
      from public.items
      where id = NEW.parent_id

      union all

      select p.id, p.parent_id
      from public.items p
      inner join parent_chain pc on p.id = pc.parent_id
    )
    select id into target_ancestor_id
    from parent_chain
    where id = NEW.id
    limit 1;

    if target_ancestor_id is not null then
      raise exception 'Bir klasör kendi alt klasörüne taşınamaz.';
    end if;
  end if;

  return NEW;
end;
$$;

drop trigger if exists trg_items_before_update on public.items;
create trigger trg_items_before_update
before update on public.items
for each row
execute function public.handle_item_before_update();

-- 6. E-POSTA İLE PAYLAŞIM: "share_item" RPC FONKSİYONU
create or replace function public.share_item(
  p_item_id uuid,
  p_email text,
  p_role text
)
returns json
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_owner_id uuid;
  v_target_user_id uuid;
  v_caller_id uuid := auth.uid();
  v_share_id uuid;
begin
  -- Rol kontrolü
  if p_role not in ('viewer', 'editor') then
    raise exception 'Geçersiz yetki rolü. Yalnızca "viewer" veya "editor" seçilebilir.';
  end if;

  -- Giriş yapmış kullanıcı kontrolü
  if v_caller_id is null then
    raise exception 'İşlem için giriş yapmış olmalısınız.';
  end if;

  -- Öğe sahibi kontrolü
  select owner_id into v_owner_id
  from public.items
  where id = p_item_id;

  if v_owner_id is null then
    raise exception 'Paylaşılmak istenen öğe bulunamadı.';
  end if;

  if v_owner_id <> v_caller_id then
    raise exception 'Bu öğeyi paylaşma yetkiniz yok. Yalnızca öğe sahibi paylaşabilir.';
  end if;

  -- Hedef kullanıcıyı auth.users tablosunda bul
  select id into v_target_user_id
  from auth.users
  where lower(email) = lower(trim(p_email));

  if v_target_user_id is null then
    raise exception 'Belirtilen e-posta adresine kayıtlı bir kullanıcı bulunamadı.';
  end if;

  -- Kendisiyle paylaşma engeli
  if v_target_user_id = v_caller_id then
    raise exception 'Öğeyi kendinizle paylaşamazsınız.';
  end if;

  -- Paylaşımı ekle veya rolü güncelle (upsert)
  insert into public.shares (item_id, user_id, role)
  values (p_item_id, v_target_user_id, p_role)
  on conflict (item_id, user_id)
  do update set role = excluded.role
  returning id into v_share_id;

  return json_build_object(
    'success', true,
    'share_id', v_share_id,
    'item_id', p_item_id,
    'user_id', v_target_user_id,
    'email', lower(trim(p_email)),
    'role', p_role
  );
end;
$$;

grant execute on function public.share_item(uuid, text, text) to authenticated;

-- 7. PAYLAŞIMLARI LİSTELEME: "list_shares" RPC FONKSİYONU
create or replace function public.list_shares(p_item_id uuid)
returns table (
  share_id uuid,
  item_id uuid,
  user_id uuid,
  email text,
  role text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_owner_id uuid;
begin
  select owner_id into v_owner_id
  from public.items
  where id = p_item_id;

  if v_owner_id is null then
    raise exception 'Öğe bulunamadı.';
  end if;

  if v_owner_id <> auth.uid() then
    raise exception 'Bu öğenin paylaşımlarını görüntüleme yetkiniz yok. Yalnızca öğe sahibi görüntüleyebilir.';
  end if;

  return query
  select
    s.id as share_id,
    s.item_id,
    s.user_id,
    u.email::text as email,
    s.role,
    s.created_at
  from public.shares s
  inner join auth.users u on u.id = s.user_id
  where s.item_id = p_item_id
  order by s.created_at desc;
end;
$$;

grant execute on function public.list_shares(uuid) to authenticated;

-- 8. KALICI SİLME İÇİN ALT DOSYA YOLLARI: "descendant_paths" RPC FONKSİYONU
create or replace function public.descendant_paths(p_folder_id uuid)
returns table (
  storage_path text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
begin
  select owner_id into v_owner_id
  from public.items
  where id = p_folder_id;

  if v_owner_id is null then
    raise exception 'Öğe bulunamadı.';
  end if;

  if v_owner_id <> auth.uid() then
    raise exception 'Bu işlem için yetkiniz yok. Yalnızca öğe sahibi çağırabilir.';
  end if;

  return query
  with recursive all_descendants as (
    -- Klasörün doğrudan alt öğeleri
    select id, parent_id, items.storage_path
    from public.items
    where parent_id = p_folder_id

    union all

    -- Rekürsif torun öğeler
    select i.id, i.parent_id, i.storage_path
    from public.items i
    inner join all_descendants ad on i.parent_id = ad.id
  )
  select ad.storage_path
  from all_descendants ad
  where ad.storage_path is not null;
end;
$$;

grant execute on function public.descendant_paths(uuid) to authenticated;

-- 9. "drive" PRİVATE STORAGE BUCKET VE POLİTİKALARI
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('drive', 'drive', false, null, null)
on conflict (id) do update set public = false;

-- Storage okuma yetki kontrolü yardımcısı
create or replace function public.can_read_drive_object(object_name text, check_user uuid default auth.uid())
returns boolean
language plpgsql
security definer
stable
set search_path = public, auth
as $$
begin
  if check_user is null or object_name is null then
    return false;
  end if;

  -- 1. Sahip ise (Dosya yolu: {user_id}/{item_id})
  if split_part(object_name, '/', 1) = check_user::text then
    return true;
  end if;

  -- 2. Items üzerinden erişim yetkisi olan (paylaşılmış) kullanıcı ise
  return exists (
    select 1
    from public.items i
    where i.storage_path = object_name
      and public.has_item_access(i.id, false, check_user)
  );
end;
$$;

-- Storage Politikaları
drop policy if exists "drive_storage_select_policy" on storage.objects;
create policy "drive_storage_select_policy"
on storage.objects for select
to authenticated
using (
  bucket_id = 'drive'
  and public.can_read_drive_object(name, auth.uid())
);

drop policy if exists "drive_storage_insert_policy" on storage.objects;
create policy "drive_storage_insert_policy"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'drive'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists "drive_storage_update_policy" on storage.objects;
create policy "drive_storage_update_policy"
on storage.objects for update
to authenticated
using (
  bucket_id = 'drive'
  and split_part(name, '/', 1) = auth.uid()::text
)
with check (
  bucket_id = 'drive'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists "drive_storage_delete_policy" on storage.objects;
create policy "drive_storage_delete_policy"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'drive'
  and split_part(name, '/', 1) = auth.uid()::text
);
