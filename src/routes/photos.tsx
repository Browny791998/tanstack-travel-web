import {
	createFileRoute,
	Link,
	Outlet,
	useNavigate,
} from "@tanstack/react-router";

const photoIds = ["1", "2", "3"];

export const Route = createFileRoute("/photos")({
	component: PhotosLayoutComponent,
});

function PhotosLayoutComponent() {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col gap-4 p-4">
			<h1 className="font-bold">Photos (route masking)</h1>

			<section>
				<h2 className="font-bold">{"<Link mask> — modal URL hidden"}</h2>
				<ul className="mt-1 flex flex-col gap-1 text-blue-600 underline">
					{photoIds.map((photoId) => (
						<li key={photoId}>
							<Link
								to="/photos/$photoId/modal"
								params={{ photoId }}
								mask={{ to: "/photos/$photoId", params: { photoId } }}
							>
								Open photo {photoId} in modal (URL shows /photos/{photoId})
							</Link>
						</li>
					))}
				</ul>
			</section>

			<section>
				<h2 className="font-bold">{"navigate() with mask"}</h2>
				<button
					type="button"
					className="mt-1 border px-2 py-1"
					onClick={() =>
						navigate({
							to: "/photos/$photoId/modal",
							params: { photoId: "3" },
							mask: { to: "/photos/$photoId", params: { photoId: "3" } },
						})
					}
				>
					Open photo 3 via navigate()
				</button>
			</section>

			<section>
				<h2 className="font-bold">{"unmaskOnReload"}</h2>
				<Link
					to="/photos/$photoId/modal"
					params={{ photoId: "1" }}
					mask={{
						to: "/photos/$photoId",
						params: { photoId: "1" },
						unmaskOnReload: true,
					}}
					className="mt-1 inline-block text-blue-600 underline"
				>
					Photo 1 modal, unmasked on reload
				</Link>
			</section>

			<section>
				<h2 className="font-bold">{"Declarative createRouteMask"}</h2>
				<p className="mt-1 text-sm text-gray-500">
					Any plain Link to /photos/$photoId/modal is masked globally (see
					router.tsx).
				</p>
				<Link
					to="/photos/$photoId/modal"
					params={{ photoId: "2" }}
					className="mt-1 inline-block text-blue-600 underline"
				>
					Photo 2 modal (declarative mask)
				</Link>
			</section>

			<Outlet />
		</div>
	);
}
