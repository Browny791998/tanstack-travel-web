import {
	createRouteMask,
	createRouter as createTanStackRouter,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const locales = ["en", "fr", "es"];
const defaultLocale = "en";

const photoModalToPhotoMask = createRouteMask({
	routeTree,
	from: "/photos/$photoId/modal",
	to: "/photos/$photoId",
	params: (prev) => ({ photoId: prev.photoId }),
});

function getLocale() {
	if (typeof localStorage === "undefined") return defaultLocale;
	return localStorage.getItem("locale") || defaultLocale;
}

export function getRouter() {
	return createTanStackRouter({
		routeTree,
		routeMasks: [photoModalToPhotoMask],
		scrollRestoration: true,
		scrollRestorationBehavior: "instant",
		rewrite: {
			// Browser URL (/en/about) -> router's internal URL (/about)
			input: ({ url }) => {
				const segments = url.pathname.split("/").filter(Boolean);
				const [firstSegment] = segments;

				if (firstSegment && locales.includes(firstSegment)) {
					url.pathname = `/${segments.slice(1).join("/")}` || "/";
				}

				return url;
			},
			// Router's internal URL (/about) -> browser URL (/en/about)
			output: ({ url }) => {
				const locale = getLocale();
				url.pathname = `/${locale}${url.pathname === "/" ? "" : url.pathname}`;
				return url;
			},
		},
	});
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
