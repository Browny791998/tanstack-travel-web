import { createFileRoute, Link } from "@tanstack/react-router";

type SearchParams = {
	query: string;
	page: number;
};

export const Route = createFileRoute("/nav/search")({
	validateSearch: (search: Record<string, unknown>): SearchParams => ({
		query: typeof search.query === "string" ? search.query : "",
		page: typeof search.page === "number" ? search.page : 1,
	}),
	component: SearchComponent,
});

function SearchComponent() {
	const { query, page } = Route.useSearch();

	return (
		<section>
			<h2 className="font-bold">Search parameters</h2>
			<p className="mt-1">
				query: "{query}", page: {page}
			</p>
			<ul className="mt-1 flex flex-col gap-1 text-blue-600 underline">
				<li>
					{/* Set search params directly */}
					<Link to="/nav/search" search={{ query: "routing", page: 1 }}>
						Search "routing" (page 1)
					</Link>
				</li>
				<li>
					{/* Update a single param via a function, preserving the rest */}
					<Link
						to="."
						search={(prev) => ({ ...prev, page: (prev.page ?? 1) + 1 })}
					>
						Next page ({page + 1})
					</Link>
				</li>
			</ul>
		</section>
	);
}
