import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrayKeysWithVariablesSection } from "../components/ArrayKeysWithVariablesSection";
import { CacheInspector } from "../components/CacheInspector";
import { DependentQueriesSection } from "../components/DependentQueriesSection";
import { DeterministicHashingSection } from "../components/DeterministicHashingSection";
import { Header } from "../components/Header";
import { QueryOptionsSection } from "../components/QueryOptionsSection";
import { SimpleKeysSection } from "../components/SimpleKeysSection";
import { VariableDependencySection } from "../components/VariableDependencySection";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/")({
	component: QueryKeysShowcase,
});

function QueryKeysShowcase() {
	const [supabaseStatus, setSupabaseStatus] = useState<
		"checking" | "connected" | "fallback"
	>("checking");

	const checkConnection = useCallback(async () => {
		setSupabaseStatus("checking");
		try {
			const { error } = await supabase.from("posts").select("id").limit(1);
			if (!error) {
				setSupabaseStatus("connected");
			} else {
				setSupabaseStatus("fallback");
			}
		} catch {
			setSupabaseStatus("fallback");
		}
	}, []);

	useEffect(() => {
		checkConnection();
	}, [checkConnection]);

	return (
		<div className="min-h-screen flex flex-col bg-slate-100/70">
			{/* Top Bar with DB info and docs link */}
			<Header supabaseStatus={supabaseStatus} onRefresh={checkConnection} />

			{/* Main Content Area */}
			<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Intro Overview Card */}
				<div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-md">
					<div className="max-w-3xl">
						<span className="inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-wider mb-3">
							Interactive Guide & Playground
						</span>
						<h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
							TanStack Query Keys
						</h1>
						<p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed">
							At its core, TanStack Query manages query caching for you based on
							query keys. Query keys have to be an{" "}
							<strong>Array at the top level</strong>, and can range from as
							simple as an array with a single string to complex arrays of many
							strings and nested objects.
						</p>

						<div className="mt-6 flex flex-wrap gap-3 text-xs">
							<div className="bg-white/10 backdrop-blur-xs px-3 py-2 rounded-lg border border-white/10">
								✓ Must be an Array at top level
							</div>
							<div className="bg-white/10 backdrop-blur-xs px-3 py-2 rounded-lg border border-white/10">
								✓ Serializable with JSON.stringify
							</div>
							<div className="bg-white/10 backdrop-blur-xs px-3 py-2 rounded-lg border border-white/10">
								✓ Deterministically hashed objects
							</div>
							<div className="bg-white/10 backdrop-blur-xs px-3 py-2 rounded-lg border border-white/10">
								✓ Connected to Supabase tables
							</div>
						</div>
					</div>
				</div>

				{/* Section 1: Simple Query Keys */}
				<SimpleKeysSection />

				{/* Section 2: Array Keys with Variables */}
				<ArrayKeysWithVariablesSection />

				{/* Section 3: Deterministic Hashing */}
				<DeterministicHashingSection />

				{/* Section 4: Variable Dependency */}
				<VariableDependencySection />

				{/* Section 5: Type-Safe queryOptions */}
				<QueryOptionsSection />

				{/* Section 6: Dependent (Serial) Queries */}
				<DependentQueriesSection />

				{/* Live Cache Inspector */}
				<CacheInspector />
			</main>

			<footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
				TanStack Query Keys Guide Implementation • Powered by TanStack Start,
				React 19 & Supabase
			</footer>
		</div>
	);
}
