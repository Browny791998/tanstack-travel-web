import {
	createFileRoute,
	Link,
	MatchRoute,
	useMatchRoute,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Route as aboutRoute } from "./about";

export const Route = createFileRoute("/nav/")({
	component: NavIndexComponent,
});

function NavIndexComponent() {
	return (
		<div className="flex flex-col gap-6">
			<LinkExamples />
			<ImperativeNavigationExamples />
			<MatchRouteExamples />
		</div>
	);
}

function LinkExamples() {
	return (
		<section>
			<h2 className="font-bold">{"<Link> examples"}</h2>
			<ul className="mt-1 flex flex-col gap-1 text-blue-600 underline">
				<li>
					{/* Basic usage */}
					<Link to="/about">Basic: /about</Link>
				</li>
				<li>
					{/* Dynamic parameters */}
					<Link
						to="/posts/$postId"
						params={{ postId: "11111111-1111-1111-1111-111111111111" }}
					>
						Dynamic params: /posts/[id]
					</Link>
				</li>
				<li>
					{/* Hash link */}
					<Link to="/about" hash="section-1">
						Hash link: /about#section-1
					</Link>
				</li>
				<li>
					{/* Optional parameter, filled in */}
					<Link to="/products/{-$category}" params={{ category: "tech" }}>
						Optional param: /products/tech
					</Link>
				</li>
				<li>
					{/* Optional parameter, explicitly cleared */}
					<Link to="/products/{-$category}" params={{ category: undefined }}>
						Optional param cleared: /products
					</Link>
				</li>
				<li>
					{/* activeProps: styles applied only while this route is active */}
					<Link
						to="/nav"
						activeOptions={{ exact: true }}
						activeProps={{ style: { fontWeight: "bold" } }}
					>
						activeProps demo (bold while on /nav)
					</Link>
				</li>
				<li>
					{/* Children function pattern: render based on isActive */}
					<Link to="/nav" activeOptions={{ exact: true }}>
						{({ isActive }) => (
							<span>
								Children-function demo ({isActive ? "active" : "inactive"})
							</span>
						)}
					</Link>
				</li>
				<li>
					{/* Preload on hover/focus intent, with a custom delay */}
					<Link
						to="/posts/$postId"
						params={{ postId: "22222222-2222-2222-2222-222222222222" }}
						preload="intent"
						preloadDelay={100}
					>
						Preload demo: /posts/[id] (hover to preload)
					</Link>
				</li>
				<li>
					{/* Type-safe route reference instead of a string literal */}
					<Link to={aboutRoute.to}>Type-safe reference to About route</Link>
				</li>
			</ul>
		</section>
	);
}

function ImperativeNavigationExamples() {
	const navigate = useNavigate();
	const router = useRouter();

	const navigateToNewPost = () => {
		// Simplified version of the guide's "create then navigate" pattern
		// (skips the real insert call so this demo has no write dependency;
		// navigates to one of the seeded Supabase posts instead).
		navigate({
			to: "/posts/$postId",
			params: { postId: "33333333-3333-3333-3333-333333333333" },
		});
	};

	const navigateWithRouter = () => {
		// router.navigate() accepts the same options as useNavigate()
		router.navigate({ to: "/about" });
	};

	return (
		<section>
			<h2 className="font-bold">Imperative navigation</h2>
			<div className="mt-1 flex gap-2">
				<button
					type="button"
					className="border px-2 py-1"
					onClick={navigateToNewPost}
				>
					useNavigate(): go to a "new" post
				</button>
				<button
					type="button"
					className="border px-2 py-1"
					onClick={navigateWithRouter}
				>
					router.navigate(): go to /about
				</button>
			</div>
		</section>
	);
}

function MatchRouteExamples() {
	const matchRoute = useMatchRoute();
	const [postsPending, setPostsPending] = useState(false);

	useEffect(() => {
		setPostsPending(Boolean(matchRoute({ to: "/posts", pending: true })));
	}, [matchRoute]);

	return (
		<section>
			<h2 className="font-bold">useMatchRoute() / {"<MatchRoute>"}</h2>
			<p className="mt-1 text-sm text-gray-500">
				/posts is currently {postsPending ? "pending" : "not pending"} (via
				useMatchRoute)
			</p>
			<Link to="/posts" className="text-blue-600 underline">
				Posts
				<MatchRoute to="/posts" pending>
					{(match) => (match ? " (loading…)" : "")}
				</MatchRoute>
			</Link>
		</section>
	);
}
