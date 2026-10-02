import { createFileRoute } from "@tanstack/react-router";

// Dynamic route segment: $postId is captured into Route.useParams()
export const Route = createFileRoute("/posts/$postId")({
	component: PostComponent,
});

function PostComponent() {
	const { postId } = Route.useParams();
	return <div>Post #{postId}</div>;
}
