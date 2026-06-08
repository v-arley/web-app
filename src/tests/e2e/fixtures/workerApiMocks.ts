import type { Page, Route } from "@playwright/test";

type WorkerMockUser = {
  username: string;
  campId: number | null;
  profession?: string | null;
};

const workerUser = {
  id: 3,
  username: "worker_user",
  roles: ["WORKER"],
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

const workerTasks = [
  {
    id: 101,
    name: "Inspect water filters",
    title: "Inspect water filters",
    description: "Verify that the camp water filters are clean and operational.",
    type: "MAINTENANCE",
    priority: "H",
    difficulty: "M",
    estimated_minutes: 45,
    assignment: {
      id: 501,
      state: "A",
      assigned_at: "2026-06-06T12:00:00.000Z",
    },
  },
];

const completedTaskResult = {
  taskId: 101,
  taskName: "Inspect water filters",
  pointsAwarded: 10,
  alreadyCompleted: false,
  points: {
    totalPoints: 120,
    level: 2,
  },
  unlockedAchievements: [],
};

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

export async function mockWorkerApi(
  page: Page,
  user: WorkerMockUser = {
    username: "worker_user",
    campId: 1,
    profession: "WORKER",
  },
) {
  const handleApiRoute = async (route: Route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");

    if (path === "/auth/login" && request.method() === "POST") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Session started" }),
      });
      return;
    }

    if (path === "/auth/me" && request.method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          userId: workerUser.id,
          username: user.username,
          roles: workerUser.roles,
          campId: user.campId,
          profession: user.profession ?? "WORKER",
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

    if (path === "/notifications" && request.method() === "GET") {
      await fulfill(route, { notifications: { items: [] } });
      return;
    }

    if (path === "/notifications/read" || path === "/notifications/read-all") {
      await fulfill(route, {});
      return;
    }

    if (path === "/camps/current/visible") {
      await fulfill(route, {
        item: user.campId === 1 ? campAlpha : null,
      });
      return;
    }

    if (path === "/camps/1") {
      await fulfill(route, { item: campAlpha });
      return;
    }

    if (path === "/tasks/worker" && request.method() === "GET") {
      await fulfill(route, { items: workerTasks });
      return;
    }

    if (path === "/tasks/worker/101/complete" && request.method() === "PATCH") {
      await fulfill(route, { item: completedTaskResult });
      return;
    }

    await route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({ message: `Unhandled worker mock route: ${path}` }),
    });
  };

  await page.route("http://localhost:3000/api/**", handleApiRoute);
  await page.route("http://127.0.0.1:3000/api/**", handleApiRoute);
}