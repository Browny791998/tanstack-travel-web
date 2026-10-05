import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/scroll-item/$itemId")({
	component: ScrollItemComponent,
});

function ScrollItemComponent() {
	const { itemId } = Route.useParams();

	return (
		<div className="flex flex-col gap-4 p-4">
			<h1 className="font-bold">Item {itemId}</h1>
			<p className="text-sm text-gray-500">
				Press Back in the browser to return to the list at the same position.
			</p>
			<Link to="/scroll" className="text-blue-600 underline">
				Back to list (new navigation, starts at top)
			</Link>
		</div>
	);
}
