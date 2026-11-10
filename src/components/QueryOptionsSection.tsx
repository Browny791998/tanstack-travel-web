import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchTodoById } from "../lib/api";

// 1. Define queryOptions helper function
// Bundles queryKey, queryFn, and options together with full TypeScript inference
export const todoDetailOptions = (id: number, preview = false) =>
	queryOptions({
		queryKey: ["todo", "options-demo", id, { preview }] as const,
		queryFn: () => fetchTodoById(id, { preview }),
		staleTime: 1000 * 30, // 30 seconds
	});

export function QueryOptionsSection() {
	const queryClient = useQueryClient();
	const [selectedId, setSelectedId] = useState<number>(1);
	const [preview, setPreview] = useState<boolean>(false);
	const [prefetchStatus, setPrefetchStatus] = useState<string | null>(null);

	// 2. Pass queryOptions directly to useQuery
	const currentOptions = todoDetailOptions(selectedId, preview);
	const { data, isLoading, isFetching, isError, error } =
		useQuery(currentOptions);

	// 3. Reuse the exact same queryOptions for prefetching
	const handlePrefetch = async (id: number) => {
		const targetOptions = todoDetailOptions(id, preview);
		await queryClient.prefetchQuery(targetOptions);
		setPrefetchStatus(
			`Prefetched ID #${id} successfully! Check Cache Inspector below.`,
		);
		setTimeout(() => setPrefetchStatus(null), 4000);
	};

	// 4. Invalidate using the options' queryKey
	const handleInvalidate = () => {
		queryClient.invalidateQueries({
			queryKey: currentOptions.queryKey,
		});
	};

	return (
		<section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-8">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
				<div>
					<span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
						Section 5
					</span>
					<h2 className="text-xl font-bold text-slate-900">
						Type-Safe Query Definitions with queryOptions
					</h2>
					<p className="text-sm text-slate-500 mt-1">
						Introduced in TanStack Query v5,{" "}
						<code className="text-indigo-600 font-mono">queryOptions</code>{" "}
						cololocates the{" "}
						<code className="text-indigo-600 font-mono">queryKey</code> and{" "}
						<code className="text-indigo-600 font-mono">queryFn</code> into a
						single reusable, strongly-typed helper.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
				{/* Code Pattern Card */}
				<div className="flex flex-col border border-slate-200 rounded-lg p-4 bg-slate-50/50">
					<div className="flex items-center justify-between mb-3">
						<span className="text-xs font-bold text-slate-700 uppercase">
							Definition & Pattern
						</span>
						<span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded">
							TanStack Query v5
						</span>
					</div>

					<pre className="text-xs bg-slate-900 text-slate-200 p-3 rounded font-mono overflow-x-auto leading-relaxed">
						{`import { queryOptions, useQuery } from '@tanstack/react-query'

// 1. Declare once with queryOptions
export const todoOptions = (id: number, preview = false) =>
  queryOptions({
    queryKey: ['todo', 'options-demo', id, { preview }] as const,
    queryFn: () => fetchTodoById(id, { preview }),
    staleTime: 30 * 1000,
  })

// 2. Consume in components:
const { data } = useQuery(todoOptions(${selectedId}, ${preview}))

// 3. Share with queryClient (prefetch, loaders, getQueryData):
queryClient.prefetchQuery(todoOptions(${selectedId < 5 ? selectedId + 1 : 1}, ${preview}))`}
					</pre>

					<div className="mt-4 text-xs text-slate-600 space-y-2">
						<p className="font-semibold text-slate-800">
							Why use{" "}
							<code className="bg-slate-200 px-1 py-0.5 rounded font-mono">
								queryOptions
							</code>
							?
						</p>
						<ul className="list-disc pl-4 space-y-1">
							<li>
								<strong>End-to-End Type Safety:</strong> Types for query results
								and variables flow automatically into{" "}
								<code className="bg-slate-200 px-1 py-0.5 rounded font-mono">
									useQuery
								</code>
								,{" "}
								<code className="bg-slate-200 px-1 py-0.5 rounded font-mono">
									prefetchQuery
								</code>
								, and{" "}
								<code className="bg-slate-200 px-1 py-0.5 rounded font-mono">
									setQueryData
								</code>
								.
							</li>
							<li>
								<strong>Zero Key Mismatches:</strong> No danger of mis-typing
								query key arrays between fetching and cache management.
							</li>
							<li>
								<strong>Framework Agnostic:</strong> Works seamlessly with
								TanStack Router loaders and SSR.
							</li>
						</ul>
					</div>
				</div>

				{/* Live Interactive Demo */}
				<div className="flex flex-col border border-slate-200 rounded-lg p-4 bg-slate-50/50">
					<div className="flex flex-wrap items-center justify-between mb-3 gap-2">
						<span className="text-xs font-bold text-slate-700 uppercase">
							Live Interactive Demo
						</span>

						{/* Controls */}
						<div className="flex items-center gap-3">
							<label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
								<input
									type="checkbox"
									checked={preview}
									onChange={(e) => setPreview(e.target.checked)}
									className="rounded text-indigo-600 focus:ring-indigo-500"
								/>
								<span>preview</span>
							</label>

							<div className="flex items-center gap-1">
								<span className="text-xs text-slate-500 mr-1">ID:</span>
								{[1, 2, 3, 4, 5].map((id) => (
									<button
										key={id}
										type="button"
										onClick={() => setSelectedId(id)}
										className={`text-xs px-2.5 py-1 rounded font-semibold transition ${
											selectedId === id
												? "bg-indigo-600 text-white shadow-xs"
												: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
										}`}
									>
										{id}
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Active query status */}
					<div className="border border-indigo-200 bg-indigo-50/30 rounded-lg p-4 flex-1 flex flex-col justify-between">
						<div>
							<div className="flex items-center justify-between mb-2">
								<span className="font-mono text-[11px] font-semibold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded truncate max-w-[240px]">
									{JSON.stringify(currentOptions.queryKey)}
								</span>
								<span
									className={`text-xs px-2 py-0.5 rounded font-medium ${
										isFetching
											? "bg-amber-100 text-amber-800 animate-pulse"
											: "bg-emerald-100 text-emerald-800"
									}`}
								>
									{isFetching ? "Fetching..." : "Cached"}
								</span>
							</div>

							<div className="bg-white border border-slate-200 rounded p-3 text-xs mt-3">
								{isLoading ? (
									<p className="text-slate-400">Loading todo {selectedId}...</p>
								) : isError ? (
									<p className="text-red-500">
										Error: {(error as Error).message}
									</p>
								) : (
									<div className="space-y-1.5">
										<div className="flex items-center justify-between">
											<h4 className="font-bold text-slate-900">
												{data?.data.title}
											</h4>
											<span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-mono">
												#{data?.data.id}
											</span>
										</div>
										<p className="text-slate-600">{data?.data.content}</p>
										<div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
											<span>Status: {data?.data.status}</span>
											<span>Category: {data?.data.category}</span>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Action Buttons */}
						<div className="mt-4 pt-3 border-t border-indigo-100 flex flex-wrap items-center gap-2">
							<button
								type="button"
								onClick={() =>
									handlePrefetch(selectedId < 5 ? selectedId + 1 : 1)
								}
								className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded font-medium transition cursor-pointer"
							>
								⚡ Prefetch Next ID ({selectedId < 5 ? selectedId + 1 : 1})
							</button>

							<button
								type="button"
								onClick={handleInvalidate}
								className="text-xs bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded font-medium transition cursor-pointer"
							>
								↻ Invalidate Current
							</button>
						</div>

						{prefetchStatus && (
							<div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
								{prefetchStatus}
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
