// Shared by the blog post and project detail templates so the two can't drift.
export default function TagList({ tags }: { tags?: string[] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
