-- Keep profile creation collision-free even when emails share the same local part.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, username)
  values (new.id, 'player_' || replace(new.id::text, '-', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- An internal event trigger can exist on hosted Supabase, but not fresh local installs.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end;
$$;

create index if not exists mechanics_recommended_rank_id_idx on public.mechanics(recommended_rank_id);
create index if not exists profiles_current_rank_id_idx on public.profiles(current_rank_id);
create index if not exists user_mechanics_mechanic_id_idx on public.user_mechanics(mechanic_id);

drop policy if exists "owner select" on public.profiles;
drop policy if exists "owner insert" on public.profiles;
drop policy if exists "owner update" on public.profiles;
create policy "owner select" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "owner insert" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "owner update" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "owner select" on public.user_mechanics;
drop policy if exists "owner insert" on public.user_mechanics;
drop policy if exists "owner update" on public.user_mechanics;
drop policy if exists "owner delete" on public.user_mechanics;
create policy "owner select" on public.user_mechanics for select to authenticated using ((select auth.uid()) = user_id);
create policy "owner insert" on public.user_mechanics for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "owner update" on public.user_mechanics for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "owner delete" on public.user_mechanics for delete to authenticated using ((select auth.uid()) = user_id);
