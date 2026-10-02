import { createFileRoute } from "@tanstack/react-router";

// Optional path parameter: {-$category} matches both /products and
// /products/<anything>, with category left undefined in the former case.
export const Route = createFileRoute("/products/{-$category}")({
	component: ProductsComponent,
});

function ProductsComponent() {
	const { category } = Route.useParams();
	return (
		<div>Products{category ? ` in ${category}` : " (all categories)"}</div>
	);
}
