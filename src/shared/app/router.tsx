import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import AuthLayout from "../layouts/AuthLayout";
import { LoginPage } from "../pages/LoginPage";
import { RequireTemporalUser } from "./RequireTemporalUser";
import { PublicGuard } from "./PublicGuard";
import { SECTIONS } from "./sections";
import { NotFoundPage } from "./section-components";
import { ROUTES } from "../../router/routes";

// Rutas hijas para /app generadas desde SECTIONS :::
// Convierte la ruta absoluta "/app/foo/bar" en la ruta relativa "foo/bar"
// que React Router anida bajo el segmento padre "/app".
const sectionRoutes = SECTIONS.map((section) => ({
    path: section.path.replace(/^\/app\//, ""),
    // section.component() devuelve un elemento JSX; el lazy no se carga
    // hasta que React intente renderizarlo, no en la definición del router.
    element: section.component(),
}));

// Definición del router :::
export const router = createBrowserRouter([
    // Raíz → redirige a login. PublicGuard redirige al dashboard si ya hay sesión activa.
    {
        path: "/",
        element: <Navigate to={ROUTES.LOGIN} replace />,
    },
    // Rutas públicas: si el usuario ya tiene sesión, PublicGuard lo redirige a /app
    {
        element: <PublicGuard />,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    {
                        path: ROUTES.LOGIN,
                        element: <LoginPage />,
                    },
                ],
            },
        ],
    },
    // Rutas protegidas: RequireTemporalUser valida la sesión
    {
        element: <RequireTemporalUser />,
        children: [
            {
                path: ROUTES.APP,
                element: <AppLayout />,
                children: [
                    // Sin sección explícita → redirige al dashboard
                    {
                        index: true,
                        element: <Navigate to={ROUTES.DASHBOARD} replace />,
                    },
                    // Una ruta por sección, generadas automáticamente desde SECTIONS
                    ...sectionRoutes,
                    // Cualquier sub-ruta desconocida dentro de /app → 404
                    {
                        path: "*",
                        element: <NotFoundPage />,
                    },
                ],
            },
        ],
    },
    // Ruta desconocida fuera de /app → redirige a login
    {
        path: "*",
        element: <Navigate to={ROUTES.LOGIN} replace />,
    },
]);

