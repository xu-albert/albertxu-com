import { test, expect } from "@playwright/test";

test("resume shows new intro and omits old intro", async ({ page }) => {
  await page.goto("/resume");
  await expect(
    page.getByText("My experience explaining software to humans (and more recently, agents)."),
  ).toBeVisible();
  await expect(
    page.getByText("6 years of explaining software to humans (and now, to agents too)."),
  ).toHaveCount(0);
});

test("resume lists YouTube at the top of Experience above existing roles", async ({ page }) => {
  await page.goto("/resume");
  const items = page.locator("ol > li");
  await expect(items.locator("h3")).toHaveText([
    "YouTube",
    "C3.ai",
    "Amazon Web Services",
    "GigNow (EY)",
  ]);

  const first = items.first();
  await expect(first.getByRole("heading", { name: "YouTube" })).toBeVisible();
  await expect(first).toContainText("Technical Writer");
  await expect(first).toContainText("2026 \u2013");
  await expect(first).toContainText(
    "Writing developer docs at YouTube. Also promoting AI advocacy and usage at YouTube engineering.",
  );
});

test("site updates lists the November 2026 resume update linking to /resume", async ({ page }) => {
  await page.goto("/updates");
  const novHeading = page.getByRole("heading", { level: 2, name: "November 2026" });
  await expect(novHeading).toBeVisible();

  const firstBullet = novHeading.locator("+ ul > li").first();
  await expect(firstBullet).toHaveText("Updated resume with YouTube experience");
  const resumeLink = firstBullet.getByRole("link", { name: "resume" });
  await expect(resumeLink).toHaveAttribute("href", "/resume");

  await resumeLink.click();
  await expect(page).toHaveURL(/\/resume$/);
  await expect(page.getByRole("heading", { level: 1, name: "Resume" })).toBeVisible();
});

