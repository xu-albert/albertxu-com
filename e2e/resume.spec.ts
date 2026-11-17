import { test, expect } from "@playwright/test";

test("resume shows new intro and YouTube entry", async ({ page }) => {
  await page.goto("/resume");
  await expect(
    page.getByText("My experience explaining software to humans (and more recently, agents)."),
  ).toBeVisible();
  const first = page.locator("ol > li").first();
  await expect(first.getByRole("heading", { name: "YouTube" })).toBeVisible();
  await expect(first).toContainText("Technical Writer");
  await expect(first).toContainText("2026");
  await expect(first).toContainText("Writing developer docs at YouTube.");
});
