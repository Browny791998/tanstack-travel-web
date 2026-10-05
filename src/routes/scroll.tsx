import {
	createFileRoute,
	Link,
	useElementScrollRestoration,
} from "@tanstack/react-router";

const SCROLL_BOX_ID = "scroll-box";
const listItems = Array.from({ length: 100 }, (_, i) => i + 1);
const boxItems = Array.from({ length: 200 }, (_, i) => i + 1);

// Window scroll is restored automatically (scrollRestoration in router.tsx).
// The inner box is restored because it carries data-scroll-restoration-id.
export const Route = createFileRoute("/scroll")({
	component: ScrollPageComponent,
});

function ScrollPageComponent() {
	const boxEntry = useElementScrollRestoration({ id: SCROLL_BOX_ID });

	return (
		<div className="flex flex-col gap-4 p-4">
			<h1 className="font-bold">Scroll restoration</h1>
			<p className="text-sm text-gray-500">
				Scroll down, open an item, then press Back. The position is restored.
			</p>

			<ul className="flex flex-col gap-1 text-blue-600 underline">
				{listItems.map((id) => (
					<li key={id}>
						<Link to="/scroll-item/$itemId" params={{ itemId: String(id) }}>
							Item {id}
						</Link>
					</li>
				))}
			</ul>

			<section>
				<h2 className="font-bold">Element scroll restoration</h2>
				<p className="text-sm">Saved scrollY: {boxEntry?.scrollY ?? 0}</p>
				<div
					data-scroll-restoration-id={SCROLL_BOX_ID}
					className="mt-1 h-64 overflow-auto border"
				>
					{boxItems.map((id) => (
						<div key={id} className="border-b px-2 py-1">
							Row {id}
						</div>
					))}
				</div>
			</section>

			<div className="flex gap-4 text-blue-600 underline">
				<Link to="/scroll" resetScroll={false}>
					Same page, keep scroll (resetScroll: false)
				</Link>
				<Link to="/scroll" hash="bottom">
					Jump to bottom (hash)
				</Link>
			</div>

			<div id="bottom" className="mt-96 font-bold">
				Bottom of the page
			</div>
		</div>
	);
}
