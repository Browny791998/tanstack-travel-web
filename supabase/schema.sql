-- Supabase SQL Schema for TanStack Query Keys Guide
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/jlagpoyrmjipnjdtxvgc/sql/new

-- 1. Posts Table
create table if not exists public.posts (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	content text not null,
	status text not null default 'published',
	created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "Public read access for posts"
	on public.posts
	for select
	using (true);

-- 2. Todos Table (matching official TanStack Query guide)
create table if not exists public.todos (
	id serial primary key,
	title text not null,
	content text not null,
	completed boolean not null default false,
	status text not null default 'pending',
	category text default 'general',
	created_at timestamptz not null default now()
);

alter table public.todos enable row level security;

create policy "Public read access for todos"
	on public.todos
	for select
	using (true);

-- Seed data for posts
insert into public.posts (id, title, content, status)
values
	(
		'11111111-1111-1111-1111-111111111111',
		'Mastering TanStack Query Keys',
		'Query Keys are arrays that serialize your cache queries. They form the backbone of fetching, caching, and invalidating asynchronous state in TanStack Query.',
		'published'
	),
	(
		'22222222-2222-2222-2222-222222222222',
		'Deterministic Key Hashing Explained',
		'Object keys inside query keys are hashed deterministically. Order of properties does not matter, but the order of array items does!',
		'published'
	),
	(
		'33333333-3333-3333-3333-333333333333',
		'Draft Post: Advanced Cache Invalidation',
		'Learn how hierarchical array keys enable selective cache invalidation across your entire application.',
		'draft'
	)
on conflict (id) do nothing;

-- Seed data for todos
insert into public.todos (id, title, content, completed, status, category)
values
	(1, 'Review Query Keys Guide', 'Read official docs on array keys and deterministic hashing.', true, 'done', 'learning'),
	(2, 'Connect Supabase Database', 'Query real records from Supabase tables or observe cache invalidation.', true, 'done', 'database'),
	(3, 'Implement Array Keys with Variables', 'Pass dynamic parameters like IDs, pagination, and filter objects.', false, 'pending', 'code'),
	(4, 'Test Deterministic Hashing', 'Compare object order invariance vs array position sensitivity.', false, 'pending', 'testing'),
	(5, 'Inspect Query Cache Entries', 'View live query key hashes in QueryClient cache and trigger invalidations.', false, 'pending', 'inspection')
on conflict (id) do nothing;

