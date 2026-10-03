import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

// Layout route for the navigation-guide examples
export const Route = createFileRoute("/nav")({
	component: NavLayoutComponent,
});

function NavLayoutComponent() {
	return (
		<div className="p-4">
			<h1 className="font-bold">Navigation guide examples</h1>
			<nav className="mt-2 flex gap-3 text-blue-600 underline">
				<Link to="/nav" activeOptions={{ exact: true }}>
					Overview
				</Link>
				<Link to="/nav/search" search={{ query: "tanstack", page: 1 }}>
					Search params
				</Link>
				<Link to="/nav/redirect">{"<Navigate> redirect"}</Link>
			</nav>
			<hr className="my-2" />
			<Outlet />
		</div>
	);
}
