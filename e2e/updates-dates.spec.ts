import { test, expect, type Page } from "@playwright/test";

// The changelog only says when something was published through the `## Month
// Year` heading an entry sits under, so read the rendered article back into
// that heading -> entries shape instead of asserting on flat page text.
async function entriesByMonth(page: Page): Promise<[string, string[]][]> {
  return page.evaluate(() => {
    const months: [string, string[]][] = [];
    let current: string[] | null = null;

    for (const el of Array.from(document.querySelector("article")?.children ?? [])) {
      if (el.tagName === "H2") {
        current = [];
        months.push([el.textContent?.trim() ?? "", current]);
      } else if (el.tagName === "UL" && current) {
        // A top-level <li> carries its nested detail bullets with it, which is
        // exactly what should have moved along with the entry.
        current.push(
          ...Array.from(el.children).map((li) =>
            (li.textContent ?? "").replace(/\s+/g, " ").trim()
          )
        );
      }
    }

    return months;
  });
}

test.describe("site updates publish months", () => {
  test("the Gonna Rain? case study is listed under August 2026, with its detail bullets", async ({
    page,
  }) => {
    await page.goto("/updates");
    const months = await entriesByMonth(page);

    const listings = months.filter(([, entries]) =>
      entries.some((e) => /case study on Gonna Rain\?/i.test(e))
    );
    expect(listings.map(([month]) => month)).toEqual(["August 2026"]);

    const [, august] = listings[0];
    const entry = august.find((e) => /Gonna Rain\?/i.test(e))!;
    expect(entry).toContain("Walks the design rounds");
    expect(entry).toContain("Added a build timeline");
  });

  test("the other July 2026 entries stay put", async ({ page }) => {
    await page.goto("/updates");
    const months = new Map(await entriesByMonth(page));

    const july = months.get("July 2026") ?? [];
    expect(july).toHaveLength(4);
    for (const expected of [
      /Added a What's new section to the home page/,
      /Added a scroll-tracking table of contents/,
      /case study on Potter Journal/,
      /Added a back arrow to blog post links/,
    ]) {
      expect(july.some((e) => expected.test(e)), `July is missing ${expected}`).toBe(true);
    }

    // Older months are untouched, and the page still reads newest-first.
    expect([...months.keys()]).toEqual([
      "September 2026",
      "August 2026",
      "July 2026",
      "May 2026",
      "April 2026",
    ]);
  });

  test("the home page What's new card dates the case study the same month", async ({
    page,
  }) => {
    await page.goto("/updates");
    const [changelogMonth] = (await entriesByMonth(page)).find(([, entries]) =>
      entries.some((e) => /Gonna Rain\?/i.test(e))
    )!;

    await page.goto("/");
    const card = page
      .locator("section", { has: page.getByText("What's new") })
      .locator('a[href="/projects/gonna-rain"]');
    await expect(card).toHaveCount(1);

    // The card is a separate hand-maintained list, so it can drift from the
    // changelog — that drift is the bug this guards.
    await expect(card).toContainText(changelogMonth);
    await expect(card).not.toContainText("July 2026");
  });

  test("the case study page itself claims no other publish month", async ({ page }) => {
    await page.goto("/projects/gonna-rain");
    const body = (await page.locator("main").innerText()).replace(/\s+/g, " ");

    // The build timeline legitimately shows app release dates ("Jul 24"); what
    // must not appear is a competing "<Month> 2026" publish date.
    expect(body).not.toMatch(/July 2026/i);
    expect(body.match(/[A-Z][a-z]+ 2026/g) ?? []).toEqual([]);
  });
});
