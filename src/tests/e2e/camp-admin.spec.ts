import { expect, test, type Page } from "@playwright/test";
import { mockCampAdminApi } from "./fixtures/campAdminApiMocks";

function createFakeJwtPayload(payload: Record<string, unknown>) {
  const base64Url = (value: string) =>
    btoa(value)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");

  return [
    base64Url(JSON.stringify({ alg: "none", typ: "JWT" })),
    base64Url(JSON.stringify(payload)),
    "test-signature",
  ].join(".");
}

async function loginAsCampAdmin(page: Page) {
  await mockCampAdminApi(page, {
  username: "camp_admin",
  campId: 1,
});

  await page.goto("/login");
  await page.getByLabel("USERNAME").fill("camp_admin");
  await page.getByLabel("PASSWORD").fill("secret");
  await page.getByRole("button", { name: "LOG IN" }).click();

  const token = createFakeJwtPayload({
    userId: 3,
    username: "camp_admin",
    roles: ["CAMP_ADMINISTRATOR"],
    camp_id: 1,
    campId: 1,
    profession: null,
  });

  await page.evaluate((tokenValue) => {
    localStorage.setItem("token", tokenValue);
  }, token);

  await expect(page.getByText("CAMP-ALPHA").first()).toBeVisible();
}

test.describe("Camp Admin flow", () => {
  test("camp admin logs in and navigates camp administration sections", async ({ page }) => {
    await loginAsCampAdmin(page);

    await page.getByRole("button", { name: /Dashboard/i }).click();
    await expect(page.getByText("CAMP-ALPHA").first()).toBeVisible();

    await page.getByRole("button", { name: /Users/i }).click();
    await expect(page.getByText(/camp_admin|Alice|Users/i).first()).toBeVisible();

    await page.getByRole("button", { name: /Inter-Camp/i }).click();
    await expect(page.getByText(/Water support request|CAMP-BETA|Inter-Camp/i).first()).toBeVisible();

    await page.getByRole("button", { name: /Settings/i }).click();
    await expect(page.getByText(/Roles|Permissions|Rules|Camp Settings/i).first()).toBeVisible();
  });

  test("camp admin creates a role", async ({ page }) => {
    await loginAsCampAdmin(page);

    await page.getByRole("button", { name: /Settings/i }).click();
    await page.getByRole("button", { name: /Roles/i }).click();

    await page.locator("#role-name").fill("TEST_CAMP_ROLE");
    await page.locator("#role-description").fill("Role created from Playwright test");

    await page.getByRole("button", { name: /Create Role/i }).click();

    await expect(page.getByText(/Role created|Role created successfully|TEST_CAMP_ROLE/i).first()).toBeVisible();
  });

  test("camp admin creates a permission", async ({ page }) => {
    await loginAsCampAdmin(page);

    await page.getByRole("button", { name: /Settings/i }).click();
    await page.getByRole("button", { name: /Permissions/i }).click();

    await page.locator("#permission-code").fill("TEST_PERMISSION");
    await page.locator("#permission-name").fill("Test Permission");
    await page.locator("#permission-description").fill("Permission created from Playwright test");

    await page.getByRole("button", { name: /Create Permission/i }).click();

    await expect(page.getByText(/Permission created|Permission created successfully|TEST_PERMISSION/i).first()).toBeVisible();
  });

  test("camp admin creates a camp rule", async ({ page }) => {
    await loginAsCampAdmin(page);

    await page.getByRole("button", { name: /Settings/i }).click();
    await page.getByRole("button", { name: /Rules/i }).click();

    const ruleName = page.locator("#rule-name");
    const ruleDescription = page.locator("#rule-description");
    const ruleCondition = page.locator("#rule-condition");
    const createRuleButton = page.getByRole("button", { name: /Create Rule/i });

    await expect(ruleName).toBeVisible();
    await expect(ruleDescription).toBeVisible();
    await expect(ruleCondition).toBeVisible();

    await ruleName.fill("TEST CAMP RULE");
    await ruleDescription.fill("Rule created from Playwright test");
    await ruleCondition.fill("population > 10");

    await expect(ruleName).toHaveValue("TEST CAMP RULE");
    await expect(ruleDescription).toHaveValue("Rule created from Playwright test");
    await expect(ruleCondition).toHaveValue("population > 10");

    await expect(createRuleButton).toBeEnabled();

    await createRuleButton.click();

    await expect(
        page.getByText(/Rule created|Rule created successfully|TEST CAMP RULE/i).first(),
    ).toBeVisible();
    });

  test("camp admin reviews and approves inter-camp requests", async ({ page }) => {
    await loginAsCampAdmin(page);

    await page.getByRole("button", { name: /Inter-Camp/i }).click();

    await page
      .getByRole("button", { name: /01\s*Sent|Sent\s*Applications submitted/i })
      .click();

    await expect(page.getByText("MY REQUESTS")).toBeVisible();
    await expect(page.getByText("Water support request")).toBeVisible();
    await expect(page.getByText("Camp #2")).toBeVisible();

    await page.getByRole("button", { name: "View request detail" }).click();
    await expect(page.getByText(/Request Detail|Requested resources/i).first()).toBeVisible();
    await page.getByRole("button", { name: /Close request detail|Close/i }).first().click();

    const approveResponse = page.waitForResponse((response) =>
      response.url().includes("/camp-requests/1/approve") &&
      response.status() === 200,
    );

    await page.getByRole("button", { name: "Approve request" }).click();
    await approveResponse;
  });

  test("camp admin reviews outgoing inter-camp requests and can reject one", async ({ page }) => {
    await loginAsCampAdmin(page);

    await page.getByRole("button", { name: /Inter-Camp/i }).click();

    await page
      .getByRole("button", { name: /01\s*Sent|Sent\s*Applications submitted/i })
      .click();

    await expect(page.getByText("MY REQUESTS")).toBeVisible();
    await expect(page.getByText("Water support request")).toBeVisible();
    await expect(page.getByText("Camp #2")).toBeVisible();

    const rejectResponse = page.waitForResponse((response) =>
      response.url().includes("/camp-requests/1/reject") &&
      response.status() === 200,
    );

    await page.getByRole("button", { name: "Reject request" }).click();
    await rejectResponse;
  });

  test("camp admin opens shipment detail and starts transit", async ({ page }) => {
    await loginAsCampAdmin(page);

    await page.getByRole("button", { name: /Inter-Camp/i }).click();

    await page
      .getByRole("button", { name: /03\s*Shipments|Shipments in transit/i })
      .click();

    await expect(page.getByText("SHIPMENTS").first()).toBeVisible();
    await expect(page.getByText("Req #1").first()).toBeVisible();

    await page.getByRole("button", { name: "View shipment" }).first().click();
    await expect(page.getByText(/SHIPMENT DETAIL|Request ID|STATUS/i).first()).toBeVisible();

    const startTransitResponse = page.waitForResponse((response) =>
      response.url().includes("/shipments/1/start-transit") &&
      response.status() === 200,
    );

    await page.getByRole("button", { name: /START TRANSIT/i }).click();
    await startTransitResponse;
  });

  test("camp admin opens shipment detail and confirms delivery", async ({ page }) => {
    await loginAsCampAdmin(page);

    await page.getByRole("button", { name: /Inter-Camp/i }).click();

    await page
      .getByRole("button", { name: /03\s*Shipments|Shipments in transit/i })
      .click();

    await expect(page.getByText("SHIPMENTS").first()).toBeVisible();
    await expect(page.getByText("Req #1").first()).toBeVisible();

    await page.getByRole("button", { name: "View shipment" }).nth(1).click();
    await expect(page.getByText(/SHIPMENT DETAIL|IN TRANSIT/i).first()).toBeVisible();

    const confirmDeliveryResponse = page.waitForResponse((response) =>
      response.url().includes("/shipments/2/confirm-delivery") &&
      response.status() === 200,
    );

    await page.getByRole("button", { name: /CONFIRM DELIVERY/i }).click();
    await confirmDeliveryResponse;
  });

    test("camp admin opens users and views a user profile", async ({ page }) => {
    await loginAsCampAdmin(page);

    await page.getByRole("button", { name: /Users/i }).click();

    await expect(page.getByText("Users").first()).toBeVisible();
    await expect(page.getByText(/Alice|Walker|alice.worker/i).first()).toBeVisible();

    const userCard = page
      .getByRole("button", { name: /Open user details/i })
      .first();

    await expect(userCard).toBeVisible();
    await userCard.click();

    await expect(page.getByText(/Alice|Walker/i).first()).toBeVisible();
  });

  test("camp admin rejects a pending admission request", async ({ page }) => {
    await loginAsCampAdmin(page);

    await page.getByRole("button", { name: /Users/i }).click();
    await page.getByRole("button", { name: /Admissions/i }).click();

    await expect(page.getByText("Pending Admission Requests")).toBeVisible();

    const rejectButton = page.getByRole("button", { name: "Reject" }).first();
    await expect(rejectButton).toBeVisible();

    const rejectAdmissionResponse = page.waitForResponse((response) =>
      response.url().includes("/admission-requests/1") &&
      response.request().method() === "PUT" &&
      response.status() === 200,
    );

    await rejectButton.click();
    await rejectAdmissionResponse;
  });

  test("camp admin accepts admission request and assigns credentials", async ({ page }) => {
    await loginAsCampAdmin(page);

    await page.getByRole("button", { name: /Users/i }).click();
    await page.getByRole("button", { name: /Admissions/i }).click();

    await expect(page.getByText("Pending Admission Requests")).toBeVisible();

    const acceptButton = page.getByRole("button", { name: "Accept" }).first();
    await expect(acceptButton).toBeVisible();

    await acceptButton.click();

    await expect(page.locator("#approvalRole")).toBeVisible();
    await expect(page.locator("#approvalProfession")).toBeVisible();
    await expect(page.getByText(/Role and Profession/i).first()).toBeVisible();

    await page.getByRole("button", { name: /Next/i }).click();

    await expect(page.getByText(/Access Credentials/i).first()).toBeVisible();

    await page.locator("#approvalUsername").fill("alice.worker");
    await page.locator("#approvalPassword").fill("Password123");
    await page.locator("#approvalConfirmPassword").fill("Password123");

    const acceptAdmissionResponse = page.waitForResponse((response) =>
      response.url().includes("/admission-requests/1") &&
      response.request().method() === "PUT" &&
      response.status() === 200,
    );

    await page.getByRole("button", { name: /Confirm Admission/i }).click();
    await acceptAdmissionResponse;
  });
});