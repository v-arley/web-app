import { createBrowserRouter, Navigate } from "react-router-dom";

export const ROUTES = {
    LOGIN: "/login",
    DASHBOARD: "/",
} as const;
import AppLayout from "../layouts/AppLayout";
import AuthLayout from "../layouts/AuthLayout";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/MainPage";
import { RequireTemporalUser } from "./RequireTemporalUser";

export const router = createBrowserRouter([
    // ── Auth routes ────────────────────────────────────
    {
        element: <AuthLayout />,
        children: [
            {
                path: "/login",
                element: <LoginPage />,
            },
        ],
    },
    // ── Protected app routes ───────────────────────────
    {
        element: <RequireTemporalUser />,
        children: [
            {
                path: "/",
                element: <AppLayout />,
                children: [
                    {
                        index: true,
                        element: <DashboardPage />,
                    },
                ],
            },
        ],
    },
    // ── Fallback ───────────────────────────────────────
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);
