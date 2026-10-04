import { Block, createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

// Same behaviour as /blocking, but using the declarative <Block> component.
export const Route = createFileRoute("/blocking-component")({
	component: BlockingComponentPage,
});

function BlockingComponentPage() {
	const [text, setText] = useState("");
	const [isDirty, setIsDirty] = useState(false);

	return (
		<div className="flex flex-col gap-4 p-4">
			<h1 className="font-bold">Navigation blocking (Block component)</h1>

			<input
				className="border px-2 py-1 text-black"
				value={text}
				onChange={(e) => {
					setText(e.target.value);
					setIsDirty(true);
				}}
			/>
			<button
				type="button"
				className="self-start border px-2 py-1"
				onClick={() => setIsDirty(false)}
			>
				Mark as saved
			</button>

			<Block
				shouldBlockFn={() => isDirty}
				enableBeforeUnload={isDirty}
				withResolver
			>
				{({ status, proceed, reset }) =>
					status === "blocked" ? (
						<div className="border border-red-500 p-3">
							<p>Confirm navigation? Unsaved changes will be lost.</p>
							<div className="mt-2 flex gap-2">
								<button
									type="button"
									className="border px-2 py-1"
									onClick={proceed}
								>
									Yes, leave
								</button>
								<button
									type="button"
									className="border px-2 py-1"
									onClick={reset}
								>
									No, stay
								</button>
							</div>
						</div>
					) : null
				}
			</Block>

			<Link to="/about" className="text-blue-600 underline">
				Go to /about
			</Link>
		</div>
	);
}
