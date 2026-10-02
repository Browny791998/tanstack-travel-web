import { createFileRoute } from "@tanstack/react-router";

// Non-nested route: the trailing "_" after "posts" un-nests this route from
// the posts.tsx layout, so it renders on its own without the Posts layout/nav.
export const Route = createFileRoute("/posts_/$postId/edit")({
	component: PostEditComponent,
});

function PostEditComponent() {
	const { postId } = Route.useParams();
	return (
		<div className="p-4">Editing post #{postId} (outside the Posts layout)</div>
	);
}
