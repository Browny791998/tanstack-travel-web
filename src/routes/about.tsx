import { createFileRoute } from "@tanstack/react-router";

// Static route: matches the exact path /about
export const Route = createFileRoute("/about")({
	component: AboutComponent,
});

function AboutComponent() {
	return (
		<div className="p-4">
			<div>Hello from About!</div>
			<h2 id="section-1" className="mt-96 font-bold">
				Section 1
			</h2>
			<p>Linked to directly via a hash Link from /nav.</p>
		</div>
	);
}
