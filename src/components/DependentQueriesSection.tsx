import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchTodoById, fetchTodos } from "../lib/api";

export function DependentQueriesSection() {
	const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

	// 1. Primary Query: Fetches list of todos
	const todosQuery = useQuery({
		queryKey: ["todos", "dependent-demo"],
		queryFn: fetchTodos,
	});

	// 2. Dependent Query: Will NOT execute until `selectedTodoId` is not null/undefined
	const detailQuery = useQuery({
		queryKey: ["todo", "dependent-demo", selectedTodoId],
		queryFn: () => {
			if (selectedTodoId === null) {
				throw new Error("No Todo ID provided");
			}
			return fetchTodoById(selectedTodoId);
		},
		// ⚠️ Crucial: The query stays idle and does not fetch while enabled is false
		enabled: selectedTodoId !== null,
	});

	return (
		<section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-8">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
				<div>
					<span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
						Section 6
					</span>
					<h2 className="text-xl font-bold text-slate-900">
						Dependent (Serial) Queries
					</h2>
					<p className="text-sm text-slate-500 mt-1">
						Execute a query only after a previous query completes or when a
						prerequisite variable is available using the{" "}
						<code className="text-indigo-600 font-mono">enabled</code> option.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
				{/* Code Pattern Card */}
				<div className="flex flex-col border border-slate-200 rounded-lg p-4 bg-slate-50/50">
					<div className="flex items-center justify-between mb-3">
						<span className="text-xs font-bold text-slate-700 uppercase">
							Code Pattern
						</span>
						<span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded">
							enabled: Boolean(id)
						</span>
					</div>

					<pre className="text-xs bg-slate-900 text-slate-200 p-3 rounded font-mono overflow-x-auto leading-relaxed">
						{`// 1. Primary Query: Fetch list of items
const todosQuery = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})

const selectedId = ${selectedTodoId === null ? "null" : selectedTodoId};

// 2. Dependent Query: Waits for selectedId
const detailQuery = useQuery({
  queryKey: ['todo', selectedId],
  queryFn: () => fetchTodoById(selectedId!),
  // 👇 Only runs when selectedId is available
  enabled: selectedId !== null,
})`}
					</pre>

					<div className="mt-4 text-xs text-slate-600 space-y-2">
						<p className="font-semibold text-slate-800">Key Behaviors:</p>
						<ul className="list-disc pl-4 space-y-1">
							<li>
								While{" "}
								<code className="bg-slate-200 px-1 py-0.5 rounded font-mono">
									enabled: false
								</code>
								, the query's{" "}
								<code className="bg-slate-200 px-1 py-0.5 rounded font-mono">
									fetchStatus
								</code>{" "}
								remains <code className="text-amber-700 font-mono">'idle'</code>{" "}
								and does not make a network request.
							</li>
							<li>
								As soon as{" "}
								<code className="bg-slate-200 px-1 py-0.5 rounded font-mono">
									selectedTodoId
								</code>{" "}
								is provided, TanStack Query automatically triggers the fetch.
							</li>
						</ul>
					</div>
				</div>

				{/* Live Interactive Demo */}
				<div className="flex flex-col border border-slate-200 rounded-lg p-4 bg-slate-50/50">
					<div className="flex items-center justify-between mb-3">
						<span className="text-xs font-bold text-slate-700 uppercase">
							Live Interactive Demo
						</span>
						{selectedTodoId !== null && (
							<button
								type="button"
								onClick={() => setSelectedTodoId(null)}
								className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
							>
								Clear Selection
							</button>
						)}
					</div>

					<div className="space-y-4 flex-1 flex flex-col">
						{/* Step 1: Parent list */}
						<div>
							<div className="flex items-center justify-between mb-2">
								<span className="text-xs font-semibold text-slate-700">
									Step 1: Select a Todo from Primary Query
								</span>
								<span
									className={`text-[11px] px-2 py-0.5 rounded font-medium ${
										todosQuery.isFetching
											? "bg-amber-100 text-amber-800 animate-pulse"
											: "bg-emerald-100 text-emerald-800"
									}`}
								>
									{todosQuery.isFetching ? "Fetching List..." : "List Ready"}
								</span>
							</div>

							<div className="bg-white border border-slate-200 rounded-lg p-2 max-h-36 overflow-y-auto space-y-1">
								{todosQuery.isLoading ? (
									<p className="text-xs text-slate-400 p-2">Loading todos...</p>
								) : (
									todosQuery.data?.data.map((todo) => (
										<button
											key={todo.id}
											type="button"
											onClick={() => setSelectedTodoId(Number(todo.id))}
											className={`w-full text-left text-xs px-3 py-1.5 rounded flex items-center justify-between transition cursor-pointer ${
												selectedTodoId === Number(todo.id)
													? "bg-indigo-600 text-white font-medium shadow-xs"
													: "hover:bg-slate-100 text-slate-700"
											}`}
										>
											<span className="truncate">
												#{todo.id} {todo.title}
											</span>
											<span className="text-[10px] opacity-75">
												{todo.status}
											</span>
										</button>
									))
								)}
							</div>
						</div>

						{/* Step 2: Dependent detail */}
						<div className="border border-indigo-200 bg-indigo-50/30 rounded-lg p-4 flex-1 flex flex-col justify-between">
							<div>
								<div className="flex items-center justify-between mb-2">
									<span className="text-xs font-semibold text-slate-700">
										Step 2: Dependent Detail Query
									</span>
									<div className="flex items-center gap-1.5">
										<span
											className={`text-[11px] px-2 py-0.5 rounded font-medium ${
												selectedTodoId === null
													? "bg-slate-200 text-slate-700"
													: detailQuery.isFetching
														? "bg-amber-100 text-amber-800 animate-pulse"
														: "bg-emerald-100 text-emerald-800"
											}`}
										>
											{selectedTodoId === null
												? "Status: Idle (Disabled)"
												: detailQuery.isFetching
													? "Fetching Detail..."
													: "Detail Cached"}
										</span>
									</div>
								</div>

								<div className="bg-white border border-slate-200 rounded p-3 text-xs mt-2">
									{selectedTodoId === null ? (
										<div className="text-center py-4 text-slate-400">
											<p className="font-medium text-slate-600">
												Query is paused (
												<code className="font-mono">enabled: false</code>)
											</p>
											<p className="text-[11px] mt-1">
												Click any item in Step 1 to satisfy the dependency.
											</p>
										</div>
									) : detailQuery.isLoading ? (
										<p className="text-slate-400">
											Loading details for #{selectedTodoId}...
										</p>
									) : detailQuery.isError ? (
										<p className="text-red-500">
											Error: {(detailQuery.error as Error).message}
										</p>
									) : (
										<div className="space-y-1.5">
											<div className="flex items-center justify-between">
												<h4 className="font-bold text-slate-900">
													{detailQuery.data?.data.title}
												</h4>
												<span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-mono">
													ID #{detailQuery.data?.data.id}
												</span>
											</div>
											<p className="text-slate-600">
												{detailQuery.data?.data.content}
											</p>
											<div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
												<span>Status: {detailQuery.data?.data.status}</span>
												<span>Category: {detailQuery.data?.data.category}</span>
											</div>
										</div>
									)}
								</div>
							</div>

							<div className="mt-3 text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
								fetchStatus:{" "}
								<strong className="text-indigo-600">
									{detailQuery.fetchStatus}
								</strong>{" "}
								| enabled:{" "}
								<strong className="text-indigo-600">
									{String(selectedTodoId !== null)}
								</strong>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
