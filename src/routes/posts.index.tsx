import { createFileRoute, Link } from "@tanstack/react-router";

import { supabase } from "#/lib/supabase";

// Index route: matches /posts/ exactly (the parent "posts" layout with no child matched)
export const Route = createFileRoute("/posts/")({
	loader: async () => {
		const { data, error } = await supabase
			.from("posts")
			.select("id, title")
			.order("created_at", { ascending: false });

		if (error) throw error;
		return data;
	},
	component: PostsIndexComponent,
});

function PostsIndexComponent() {
	const posts = Route.useLoaderData();

	return (
		<ul className="flex flex-col gap-1 text-blue-600 underline">
			{posts.map((post) => (
				<li key={post.id}>
					<Link to="/posts/$postId" params={{ postId: post.id }}>
						{post.title}
					</Link>
				</li>
			))}
		</ul>
	);
}
