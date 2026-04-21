export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="px-6 pt-20 pb-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-end sm:gap-16">
            <div className="animate-fade-up relative">
              <img
                src="/headshot.jpeg"
                alt="Albert Xu"
                className="h-72 w-72 rounded-3xl object-cover shadow-[8px_8px_0_var(--border)]"
              />
            </div>
            <div className="animate-fade-up delay-1 flex-1 text-center sm:text-left">
              <p className="text-sm font-medium uppercase tracking-widest text-muted">
                Technical Writer / Content Engineer
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Hi, I&apos;m Albert.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted">
                6 years making software documentation at C3 AI, AWS, and
                EY. Currently exploring what&apos;s next.
              </p>
              <div className="mt-8 flex gap-4 max-sm:justify-center">
                <a
                  href="/portfolio"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#333]"
                >
                  Writing samples &rarr;
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-muted"
                >
                  Get in touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 pb-16">

      <section className="animate-fade-up delay-2 mt-14">
        <h2 className="text-xl font-semibold">
          Documentation is an extension of the product.
        </h2>
        <p className="mt-3 leading-relaxed">
          <strong>Docs is how your users (and your user&apos;s agents) learn how to use your product.</strong>{" "}
          Often, docs is the first look into how your users perceive the quality of your product.
          I firmly believe that documentation IS the product, and the best tech writers treat docs as a product itself.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">My approach</h2>
        <p className="mt-3 leading-relaxed">
          Great docs come from collaboration. I work closely with product and
          engineering to understand what users need, then build documentation
          that meets them there. I also love teaching engineers how to write —
          the best docs orgs don&apos;t just have good writers, they have a
          culture where everyone values clear communication.
        </p>
        <ul className="mt-4 list-disc space-y-3 pl-5">
          <li className="leading-relaxed">
            <span className="font-medium">Publishing process</span> — I set up
            docs-as-code pipelines with Git, Markdown, and CI/CD. At C3 AI, I
            created the processes and templates that powered their documentation
            pipeline.
          </li>
          <li className="leading-relaxed">
            <span className="font-medium">Information architecture</span> — At
            AWS, I consolidated three separate S3 guides into a single unified
            user guide.
          </li>
          <li className="leading-relaxed">
            <span className="font-medium">Technical expertise</span> — I have a
            Computer Engineering degree from UIUC and have worked with highly
            technical software my entire career. I onboard fast.
          </li>
          <li className="leading-relaxed">
            <span className="font-medium">UI text &amp; content</span> —
            Documentation isn&apos;t limited to topics and guides. I write and
            edit UI text, error messages, and in-product copy to convey
            information cleanly.
          </li>
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-semibold">
          Why hire a tech writer? Why not use AI to write everything?
        </h2>
        <p className="mt-3 leading-relaxed">
          I&apos;ve seen a cultural shift in tech writing happen over the last
          year: AI is taking more and more of the share of the actual writing.
{" "}<strong>Using AI to write is not only encouraged, but almost enforced.</strong>{" "}If
          you&apos;re an engineer, you already know how much your day-to-day
          involves using AI to write code. I think tech writing is inevitably
          meeting the same fate as coding — you can probably get 80-90% of the
          way there with an AI generated first draft.
        </p>
        <p className="mt-3 leading-relaxed">
          However, that&apos;s only if you know what great output looks like. You still need a tech writer to monitor
          AI output and ensure quality standards. There&apos;s an understanding that comes with experience when
          you&apos;re specifically using LLMs to write content. The writing itself now extends to crafting prompts,
          writing system instructions for agents, creating reusable skills that
          enforce consistent voice and structure, and structuring context so
          models produce useful output. I argue the same skills that make someone
          good at documentation make them good at getting the most out of AI.
        </p>
        <p className="mt-3 leading-relaxed">
          Using AI to generate drafts is only one piece of the puzzle, though;
          tech writers are becoming more like product managers. A great tech
          writer can multiply their output by validating AI generated content.
          The best tech writers think about docs as part of the product as a
          whole.
        </p>
        <p className="mt-3 leading-relaxed">
          It may not be necessary to have a tech writer. But in my opinion, a
          tech writer more than makes up for their worth by strategizing the
          best way your users learn about the product. That human ownership
          gets your docs from 90% to 100% — and I think every user deserves
          100% of your product.
        </p>
      </section>

      <section className="mt-12">
        <p className="leading-relaxed text-muted">
          Let&apos;s connect about possible opportunities or chat about writing.
        </p>
      </section>

      <div className="mt-14 flex gap-4">
        <a
          href="/portfolio"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#333]"
        >
          Writing samples &rarr;
        </a>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-muted"
        >
          Get in touch
        </a>
      </div>

      </div>
    </div>
  );
}
