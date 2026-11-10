import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { useState } from "react";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "TanStack Query - Query Keys Guide" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 1000 * 60, // 1 minute
						refetchOnWindowFocus: false,
					},
				},
			}),
	);

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
				<QueryClientProvider client={queryClient}>
					{children}
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
				<Scripts />
			</body>
		</html>
	);
}
