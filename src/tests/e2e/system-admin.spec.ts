import { expect, test } from "@playwright/test";
import { mockCampSystemApi } from "./fixtures/apiMocks";

test("system admin logs in and navigates critical system management sections", async ({ page }) => {
  await mockCampSystemApi(page, {
    username: "sys_admin",
    roles: ["SYSTEM_ADMIN"],
    campId: null,
  });

  await page.goto("/login");
  await page.getByLabel("USERNAME").fill("sys_admin");
  await page.getByLabel("PASSWORD").fill("secret");
  await page.getByRole("button", { name: "LOG IN" }).click();

  await expect(page).toHaveURL(/\/app\/catalog\/resources$/);
  await expect(page.getByText("Registry Control")).toBeVisible();
  await expect(page.getByText("WATER", { exact: true }).first()).toBeVisible();

  await page.getByRole("button", { name: /Global Dashboard/i }).click();
  await expect(page).toHaveURL(/\/app\/global-dashboard$/);
  await expect(page.getByText("Global Dashboard").first()).toBeVisible();
  await expect(page.getByText("Active Camps")).toBeVisible();
  await expect(page.getByText("CAMP-ALPHA")).toBeVisible();

  await page.getByRole("button", { name: /Catalogs/i }).click();
  await expect(page).toHaveURL(/\/app\/catalogs$/);
  await expect(page.getByText("Global supply catalog")).toBeVisible();
  await expect(page.getByText("WATER", { exact: true }).first()).toBeVisible();

  await page.getByRole("button", { name: /Professions/i }).click();
  await expect(page.getByText("Production roles")).toBeVisible();

  await page.getByRole("button", { name: /Achievements/i }).click();
  await expect(page.getByText("Points and badges")).toBeVisible();
});
