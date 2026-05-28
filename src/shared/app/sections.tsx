import { buildSections } from "./section-registry";

export const SECTIONS = buildSections();

// Alias de tipo para consumidores
export type { DashboardSection } from "../hooks/useDashboardNav";

