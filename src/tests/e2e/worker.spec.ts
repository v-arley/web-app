import { expect, test } from "@playwright/test";
import { mockWorkerApi } from "./fixtures/workerApiMocks";

test("worker logs in, navigates critical sections and completes a task", async ({
  page,
}) => {
  await mockWorkerApi(page, {
    username: "worker_user",
    campId: 1,
    profession: "WORKER",
  });

  await page.goto("/login");
  await page.getByLabel("USERNAME").fill("worker_user");
  await page.getByLabel("PASSWORD").fill("secret");
  await page.getByRole("button", { name: "LOG IN" }).click();

  await expect(page).toHaveURL(/\/app\/worker\/profile$/);
  await expect(page.getByText("Worker Registry", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Personal profile / camp assignment / profession status", {
      exact: true,
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: /Achievements and Points/i }).click();
  await expect(page).toHaveURL(/\/app\/worker\/achievements$/);
  await expect(
    page.getByText("Achievements & Points", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Points Record", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Field Badges & Achievements", { exact: true }),
  ).toBeVisible();

  await page.getByRole("button", { name: /My tasks/i }).click();
  await expect(page).toHaveURL(/\/app\/worker\/tasks$/);
  await expect(page.getByText("My tasks").first()).toBeVisible();
  await expect(
    page.getByText("Shift operational assignments", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Active tasks", { exact: true })).toBeVisible();

  await expect(
    page.getByText("Inspect water filters", { exact: true }),
  ).toBeVisible();

  await expect(
    page.getByText(
      "Verify that the camp water filters are clean and operational.",
      { exact: true },
    ),
  ).toBeVisible();

  await expect(page.getByText("Priority High", { exact: true })).toBeVisible();
  await expect(page.getByText("+10 pts", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /Complete task/i }).click();

  await expect(
    page.getByText("Task completed successfully", { exact: true }),
  ).toBeVisible();

  await expect(
    page.getByText(
      'The task "Inspect water filters" was completed. You earned +10 points.',
      { exact: true },
    ),
  ).toBeVisible();

  await expect(page.getByText("Current points:")).toBeVisible();
  await expect(page.getByText("120")).toBeVisible();

  await page.getByRole("button", { name: /^Explorations/i }).click();
  await expect(page).toHaveURL(/\/app\/worker\/explorations$/);
  await expect(page.getByText("Exploraciones", { exact: true })).toBeVisible();
  await expect(
    page.getByText("My external exploration missions", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Search exploration", { exact: true }),
  ).toBeVisible();

  await page.getByRole("button", { name: /Daily Production/i }).click();
  await expect(page).toHaveURL(/\/app\/worker\/production$/);
  await expect(page.getByText("Daily production").first()).toBeVisible();
  await expect(
    page.getByText("Available production rules", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Daily production record", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Logistic performance history", { exact: true }),
  ).toBeVisible();

  await page.getByRole("button", { name: /^Rations/i }).click();
  await expect(page).toHaveURL(/\/app\/worker\/rations$/);
  await expect(page.getByText("Rations").first()).toBeVisible();
  await expect(page.getByText("Shift ration").first()).toBeVisible();
  await expect(page.getByText("Supply history", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /My Profile/i }).click();
  await expect(page).toHaveURL(/\/app\/worker\/profile$/);
  await expect(page.getByText("Worker Registry", { exact: true })).toBeVisible();
});