import { test, expect } from "@playwright/test";

// The home page's written half moved out of src/app/page.tsx into
// content/home.mdx. MDX emits bare tags, so the styling that used to be
// written on each element inline is now a components map in page.tsx -- these
// assertions are what stops that map from silently drifting away from the
// look the copy had when it was inline.

test.describe("home page prose", () => {
  test("the MDX copy renders on the home page with removed sections absent", async ({ page }) => {
    await page.goto("/");

    for (const heading of [
      "Documentation is an extension of the product.",
      "My approach",
    ]) {
      await expect(
        page.getByRole("heading", { level: 2, name: heading, exact: true })
      ).toBeVisible();
    }

    // "Why not have AI do all the writing?" section is removed
    await expect(
      page.getByRole("heading", { level: 2, name: /AI/i })
    ).toHaveCount(0);
  });

  test("the hero reflects the refreshed tagline with removed items absent", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Technical writer at YouTube")).toBeVisible();
    await expect(page.getByText("Technical Writer / Content Engineer")).toHaveCount(0);
    await expect(
      page.getByText("Experience writing software docs at C3 AI, AWS, and EY.")
    ).toHaveCount(0);
    await expect(page.getByText("What's new")).toHaveCount(0);
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

  test("hero-to-first-heading gap is tightened while subsequent h2s keep mt-14", async ({
    page,
  }) => {
    await page.goto("/");

    const hero = page.locator("section").first();
    await expect(hero).toHaveCSS("padding-bottom", "64px");

    const firstHeading = page.getByRole("heading", {
      level: 2,
      name: "Documentation is an extension of the product.",
      exact: true,
    });
    await expect(firstHeading).toHaveCSS("margin-top", "0px");

    const secondHeading = page.getByRole("heading", {
      level: 2,
      name: "My approach",
      exact: true,
    });
    await expect(secondHeading).toHaveCSS("margin-top", "56px");
  });
});
