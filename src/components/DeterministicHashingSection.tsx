import { hashKey, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchTodosPaginated } from "../lib/api";

export function DeterministicHashingSection() {
	const status = "done";
	const page = 1;

	// Object key variants (Equal)
	const [activeObjectVariant, setActiveObjectVariant] = useState<
		"standard" | "reversed" | "withUndefined"
	>("standard");

	// Array position variants (Not Equal)
	const [activeArrayVariant, setActiveArrayVariant] = useState<
		"order1" | "order2" | "withUndefined"
	>("order1");

	// Object order queries
	const objectKeyStandard = ["todos", { status, page }];
	const objectKeyReversed = ["todos", { page, status }];
	const objectKeyUndefined = ["todos", { page, status, other: undefined }];

	const selectedObjectKey =
		activeObjectVariant === "standard"
			? objectKeyStandard
			: activeObjectVariant === "reversed"
				? objectKeyReversed
				: objectKeyUndefined;

	const objectQuery = useQuery({
		queryKey: selectedObjectKey,
		queryFn: () => fetchTodosPaginated({ page, status }),
	});

	// Array order queries
	const arrayKey1 = ["todos", status, page];
	const arrayKey2 = ["todos", page, status];
	const arrayKey3 = ["todos", undefined, page, status];

	const selectedArrayKey =
		activeArrayVariant === "order1"
			? arrayKey1
			: activeArrayVariant === "order2"
				? arrayKey2
				: arrayKey3;

	const arrayQuery = useQuery({
		queryKey: selectedArrayKey,
		queryFn: () => fetchTodosPaginated({ page, status }),
	});

	// Inspect query count in QueryClient
	const objectHash = hashKey(selectedObjectKey);
	const arrayHash = hashKey(selectedArrayKey);

	return (
		<section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-8">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
				<div>
					<span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
						Section 3
					</span>
					<h2 className="text-xl font-bold text-slate-900">
											</h2>
					<p className="text-sm text-slate-500 mt-1">
						TanStack Query sorts object keys before hashing, so object key order
						does not matter. However, array item order DOES matter!
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
				{/* Part A: Object Keys - EQUAL */}
				<div className="border border-emerald-200 bg-emerald-50/20 rounded-xl p-5 flex flex-col">
					<div className="flex items-center gap-2 mb-2">
						<span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-xs font-semibold uppercase">
							Considered Equal
						</span>
						<h3 className="font-bold text-slate-900 text-sm">
							Object Key Order Does NOT Matter
						</h3>
					</div>
					<p className="text-xs text-slate-600 mb-3">
						Switching between these options yields the exact same cache hash:
					</p>

					<div className="flex flex-col gap-2 mb-4">
						<button
							type="button"
							onClick={() => setActiveObjectVariant("standard")}
							className={`text-left p-2.5 rounded-lg border font-mono text-xs transition flex items-center justify-between ${
								activeObjectVariant === "standard"
									? "border-emerald-500 bg-white ring-2 ring-emerald-500/20 text-emerald-950 font-bold"
									: "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
							}`}
						>
							<span>['todos', {`{ status: 'done', page: 1 }`}]</span>
							{activeObjectVariant === "standard" && (
								<span className="text-[11px] text-emerald-600 uppercase font-sans">
									Active
								</span>
							)}
						</button>

						<button
							type="button"
							onClick={() => setActiveObjectVariant("reversed")}
							className={`text-left p-2.5 rounded-lg border font-mono text-xs transition flex items-center justify-between ${
								activeObjectVariant === "reversed"
									? "border-emerald-500 bg-white ring-2 ring-emerald-500/20 text-emerald-950 font-bold"
									: "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
							}`}
						>
							<span>['todos', {`{ page: 1, status: 'done' }`}]</span>
							{activeObjectVariant === "reversed" && (
								<span className="text-[11px] text-emerald-600 uppercase font-sans">
									Active
								</span>
							)}
						</button>

						<button
							type="button"
							onClick={() => setActiveObjectVariant("withUndefined")}
							className={`text-left p-2.5 rounded-lg border font-mono text-xs transition flex items-center justify-between ${
								activeObjectVariant === "withUndefined"
									? "border-emerald-500 bg-white ring-2 ring-emerald-500/20 text-emerald-950 font-bold"
									: "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
							}`}
						>
							<span>
								['todos', {`{ page: 1, status: 'done', other: undefined }`}]
							</span>
							{activeObjectVariant === "withUndefined" && (
								<span className="text-[11px] text-emerald-600 uppercase font-sans">
									Active
								</span>
							)}
						</button>
					</div>

					<div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
						<div className="flex items-center justify-between">
							<span className="text-slate-500">Internal Hashed Cache Key:</span>
							<span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
								{objectHash}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-slate-500">Query Status:</span>
							<span className="font-medium text-slate-800">
								{objectQuery.isFetching
									? "Fetching..."
									: "Data served from same cache slot"}
							</span>
						</div>
						<p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
							Notice: Clicking between the three buttons produces the IDENTICAL
							hash{" "}
							<code className="bg-slate-100 px-1 py-0.5 rounded">
								["todos",&#123;"page":1,"status":"done"&#125;]
							</code>
							. Undefined keys are omitted.
						</p>
					</div>
				</div>

				{/* Part B: Array Items - NOT EQUAL */}
				<div className="border border-rose-200 bg-rose-50/20 rounded-xl p-5 flex flex-col">
					<div className="flex items-center gap-2 mb-2">
						<span className="text-rose-700 bg-rose-100 px-2 py-0.5 rounded text-xs font-semibold uppercase">
							Not Equal
						</span>
						<h3 className="font-bold text-slate-900 text-sm">
							Array Item Order MATTERS!
						</h3>
					</div>
					<p className="text-xs text-slate-600 mb-3">
						Switching between these options creates completely distinct cache
						entries:
					</p>

					<div className="flex flex-col gap-2 mb-4">
						<button
							type="button"
							onClick={() => setActiveArrayVariant("order1")}
							className={`text-left p-2.5 rounded-lg border font-mono text-xs transition flex items-center justify-between ${
								activeArrayVariant === "order1"
									? "border-rose-500 bg-white ring-2 ring-rose-500/20 text-rose-950 font-bold"
									: "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
							}`}
						>
							<span>['todos', 'done', 1]</span>
							{activeArrayVariant === "order1" && (
								<span className="text-[11px] text-rose-600 uppercase font-sans">
									Active
								</span>
							)}
						</button>

						<button
							type="button"
							onClick={() => setActiveArrayVariant("order2")}
							className={`text-left p-2.5 rounded-lg border font-mono text-xs transition flex items-center justify-between ${
								activeArrayVariant === "order2"
									? "border-rose-500 bg-white ring-2 ring-rose-500/20 text-rose-950 font-bold"
									: "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
							}`}
						>
							<span>['todos', 1, 'done']</span>
							{activeArrayVariant === "order2" && (
								<span className="text-[11px] text-rose-600 uppercase font-sans">
									Active
								</span>
							)}
						</button>

						<button
							type="button"
							onClick={() => setActiveArrayVariant("withUndefined")}
							className={`text-left p-2.5 rounded-lg border font-mono text-xs transition flex items-center justify-between ${
								activeArrayVariant === "withUndefined"
									? "border-rose-500 bg-white ring-2 ring-rose-500/20 text-rose-950 font-bold"
									: "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
							}`}
						>
							<span>['todos', undefined, 1, 'done']</span>
							{activeArrayVariant === "withUndefined" && (
								<span className="text-[11px] text-rose-600 uppercase font-sans">
									Active
								</span>
							)}
						</button>
					</div>

					<div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
						<div className="flex items-center justify-between">
							<span className="text-slate-500">Internal Hashed Cache Key:</span>
							<span className="font-mono font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
								{arrayHash}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-slate-500">Query Status:</span>
							<span className="font-medium text-slate-800">
								{arrayQuery.isFetching
									? "Fetching fresh entry..."
									: "Cached under this unique array key"}
							</span>
						</div>
						<p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
							Notice: Changing the order of items in an array changes the hash!
							These represent separate queries in TanStack Query's cache.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
