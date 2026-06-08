import { test, expect, type Page } from "@playwright/test";

async function loginAsExpeditionLeader(page: Page) {
  await page.goto("http://localhost:5173");

  await page
    .locator('input[type="text"], input[name="username"]')
    .first()
    .fill("lider.alpha");

  await page
    .locator('input[type="password"], input[name="password"]')
    .first()
    .fill("Leader#2026!");

  await page.getByRole("button", { name: /log in/i }).click();

  await expect(page.getByText(/online/i)).toBeVisible();
}

async function openExplorations(page: Page) {
  await page.getByText(/^explorations$/i).click();

  await expect(page.getByText(/exploration control/i)).toBeVisible();
  await expect(page.getByText(/registered explorations/i)).toBeVisible();
}

async function createValidExploration(page: Page) {
  await page.getByRole("button", { name: /new exploration/i }).click();

  await expect(page.getByText(/register departure/i)).toBeVisible();

  const uniqueCode = `EXP-PW-${Date.now()}`;
  const uniqueName = `Playwright exploration ${Date.now()}`;

  await page.getByPlaceholder("EXP-AUR-0001").fill(uniqueCode);
  await page.getByPlaceholder(/zone reconnaissance/i).fill(uniqueName);

  const dateInputs = page.locator('input[type="date"]');

  await dateInputs.nth(0).fill("2026-06-20");
  await dateInputs.nth(1).fill("2026-06-22");

  await page.getByPlaceholder(/describe the exploration objective/i).fill(
    "Automated E2E test for exploration creation.",
  );

  await page.getByPlaceholder(/additional notes/i).fill(
    "Created by Playwright.",
  );

  await page.getByRole("button", { name: /^save$/i }).click();

  await expect(
    page.getByText(/exploration created successfully/i),
  ).toBeVisible();

  await page.getByPlaceholder(/search by code/i).fill(uniqueCode);

  await expect(page.getByText(uniqueCode).first()).toBeVisible();

  return uniqueCode;
}

async function selectExplorationByCode(page: Page, code: string) {
  await page.getByPlaceholder(/search by code/i).fill(code);

  const explorationRow = page.getByRole("button", {
    name: new RegExp(code),
  });

  await expect(explorationRow).toBeVisible();

  await explorationRow.click();

  await expect(page.getByText(/exploration detail/i)).toBeVisible();
}

async function assignFirstAvailablePerson(page: Page) {
  await page.getByRole("button", { name: /^people$/i }).click();

  await expect(page.getByText(/assigned people/i)).toBeVisible();

  const personSelect = page.locator("select").filter({
    has: page.locator("option", { hasText: /select person|seleccionar persona/i }),
  });

  await expect(personSelect).toBeVisible();

  const firstPersonOption = personSelect.locator("option").nth(1);

  const firstPersonValue = await firstPersonOption.getAttribute("value");
  const firstPersonText = (await firstPersonOption.textContent()) ?? "";
  const personName = firstPersonText.split(" - ")[0].trim();

  if (!firstPersonValue) {
    throw new Error("No available people found to assign.");
  }

  await personSelect.selectOption(firstPersonValue);

  await page.getByPlaceholder(/role|rol/i).fill("Explorer");

  await page.getByRole("button", { name: /^assign$/i }).click();

  await expect(
    page.locator("div", { hasText: personName }).filter({ hasText: /DNI/i }).first(),
  ).toBeVisible();

  await page.getByRole("button", { name: /^close$/i }).click();
}

async function assignFirstAvailableResource(page: Page) {
  await page.getByRole("button", { name: /^resources$/i }).click();

  await expect(
    page.getByText("Target resources", { exact: true }),
  ).toBeVisible();

  const resourceSelect = page.locator("select").filter({
    has: page.locator("option", {
      hasText: /select target resource|seleccionar recurso objetivo/i,
    }),
  });

  await expect(resourceSelect).toBeVisible();

  const firstResourceOption = resourceSelect.locator("option").nth(1);

  const firstResourceValue = await firstResourceOption.getAttribute("value");
  const firstResourceText = (await firstResourceOption.textContent()) ?? "";
  const resourceName = firstResourceText.split(" - ")[0].trim();

  if (!firstResourceValue) {
    throw new Error("No available resources found to assign.");
  }

  await resourceSelect.selectOption(firstResourceValue);

  await page
    .getByPlaceholder(/observations about this target resource|observaciones sobre este recurso objetivo/i)
    .fill("Target resource assigned by Playwright.");

  await page
    .getByRole("button", { name: /assign target|asignar búsqueda/i })
    .click();

  await expect(
    page.locator("div", { hasText: resourceName }).first(),
  ).toBeVisible();

  await page.getByRole("button", { name: /^close$|^cerrar$/i }).click();
}

test("expedition leader can create, assign person, assign resource and start exploration", async ({
  page,
}) => {
  await loginAsExpeditionLeader(page);
  await openExplorations(page);

  const code = await createValidExploration(page);

  await selectExplorationByCode(page, code);
  await assignFirstAvailablePerson(page);

  await selectExplorationByCode(page, code);
  await assignFirstAvailableResource(page);

  // Reload full app state so the detail panel uses updated people/resource counts.
  await page.reload();

  await expect(page.getByText(/online/i)).toBeVisible();

  await openExplorations(page);

  await selectExplorationByCode(page, code);

  await page.getByRole("button", { name: /^start$/i }).click();

  await expect(page.getByText(/confirm action/i)).toBeVisible();

  await page.getByRole("button", { name: /^confirm$/i }).click();

  await expect(
    page.getByText(/exploration started successfully/i),
  ).toBeVisible();

  await page.getByPlaceholder(/search by code/i).fill(code);

  await expect(
    page.getByRole("button", { name: new RegExp(code) }),
  ).toContainText(/Active/i);
});