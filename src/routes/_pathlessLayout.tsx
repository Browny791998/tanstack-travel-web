import { createFileRoute, Outlet } from "@tanstack/react-router";

// Pathless layout route: the leading "_" means this segment adds no URL
// path of its own, but still wraps its children with a layout.
export const Route = createFileRoute("/_pathlessLayout")({
	component: PathlessLayoutComponent,
});

function PathlessLayoutComponent() {
	return (
		<div className="border p-4">
			<div className="text-sm text-gray-500">
				Wrapped by a pathless layout (no URL segment added)
			</div>
			<Outlet />
		</div>
	);
}
