import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { supabase } from "#/lib/supabase";

// Dynamic route segment: $postId is captured into Route.useParams()
export const Route = createFileRoute("/posts/$postId")({
	loader: async ({ params }) => {
		const { data, error } = await supabase
			.from("posts")
			.select("id, title, content")
			.eq("id", params.postId)
			.maybeSingle();

		// 22P02: invalid input syntax for type uuid -> treat as a plain 404
		// instead of surfacing a raw Postgres error for a malformed id.
		if (error && error.code !== "22P02") throw error;
		if (!data) throw notFound();
		return data;
	},
	notFoundComponent: () => <div>Post not found.</div>,
	component: PostComponent,
});

function PostComponent() {
	const post = Route.useLoaderData();

	return (
		<div>
			<h2 className="font-bold">{post.title}</h2>
			<p className="mt-1">{post.content}</p>
			{/* Relative navigation examples */}
			<nav className="mt-2 flex gap-3 text-blue-600 underline">
				<Link to=".">Reload current route</Link>
				<Link to="..">Navigate to parent (/posts)</Link>
				<Link to="/posts">Absolute path to /posts</Link>
				<Link from="/posts" to=".">
					Navigate to /posts (relative from /posts)
				</Link>
				<Link to="/">Root navigation</Link>
			</nav>
		</div>
	);
}
