-- 51 English: схема для Supabase (облачного или self-hosted). Можно выполнять повторно.
-- Одна строка на пользователя: весь прогресс лежит в jsonb. Доступ к строке есть только у её владельца (RLS).

create table if not exists public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb check (pg_column_size(data) < 200000),
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- Права на уровне таблицы (RLS ниже ограничивает их строками владельца).
-- Сначала снимаем всё у PUBLIC и anon, затем явно выдаём нужное только authenticated.
revoke all on public.progress from public;
revoke all on public.progress from anon;
revoke all on public.progress from authenticated;
grant select, insert, update, delete on public.progress to authenticated;

drop policy if exists "progress_select_own" on public.progress;
drop policy if exists "progress_insert_own" on public.progress;
drop policy if exists "progress_update_own" on public.progress;
drop policy if exists "progress_delete_own" on public.progress;
create policy "progress_select_own" on public.progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "progress_insert_own" on public.progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "progress_update_own" on public.progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "progress_delete_own" on public.progress for delete to authenticated using ((select auth.uid()) = user_id);

-- Время изменения ставит сервер, а не браузер.
create or replace function public.touch_progress() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists progress_touch on public.progress;
create trigger progress_touch before insert or update on public.progress
  for each row execute function public.touch_progress();

-- Удаление собственного аккаунта (право пользователя на удаление данных).
-- Строка progress удаляется каскадом вместе с пользователем.
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
