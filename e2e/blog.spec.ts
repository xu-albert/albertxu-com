import { test, expect } from "@playwright/test";

const EXPECTED_POSTS = [
  {
    title: "Please make your resume ugly",
    date: "November 17, 2026",
    readingTime: "3 min read",
    excerpt:
      "Make the hiring process easier for everyone, including yourself.",
    href: "https://albertwxu.substack.com/p/please-make-your-resume-ugly",
    coverImage: "/blog/substack-please-make-your-resume-ugly.jpg",
    external: true,
  },
  {
    title: "Tech writing will never be the same",
    date: "October 28, 2026",
    readingTime: "9 min read",
    excerpt: "What do tech writers even do lol",
    href: "https://albertwxu.substack.com/p/tech-writing-will-never-be-the-same",
    coverImage: "/blog/substack-tech-writing-will-never-be-the-same.jpg",
    external: true,
  },
  {
    title: "Using AI in Job Search as a Technical Writer",
    date: "September 1, 2026",
    readingTime: "9 min read",
    excerpt: "AI go brrr, except not really",
    href: "https://albertwxu.substack.com/p/using-ai-in-job-search-as-a-technical",
    coverImage: "/blog/substack-using-ai-in-job-search.png",
    external: true,
  },
  {
    title: "How I Used AI to Audit a Cloud Provider's Developer Docs",
    date: "April 23, 2026",
    readingTime: "8 min read",
    excerpt:
      "A cloud infrastructure company asked me to live audit a section of their docs. I used AI to assist — here's what I learned about the process.",
    href: "/blog/ai-docs-audit",
    coverImage: "/blog/blog-ai-audit-notes.png",
    external: false,
  },
] as const;

test.describe("blog cards", () => {
  test("renders individual Substack article cards alongside the on-site post in newest-first order", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const violations: string[] = [];
      (window as unknown as { __cspViolations: string[] }).__cspViolations =
        violations;
      document.addEventListener("securitypolicyviolation", (event) => {
        violations.push(`${event.violatedDirective}: ${event.blockedURI}`);
      });
    });

    await page.goto("/blog", { waitUntil: "networkidle" });

    const cards = page.locator("main a.project-card");
    await expect(cards).toHaveCount(EXPECTED_POSTS.length);

    // Substack's default placeholder post must not be listed.
    await expect(
      page.locator('a[href*="coming-soon"]')
    ).toHaveCount(0);
    await expect(
      page.getByRole("heading", { level: 2, name: "Hello!" })
    ).toHaveCount(0);

    const cardTitles = await cards.locator("h2").allTextContents();
    expect(cardTitles).toEqual(EXPECTED_POSTS.map((p) => p.title));

    for (let i = 0; i < EXPECTED_POSTS.length; i++) {
      const expected = EXPECTED_POSTS[i];
      const card = cards.nth(i);

      await expect(card).toHaveAttribute("href", expected.href);
      await expect(card.locator("h2")).toHaveText(expected.title);
      await expect(card).toContainText(expected.date);
      await expect(card).toContainText(expected.readingTime);
      await expect(card).toContainText(expected.excerpt);

      if (expected.external) {
        await expect(card).toHaveAttribute("target", "_blank");
        await expect(card).toHaveAttribute("rel", "noopener noreferrer");
        await expect(card).toContainText("Substack");
        await expect(card.locator('span[aria-hidden="true"]')).toHaveText("↗");
      } else {
        await expect(card).not.toHaveAttribute("target", "_blank");
        await expect(card).not.toContainText("Substack");
        await expect(card.locator('span[aria-hidden="true"]')).toHaveText("→");
      }

      const img = card.locator("img");
      await expect(img).toHaveAttribute("src", expected.coverImage);
      const dims = await img.evaluate((el: HTMLImageElement) => ({
        complete: el.complete,
        naturalWidth: el.naturalWidth,
        naturalHeight: el.naturalHeight,
        width: Math.round(el.getBoundingClientRect().width),
        height: Math.round(el.getBoundingClientRect().height),
      }));
      expect(dims.complete, `${expected.coverImage} loaded`).toBe(true);
      expect(dims.naturalWidth, `${expected.coverImage} naturalWidth`).toBeGreaterThan(0);
      expect(dims.naturalHeight, `${expected.coverImage} naturalHeight`).toBeGreaterThan(0);
      expect(dims.width, `${expected.coverImage} rendered width`).toBe(160);
      expect(dims.height, `${expected.coverImage} rendered height`).toBe(96);
    }

    const cspViolations = await page.evaluate(
      () =>
        (window as unknown as { __cspViolations: string[] }).__cspViolations
    );
    expect(cspViolations, "no CSP violations on /blog").toEqual([]);
  });

  test("serves every local blog cover image under the strict production CSP", async ({
    request,
  }) => {
    const blogRes = await request.get("/blog");
    expect(blogRes.status()).toBe(200);
    const csp = blogRes.headers()["content-security-policy"] ?? "";
    expect(csp).toContain("img-src 'self' data:");
    expect(csp).not.toContain("substack");

    for (const post of EXPECTED_POSTS) {
      const imgRes = await request.get(post.coverImage);
      expect(imgRes.status(), `${post.coverImage} status`).toBe(200);
      expect(imgRes.headers()["content-type"]).toMatch(/^image\/(jpeg|png)$/);
    }
  });

  test("navigating to the on-site blog post still works", async ({ page }) => {
    await page.goto("/blog");
    await page.locator('a[href="/blog/ai-docs-audit"]').click();

    await expect(page).toHaveURL(/\/blog\/ai-docs-audit$/);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "How I Used AI to Audit a Cloud Provider's Developer Docs",
      })
    ).toBeVisible();
    await expect(page.getByText("April 23, 2026 · 8 min read")).toBeVisible();
  });

  test("site updates lists the November 2026 blog update linking to /blog", async ({
    page,
  }) => {
    await page.goto("/updates");
    const novHeading = page.getByRole("heading", {
      level: 2,
      name: "November 2026",
    });
    await expect(novHeading).toBeVisible();

    const blogBullet = novHeading.locator("+ ul > li").first();
    await expect(blogBullet).toHaveText(
      "Added Substack article cards to the blog page"
    );
    const blogLink = blogBullet.getByRole("link", { name: "blog" });
    await expect(blogLink).toHaveAttribute("href", "/blog");

    await blogLink.click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(page.locator("main a.project-card")).toHaveCount(
      EXPECTED_POSTS.length
    );
  });
});
