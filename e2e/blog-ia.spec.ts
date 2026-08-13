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

  test("every showcase card points at a page that exists", async ({
    page,
    request,
  }) => {
    // The showcase array is hand-maintained and `dynamicParams = false`, so a
    // slug that drifts from disk links to a 404 that the build won't catch.
    await page.goto("/projects");
    const hrefs = await page
      .locator("main a[href^='/']")
      .evaluateAll((links) =>
        links.map((a) => a.getAttribute("href")).filter((h): h is string => !!h)
      );

    expect(hrefs.length).toBeGreaterThanOrEqual(3);
    for (const href of hrefs) {
      const res = await request.get(href);
      expect(res.status(), `${href} linked from /projects`).toBe(200);
    }
  });

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

  test("the Potter Journal App Store link survived the move", async ({ page }) => {
    await page.goto("/blog/potter-journal");

    const link = page.locator('a[href*="apps.apple.com"]');
    await expect(link).toBeVisible();
    await expect(link).toContainText("App Store");
  });
});
