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
					<Link
						to="/posts/$postId"
						params={{ postId: "11111111-1111-1111-1111-111111111111" }}
					>
						/posts/[id] — dynamic route segment (real Supabase post)
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
				<li>
					<Link to="/nav">/nav — navigation guide examples</Link>
				</li>
				<li>
					<Link
						to="/shop/products"
						search={{ page: 2, filter: "shoes", sort: "price", tags: [] }}
					>
						/shop/products — search params examples
					</Link>
				</li>
				<li>
					<Link to="/photos">/photos — route masking examples</Link>
				</li>
				<li>
					<Link to="/blocking">
						/blocking — navigation blocking (useBlocker)
					</Link>
				</li>
				<li>
					<Link to="/blocking-component">
						/blocking-component — navigation blocking (Block component)
					</Link>
				</li>
				<li>
					<Link to="/scroll">/scroll — scroll restoration examples</Link>
				</li>
			</ul>
			<p className="mt-4 text-sm text-gray-500">
				Also try visiting these directly in the address bar:
				<br />
				/posts/2024/09/hello (splat/catch-all route)
				<br />
				/posts/11111111-1111-1111-1111-111111111111/edit (non-nested route,
				renders without the Posts layout)
				<br />
				/products/shoes (optional path parameter, filled in)
			</p>
		</div>
	);
}
