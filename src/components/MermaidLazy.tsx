"use client";

import dynamic from "next/dynamic";

// mdx-components.tsx is a server module, and there `next/dynamic` does not
// code split a Client Component (see
// node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md). This one-line
// client boundary is what actually keeps mermaid -- and the dagre and katex it
// drags in -- out of the initial bundle of every MDX route that renders no
// diagram; without it the import is static again in all but name.
export default dynamic(() => import("@/components/Mermaid"));
