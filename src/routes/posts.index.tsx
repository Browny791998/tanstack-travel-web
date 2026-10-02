import { createFileRoute } from "@tanstack/react-router";

// Index route: matches /posts/ exactly (the parent "posts" layout with no child matched)
export const Route = createFileRoute("/posts/")({
	component: PostsIndexComponent,
});

function PostsIndexComponent() {
	return <div>Select a post from the nav above.</div>;
}
