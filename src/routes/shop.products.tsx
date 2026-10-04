import {
	createFileRoute,
	getRouteApi,
	Link,
	retainSearchParams,
	stripSearchParams,
	useNavigate,
	useRouter,
	useSearch,
} from "@tanstack/react-router";
import { z } from "zod";

const productSearchSchema = z.object({
	page: z.number().catch(1),
	filter: z.string().catch(""),
	sort: z.enum(["newest", "oldest", "price"]).catch("newest"),
	tags: z.array(z.string()).catch([]),
});

const defaultSearch = {
	page: 1,
	filter: "",
	sort: "newest" as const,
	tags: [] as string[],
};

export const Route = createFileRoute("/shop/products")({
	validateSearch: productSearchSchema,
	search: {
		middlewares: [
			retainSearchParams(["filter"]),
			stripSearchParams(defaultSearch),
		],
	},
	component: ProductsComponent,
});

function ProductsComponent() {
	const { page, filter, sort, tags } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const router = useRouter();

	return (
		<div className="flex flex-col gap-4 p-4">
			<h1 className="font-bold">Products</h1>
			<p>
				page: {page}, filter: "{filter}", sort: {sort}, tags: [{tags.join(", ")}
				]
			</p>

			<section>
				<h2 className="font-bold">{"<Link search> examples"}</h2>
				<ul className="mt-1 flex flex-col gap-1 text-blue-600 underline">
					<li>
						{/* from + omitted `to`: next page using a function updater */}
						<Link
							from={Route.fullPath}
							search={(prev) => ({ ...prev, page: prev.page + 1 })}
						>
							Next page
						</Link>
					</li>
					<li>
						{/* Update a single param, keep the rest */}
						<Link
							from={Route.fullPath}
							search={(prev) => ({ ...prev, sort: "price" as const })}
						>
							Sort by price
						</Link>
					</li>
					<li>
						{/* Set several params at once */}
						<Link
							to="/shop/products"
							search={{ page: 1, filter: "shoes", sort: "newest", tags: [] }}
						>
							Search "shoes"
						</Link>
					</li>
					<li>
						{/* Arrays are JSON-encoded in the URL and parsed back */}
						<Link
							from={Route.fullPath}
							search={(prev) => ({
								...prev,
								tags: [...(prev.tags ?? []), "gifts"],
							})}
						>
							Add tag "gifts"
						</Link>
					</li>
				</ul>
			</section>

			<section>
				<h2 className="font-bold">useNavigate / router.navigate</h2>
				<div className="mt-1 flex gap-2">
					<button
						type="button"
						className="border px-2 py-1"
						onClick={() =>
							navigate({
								to: "/shop/products",
								search: (prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }),
							})
						}
					>
						Next page (useNavigate)
					</button>
					<button
						type="button"
						className="border px-2 py-1"
						onClick={() =>
							router.navigate({
								to: "/shop/products",
								search: (prev) => ({ ...defaultSearch, ...prev, page: 1 }),
							})
						}
					>
						Reset page (router.navigate)
					</button>
					<button
						type="button"
						className="border px-2 py-1"
						onClick={() => navigate({ search: defaultSearch })}
					>
						Reset all
					</button>
				</div>
			</section>

			<SearchReaders />

			<Link
				to="/shop/products/$productId"
				params={{ productId: "42" }}
				search={{ page, filter, sort, tags }}
			>
				Open product 42 (search carried over)
			</Link>
		</div>
	);
}

function SearchReaders() {
	const routeApi = getRouteApi("/shop/products");
	const fromCodeSplit = routeApi.useSearch();
	const looseSearch = useSearch({ strict: false });

	return (
		<section>
			<h2 className="font-bold">Reading search params</h2>
			<p className="mt-1">
				getRouteApi: page {fromCodeSplit.page} | strict:false keys:{" "}
				{Object.keys(looseSearch).join(", ") || "(none)"}
			</p>
		</section>
	);
}
