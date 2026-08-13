import { test, expect } from "@playwright/test";

// The case studies moved to the blog and /projects became a showcase. These
// cover the two things that move can quietly break: old URLs going dead, and
// the showcase losing a project.

test.describe("case studies on the blog, /projects as a showcase", () => {
  const moved = [
    ["/projects/potter-journal", "/blog/potter-journal"],
    ["/projects/albertxu-com", "/blog/albertxu-com"],
  ];

  for (const [from, to] of moved) {
    test(`${from} temporarily redirects to ${to}`, async ({ request }) => {
      const res = await request.get(from, { maxRedirects: 0 });

      // 307, not 308: this structure may be reorganized again, so nothing
      // should cache the move permanently. See next.config.ts.
      expect(res.status()).toBe(307);
      expect(res.headers()["location"]).toBe(to);
    });

    test(`a browser visiting ${from} lands on the write-up`, async ({ page }) => {
      await page.goto(from);
      expect(new URL(page.url()).pathname).toBe(to);
      await expect(page.locator("h1")).toBeVisible();
    });
  }

  test("the showcase still lists all three projects", async ({ page }) => {
    await page.goto("/projects");

    for (const [title, href] of [
      ["albertxu.com", "/blog/albertxu-com"],
      ["Potter Journal", "/blog/potter-journal"],
      ["LoL Paparazzi", "/projects/lol-paparazzi"],
    ]) {
      const card = page.locator(`a[href="${href}"]`);
      await expect(card, `${title} card on /projects`).toBeVisible();
      await expect(card).toContainText(title);
    }
  });

  // The two hand-maintained arrays — `projects` in src/app/projects/page.tsx
  // and `highlights` in src/components/WhatsNew.tsx — are both `dynamicParams
  // = false` templates, so a slug that drifts from disk links to a 404 the
  // build won't catch. The crawl in contact-removal.spec.ts skips non-200
  // pages rather than failing on them, so it doesn't cover this.
  const linkSources = [
    ["/projects", "showcase card", 3],
    ["/", "home page link", 2],
  ] as const;

  for (const [source, kind, minLinks] of linkSources) {
    test(`every ${kind} points at a page that exists`, async ({
      page,
      request,
    }) => {
      await page.goto(source);
      const hrefs = await page
        .locator("main a[href^='/']")
        .evaluateAll((links) =>
          links
            .map((a) => a.getAttribute("href"))
            .filter((h): h is string => !!h)
        );

      expect(hrefs.length, `internal links on ${source}`).toBeGreaterThanOrEqual(
        minLinks
      );
      for (const href of hrefs) {
        const res = await request.get(href);
        expect(res.status(), `${href} linked from ${source}`).toBe(200);
      }
    });
  }

  test("LoL Paparazzi keeps its own project page", async ({ page }) => {
    await page.goto("/projects/lol-paparazzi");
    await expect(page.locator("h1")).toContainText("LoL Paparazzi");
  });

  test("both case studies are listed on the blog", async ({ page }) => {
    await page.goto("/blog");

    for (const href of ["/blog/potter-journal", "/blog/albertxu-com"]) {
      await expect(page.locator(`a[href="${href}"]`)).toBeVisible();
    }
  });

  test("a case study keeps the screenshot its project page showed", async ({
    page,
  }) => {
    // The hero sits outside <article>, so this can't be satisfied by an image
    // that happens to be in the body copy.
    await page.goto("/blog/potter-journal");
    await expect(
      page.locator('main > div > img[src="/potter-journal.png"]')
    ).toBeVisible();
  });

  test("a post that declares no hero still renders without one", async ({
    page,
  }) => {
    // ai-docs-audit has a coverImage for its index card, but that cover is a
    // notes photo, not a hero. Its only images are inside the body.
    await page.goto("/blog/ai-docs-audit");
    await expect(page.locator("main > div > img")).toHaveCount(0);
    await expect(page.locator("article img").first()).toBeVisible();
  });

  test("the Potter Journal App Store link survived the move", async ({ page }) => {
    await page.goto("/blog/potter-journal");

    const link = page.locator('a[href*="apps.apple.com"]');
    await expect(link).toBeVisible();
    await expect(link).toContainText("App Store");
  });
});
