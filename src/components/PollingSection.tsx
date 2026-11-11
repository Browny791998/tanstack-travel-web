import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchTodos } from "../lib/api";

export function PollingSection() {
	// Polling configuration states
	const [intervalMs, setIntervalMs] = useState<number | false>(3000);
	const [inBackground, setInBackground] = useState<boolean>(false);
	const [fetchCount, setFetchCount] = useState<number>(0);

	// Query with refetchInterval and refetchIntervalInBackground
	const { data, isFetching, dataUpdatedAt } = useQuery({
		queryKey: ["todos", "polling-demo"],
		queryFn: fetchTodos,
		// Polling interval in milliseconds (or false to pause)
		refetchInterval: intervalMs,
		// If true, query continues polling even when browser tab is inactive
		refetchIntervalInBackground: inBackground,
	});

	// Track how many times data has refreshed
	useEffect(() => {
		if (dataUpdatedAt) {
			setFetchCount((prev) => prev + 1);
		}
	}, [dataUpdatedAt]);

	return (
		<section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-8">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
				<div>
					<span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
						Section 7
					</span>
					<h2 className="text-xl font-bold text-slate-900">
						Real-Time Polling (Auto-Refetching)
					</h2>
					<p className="text-sm text-slate-500 mt-1">
						Automatically refetch data on a schedule using{" "}
						<code className="text-indigo-600 font-mono">refetchInterval</code>{" "}
						and{" "}
						<code className="text-indigo-600 font-mono">
							refetchIntervalInBackground
						</code>
						.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
				{/* Code Pattern Card */}
				<div className="flex flex-col border border-slate-200 rounded-lg p-4 bg-slate-50/50">
					<div className="flex items-center justify-between mb-3">
						<span className="text-xs font-bold text-slate-700 uppercase">
							Polling Pattern
						</span>
						<span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded">
							refetchInterval:{" "}
							{intervalMs === false ? "false" : `${intervalMs}ms`}
						</span>
					</div>

					<pre className="text-xs bg-slate-900 text-slate-200 p-3 rounded font-mono overflow-x-auto leading-relaxed">
						{`const { data, isFetching } = useQuery({
  queryKey: ['todos', 'polling-demo'],
  queryFn: fetchTodos,
  // Poll every ${intervalMs === false ? "X" : intervalMs}ms (or false to pause):
  refetchInterval: ${intervalMs === false ? "false" : intervalMs},
  // Continue polling when tab is not focused:
  refetchIntervalInBackground: ${inBackground},
})`}
					</pre>

					<div className="mt-4 text-xs text-slate-600 space-y-2">
						<p className="font-semibold text-slate-800">
							TanStack Query Polling Rules:
						</p>
						<ul className="list-disc pl-4 space-y-1">
							<li>
								<strong>Timer resets on response:</strong> The interval timer
								starts only after the previous request settles, preventing
								overlapping network requests.
							</li>
							<li>
								<strong>Automatic tab-sleep:</strong> By default, polling pauses
								when the tab loses focus to save network and battery. Set{" "}
								<code className="bg-slate-200 px-1 py-0.5 rounded font-mono">
									refetchIntervalInBackground: true
								</code>{" "}
								to poll continuously.
							</li>
							<li>
								<strong>Auto-unmount cleanup:</strong> When the component
								unmounts, the polling timer is automatically cleared with no
								memory leaks.
							</li>
						</ul>
					</div>
				</div>

				{/* Live Interactive Demo */}
				<div className="flex flex-col border border-slate-200 rounded-lg p-4 bg-slate-50/50 justify-between">
					<div>
						<div className="flex flex-wrap items-center justify-between mb-3 gap-2">
							<span className="text-xs font-bold text-slate-700 uppercase">
								Interactive Controls
							</span>
							<span
								className={`text-xs px-2 py-0.5 rounded font-medium ${
									isFetching
										? "bg-amber-100 text-amber-800 animate-pulse"
										: intervalMs === false
											? "bg-slate-200 text-slate-600"
											: "bg-emerald-100 text-emerald-800"
								}`}
							>
								{isFetching
									? "Refetching Now..."
									: intervalMs === false
										? "Polling Paused"
										: `Polling every ${intervalMs / 1000}s`}
							</span>
						</div>

						{/* Interval Selector */}
						<div className="space-y-3 mb-4">
							<div className="flex flex-wrap items-center gap-1.5">
								<span className="text-xs text-slate-500 mr-1">Interval:</span>
								{[
									{ label: "Off", value: false },
									{ label: "1s", value: 1000 },
									{ label: "3s", value: 3000 },
									{ label: "5s", value: 5000 },
								].map((item) => (
									<button
										key={String(item.value)}
										type="button"
										onClick={() => setIntervalMs(item.value)}
										className={`text-xs px-2.5 py-1 rounded font-medium transition cursor-pointer ${
											intervalMs === item.value
												? "bg-indigo-600 text-white shadow-xs"
												: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
										}`}
									>
										{item.label}
									</button>
								))}
							</div>

							<label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
								<input
									type="checkbox"
									checked={inBackground}
									onChange={(e) => setInBackground(e.target.checked)}
									className="rounded text-indigo-600 focus:ring-indigo-500"
								/>
								<span>
									<strong>refetchIntervalInBackground</strong> (Keep polling
									when switching browser tabs)
								</span>
							</label>
						</div>

						{/* Live Query Data Preview */}
						<div className="border border-indigo-200 bg-indigo-50/30 rounded-lg p-4">
							<div className="flex items-center justify-between text-xs mb-2">
								<span className="font-semibold text-slate-700">
									Live Payload ({data?.data.length ?? 0} items)
								</span>
								<span className="text-slate-500 text-[11px]">
									Refetch Count:{" "}
									<strong className="text-indigo-600">{fetchCount}</strong>
								</span>
							</div>

							<div className="bg-white border border-slate-200 rounded p-2.5 text-xs max-h-36 overflow-y-auto space-y-1">
								{data?.data.slice(0, 3).map((todo) => (
									<div
										key={todo.id}
										className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0"
									>
										<span className="truncate text-slate-800">
											#{todo.id} {todo.title}
										</span>
										<span className="text-[10px] text-slate-400 font-mono">
											{todo.status}
										</span>
									</div>
								))}
							</div>

							<div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-indigo-100">
								<span>
									Last settled:{" "}
									<strong>{data?.meta?.fetchedAt ?? "None"}</strong>
								</span>
								<span className="font-mono">
									source: {data?.meta?.source ?? "api"}
								</span>
							</div>
						</div>
					</div>

					<div className="mt-4 text-[11px] text-slate-500 bg-slate-100 p-2 rounded">
						💡 Try switching browser tabs or minimizing the window to observe
						tab-sleep behavior with the checkbox above!
					</div>
				</div>
			</div>
		</section>
	);
}
