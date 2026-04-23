"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  fontFamily: "var(--font-geist-sans)",
});

let idCounter = 0;

export default function Mermaid({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState("");

  useEffect(() => {
    const id = `mermaid-${idCounter++}`;
    mermaid.render(id, chart).then(({ svg }) => setSvg(svg));
  }, [chart]);

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
