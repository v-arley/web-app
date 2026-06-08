import type { Page, Route } from "@playwright/test";

type UserRole = "SYSTEM_ADMIN" | "RESOURCE_MANAGER";

type MockUser = {
  username: string;
  roles: UserRole[];
  campId: number | null;
  profession?: string | null;
};

const campAlpha = {
  id: 1,
  code: "CAMP-ALPHA",
  description: "Alpha Operational Camp",
  capacity: 120,
  location_x: -84.092,
  location_y: 9.928,
  state: "A",
  active: true,
};

const campBeta = {
  id: 2,
  code: "CAMP-BETA",
  description: "Beta Reserve Camp",
  capacity: 80,
  location_x: -83.912,
  location_y: 10.145,
  state: "I",
  active: false,
};

const resources = [
  { id: 1, code: "WATER", name: "Water", category: "SUPPLY", unit_of_measure: "L", state: "A" },
  { id: 2, code: "MED", name: "Medicine", category: "MEDICAL", unit_of_measure: "BOX", state: "I" },
];

const professions = [
  { id: 1, code: "MEDIC", name: "Medic", default_resource_id: 2, state: "A" },
  { id: 2, code: "LOG", name: "Logistics", default_resource_id: null, state: "A" },
];

const achievements = [
  { id: 1, code: "FIRST", name: "First Task", category: "GENERAL", points: 10, state: "A" },
];

const users = [
  { id: 1, username: "sys_admin", roles: ["SYSTEM_ADMIN"] },
  { id: 2, username: "resource_admin", roles: ["RESOURCE_MANAGER"] },
];

function ok(resultado: unknown) {
  return {
    estado: true,
    codigoRespuesta: 0,
    mensaje: "OK",
    mensajeInterno: "",
    resultado,
  };
}

async function fulfill(route: Route, resultado: unknown) {
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(ok(resultado)),
  });
}

export async function mockCampSystemApi(page: Page, user: MockUser) {
  const handleApiRoute = async (route: Route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");

    if (path === "/auth/login" && request.method() === "POST") {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ message: "Session started" }) });
      return;
    }

    if (path === "/auth/me" && request.method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          userId: user.roles.includes("SYSTEM_ADMIN") ? 1 : 2,
          username: user.username,
          roles: user.roles,
          campId: user.campId,
          profession: user.profession ?? null,
        }),
      });
      return;
    }

    if (path === "/auth/logout") {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ message: "Session closed" }) });
      return;
    }

    if (path === "/notifications" && request.method() === "GET") {
      await fulfill(route, { notifications: { items: [] } });
      return;
    }

    if (path === "/notifications/read" || path === "/notifications/read-all") {
      await fulfill(route, {});
      return;
    }

    if (path === "/camps/1/dashboard-metrics") {
      await fulfill(route, {
        data: {
          population: { current: 42, total: 120, percentage: 35 },
          critical_alerts: 2,
          rations_today: { delivered: 36, total: 42, percentage: 85.7 },
          shipments_in_transit: 3,
        },
      });
      return;
    }

    if (path === "/camps/1/stock-summary") {
      await fulfill(route, {
        items: [
          {
            warehouse_id: 1,
            warehouse_name: "Central Alpha",
            resource_id: 1,
            resource_code: "WATER",
            resource_name: "Water",
            category: "SUPPLY",
            unit_of_measure: "L",
            current_amount: 12,
            min_quantity: 20,
            stock_status: "LOW",
            date_last_movement: "2026-06-06T12:00:00.000Z",
          },
        ],
      });
      return;
    }

    if (path === "/camps/1/activity-log") {
      await fulfill(route, {
        items: [
          {
            id: 1,
            table_name: "warehouse_resources",
            action: "UPDATE",
            record_id: 1,
            performed_by: 2,
            username: "resource_admin",
            old_values: null,
            new_values: null,
            created_at: "2026-06-06T12:00:00.000Z",
          },
        ],
      });
      return;
    }

    if (path === "/camps/1") {
      await fulfill(route, { item: campAlpha });
      return;
    }

    if (path === "/camps/2") {
      await fulfill(route, { item: campBeta });
      return;
    }

    if (path === "/camps") {
      await fulfill(route, { items: [campAlpha, campBeta] });
      return;
    }

    if (path === "/resources") {
      await fulfill(route, { items: resources });
      return;
    }

    if (path === "/professions") {
      await fulfill(route, { items: professions });
      return;
    }

    if (path === "/achievements") {
      await fulfill(route, { items: achievements });
      return;
    }

    if (path === "/users/profiles/list" || path === "/users/with-profile" || path === "/users") {
      await fulfill(route, { items: users });
      return;
    }

    await route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: `Unhandled mock route: ${path}` }) });
  };

  await page.route("http://localhost:3000/api/**", handleApiRoute);
  await page.route("http://127.0.0.1:3000/api/**", handleApiRoute);
}
