import { type Post, supabase, type Todo } from "./supabase";

// Fallback initial data in case Supabase project is paused or inaccessible
const fallbackPosts: Post[] = [
	{
		id: "11111111-1111-1111-1111-111111111111",
		title: "Mastering TanStack Query Keys",
		content:
			"Query Keys are arrays that serialize your cache queries. They form the backbone of fetching, caching, and invalidating asynchronous state in TanStack Query.",
		created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
		status: "published",
	},
	{
		id: "22222222-2222-2222-2222-222222222222",
		title: "Deterministic Key Hashing Explained",
		content:
			"Object keys inside query keys are hashed deterministically. Order of properties doesn't matter, but the order of array items does!",
		created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
		status: "published",
	},
	{
		id: "33333333-3333-3333-3333-333333333333",
		title: "Draft Post: Advanced Cache Invalidation",
		content:
			"Learn how hierarchical array keys enable selective cache invalidation across your entire application.",
		created_at: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
		status: "draft",
	},
];

const fallbackTodos: Todo[] = [
	{
		id: 1,
		title: "Review Query Keys Guide",
		content:
			"Read the official TanStack Query documentation on array keys and deterministic hashing.",
		completed: true,
		status: "done",
		category: "learning",
	},
	{
		id: 2,
		title: "Connect Supabase Database",
		content:
			"Query real records from Supabase tables or observe cache invalidation.",
		completed: true,
		status: "done",
		category: "database",
	},
	{
		id: 3,
		title: "Implement Array Keys with Variables",
		content:
			"Pass dynamic parameters like IDs, pagination, and filter objects inside query keys.",
		completed: false,
		status: "pending",
		category: "code",
	},
	{
		id: 4,
		title: "Test Deterministic Hashing",
		content: "Compare object order invariance vs array position sensitivity.",
		completed: false,
		status: "pending",
		category: "testing",
	},
	{
		id: 5,
		title: "Inspect Query Cache Entries",
		content:
			"View live query key hashes in QueryClient cache and trigger invalidations.",
		completed: false,
		status: "pending",
		category: "inspection",
	},
];

export type FetchMeta = {
	source: "supabase" | "fallback";
	fetchedAt: string;
};

// 1. Simple Query Key: ['todos'] or ['posts']
export async function fetchPosts(): Promise<{ data: Post[]; meta: FetchMeta }> {
	const now = new Date().toLocaleTimeString();
	try {
		const { data, error } = await supabase
			.from("posts")
			.select("id, title, content, created_at")
			.order("created_at", { ascending: false });

		if (!error && data && data.length > 0) {
			return { data, meta: { source: "supabase", fetchedAt: now } };
		}
	} catch {
		// Supabase network unreachable / project paused
	}

	return { data: fallbackPosts, meta: { source: "fallback", fetchedAt: now } };
}

export async function fetchTodos(): Promise<{ data: Todo[]; meta: FetchMeta }> {
	const now = new Date().toLocaleTimeString();
	try {
		const { data, error } = await supabase
			.from("todos")
			.select("*")
			.order("id", { ascending: true });

		if (!error && data && data.length > 0) {
			return { data, meta: { source: "supabase", fetchedAt: now } };
		}
	} catch {
		// Fallback to local
	}

	return { data: fallbackTodos, meta: { source: "fallback", fetchedAt: now } };
}

// 2. Simple Query Key: ['something', 'special']
export async function fetchSomethingSpecial(): Promise<{
	message: string;
	timestamp: string;
	features: string[];
	meta: FetchMeta;
}> {
	await new Promise((r) => setTimeout(r, 200));
	return {
		message:
			"Special static resource fetched via non-hierarchical key ['something', 'special']",
		timestamp: new Date().toISOString(),
		features: [
			"Constant values in array key",
			"Ideal for generic list/index or global resources",
			"Independent cache slot from ['something'] or ['special']",
		],
		meta: { source: "fallback", fetchedAt: new Date().toLocaleTimeString() },
	};
}

