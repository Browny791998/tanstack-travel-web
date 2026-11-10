import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function CacheInspector() {
	const queryClient = useQueryClient();
	const [, setTick] = useState(0);

	// Subscribe to QueryCache updates so the table refreshes in real-time
	useEffect(() => {
		const unsubscribe = queryClient.getQueryCache().subscribe(() => {
			setTick((prev) => prev + 1);
		});
		return () => unsubscribe();
	}, [queryClient]);

	const queries = queryClient.getQueryCache().getAll();

	return (
		<section className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-lg p-6 mb-12">
			<div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
				<div>
					<div className="flex items-center gap-2">
						<span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
						<h2 className="text-xl font-bold tracking-tight">
							Live Query Cache Inspector
						</h2>
						<span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
							{queries.length} Cached{" "}
							{queries.length === 1 ? "Query" : "Queries"}
						</span>
					</div>
					<p className="text-xs text-slate-400 mt-1">
						Inspect the serialized query keys currently stored in the in-memory
						TanStack Query cache.
					</p>
				</div>

				{/* Quick Invalidation Actions */}
				<div className="flex flex-wrap items-center gap-2">
					<button
						type="button"
						onClick={() =>
							queryClient.invalidateQueries({ queryKey: ["todos"] })
						}
						className="px-2.5 py-1.5 text-xs font-medium rounded bg-indigo-600 hover:bg-indigo-500 text-white transition"
						title="Invalidate all queries whose keys start with ['todos']"
					>
						Invalidate ['todos']
					</button>
					<button
						type="button"
						onClick={() =>
							queryClient.invalidateQueries({ queryKey: ["posts"] })
						}
						className="px-2.5 py-1.5 text-xs font-medium rounded bg-emerald-700 hover:bg-emerald-600 text-white transition"
						title="Invalidate Supabase posts cache"
					>
						Invalidate ['posts']
					</button>
					<button
						type="button"
						onClick={() =>
							queryClient.invalidateQueries({
								queryKey: ["something", "special"],
							})
						}
						className="px-2.5 py-1.5 text-xs font-medium rounded bg-purple-700 hover:bg-purple-600 text-white transition"
					>
						Invalidate ['something', 'special']
					</button>
					<button
						type="button"
						onClick={() => queryClient.clear()}
						className="px-2.5 py-1.5 text-xs font-medium rounded bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 transition"
					>
						Clear All Cache
					</button>
				</div>
			</div>

			<div className="mt-4 overflow-x-auto">
				<table className="w-full text-left text-xs">
					<thead>
						<tr className="border-b border-slate-800 text-slate-400 font-mono">
							<th className="py-2.5 px-3">Query Key</th>
							<th className="py-2.5 px-3">Status</th>
							<th className="py-2.5 px-3">Internal Hash</th>
							<th className="py-2.5 px-3">Observers</th>
							<th className="py-2.5 px-3 text-right">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-800/60">
						{queries.length === 0 ? (
							<tr>
								<td
									colSpan={5}
									className="py-6 text-center text-slate-500 italic"
								>
									No queries currently cached.
								</td>
							</tr>
						) : (
							queries.map((q) => {
								const isFetching = q.state.fetchStatus === "fetching";
								const isStale = q.isStale();

								return (
									<tr
										key={q.queryHash}
										className="hover:bg-slate-800/40 font-mono transition"
									>
										<td className="py-2.5 px-3">
											<span className="text-amber-300 font-semibold">
												{JSON.stringify(q.queryKey)}
											</span>
										</td>
										<td className="py-2.5 px-3 font-sans">
											<span
												className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
													isFetching
														? "bg-amber-900/50 text-amber-300 border border-amber-700"
														: isStale
															? "bg-slate-800 text-slate-400 border border-slate-700"
															: "bg-emerald-900/40 text-emerald-300 border border-emerald-700"
												}`}
											>
												{isFetching ? "Fetching" : isStale ? "Stale" : "Fresh"}
											</span>
										</td>
										<td className="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-[200px]">
											{q.queryHash}
										</td>
										<td className="py-2.5 px-3 font-sans text-slate-400">
											{q.getObserversCount()}
										</td>
										<td className="py-2.5 px-3 text-right font-sans">
											<button
												type="button"
												onClick={() =>
													queryClient.invalidateQueries({
														queryKey: q.queryKey,
														exact: true,
													})
												}
												className="text-[11px] text-blue-400 hover:text-blue-300 underline font-medium"
											>
												Invalidate
											</button>
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>
		</section>
	);
}
