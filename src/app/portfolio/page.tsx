export const metadata = {
  title: "Portfolio",
};

type Sample = {
  title: string;
  href: string;
  description?: string;
  mirrorHref?: string;
};

const sections: {
  company: string;
  intro?: string;
  samples: Sample[];
  secondaryIntro?: string;
  secondarySamples?: Sample[];
}[] = [
  {
    company: "C3.ai",
    intro: "Wrote docs mostly for C3\u2019s AI/ML developer platform.",
    samples: [
      {
        title: "Virtualization",
        href: "https://docs.c3.ai/docs/platform/8.9/topic/di-data-virtualization",
        mirrorHref: "/portfolio-mirrors/c3-ai-data-virtualization.pdf",
      },
      {
        title: "Package Structure",
        href: "https://docs.c3.ai/docs/platform/8.9/topic/package-structure-overview",
        mirrorHref: "/portfolio-mirrors/c3-ai-package-structure.pdf",
      },
      {
        title: "C3 AI Feature Store Overview",
        href: "https://docs.c3.ai/docs/platform/8.9/topic/ds-feature-store",
        mirrorHref: "/portfolio-mirrors/c3-ai-feature-store-overview.pdf",
      },
    ],
  },
  {
    company: "AWS (Amazon S3)",
    intro: "Worked almost exclusively on Amazon S3",
    samples: [
      {
        title: "Creating, configuring, and working with Amazon S3 buckets",
        href: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-buckets-s3.html",
        mirrorHref: "/portfolio-mirrors/aws-s3-creating-buckets.pdf",
      },
      {
        title: "Amazon S3 objects overview",
        href: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingObjects.html",
        mirrorHref: "/portfolio-mirrors/aws-s3-objects-overview.pdf",
      },
      {
        title: "Naming Amazon S3 objects",
        href: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html",
        mirrorHref: "/portfolio-mirrors/aws-s3-naming-objects.pdf",
      },
      {
        title: "Replicating existing objects with Batch Replication",
        href: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-batch-replication-batch.html",
        mirrorHref: "/portfolio-mirrors/aws-s3-batch-replication.pdf",
      },
      {
        title: "GetBucketReplication API",
        href: "https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetBucketReplication.html",
        mirrorHref: "/portfolio-mirrors/aws-s3-get-bucket-replication-api.pdf",
      },
      {
        title: "Delete an Archive in S3 Glacier using the AWS CLI",
        href: "https://docs.aws.amazon.com/amazonglacier/latest/dev/getting-started-delete-archive-cli.html",
        mirrorHref: "/portfolio-mirrors/aws-s3-glacier-delete-archive-cli.pdf",
      },
    ],
  },
  {
    company: "Ernst and Young (GigNow)",
    intro: "I was the first technical writer at GigNow, a startup subsidiary that is part of EY. I authored and edited most of the Zendesk KB articles, and I wrote release notes content every 2 weeks.",
    samples: [
      {
        title: "What is EY GigNow?",
        href: "https://gignow.zendesk.com/hc/en-us/articles/360001055554-What-is-EY-GigNow",
      },
    ],
  },
  {
    company: "Student Work",
    intro: "Some Medium articles I wrote while I was exploring technical writing.",
    samples: [
      {
        title: "Binary Representation: Unsigned and 2\u2019s Complement",
        href: "https://medium.com/@murmuring/binary-representation-unsigned-and-2s-complement-f8b3afa4a3ef",
      },
      {
        title: "Karnaugh Map (K-map): Introduction",
        href: "https://medium.com/@murmuring/karnaugh-map-k-map-introduction-81545531ccf1",
      },
    ],
    secondaryIntro: "Some school projects I thought were cool.",
    secondarySamples: [
      {
        title: "Larosia \u2014 a board game",
        description:
          "A custom board game designed in a technical writing course.",
        href: "/BTW-Final-Project-Manual.pdf",
      },
      {
        title: "First Time Student\u2019s Perception of the Writing Center",
        description:
          "How first-time students experience the university writing center.",
        href: "/WRIT-300-Final-Research-Report.pdf",
      },
      {
        title: "Examining the Success of Technology Impacted Relationships",
        description:
          "How modern texting and online dating affect romantic relationships.",
        href: "/Cyber_Dystopia_Final.pdf",
      },
    ],
  },
];

function SampleList({
  samples,
  className,
}: {
  samples: Sample[];
  className?: string;
}) {
  return (
    <ul className={`space-y-2 ${className ?? ""}`}>
      {samples.map((sample) => (
        <li key={sample.title} className="flex items-stretch gap-2">
          <a
            href={sample.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-w-0 flex-1 items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:border-muted hover:bg-border/30"
          >
            <div className="min-w-0">
              <span className="flex items-center gap-2">
                {sample.title}
                {sample.href.endsWith(".pdf") && (
                  <span className="inline-flex rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                    PDF
                  </span>
                )}
              </span>
              {sample.description && (
                <p className="mt-1 text-sm text-muted">
                  {sample.description}
                </p>
              )}
            </div>
            <span
              aria-hidden="true"
              className="ml-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
            >
              &rarr;
            </span>
          </a>
          {sample.mirrorHref && (
            <a
              href={sample.mirrorHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center rounded-lg border border-border px-3 py-3 text-xs font-medium text-muted transition-colors hover:border-muted hover:bg-border/30 hover:text-foreground"
            >
              PDF mirror
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function Portfolio() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
      <p className="mt-2 text-muted">Stuff I wrote</p>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.company}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
              {section.company}
            </h2>
            {section.intro && (
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {section.intro}
              </p>
            )}
            <SampleList samples={section.samples} className="mt-3" />
            {section.secondaryIntro && (
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {section.secondaryIntro}
              </p>
            )}
            {section.secondarySamples && (
              <SampleList samples={section.secondarySamples} className="mt-3" />
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
