import type { MDXComponents } from "mdx/types";

import HomeProse from "@content/home.mdx";
import WhatsNew from "@/components/WhatsNew";
import { GitHubIcon, LinkedInIcon, SubstackIcon } from "@/components/SocialIcons";
import { useMDXComponents } from "@/mdx-components";

// A local `pre` would shadow the shared handler, which is what turns a
// ```mermaid fence into a diagram. So render the shared one and pass the
// framing through it instead: on the ordinary path it spreads props onto the
// <pre>, and on the mermaid path it ignores them, leaving diagrams untouched.
// The framing itself has to be spelled out because `.prose :where(pre)` is
// where the other MDX routes get theirs, and this page carries no `prose`.
function Pre(props: React.ComponentProps<"pre">) {
  // `MDXComponents` widens every key with an index signature, so the shared
  // entry needs naming as what mdx-components.tsx actually puts there.
  const { pre: SharedPre } = useMDXComponents() as {
    pre: React.ComponentType<React.ComponentProps<"pre">>;
  };
  return (
    <SharedPre
      {...props}
      className="mt-6 overflow-x-auto rounded-md bg-border px-4 py-3 text-sm leading-relaxed"
    />
  );
}

// The copy below What's new lives in content/home.mdx so it can be edited as
// plain markdown. MDX emits bare tags, so the classes that used to sit on those
// tags inline are mapped back onto them here -- the rendered markup is what it
// was when the prose was written out in this file. Constructs the prose doesn't
// use yet are mapped too: with no `prose` class, preflight would otherwise
// strip a link's underline, a numbered list's numbers and a sub-heading's size,
// so writing ordinary markdown would silently render as plain body text.
//
// Deliberately not the `prose` class that updates/page.tsx uses: the typography
// plugin would restyle h2 to 1.5em/700 (this page wants text-xl/600), push
// paragraph leading to 1.75, and recolour the list bullets. Mapping the tags is
// shorter than tuning all of that back.
//
// Section gaps are uniform mt-14 here; inline they alternated mt-14/mt-12,
// which read as an accident rather than a rhythm.
const proseComponents: MDXComponents = {
  h2: (props) => <h2 className="mt-14 text-xl font-semibold" {...props} />,
  h3: (props) => <h3 className="mt-8 text-lg font-semibold" {...props} />,
  p: (props) => <p className="mt-3 leading-relaxed" {...props} />,
  // Matches `.prose a` in globals.css so a link reads the same here as it does
  // on the MDX routes that do use the typography plugin.
  a: (props) => (
    <a
      className="underline underline-offset-2 transition-colors hover:text-muted"
      {...props}
    />
  ),
  ul: (props) => <ul className="mt-4 list-disc space-y-3 pl-5" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-3 pl-5" {...props} />,
  // A bullet's lead-in is written as **bold** in the MDX and held at the
  // font-medium it had as <span className="font-medium">. Scoped to the leading
  // word so **bold** written mid-bullet still reads as emphasis, the same as it
  // does in a paragraph.
  li: (props) => (
    <li
      className="leading-relaxed [&>strong:first-child]:font-medium"
      {...props}
    />
  ),
  // The pill is for inline code; inside a fenced block `Pre` above owns the
  // framing, so it drops back out.
  code: (props) => (
    <code
      className="rounded bg-accent-soft px-1.5 py-0.5 font-mono text-[0.9em] [pre_&]:bg-transparent [pre_&]:p-0"
      {...props}
    />
  ),
  pre: Pre,
  // globals.css treats blockquotes as asides rather than quotations: upright,
  // with an accent rule down the left.
  blockquote: (props) => (
    <blockquote className="mt-4 border-l-4 border-accent pl-4" {...props} />
  ),
  // The sign-off is a muted aside, not a body paragraph, so it gets its own
  // tag in the MDX rather than being the one paragraph that renders unlike the
  // others.
  Closing: (props: React.ComponentProps<"p">) => (
    <p className="mt-12 leading-relaxed text-muted" {...props} />
  ),
};

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
                Experience writing software docs at C3 AI, AWS, and EY.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 max-sm:justify-center">
                <a
                  href="/portfolio"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#333]"
                >
                  Writing samples &rarr;
                </a>
                <a
                  href="https://www.linkedin.com/in/albertxu451/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-muted"
                >
                  <LinkedInIcon />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/xu-albert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-muted"
                >
                  <GitHubIcon />
                  GitHub
                </a>
                <a
                  href="https://albertwxu.substack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-muted"
                >
                  <SubstackIcon />
                  Substack
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 pb-16">

      <WhatsNew />

      {/* animate-fade-up moved from the first section to this wrapper when the
          copy moved out to MDX, so the whole block shares the one load
          animation. Everything past the first section is below the fold at
          load, so it reads the same. */}
      <div className="animate-fade-up delay-3">
        <HomeProse components={proseComponents} />
      </div>

      </div>
    </div>
  );
}
