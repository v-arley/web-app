import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import { LoginPage } from '../views/pages/LoginPage';
import { DashboardPage } from '../views/pages/MainPage';
import { DashboardView } from '../views/pages/DashboardView';

import { DashboardResourcePage } from '../modules/resource-management-modules/dashboard';
import { InventoryMainPage } from '../modules/resource-management-modules/inventory';
import { StockAlertsMainPage } from '../modules/resource-management-modules/stock-alerts';
import { ProductionMainPage } from '../modules/resource-management-modules/production-daily';
import { RationsMainPage } from '../modules/resource-management-modules/daily-rations';
import { InterCampMainPage } from '../modules/resource-management-modules/request-inter-camp';


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

        {/* Rutas del módulo de gestión de recursos */}
        <Route path={ROUTES.RESOURCE_DASHBOARD} element={<DashboardResourcePage />} />
        <Route path={ROUTES.RESOURCE_INVENTORY} element={<InventoryMainPage />} />
        <Route path={ROUTES.RESOURCE_ALERTS} element={<StockAlertsMainPage />} />
        <Route path={ROUTES.RESOURCE_PRODUCTION} element={<ProductionMainPage />} />
        <Route path={ROUTES.RESOURCE_RATIONS} element={<RationsMainPage />} />
        <Route path={ROUTES.RESOURCE_INTER_CAMP} element={<InterCampMainPage />} />
        
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />

      </Routes>
    </BrowserRouter>
  );
}
