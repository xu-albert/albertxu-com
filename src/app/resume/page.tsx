export const metadata = {
  title: "Resume",
};

export default function Resume() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Resume</h1>
      <p className="mt-2 text-muted">
        6 years of explaining software to humans (and now, to agents too).
      </p>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Experience
        </h2>
        <ol className="mt-4 space-y-10">
          <li>
            <div className="flex items-baseline justify-between">
              <h3 className="font-semibold">C3.ai</h3>
              <span className="text-sm text-muted">2022 &ndash; 2024</span>
            </div>
            <p className="text-sm text-muted">Technical Writer</p>
            <p className="mt-2 leading-relaxed">
              Wrote developer docs for an enterprise AI/ML platform &mdash;
              covering data science, data integration, and application
              development. Built the templates and processes that became the
              team&apos;s documentation pipeline. Also reviewed UI strings and
              error messages (you can use tech writers for this too!).
            </p>
          </li>
          <li>
            <div className="flex items-baseline justify-between">
              <h3 className="font-semibold">Amazon Web Services</h3>
              <span className="text-sm text-muted">2020 &ndash; 2022</span>
            </div>
            <p className="text-sm text-muted">Technical Writer &mdash; S3</p>
            <p className="mt-2 leading-relaxed">
              Wrote about buckets and stuff.
            </p>
          </li>
          <li>
            <div className="flex items-baseline justify-between">
              <h3 className="font-semibold">GigNow (EY)</h3>
              <span className="text-sm text-muted">2019 &ndash; 2020</span>
            </div>
            <p className="text-sm text-muted">Technical Writer</p>
            <p className="mt-2 leading-relaxed">
              First tech writing intern they hired &mdash; ended up staying as a
              contractor. Created the company style guide, published dozens of
              knowledge base articles, and wrote the bi-weekly release notes
              that hopefully some people read.
            </p>
          </li>
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Education
        </h2>
        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <h3 className="font-semibold">
              University of Illinois at Urbana-Champaign
            </h3>
          </div>
          <p className="text-sm text-muted">
            B.S. Computer Engineering
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Skills &amp; Tools
        </h2>
        <div className="mt-4 space-y-3 text-sm">
          <div>
            <span className="font-medium">Documentation:</span>{" "}
            <span className="text-muted">
              Markdown, MDX, XML, LaTeX, docs-as-code, static site generators, Sphinx, Vale
            </span>
          </div>
          <div>
            <span className="font-medium">Code:</span>{" "}
            <span className="text-muted">
              Python, JavaScript, C/C++, Java, HTML, CSS, x86 Assembly, System Verilog
            </span>
          </div>
          <div>
            <span className="font-medium">Tools:</span>{" "}
            <span className="text-muted">
              Git, GitHub, SVN, VS Code, Oxygen, Figma, Confluence, Jira, Snagit, Adobe Photoshop, G Suite, Unix/command line
            </span>
          </div>
          <div>
            <span className="font-medium">Languages:</span>{" "}
            <span className="text-muted">
              English (native), Chinese (native)
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}
