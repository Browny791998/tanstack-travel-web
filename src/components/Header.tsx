import { supabaseUrl } from "../lib/supabase";

export function Header({
	supabaseStatus,
	onRefresh,
}: {
	supabaseStatus: "checking" | "connected" | "fallback";
	onRefresh: () => void;
}) {
	return (
		<header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-3">
							<span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20">
								TanStack Query v5
							</span>
							<h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
								Query Keys Guide & Examples
							</h1>
						</div>
						<p className="text-sm text-slate-500 mt-1">
							All examples from{" "}
							<a
								href="https://tanstack.com/query/latest/docs/framework/react/guides/query-keys"
								target="_blank"
								rel="noreferrer"
								className="text-blue-600 hover:text-blue-700 underline font-medium"
							>
								tanstack.com/query/latest/docs/framework/react/guides/query-keys
							</a>
						</p>
					</div>

					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700">
							<span className="font-semibold text-slate-500">Database:</span>
							<span className="font-mono text-slate-800 truncate max-w-[180px] sm:max-w-[240px]">
								{supabaseUrl
									? supabaseUrl.replace("https://", "")
									: "Not configured"}
							</span>
							<span
								className={`inline-block w-2.5 h-2.5 rounded-full ${
									supabaseStatus === "connected"
										? "bg-emerald-500 ring-2 ring-emerald-200"
										: supabaseStatus === "checking"
											? "bg-amber-400 animate-pulse"
											: "bg-indigo-400"
								}`}
								title={
									supabaseStatus === "connected"
										? "Connected to live Supabase"
										: supabaseStatus === "checking"
											? "Checking connection..."
											: "Using local demo store (Supabase paused or offline)"
								}
							/>
							<span className="text-[11px] font-medium text-slate-600">
								{supabaseStatus === "connected"
									? "Supabase Live"
									: supabaseStatus === "checking"
										? "Checking..."
										: "Demo Mode"}
							</span>
						</div>

						<button
							type="button"
							onClick={onRefresh}
							className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition shadow-2xs"
						>
							Check DB
						</button>
					</div>
				</div>
			</div>
		</header>
	);
}
