import { test, expect, type Page } from "@playwright/test";

const LINKEDIN = "https://linkedin.com/in/albertwxu";

// The profiles the site itself links to (the /contact redirect above is a
// separate, older target).
const PROFILE_LINKEDIN = "https://www.linkedin.com/in/albertxu451/";
const PROFILE_GITHUB = "https://github.com/xu-albert";

test.describe("contact form removal", () => {
  test("/contact temporarily redirects to LinkedIn instead of 404ing", async ({
    request,
  }) => {
    const res = await request.get("/contact", { maxRedirects: 0 });

    // 307, not 308: deliberately temporary so nothing caches it forever and an
    // on-site /contact page can come back later. See next.config.ts.
    expect(res.status()).toBe(307);
    expect(res.headers()["location"]).toBe(LINKEDIN);
  });

  test("a browser visiting /contact lands on the LinkedIn profile", async ({
    page,
  }) => {
    // Stub LinkedIn so the test never depends on the live site being reachable.
    await page.route(/linkedin\.com/, (route) =>
      route.fulfill({ status: 200, contentType: "text/html", body: "<h1>LinkedIn</h1>" })
    );

    await page.goto("/contact");

    // Allow the `www.` LinkedIn itself canonicalizes to when it isn't stubbed.
    expect(page.url()).toMatch(/^https:\/\/(www\.)?linkedin\.com\/in\/albertwxu$/);
  });

  test("the /api/contact route handler is gone", async ({ request }) => {
    const post = await request.post("/api/contact", {
      data: { name: "Test", email: "test@example.com", message: "Hello" },
      failOnStatusCode: false,
    });
    expect(post.status()).toBe(404);

    const get = await request.get("/api/contact", { failOnStatusCode: false });
    expect(get.status()).toBe(404);
  });

  test("the nav no longer has a Contact tab", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header").getByRole("link", { name: "Contact" })).toHaveCount(0);
  });

  test("the home page hero links to LinkedIn and GitHub, with no Get in touch CTA", async ({
    page,
  }) => {
    await page.goto("/");

    // The "Get in touch" CTAs were replaced on purpose: the hero now points
    // straight at the two profiles instead.
    await expect(page.getByRole("link", { name: /get in touch/i })).toHaveCount(0);

    const hero = page.locator("section").first();
    for (const [name, href] of [
      ["LinkedIn", PROFILE_LINKEDIN],
      ["GitHub", PROFILE_GITHUB],
    ] as const) {
      const cta = hero.getByRole("link", { name });
      await expect(cta).toHaveCount(1);
      await expect(cta).toHaveAttribute("href", href);
      // Matches how the footer social links are written.
      await expect(cta).toHaveAttribute("target", "_blank");
      await expect(cta).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  test("no page on the site still links to /contact", async ({ page, baseURL }) => {
    const visited = new Set<string>(["/"]);
    const queue = ["/"];
    const offenders: string[] = [];

    while (queue.length) {
      const path = queue.shift()!;
      const res = await page.goto(path, { waitUntil: "domcontentloaded" });
      if (res?.status() !== 200) continue;

      const hrefs = await page.$$eval("a[href]", (as) =>
        as.map((a) => a.getAttribute("href") ?? "")
      );

      for (const href of hrefs) {
        if (href === "/contact" || href.startsWith("/contact/") || href.startsWith("/api/contact")) {
          offenders.push(`${path} -> ${href}`);
        }
        const internal =
          href.startsWith("/") && !href.startsWith("//") && !/\.(png|jpe?g|svg|ico|pdf)$/i.test(href);
        if (internal && !visited.has(href)) {
          visited.add(href);
          queue.push(href);
        }
      }
    }

    expect(visited.size, `crawled from ${baseURL}`).toBeGreaterThan(5);
    expect(offenders, "pages still linking to the removed contact form").toEqual([]);
  });

  test("the albertxu.com project card and its detail page agree, with no Resend tag", async ({
    page,
  }) => {
    const tagsOn = async (p: Page, scope: string) =>
      (await p.locator(scope).allTextContents()).map((t) => t.trim());

    await page.goto("/projects");
    const cardTags = await tagsOn(page, 'a[href="/projects/albertxu-com"] span');

    await page.goto("/projects/albertxu-com");
    const detailTags = await tagsOn(page, "main span");

    // The card and the detail page read from separate sources, so they can drift.
    for (const expected of ["Next.js", "Tailwind", "Vercel"]) {
      expect(cardTags).toContain(expected);
      expect(detailTags).toContain(expected);
    }
    expect(cardTags).not.toContain("Resend");
    expect(detailTags).not.toContain("Resend");
  });
});
