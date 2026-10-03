import { createFileRoute, Navigate } from "@tanstack/react-router";

// <Navigate> performs an immediate client-side redirect once this
// component mounts, unlike <Link> which waits for a user interaction.
export const Route = createFileRoute("/nav/redirect")({
	component: RedirectComponent,
});

function RedirectComponent() {
	return <Navigate to="/nav" />;
}
