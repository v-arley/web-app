import { expect, test } from "@playwright/test";
import { mockCampSystemApi } from "./fixtures/apiMocks";

test("resource manager logs in and sees camp scoped resource dashboard", async ({ page }) => {
  await mockCampSystemApi(page, {
    username: "resource_admin",
    roles: ["RESOURCE_MANAGER"],
    campId: 1,
    profession: "RESOURCE_MANAGER",
  });

  await page.goto("/login");
  await page.getByLabel("USERNAME").fill("resource_admin");
  await page.getByLabel("PASSWORD").fill("secret");
  await page.getByRole("button", { name: "LOG IN" }).click();

  await expect(page).toHaveURL(/\/app\/resource\/dashboard$/);
  await expect(page.getByText("CAMP-ALPHA").first()).toBeVisible();
  await expect(page.getByText("Resource Management").first()).toBeVisible();
  await expect(page.getByText("Population")).toBeVisible();
  await expect(page.getByText("Critical Alerts")).toBeVisible();
  await expect(page.getByText("Internal Stock Status")).toBeVisible();
  await expect(page.getByText("WATER", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Operational Log")).toBeVisible();
});
