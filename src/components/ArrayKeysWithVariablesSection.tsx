import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchTodoById, fetchTodosByType } from "../lib/api";

export function ArrayKeysWithVariablesSection() {
	// State for Example 1 & 2
	const [selectedTodoId, setSelectedTodoId] = useState<number>(5);
	const [isPreview, setIsPreview] = useState<boolean>(false);

	// State for Example 3
	const [filterType, setFilterType] = useState<"done" | "pending" | "all">(
		"done",
	);

	// Example 1: ['todo', 5] (without preview)
	const standardTodoQuery = useQuery({
		queryKey: ["todo", selectedTodoId],
		queryFn: () => fetchTodoById(selectedTodoId),
	});

	// Example 2: ['todo', 5, { preview: true }]
	const previewTodoQuery = useQuery({
		queryKey: ["todo", selectedTodoId, { preview: isPreview }],
		queryFn: () => fetchTodoById(selectedTodoId, { preview: isPreview }),
	});

	// Example 3: ['todos', { type: 'done' }]
	const filteredTodosQuery = useQuery({
		queryKey: ["todos", { type: filterType }],
		queryFn: () => fetchTodosByType(filterType),
	});

	return (
		<section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-8">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
				<div>
					<span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
						Section 2
					</span>
					<h2 className="text-xl font-bold text-slate-900">
						Array Keys with Variables
					</h2>
					<p className="text-sm text-slate-500 mt-1">
						When queries need more information to uniquely describe data
						(hierarchical IDs, preview options, filters), pass serializable
						objects and primitives.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
				{/* Example 1: ['todo', id] */}
				<div className="flex flex-col border border-slate-200 rounded-lg p-4 bg-slate-50/50">
					<div className="flex items-center justify-between mb-3">
						<span className="font-mono text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200">
							['todo', {selectedTodoId}]
						</span>
						<div className="flex items-center gap-1.5">
							<label
								htmlFor="todo-id-select"
								className="text-xs text-slate-500"
							>
								ID:
							</label>
							<select
								id="todo-id-select"
								value={selectedTodoId}
								onChange={(e) => setSelectedTodoId(Number(e.target.value))}
								className="text-xs border border-slate-300 rounded px-2 py-1 bg-white font-medium"
							>
								{[1, 2, 3, 4, 5].map((id) => (
									<option key={id} value={id}>
										{id}
									</option>
								))}
							</select>
						</div>
					</div>

					<pre className="text-xs bg-slate-900 text-slate-200 p-2.5 rounded font-mono overflow-x-auto mb-3">
						{`// An individual todo
useQuery({
  queryKey: ['todo', ${selectedTodoId}],
  queryFn: () => fetchTodo(${selectedTodoId}),
})`}
					</pre>

					<div className="flex items-center gap-2 mb-2 text-xs">
						<span
							className={`px-2 py-0.5 rounded font-medium ${
								standardTodoQuery.isFetching
									? "bg-amber-100 text-amber-800 animate-pulse"
									: "bg-emerald-100 text-emerald-800"
							}`}
						>
							{standardTodoQuery.isFetching ? "Fetching..." : "Cached"}
						</span>
						<span className="text-slate-500">
							Key: {JSON.stringify(["todo", selectedTodoId])}
						</span>
					</div>

					<div className="flex-1 bg-white border border-slate-200 rounded p-3 text-xs">
						{standardTodoQuery.isLoading ? (
							<p className="text-slate-400">
								Loading todo #{selectedTodoId}...
							</p>
						) : (
							<div className="space-y-1.5">
								<div className="flex items-center justify-between">
									<h4 className="font-semibold text-slate-900">
										{standardTodoQuery.data?.data.title}
									</h4>
									<span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-mono">
										#{standardTodoQuery.data?.data.id}
									</span>
								</div>
								<p className="text-slate-600">
									{standardTodoQuery.data?.data.content}
								</p>
								<div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
									<span>Status: {standardTodoQuery.data?.data.status}</span>
									<span>Category: {standardTodoQuery.data?.data.category}</span>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Example 2: ['todo', id, { preview: true }] */}
				<div className="flex flex-col border border-slate-200 rounded-lg p-4 bg-slate-50/50">
					<div className="flex items-center justify-between mb-3">
						<span className="font-mono text-xs font-semibold px-2 py-1 bg-amber-50 text-amber-800 rounded border border-amber-200">
							['todo', {selectedTodoId}, {`{ preview: ${isPreview} }`}]
						</span>
						<label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
							<input
								type="checkbox"
								checked={isPreview}
								onChange={(e) => setIsPreview(e.target.checked)}
								className="rounded text-indigo-600 focus:ring-indigo-500"
							/>
							<span>preview: true</span>
						</label>
					</div>

					<pre className="text-xs bg-slate-900 text-slate-200 p-2.5 rounded font-mono overflow-x-auto mb-3">
						{`// An individual todo in a "preview" format
useQuery({
  queryKey: ['todo', ${selectedTodoId}, { preview: ${isPreview} }],
  queryFn: () => fetchTodo(${selectedTodoId}, { preview: ${isPreview} }),
})`}
					</pre>

					<div className="flex items-center gap-2 mb-2 text-xs">
						<span
							className={`px-2 py-0.5 rounded font-medium ${
								previewTodoQuery.isFetching
									? "bg-amber-100 text-amber-800 animate-pulse"
									: "bg-emerald-100 text-emerald-800"
							}`}
						>
							{previewTodoQuery.isFetching ? "Fetching..." : "Cached"}
						</span>
						<span className="text-slate-500">Unique preview cache entry</span>
					</div>

					<div className="flex-1 bg-white border border-slate-200 rounded p-3 text-xs">
						{previewTodoQuery.isLoading ? (
							<p className="text-slate-400">Loading preview...</p>
						) : (
							<div className="space-y-1.5">
								<div className="flex items-center justify-between">
									<h4 className="font-semibold text-slate-900">
										{previewTodoQuery.data?.data.title}
									</h4>
									<span
										className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
											previewTodoQuery.data?.preview
												? "bg-amber-100 text-amber-800 font-bold"
												: "bg-slate-100 text-slate-600"
										}`}
									>
										{previewTodoQuery.data?.preview ? "PREVIEW" : "FULL"}
									</span>
								</div>
								<p className="text-slate-600 italic">
									"{previewTodoQuery.data?.data.content}"
								</p>
								<p className="text-[11px] text-slate-400 pt-1">
									Notice: This entry is cached under a separate key than the
									non-preview query!
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Example 3: ['todos', { type: 'done' }] */}
				<div className="flex flex-col border border-slate-200 rounded-lg p-4 bg-slate-50/50">
					<div className="flex items-center justify-between mb-3">
						<span className="font-mono text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
							['todos', {`{ type: '${filterType}' }`}]
						</span>
						<div className="flex items-center gap-1">
							{(["done", "pending", "all"] as const).map((type) => (
								<button
									key={type}
									type="button"
									onClick={() => setFilterType(type)}
									className={`text-xs px-2 py-0.5 rounded font-medium transition ${
										filterType === type
											? "bg-indigo-600 text-white"
											: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
									}`}
								>
									{type}
								</button>
							))}
						</div>
					</div>

					<pre className="text-xs bg-slate-900 text-slate-200 p-2.5 rounded font-mono overflow-x-auto mb-3">
						{`// A list of todos that are "${filterType}"
useQuery({
  queryKey: ['todos', { type: '${filterType}' }],
  queryFn: () => fetchTodosByType('${filterType}'),
})`}
					</pre>

					<div className="flex items-center gap-2 mb-2 text-xs">
						<span
							className={`px-2 py-0.5 rounded font-medium ${
								filteredTodosQuery.isFetching
									? "bg-amber-100 text-amber-800 animate-pulse"
									: "bg-emerald-100 text-emerald-800"
							}`}
						>
							{filteredTodosQuery.isFetching ? "Fetching..." : "Cached"}
						</span>
						<span className="text-slate-500">
							Results: {filteredTodosQuery.data?.data.length ?? 0}
						</span>
					</div>

					<div className="flex-1 bg-white border border-slate-200 rounded p-3 overflow-y-auto max-h-48 text-xs">
						{filteredTodosQuery.isLoading ? (
							<p className="text-slate-400">Loading filtered todos...</p>
						) : (
							<ul className="space-y-1.5">
								{filteredTodosQuery.data?.data.map((todo) => (
									<li
										key={todo.id}
										className="flex items-center justify-between text-slate-700"
									>
										<span className="truncate">
											{todo.completed ? "✓ " : "○ "}
											{todo.title}
										</span>
										<span
											className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
												todo.completed
													? "bg-emerald-100 text-emerald-700"
													: "bg-amber-100 text-amber-700"
											}`}
										>
											{todo.status}
										</span>
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
