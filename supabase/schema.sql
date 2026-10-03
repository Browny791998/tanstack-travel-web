-- Run this once in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jlagpoyrmjipnjdtxvgc/sql/new
-- The app's publishable (anon) key can only read/write rows through RLS
-- policies, it cannot create tables, so this step has to be done manually.

create table if not exists public.posts (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	content text not null,
	created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "Public read access"
	on public.posts
	for select
	using (true);

insert into public.posts (id, title, content)
values
	(
		'11111111-1111-1111-1111-111111111111',
		'Welcome to TanStack Start',
		'TanStack Start is a full-stack React framework built on TanStack Router. It gives you file-based routing, SSR, and server functions out of the box.'
	),
	(
		'22222222-2222-2222-2222-222222222222',
		'Why File-Based Routing Rocks',
		'Routes are defined by the files in src/routes. Nesting, dynamic segments, and layouts all fall out of simple file naming conventions.'
	),
	(
		'33333333-3333-3333-3333-333333333333',
		'Shipping with Supabase',
		'This post is loaded from a real Supabase Postgres table through the project''s publishable key, with row-level security restricting access to read-only.'
	)
on conflict (id) do nothing;
