import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { z } from "zod";

import { supabase } from "#/lib/supabase";

export const Route = createFileRoute("/data")({
	validateSearch: z.object({
		offset: z.number().int().nonnegative().catch(0),
		limit: z.number().int().positive().max(10).catch(2),
	}),
	loaderDeps: ({ search: { offset, limit } }) => ({ offset, limit }),
	loader: async ({ deps: { offset, limit } }) => {
		// Artificial delay so pendingComponent is visible in the demo
		await new Promise((resolve) => setTimeout(resolve, 800));

		const { data, count, error } = await supabase
			.from("posts")
			.select("id, title", { count: "exact" })
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		if (error) throw error;
		return {
			posts: data ?? [],
			total: count ?? 0,
			loadedAt: new Date().toLocaleTimeString(),
		};
	},
	staleTime: 10_000,
	pendingMs: 300,
	pendingMinMs: 300,
	pendingComponent: () => <div className="p-4">Loading posts...</div>,
	errorComponent: ({ error }) => <DataErrorComponent error={error} />,
	component: DataComponent,
});

function DataErrorComponent({ error }: { error: unknown }) {
	const router = useRouter();
	const message =
		error instanceof Error ? error.message : JSON.stringify(error);

	return (
		<div className="flex flex-col gap-2 p-4">
			<p className="text-red-600">Failed to load: {message}</p>
			<button
				type="button"
				className="self-start border px-2 py-1"
				onClick={() => router.invalidate()}
			>
				Retry (router.invalidate)
			</button>
		</div>
	);
}

function DataComponent() {
	const { posts, total, loadedAt } = Route.useLoaderData();
	const { offset, limit } = Route.useSearch();
	const router = useRouter();

	const hasPrev = offset > 0;
	const hasNext = offset + limit < total;

	return (
		<div className="flex flex-col gap-4 p-4">
			<h1 className="font-bold">Data loading (loaderDeps + staleTime)</h1>
			<p className="text-sm">
				Showing {posts.length} of {total} posts (offset {offset}, limit {limit})
			</p>
			<p className="text-sm">Loaded at: {loadedAt}</p>

			<ul className="flex flex-col gap-1">
				{posts.map((post) => (
					<li key={post.id}>
						<Link
							to="/posts/$postId"
							params={{ postId: post.id }}
							className="text-blue-600 underline"
						>
							{post.title}
						</Link>
					</li>
				))}
			</ul>

			<div className="flex gap-3 text-blue-600 underline">
				{hasPrev && (
					<Link
						from={Route.fullPath}
						search={(prev) => ({
							...prev,
							offset: Math.max(0, (prev.offset ?? 0) - (prev.limit ?? 2)),
						})}
					>
						Previous
					</Link>
				)}
				{hasNext && (
					<Link
						from={Route.fullPath}
						search={(prev) => ({
							...prev,
							offset: (prev.offset ?? 0) + (prev.limit ?? 2),
						})}
					>
						Next
					</Link>
				)}
			</div>

			<button
				type="button"
				className="self-start border px-2 py-1"
				onClick={() => router.invalidate()}
			>
				Invalidate & reload (router.invalidate)
			</button>
		</div>
	);
}
