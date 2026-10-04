import { createFileRoute, useNavigate } from "@tanstack/react-router";

// Internal route at /photos/$photoId/modal. Links masked to /photos/$photoId
// show the clean URL in the address bar while this modal is open.
export const Route = createFileRoute("/photos/$photoId/modal")({
	component: PhotoModalComponent,
});

function PhotoModalComponent() {
	const { photoId } = Route.useParams();
	const navigate = useNavigate();

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/50">
			<div className="flex flex-col gap-3 rounded bg-white p-6 text-black">
				<h3 className="font-bold">Modal: photo #{photoId}</h3>
				<p className="text-sm">
					Check the address bar: it still shows the clean photo URL.
				</p>
				<button
					type="button"
					className="self-start border px-2 py-1"
					onClick={() => navigate({ to: "/photos" })}
				>
					Close
				</button>
			</div>
		</div>
	);
}
