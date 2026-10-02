import { createFileRoute } from "@tanstack/react-router";

// Splat/catch-all route: "$" captures any remaining path segments under /posts
// e.g. /posts/2024/09/announcement -> _splat === "2024/09/announcement"
export const Route = createFileRoute("/posts/$")({
	component: PostsCatchAllComponent,
});

function PostsCatchAllComponent() {
	const { _splat } = Route.useParams();
	return <div>Unmatched posts path: {_splat}</div>;
}