// 3. Array Key with variable: ['todo', id] or ['post', id]
// 4. Array Key with variable + options: ['todo', id, { preview: true }]
export async function fetchTodoById(
	id: number | string,
	options?: { preview?: boolean },
): Promise<{ data: Todo; preview: boolean; meta: FetchMeta }> {
	const now = new Date().toLocaleTimeString();
	const numId = Number(id);

	let found: Todo | undefined;
	try {
		const { data, error } = await supabase
			.from("todos")
			.select("*")
			.eq("id", id)
			.maybeSingle();

		if (!error && data) {
			found = data;
			return {
				data: options?.preview
					? {
							...found,
							content: `${found.content.slice(0, 30)}... [PREVIEW MODE]`,
						}
					: found,
				preview: Boolean(options?.preview),
				meta: { source: "supabase", fetchedAt: now },
			};
		}
	} catch {
		// Fallback
	}

	found =
		fallbackTodos.find((t) => t.id === numId || t.id === id) ||
		fallbackTodos[0];
	return {
		data: options?.preview
			? { ...found, content: `${found.content.slice(0, 30)}... [PREVIEW MODE]` }
			: found,
		preview: Boolean(options?.preview),
		meta: { source: "fallback", fetchedAt: now },
	};
}

export async function fetchPostById(
	id: string,
	options?: { preview?: boolean },
): Promise<{ data: Post; preview: boolean; meta: FetchMeta }> {
	const now = new Date().toLocaleTimeString();

	try {
		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.eq("id", id)
			.maybeSingle();

		if (!error && data) {
			return {
				data: options?.preview
					? { ...data, content: `${data.content.slice(0, 40)}... [PREVIEW]` }
					: data,
				preview: Boolean(options?.preview),
				meta: { source: "supabase", fetchedAt: now },
			};
		}
	} catch {
		// Fallback
	}

	const fallback = fallbackPosts.find((p) => p.id === id) || fallbackPosts[0];
	return {
		data: options?.preview
			? {
					...fallback,
					content: `${fallback.content.slice(0, 40)}... [PREVIEW]`,
				}
			: fallback,
		preview: Boolean(options?.preview),
		meta: { source: "fallback", fetchedAt: now },
	};
}

// 5. Array Key with filter object: ['todos', { type: 'done' }]
export async function fetchTodosByType(
	type: "all" | "done" | "pending",
): Promise<{ data: Todo[]; type: string; meta: FetchMeta }> {
	const now = new Date().toLocaleTimeString();

	try {
		let query = supabase.from("todos").select("*");
		if (type === "done") {
			query = query.eq("completed", true);
		} else if (type === "pending") {
			query = query.eq("completed", false);
		}

		const { data, error } = await query;
		if (!error && data) {
			return { data, type, meta: { source: "supabase", fetchedAt: now } };
		}
	} catch {
		// Fallback
	}

	const filtered =
		type === "done"
			? fallbackTodos.filter((t) => t.completed)
			: type === "pending"
				? fallbackTodos.filter((t) => !t.completed)
				: fallbackTodos;

	return { data: filtered, type, meta: { source: "fallback", fetchedAt: now } };
}

// 6. Array Key with multiple variables: ['todos', { status, page }]
export async function fetchTodosPaginated({
	page,
	status,
}: {
	page: number;
	status: string;
}): Promise<{
	data: Todo[];
	page: number;
	status: string;
	total: number;
	meta: FetchMeta;
}> {
	const now = new Date().toLocaleTimeString();
	const pageSize = 2;

	const all =
		status === "all"
			? fallbackTodos
			: status === "done"
				? fallbackTodos.filter((t) => t.completed)
				: fallbackTodos.filter((t) => !t.completed);

	const start = (page - 1) * pageSize;
	const data = all.slice(start, start + pageSize);

	return {
		data,
		page,
		status,
		total: all.length,
		meta: { source: "fallback", fetchedAt: now },
	};
}
