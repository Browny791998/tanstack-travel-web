import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchTodoById } from "../lib/api";

// The exact example component structure from TanStack documentation:
// function Todos({ todoId }) {
//   const result = useQuery({
//     queryKey: ['todos', todoId],
//     queryFn: () => fetchTodoById(todoId),
//   })
// }
function TodosComponent({ todoId }: { todoId: number }) {
	const result = useQuery({
		queryKey: ["todos", todoId],
		queryFn: () => fetchTodoById(todoId),
	});

	return (
		<div className="border border-indigo-200 bg-indigo-50/30 rounded-lg p-4">
			<div className="flex items-center justify-between mb-2">
				<span className="font-mono text-xs font-semibold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded">
					queryKey: ['todos', {todoId}]
				</span>
				<span
					className={`text-xs px-2 py-0.5 rounded font-medium ${
						result.isFetching
							? "bg-amber-100 text-amber-800 animate-pulse"
							: "bg-emerald-100 text-emerald-800"
					}`}
				>
					{result.isFetching
						? `Fetching for ID ${todoId}`
						: `Cached for ID ${todoId}`}
				</span>
			</div>

			<div className="bg-white border border-slate-200 rounded p-3 text-xs mt-3">
				{result.isLoading ? (
					<p className="text-slate-400">Loading todo {todoId}...</p>
				) : result.isError ? (
					<p className="text-red-500">
						Error: {(result.error as Error).message}
					</p>
				) : (
					<div className="space-y-1">
						<div className="flex items-center justify-between">
							<h4 className="font-bold text-slate-900">
								{result.data?.data.title}
							</h4>
							<span className="text-[10px] text-slate-500">
								ID #{result.data?.data.id}
							</span>
						</div>
						<p className="text-slate-600">{result.data?.data.content}</p>
						<div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
							<span>Status: {result.data?.data.status}</span>
							<span>Last fetched: {result.data?.meta.fetchedAt}</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export function VariableDependencySection() {
	const [activeTodoId, setActiveTodoId] = useState<number>(1);

	return (
		<section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-8">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
				<div>
					<span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
						Section 4
					</span>
					<h2 className="text-xl font-bold text-slate-900">
						If Your Query Function Depends on a Variable, Include It in Your
						Query Key
					</h2>
					<p className="text-sm text-slate-500 mt-1">
						Since query keys uniquely describe the data they are fetching, they
						should include any variables you use in your query function.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
				{/* Code Example from Docs */}
				<div className="flex flex-col border border-slate-200 rounded-lg p-4 bg-slate-50/50">
					<div className="flex items-center justify-between mb-3">
						<span className="text-xs font-bold text-slate-700 uppercase">
							Official Code Pattern
						</span>
					</div>

					<pre className="text-xs bg-slate-900 text-slate-200 p-3 rounded font-mono overflow-x-auto leading-relaxed">
						{`function Todos({ todoId }) {
  const result = useQuery({
    queryKey: ['todos', todoId],
    queryFn: () => fetchTodoById(todoId),
  })
}`}
					</pre>

					<div className="mt-4 text-xs text-slate-600 space-y-2">
						<p>
							<strong>Why is this critical?</strong>
						</p>
						<p>
							If you did not include{" "}
							<code className="bg-slate-200 px-1 py-0.5 rounded">todoId</code>{" "}
							in the query key and only used{" "}
							<code className="bg-slate-200 px-1 py-0.5 rounded">
								['todos']
							</code>
							, TanStack Query would treat requests for different IDs as the
							same query!
						</p>
						<p>
							By including{" "}
							<code className="bg-slate-200 px-1 py-0.5 rounded">todoId</code>{" "}
							in the key array, every ID gets its own dedicated cache slot and
							automatically triggers a fetch when the ID prop changes.
						</p>
					</div>
				</div>

				{/* Live Interactive Implementation */}
				<div className="flex flex-col border border-slate-200 rounded-lg p-4 bg-slate-50/50">
					<div className="flex items-center justify-between mb-3">
						<span className="text-xs font-bold text-slate-700 uppercase">
							Live Interactive Demo
						</span>

						{/* ID Switcher */}
						<div className="flex items-center gap-1">
							<span className="text-xs text-slate-500 mr-1">Switch ID:</span>
							{[1, 2, 3, 4, 5].map((id) => (
								<button
									key={id}
									type="button"
									onClick={() => setActiveTodoId(id)}
									className={`text-xs px-2.5 py-1 rounded font-semibold transition ${
										activeTodoId === id
											? "bg-indigo-600 text-white shadow-xs"
											: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
									}`}
								>
									{id}
								</button>
							))}
						</div>
					</div>

					<TodosComponent todoId={activeTodoId} />
				</div>
			</div>
		</section>
	);
}
