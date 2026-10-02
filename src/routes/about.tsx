import { createFileRoute } from "@tanstack/react-router";

// Static route: matches the exact path /about
export const Route = createFileRoute("/about")({
	component: AboutComponent,
});

function AboutComponent() {
	return <div className="p-4">Hello from About!</div>;
}
