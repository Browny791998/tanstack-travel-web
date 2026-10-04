import { createFileRoute, Link, useBlocker } from "@tanstack/react-router";
import { useState } from "react";

// useBlocker with a custom resolver UI. Blocks router navigation to a different
// pathname while the draft has unsaved changes, and warns on tab close/refresh.
export const Route = createFileRoute("/blocking")({
	component: BlockingComponent,
});

function BlockingComponent() {
	const [draft, setDraft] = useState("");
	const [savedValue, setSavedValue] = useState("");
	const isDirty = draft !== savedValue;

	const blocker = useBlocker({
		shouldBlockFn: ({ current, next }) =>
			isDirty && next.pathname !== current.pathname,
		enableBeforeUnload: isDirty,
		withResolver: true,
	});

	return (
		<div className="flex flex-col gap-4 p-4">
			<h1 className="font-bold">Navigation blocking (useBlocker)</h1>

			<label className="flex flex-col gap-1">
				Draft note {isDirty ? "(unsaved changes)" : "(saved)"}
				<input
					className="border px-2 py-1 text-black"
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
				/>
			</label>
			<button
				type="button"
				className="self-start border px-2 py-1"
				onClick={() => setSavedValue(draft)}
			>
				Save
			</button>

			{blocker.status === "blocked" && (
				<div className="border border-red-500 p-3">
					<p>You have unsaved changes. Leave to {blocker.next.pathname}?</p>
					<div className="mt-2 flex gap-2">
						<button
							type="button"
							className="border px-2 py-1"
							onClick={blocker.proceed}
						>
							Leave without saving
						</button>
						<button
							type="button"
							className="border px-2 py-1"
							onClick={blocker.reset}
						>
							Stay
						</button>
					</div>
				</div>
			)}

			<ul className="flex flex-col gap-1 text-blue-600 underline">
				<li>
					<Link to="/about">Go to /about (blocked while dirty)</Link>
				</li>
				<li>
					<Link to="/blocking" search={{ tab: "2" }}>
						Same pathname, new search (not blocked)
					</Link>
				</li>
			</ul>
		</div>
	);
}
