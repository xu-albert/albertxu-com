import Content from "@content/updates.mdx";

export const metadata = {
  title: "Site updates",
};

export default function Updates() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Site updates</h1>
      <p className="mt-2 text-muted">A running changelog, newest first.</p>

      {/* Month headings are dialled down from the prose default — this is a
          list of dates, not an article with sections. Nested bullets drop to
          small muted text so detail reads as subordinate to the change. */}
      <article className="prose mt-10 prose-h2:mt-10 prose-h2:mb-3 prose-h2:text-base prose-h2:font-semibold prose-ul:my-0 prose-li:my-1.5 [&_ul_ul]:my-1.5 [&_ul_ul]:text-sm [&_ul_ul]:text-muted [&_ul_ul_li]:my-0.5">
        <Content />
      </article>
    </div>
  );
}
