import { useQuery } from "@tanstack/react-query";
import { fetchPosts, fetchSomethingSpecial, fetchTodos } from "../lib/api";

export function SimpleKeysSection() {
	// Example 1: ['todos'] - Generic List/Index resource
	const todosQuery = useQuery({
		queryKey: ["todos"],
		queryFn: fetchTodos,
	});

	// Example 2: ['something', 'special'] - Non-hierarchical / generic resource
	const somethingSpecialQuery = useQuery({
		queryKey: ["something", "special"],
		queryFn: fetchSomethingSpecial,
	});

	// Example 3: ['posts'] - Using the Supabase table from this project
	const postsQuery = useQuery({
		queryKey: ["posts"],
		queryFn: fetchPosts,
	});

	return (
		<section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-8">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
				<div>
					<span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
						Section 1
					</span>
					<h2 className="text-xl font-bold text-slate-900">
						Simple Query Keys
					</h2>
					<p className="text-sm text-slate-500 mt-1">
						The simplest form of a key is an array with constant values. Useful
						for generic list/index resources and non-hierarchical resources.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
				{/* Example 1: ['todos'] */}
				<div className="flex flex-col border border-slate-200 rounded-lg p-4 bg-slate-50/50">
					<div className="flex items-center justify-between mb-3">
						<span className="font-mono text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200">
							queryKey: ['todos']
						</span>
						<button
							type="button"
							onClick={() => todosQuery.refetch()}
							className="text-xs px-2.5 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50 active:bg-slate-100 font-medium text-slate-700"
						>
							Refetch
						</button>
					</div>

					<pre className="text-xs bg-slate-900 text-slate-200 p-2.5 rounded font-mono overflow-x-auto mb-3">
						{`// A list of todos
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})`}
					</pre>

					<div className="flex items-center gap-2 mb-2 text-xs">
						<span
							className={`px-2 py-0.5 rounded font-medium ${
								todosQuery.isFetching
									? "bg-amber-100 text-amber-800 animate-pulse"
									: "bg-emerald-100 text-emerald-800"
							}`}
						>
							{todosQuery.isFetching ? "Fetching..." : "Cached"}
						</span>
						<span className="text-slate-500">
							Source: {todosQuery.data?.meta.source ?? "..."}
						</span>
					</div>

					<div className="flex-1 bg-white border border-slate-200 rounded p-3 overflow-y-auto max-h-48 text-xs">
						{todosQuery.isLoading ? (
							<p className="text-slate-400">Loading todos...</p>
						) : todosQuery.isError ? (
							<p className="text-red-500">
								Error: {(todosQuery.error as Error).message}
							</p>
						) : (
							<ul className="space-y-1.5">
								{todosQuery.data?.data.map((todo) => (
									<li
										key={todo.id}
										className="flex items-center justify-between text-slate-700"
									>
										<span className="truncate">
											{todo.completed ? "✓ " : "○ "}
											{todo.title}
										</span>
										<span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
											#{todo.id}
										</span>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				{/* Example 2: ['something', 'special'] */}
				<div className="flex flex-col border border-slate-200 rounded-lg p-4 bg-slate-50/50">
					<div className="flex items-center justify-between mb-3">
						<span className="font-mono text-xs font-semibold px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-200">
							queryKey: ['something', 'special']
						</span>
						<button
							type="button"
							onClick={() => somethingSpecialQuery.refetch()}
							className="text-xs px-2.5 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50 active:bg-slate-100 font-medium text-slate-700"
						>
							Refetch
						</button>
					</div>

					<pre className="text-xs bg-slate-900 text-slate-200 p-2.5 rounded font-mono overflow-x-auto mb-3">
						{`// Something else, whatever!
useQuery({
  queryKey: ['something', 'special'],
  queryFn: fetchSomethingSpecial,
})`}
					</pre>

					<div className="flex items-center gap-2 mb-2 text-xs">
						<span
							className={`px-2 py-0.5 rounded font-medium ${
								somethingSpecialQuery.isFetching
									? "bg-amber-100 text-amber-800 animate-pulse"
									: "bg-emerald-100 text-emerald-800"
							}`}
						>
							{somethingSpecialQuery.isFetching ? "Fetching..." : "Cached"}
						</span>
						<span className="text-slate-500">Non-hierarchical</span>
					</div>

					<div className="flex-1 bg-white border border-slate-200 rounded p-3 overflow-y-auto max-h-48 text-xs">
						{somethingSpecialQuery.isLoading ? (
							<p className="text-slate-400">Loading special resource...</p>
						) : (
							<div className="space-y-2 text-slate-700">
								<p className="font-medium text-slate-900">
									{somethingSpecialQuery.data?.message}
								</p>
								<ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
									{somethingSpecialQuery.data?.features.map((feature) => (
										<li key={feature}>{feature}</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>

				{/* Example 3: ['posts'] - Supabase Table */}
				<div className="flex flex-col border border-slate-200 rounded-lg p-4 bg-slate-50/50">
					<div className="flex items-center justify-between mb-3">
						<span className="font-mono text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
							queryKey: ['posts'] (Supabase)
						</span>
						<button
							type="button"
							onClick={() => postsQuery.refetch()}
							className="text-xs px-2.5 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50 active:bg-slate-100 font-medium text-slate-700"
						>
							Refetch
						</button>
					</div>

					<pre className="text-xs bg-slate-900 text-slate-200 p-2.5 rounded font-mono overflow-x-auto mb-3">
						{`// Supabase posts table
useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
})`}
					</pre>

					<div className="flex items-center gap-2 mb-2 text-xs">
						<span
							className={`px-2 py-0.5 rounded font-medium ${
								postsQuery.isFetching
									? "bg-amber-100 text-amber-800 animate-pulse"
									: "bg-emerald-100 text-emerald-800"
							}`}
						>
							{postsQuery.isFetching ? "Fetching..." : "Cached"}
						</span>
						<span className="text-slate-500">
							Source: {postsQuery.data?.meta.source ?? "..."}
						</span>
					</div>

					<div className="flex-1 bg-white border border-slate-200 rounded p-3 overflow-y-auto max-h-48 text-xs">
						{postsQuery.isLoading ? (
							<p className="text-slate-400">Loading Supabase posts...</p>
						) : postsQuery.isError ? (
							<p className="text-red-500">
								Error: {(postsQuery.error as Error).message}
							</p>
						) : (
							<ul className="space-y-2">
								{postsQuery.data?.data.map((post) => (
									<li
										key={post.id}
										className="border-b border-slate-100 pb-1.5 last:border-0 text-slate-700"
									>
										<p className="font-semibold text-slate-900 truncate">
											{post.title}
										</p>
										<p className="text-slate-500 text-[11px] truncate">
											{post.content}
										</p>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
