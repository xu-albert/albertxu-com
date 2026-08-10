// Captioned image figure for case studies. Takes one or more images and lays
// them out in a row, each with its own caption, plus an optional shared caption
// underneath. Built for side-by-side design comparisons — a rejected direction
// next to the chosen one — so the images argue a point rather than decorate.
//
// On narrow screens the row stacks. `cols` sets the desktop column count; it
// defaults to the number of items.
//
// An item with `pending: true` renders a labelled dashed slot instead of an
// image, so a comparison can be laid out before every asset exists. Those slots
// are visible on the page by design — they should be filled or removed before
// the page is considered done.

interface FigureItem {
  src?: string;
  alt?: string;
  /** Bold lead-in on the caption, e.g. "v2". */
  label?: string;
  /** The rest of the caption. */
  caption?: string;
  /** Render a dashed placeholder slot instead of an image. */
  pending?: string;
  /** Constrain height — useful for tall phone screenshots. */
  tall?: boolean;
}

const COLS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

export default function Figure({
  items,
  caption,
  cols,
}: {
  items: FigureItem[];
  caption?: string;
  cols?: number;
}) {
  const columns = COLS[cols ?? items.length] ?? COLS[2];

  return (
    <figure className="not-prose my-8">
      <div className={`grid items-start gap-4 ${columns}`}>
        {items.map((item, i) => (
          <div key={item.src ?? i} className="flex flex-col">
            {item.pending ? (
              <div className="flex min-h-40 flex-1 items-center justify-center rounded-xl border border-dashed border-muted/50 bg-foreground/[0.03] p-4">
                <span className="text-center font-mono text-[11px] leading-relaxed text-muted">
                  {item.pending}
                </span>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-foreground/[0.03]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.alt ?? item.caption ?? ""}
                  className={`w-full ${item.tall ? "object-cover" : ""}`}
                />
              </div>
            )}

            {(item.label || item.caption) && (
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {item.label && (
                  <span className="font-medium text-foreground/75">
                    {item.label}
                  </span>
                )}
                {item.label && item.caption && " — "}
                {item.caption}
              </p>
            )}
          </div>
        ))}
      </div>

      {caption && (
        <figcaption className="mt-3 text-xs italic leading-relaxed text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
