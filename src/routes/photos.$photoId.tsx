import { createFileRoute, Outlet } from "@tanstack/react-router";

// Canonical photo page at /photos/$photoId. The modal child renders on top of it.
export const Route = createFileRoute("/photos/$photoId")({
	component: PhotoPageComponent,
});

function PhotoPageComponent() {
	const { photoId } = Route.useParams();

	return (
		<div className="border p-4">
			<h2 className="font-bold">Photo #{photoId} — full page</h2>
			<p className="mt-1">Placeholder image for photo {photoId}.</p>
			<Outlet />
		</div>
	);
}
