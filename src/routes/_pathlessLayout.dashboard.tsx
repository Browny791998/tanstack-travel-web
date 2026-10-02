import { createFileRoute } from "@tanstack/react-router";

// Child of the pathless layout above. Even though the file is prefixed with
// "_pathlessLayout.", the actual URL is just /dashboard.
export const Route = createFileRoute("/_pathlessLayout/dashboard")({
	component: DashboardComponent,
});

function DashboardComponent() {
	return (
		<div>Dashboard (URL is /dashboard, not /pathlessLayout/dashboard)</div>
	);
}
