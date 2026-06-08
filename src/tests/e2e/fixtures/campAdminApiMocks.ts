import type { Page, Route } from "@playwright/test";

type MockCampAdminUser = {
  username: string;
  campId: number;
};

/**
 * Mock API responses used only by Camp Admin Playwright E2E tests.
 * These fixtures simulate backend responses so the tests can validate
 * the frontend flow without depending on a live API or database.
 */

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
  { id: 2, code: "MED", name: "Medicine", category: "MEDICAL", unit_of_measure: "BOX", state: "A" },
];

const professions = [
  { id: 1, code: "MEDIC", name: "Medic", default_resource_id: 2, state: "A" },
  { id: 2, code: "LOG", name: "Logistics", default_resource_id: null, state: "A" },
];

const people = [
  {
    id: 1,
    dni: "10101010",
    name: "Alice",
    surname: "Walker",
    firstName: "Alice",
    lastName: "Walker",
    sex: "F",
    date_of_birth: "1998-01-15",
    description: "Logistics applicant",
    camp_id: 1,
    state: "A",
    created_at: "2026-06-06T12:00:00.000Z",
  },
];

const users = [
  {
    id: 3,
    username: "camp_admin",
    roles: ["CAMP_ADMINISTRATOR"],
    camp_id: 1,
    state: "A",
  },
  {
    id: 4,
    userId: 4,
    personId: 1,
    person_id: 1,
    username: "alice.worker",
    name: "Alice",
    lastName: "Walker",
    surname: "Walker",
    dni: "10101010",
    role: "EXPED_LEAD",
    profession: "LOGISTICS",
    active: true,
    state: "A",
    sex: "F",
    registrationDate: "2026-06-07T12:00:00.000Z",
    persona: people[0],
  },
];

const roles = [
  {
    id: 1,
    code: "CAMP_ADMINISTRATOR",
    name: "CAMP_ADMINISTRATOR",
    description: "Camp administrator",
    state: "A",
  },
  {
    id: 2,
    code: "EXPED_LEAD",
    name: "EXPED_LEAD",
    description: "Exploration leader",
    state: "A",
  },
  {
    id: 3,
    code: "WORKER",
    name: "Worker",
    description: "Operational camp worker",
    state: "A",
  },
];

const permissions = [
  {
    id: 1,
    code: "ROLE_CREATE",
    name: "Create roles",
    description: "Can create camp roles",
    state: "A",
  },
  {
    id: 2,
    code: "USER_READ",
    name: "Read users",
    description: "Can view camp users",
    state: "A",
  },
];

const campRules = [
  {
    id: 1,
    camp_id: 1,
    name: "High risk exploration protocol",
    description: "Explorations with high risk require extra resources.",
    condition: "exploration.risk_level = 'H'",
    status: "A",
  },
];

const campRequests = [
  {
    id: 1,
    origin_camp_id: 1,
    destination_camp_id: 2,
    request_type: "R",
    status: "P",
    origin_approval_status: "P",
    destination_approval_status: "P",
    description: "Water support request",
    created_at: "2026-06-06T12:00:00.000Z",
    origin_camp: campAlpha,
    destination_camp: campBeta,
  },
];

const requestResources = [
  {
    id: 1,
    request_id: 1,
    resource_id: 1,
    amount: 25,
  },
];

const shipments = [
  {
    id: 1,
    request_id: 1,
    status: "P",
    departure_date: "2026-06-07T12:00:00.000Z",
    arrival_date: null,
    observations: "Initial shipment pending dispatch.",
    created_at: "2026-06-07T12:00:00.000Z",
  },
  {
    id: 2,
    request_id: 1,
    status: "I",
    departure_date: "2026-06-07T13:00:00.000Z",
    arrival_date: null,
    observations: "Shipment already in transit.",
    created_at: "2026-06-07T13:00:00.000Z",
  },
];

const admissionRequests = [
  {
    id: 1,
    person_id: 1,
    camp_id: 1,
    requested_at: "2026-06-07T12:00:00.000Z",
    request_status: "P",
    observations: "Applicant has logistics experience and basic field training.",
    person: people[0],
    camp: campAlpha,
  },
];

const aiPrompts = [
  {
    id: 1,
    admission_request_id: 1,
    response_json: JSON.stringify({
      apto: true,
      riesgo: "Low",
      razon: "Applicant has relevant camp experience.",
      asignacion_recomendada: "Logistics",
    }),
  },
];

