/**
 * Definición centralizada de rutas de la aplicación.
 * Agregar aquí cada nueva vista/página para mantener consistencia.
 */
export const ROUTES = {

  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CAMP_CREATE: '/camp-create',

} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
