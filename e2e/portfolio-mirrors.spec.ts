import { test, expect } from "@playwright/test";

const MIRRORED_SAMPLES = [
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
] as const;

const UNMIRRORED_EXTERNAL_SAMPLES = [
  {
    title: "What is EY GigNow?",
    href: "https://gignow.zendesk.com/hc/en-us/articles/360001055554-What-is-EY-GigNow",
  },
  {
    title: "Binary Representation: Unsigned and 2\u2019s Complement",
    href: "https://medium.com/@murmuring/binary-representation-unsigned-and-2s-complement-f8b3afa4a3ef",
  },
  {
    title: "Karnaugh Map (K-map): Introduction",
    href: "https://medium.com/@murmuring/karnaugh-map-k-map-introduction-81545531ccf1",
  },
] as const;

const INTERNAL_PDF_SAMPLES = [
  {
    title: "Larosia \u2014 a board game",
    href: "/BTW-Final-Project-Manual.pdf",
  },
  {
    title: "First Time Student\u2019s Perception of the Writing Center",
    href: "/WRIT-300-Final-Research-Report.pdf",
  },
  {
    title: "Examining the Success of Technology Impacted Relationships",
    href: "/Cyber_Dystopia_Final.pdf",
  },
] as const;

test.describe("portfolio PDF mirrors", () => {
  test("renders primary links and separate PDF mirror buttons for the 9 C3.ai and AWS samples without nested anchors", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/portfolio");

    await expect(
      page.locator("header").getByRole("link", { name: "Portfolio", exact: true })
    ).toHaveAttribute("href", "/portfolio");

    await expect(page.locator("a a")).toHaveCount(0);

    const mirrorLinks = page.getByRole("link", { name: "PDF mirror", exact: true });
    await expect(mirrorLinks).toHaveCount(MIRRORED_SAMPLES.length);

    for (const sample of MIRRORED_SAMPLES) {
      const item = page.locator("li", {
        has: page.getByRole("link", { name: sample.title, exact: true }),
      });
      await expect(item).toHaveCount(1);

      const primaryLink = item.getByRole("link", { name: sample.title, exact: true });
      await expect(primaryLink).toHaveAttribute("href", sample.href);
      await expect(primaryLink).toHaveAttribute("target", "_blank");
      await expect(primaryLink).toHaveAttribute("rel", "noopener noreferrer");

      const mirrorLink = item.getByRole("link", { name: "PDF mirror", exact: true });
      await expect(mirrorLink).toHaveCount(1);
      await expect(mirrorLink).toHaveAttribute("href", sample.mirrorHref);
      await expect(mirrorLink).toHaveAttribute("target", "_blank");
      await expect(mirrorLink).toHaveAttribute("rel", "noopener noreferrer");

      const primaryBox = await primaryLink.boundingBox();
      const mirrorBox = await mirrorLink.boundingBox();
      expect(primaryBox).not.toBeNull();
      expect(mirrorBox).not.toBeNull();
      expect(mirrorBox!.x).toBeGreaterThanOrEqual(
        primaryBox!.x + primaryBox!.width
      );
      expect(mirrorBox!.x + mirrorBox!.width).toBeLessThanOrEqual(1280);
    }
  });

  test("serves a valid PDF for every portfolio PDF mirror link", async ({
    request,
  }) => {
    for (const sample of MIRRORED_SAMPLES) {
      const res = await request.get(sample.mirrorHref);
      expect(res.status(), `${sample.mirrorHref} status`).toBe(200);
      expect(res.headers()["content-type"]).toContain("application/pdf");

      const body = await res.body();
      expect(
        body.byteLength,
        `${sample.mirrorHref} should be a non-trivial PDF`
      ).toBeGreaterThan(10_000);
      expect(body.subarray(0, 5).toString("ascii")).toBe("%PDF-");
    }
  });

  test("keeps unmirrored external samples and internal PDF samples without mirror links", async ({
    page,
  }) => {
    await page.goto("/portfolio");

    for (const sample of UNMIRRORED_EXTERNAL_SAMPLES) {
      const item = page.locator("li", {
        has: page.getByRole("link", { name: sample.title, exact: true }),
      });
      await expect(item).toHaveCount(1);
      await expect(
        item.getByRole("link", { name: sample.title, exact: true })
      ).toHaveAttribute("href", sample.href);
      await expect(
        item.getByRole("link", { name: "PDF mirror", exact: true })
      ).toHaveCount(0);
    }

    for (const sample of INTERNAL_PDF_SAMPLES) {
      const item = page.locator("li", {
        has: page.locator(`a[href="${sample.href}"]`),
      });
      await expect(item).toHaveCount(1);
      await expect(item.locator(`a[href="${sample.href}"]`)).toContainText("PDF");
      await expect(
        item.getByRole("link", { name: "PDF mirror", exact: true })
      ).toHaveCount(0);
    }
  });

  test("organizes the AWS section with the updated intro and unified 6-item S3 progression", async ({
    page,
  }) => {
    await page.goto("/portfolio");

    const awsSection = page.locator("section", {
      has: page.getByRole("heading", { level: 2, name: "AWS (Amazon S3)" }),
    });
    await expect(awsSection).toHaveCount(1);
    await expect(
      awsSection.getByText("Worked almost exclusively on Amazon S3", {
        exact: true,
      })
    ).toBeVisible();
    await expect(
      awsSection.getByText(/largely been unchanged since leaving AWS/i)
    ).toHaveCount(0);
    await expect(
      awsSection.getByText(/topics may have been updated or edited/i)
    ).toHaveCount(0);

    const lists = awsSection.locator("ul");
    await expect(lists).toHaveCount(1);

    const titles = await lists
      .locator("li > a:first-child")
      .evaluateAll((links) =>
        links.map((a) => {
          const titleSpan = a.querySelector("span");
          return titleSpan?.textContent?.trim() ?? "";
        })
      );
    expect(titles).toEqual([
      "Creating, configuring, and working with Amazon S3 buckets",
      "Amazon S3 objects overview",
      "Naming Amazon S3 objects",
      "Replicating existing objects with Batch Replication",
      "GetBucketReplication API",
      "Delete an Archive in S3 Glacier using the AWS CLI",
    ]);
  });

  test.describe("on a phone-width viewport", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("portfolio sample cards and PDF mirror buttons sit side by side without overlapping or overflowing", async ({
      page,
    }) => {
      await page.goto("/portfolio");

      const mirrorLinks = page.getByRole("link", { name: "PDF mirror", exact: true });
      await expect(mirrorLinks).toHaveCount(MIRRORED_SAMPLES.length);

      for (const sample of MIRRORED_SAMPLES) {
        const item = page.locator("li", {
          has: page.getByRole("link", { name: sample.title, exact: true }),
        });
        const primaryLink = item.getByRole("link", { name: sample.title, exact: true });
        const mirrorLink = item.getByRole("link", { name: "PDF mirror", exact: true });

        await expect(primaryLink).toBeVisible();
        await expect(mirrorLink).toBeVisible();

        const primaryBox = await primaryLink.boundingBox();
        const mirrorBox = await mirrorLink.boundingBox();
        expect(primaryBox).not.toBeNull();
        expect(mirrorBox).not.toBeNull();
        expect(mirrorBox!.x).toBeGreaterThanOrEqual(
          primaryBox!.x + primaryBox!.width
        );
        expect(mirrorBox!.x + mirrorBox!.width).toBeLessThanOrEqual(375);
      }
    });
  });
});
