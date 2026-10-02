import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<div className="p-4">
			<h1 className="font-bold">TanStack Router — routing concepts</h1>
			<ul className="mt-2 flex flex-col gap-1 text-blue-600 underline">
				<li>
					<Link to="/about">/about — static route</Link>
				</li>
				<li>
					<Link to="/posts">/posts — layout route + index route</Link>
				</li>
				<li>
					<Link to="/posts/$postId" params={{ postId: "1" }}>
						/posts/1 — dynamic route segment
					</Link>
				</li>
				<li>
					<Link to="/dashboard">/dashboard — pathless layout route</Link>
				</li>
				<li>
					<Link to="/products/{-$category}">
						/products — optional path parameter (empty)
					</Link>
				</li>
			</ul>
			<p className="mt-4 text-sm text-gray-500">
				Also try visiting these directly in the address bar:
				<br />
				/posts/2024/09/hello (splat/catch-all route)
				<br />
				/posts/1/edit (non-nested route, renders without the Posts layout)
				<br />
				/products/shoes (optional path parameter, filled in)
			</p>
		</div>
	);
}
