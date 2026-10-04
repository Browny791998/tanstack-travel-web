import { createFileRoute, Link } from "@tanstack/react-router";

// Child route: inherits the parent's validated search (page, filter, sort, tags)
export const Route = createFileRoute("/shop/products/$productId")({
	component: ProductDetailComponent,
});

function ProductDetailComponent() {
	const { productId } = Route.useParams();
	const { page, filter, sort } = Route.useSearch();

	return (
		<div className="p-4">
			<h2 className="font-bold">Product #{productId}</h2>
			<p>
				Inherited search from parent: page {page}, filter "{filter}", sort{" "}
				{sort}
			</p>
			{/* Keeps the parent's search params when going back */}
			<Link
				from={Route.fullPath}
				to=".."
				search={(prev) => prev}
				className="text-blue-600 underline"
			>
				Back to list (same search)
			</Link>
		</div>
	);
}