const aiDecisions = [
  {
    id: 1,
    admission_request_id: 1,
    decision_status: "A",
  },
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

export async function mockCampAdminApi(
  page: Page,
  user: MockCampAdminUser = { username: "camp_admin", campId: 1 },
) {
  const handleApiRoute = async (route: Route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");
    const method = request.method();

    if (path === "/auth/login" && method === "POST") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Session started" }),
      });
      return;
    }

    if (path === "/auth/me" && method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          userId: 3,
          username: user.username,
          roles: ["CAMP_ADMINISTRATOR"],
          campId: user.campId,
          profession: null,
        }),
      });
      return;
    }

    if (path === "/auth/logout") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Session closed" }),
      });
      return;
    }

    if (path === "/notifications" && method === "GET") {
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
            performed_by: 3,
            username: "camp_admin",
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

    if (path === "/roles" && method === "GET") {
      await fulfill(route, { items: roles });
      return;
    }

    if (path === "/roles" && method === "POST") {
      const body = request.postDataJSON() as {
        name?: string;
        description?: string;
      };

      await fulfill(route, {
        item: {
          id: 99,
          name: body.name ?? "TEST_CAMP_ROLE",
          description: body.description ?? "Created from Playwright",
          state: "A",
        },
      });
      return;
    }

    if (path === "/permissions" && method === "GET") {
      await fulfill(route, { items: permissions });
      return;
    }

    if (path === "/permissions" && method === "POST") {
      const body = request.postDataJSON() as {
        code?: string;
        name?: string;
        description?: string;
      };

      await fulfill(route, {
        item: {
          id: 99,
          code: body.code ?? "TEST_PERMISSION",
          name: body.name ?? "TEST PERMISSION",
          description: body.description ?? "Created from Playwright",
          state: "A",
        },
      });
      return;
    }

    if ((path === "/camp-rules" || path === "/rules") && method === "GET") {
      await fulfill(route, { items: campRules });
      return;
    }

    if ((path === "/camp-rules" || path === "/rules") && method === "POST") {
      const body = request.postDataJSON() as {
        camp_id?: number;
        name?: string;
        description?: string;
        condition?: string;
        status?: string;
      };

      await fulfill(route, {
        item: {
          id: 99,
          camp_id: body.camp_id ?? 1,
          name: body.name ?? "TEST CAMP RULE",
          description: body.description ?? "Created from Playwright",
          condition: body.condition ?? "population > 10",
          status: body.status ?? "A",
        },
      });
      return;
    }

    if (path === "/camp-requests" && method === "GET") {
      await fulfill(route, { items: campRequests });
      return;
    }

    if (path === "/camp-requests" && method === "POST") {
      const body = request.postDataJSON() as {
        origin_camp_id?: number;
        destination_camp_id?: number;
        request_type?: string;
        description?: string;
      };

      await fulfill(route, {
        item: {
          id: 99,
          origin_camp_id: body.origin_camp_id ?? 1,
          destination_camp_id: body.destination_camp_id ?? 2,
          request_type: body.request_type ?? "R",
          status: "P",
          origin_approval_status: "P",
          destination_approval_status: "P",
          description: body.description ?? "Created from Playwright",
          created_at: "2026-06-07T12:00:00.000Z",
        },
      });
      return;
    }

    if (
      path.match(/^\/camp-requests\/\d+\/approve-destination$/) ||
      path.match(/^\/camp-requests\/\d+\/approve-origin$/)
    ) {
      await fulfill(route, {
        item: {
          ...campRequests[0],
          status: "A",
          origin_approval_status: "A",
          destination_approval_status: "A",
        },
      });
      return;
    }

    if (
      path.match(/^\/camp-requests\/\d+\/reject-destination$/) ||
      path.match(/^\/camp-requests\/\d+\/reject-origin$/)
    ) {
      await fulfill(route, {
        item: {
          ...campRequests[0],
          status: "R",
          origin_approval_status: "R",
          destination_approval_status: "R",
        },
      });
      return;
    }

    if (path === "/request-resources" && method === "GET") {
      await fulfill(route, { items: requestResources });
      return;
    }

    if (path === "/shipments" && method === "GET") {
      await fulfill(route, { items: shipments });
      return;
    }

    if (path.match(/^\/shipments\/\d+\/start-transit$/)) {
      await fulfill(route, {
        item: {
          ...shipments[0],
          status: "I",
        },
      });
      return;
    }

    if (path.match(/^\/shipments\/\d+\/confirm-delivery$/)) {
      await fulfill(route, {
        item: {
          ...shipments[1],
          status: "D",
          arrival_date: "2026-06-08T12:00:00.000Z",
        },
      });
      return;
    }

    if (path === "/people" && method === "GET") {
      await fulfill(route, { items: people });
      return;
    }

    if (path.match(/^\/person-professions\/person\/\d+$/) && method === "GET") {
      await fulfill(route, {
        items: [
          {
            id: 1,
            person_id: 1,
            profession_id: 2,
            is_temporary: "N",
            status: "A",
            profession: {
              id: 2,
              code: "LOG",
              name: "Logistics",
            },
          },
        ],
      });
      return;
    }

    if (
      (path === "/users/profiles/list" ||
        path === "/users/with-profile" ||
        path === "/users") &&
      method === "GET"
    ) {
      await fulfill(route, { items: users });
      return;
    }

    if (path === "/admission-requests" && method === "GET") {
      await fulfill(route, {
        items: admissionRequests,
        registros: admissionRequests,
      });
      return;
    }

    if (path.match(/^\/admission-requests\/\d+$/) && method === "PUT") {
      const body = request.postDataJSON() as {
        request_status?: "A" | "R";
        role_id?: number;
        profession_id?: number;
        username?: string;
        password?: string;
      };

      await fulfill(route, {
        item: {
          ...admissionRequests[0],
          request_status: body.request_status ?? "A",
          role_id: body.role_id,
          profession_id: body.profession_id,
          username: body.username,
        },
      });
      return;
    }

    if (path === "/ai-prompts" && method === "GET") {
      await fulfill(route, { items: aiPrompts });
      return;
    }

    if (path === "/ai-decisions" && method === "GET") {
      await fulfill(route, { items: aiDecisions });
      return;
    }

    await route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({ message: `Unhandled camp admin mock route: ${path}` }),
    });
  };

  await page.route("http://localhost:3000/api/**", handleApiRoute);
  await page.route("http://127.0.0.1:3000/api/**", handleApiRoute);
}