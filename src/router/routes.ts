/**
 * Definición centralizada de rutas de la aplicación.
 * Agregar aquí cada nueva vista/página para mantener consistencia.
 */
export const ROUTES = {

  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CAMP_CREATE: '/camp-create',

  // Resource Management Module
  RESOURCE_DASHBOARD: '/resource-dashboard',
  RESOURCE_INVENTORY: '/resource-inventory',
  RESOURCE_ALERTS: '/resource-alerts',
  RESOURCE_PRODUCTION: '/resource-production',
  RESOURCE_RATIONS: '/resource-rations',
  RESOURCE_INTER_CAMP: '/resource-inter-camp',

} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
