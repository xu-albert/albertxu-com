import { test, expect } from "@playwright/test";

// The home page's written half moved out of src/app/page.tsx into
// content/home.mdx. MDX emits bare tags, so the styling that used to be
// written on each element inline is now a components map in page.tsx -- these
// assertions are what stops that map from silently drifting away from the
// look the copy had when it was inline.

test.describe("home page prose", () => {
  test("the MDX copy renders under the What's new section", async ({ page }) => {
    await page.goto("/");

    for (const heading of [
      "Documentation is an extension of the product.",
      "My approach",
      "Why hire a tech writer? Why not use AI to write everything?",
    ]) {
      await expect(
        page.getByRole("heading", { level: 2, name: heading, exact: true })
      ).toBeVisible();
    }

    await expect(
      page.getByText("Let's connect about opportunities or chat about writing.")
    ).toBeVisible();
  });

  test("headings and body keep the type scale they had inline", async ({ page }) => {
    await page.goto("/");

    // text-xl / font-semibold, not the typography plugin's 1.5em / 700.
    const heading = page.getByRole("heading", { level: 2, name: "My approach" });
    await expect(heading).toHaveCSS("font-size", "20px");
    await expect(heading).toHaveCSS("font-weight", "600");

    // leading-relaxed: 1.625 x 16px.
    await expect(
      page.getByText("Great docs come from collaboration.", { exact: false })
    ).toHaveCSS("line-height", "26px");
  });

  test("the approach bullets keep their lighter lead-in weight", async ({ page }) => {
    await page.goto("/");

    // Written as **bold** in the MDX, but rendered at font-medium so the
    // lead-ins read as labels rather than as emphasis mid-sentence.
    const leadIns = page.locator("li strong");
    await expect(leadIns).toHaveCount(4);

    for (const label of [
      "Publishing process",
      "Information architecture",
      "Technical expertise",
      "UI text & content",
    ]) {
      await expect(leadIns.filter({ hasText: label })).toHaveCSS(
        "font-weight",
        "500"
      );
    }
  });

  test("every approach bullet spaces its lead-in off the em dash", async ({ page }) => {
    await page.goto("/");

    // All four bullets spaced their lead-in off the em dash inline and still
    // do as markdown -- JSX only trims whitespace leading a line *after* a text
    // node's first, and every em dash sat on the first. So the move changed no
    // rendered text here; this pins that the four stay in agreement.
    const bullets = await page
      .locator("ul.list-disc > li")
      .allInnerTexts();

    expect(bullets).toHaveLength(4);
    for (const bullet of bullets) {
      expect(bullet).toContain(" — ");
    }
  });
});
