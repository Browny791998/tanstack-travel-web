import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

// Layout route: wraps every /posts/* route with a shared header + <Outlet />
export const Route = createFileRoute("/posts")({
	component: PostsLayoutComponent,
});

function PostsLayoutComponent() {
	return (
		<div className="p-4">
			<h1 className="font-bold">Posts</h1>
			<nav className="flex gap-3 text-blue-600 underline">
				<Link to="/posts">All posts</Link>
				<Link
					to="/posts/$postId"
					params={{ postId: "11111111-1111-1111-1111-111111111111" }}
				>
					Post 1
				</Link>
			</nav>
			<hr className="my-2" />
			<Outlet />
		</div>
	);
}
