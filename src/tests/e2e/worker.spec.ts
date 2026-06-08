import { expect, test } from "@playwright/test";
import { mockCampSystemApi } from "./fixtures/apiMocks";

test("worker logs in and navigates worker critical sections", async ({
  page,
}) => {
  await mockCampSystemApi(page, {
    username: "worker_user",
    roles: ["WORKER"],
    campId: 1,
    profession: "WORKER",
  });

  await page.goto("/login");
  await page.getByLabel("USERNAME").fill("worker_user");
  await page.getByLabel("PASSWORD").fill("secret");
  await page.getByRole("button", { name: "LOG IN" }).click();

  // Pantalla inicial del trabajador
  await expect(page).toHaveURL(/\/app\/worker\/profile$/);
  await expect(page.getByText("My Profile").first()).toBeVisible();

  // Logros
  await page.getByRole("button", { name: /Achievements and Points/i }).click();
  await expect(page).toHaveURL(/\/app\/worker\/achievements$/);
  await expect(page.getByText("Achievements and Points").first()).toBeVisible();

  // Tareas
  await page.getByRole("button", { name: /My tasks/i }).click();
  await expect(page).toHaveURL(/\/app\/worker\/tasks$/);
  await expect(page.getByText("My tasks").first()).toBeVisible();

  // Expediciones
  await page.getByRole("button", { name: /^Explorations/i }).click();
  await expect(page).toHaveURL(/\/app\/worker\/explorations$/);
  await expect(page.getByText("Explorations").first()).toBeVisible();

  // Producción diaria
  await page.getByRole("button", { name: /Daily Production/i }).click();
  await expect(page).toHaveURL(/\/app\/worker\/production$/);
  await expect(page.getByText("Daily Production").first()).toBeVisible();

  // Raciones
  await page.getByRole("button", { name: /^Rations/i }).click();
  await expect(page).toHaveURL(/\/app\/worker\/rations$/);
  await expect(page.getByText("Rations").first()).toBeVisible();

  // Volver a perfil
  await page.getByRole("button", { name: /My Profile/i }).click();
  await expect(page).toHaveURL(/\/app\/worker\/profile$/);
  await expect(page.getByText("My Profile").first()).toBeVisible();
});
