import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import { LoginPage } from '../views/pages/LoginPage';
import { DashboardPage } from '../views/pages/MainPage';
import { DashboardView } from '../views/pages/DashboardView';

/**
 * Router principal de la aplicación.
 * Usa react-router-dom para manejar navegación con URLs reales.
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.CAMP_CREATE} element={<DashboardView />} />
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
