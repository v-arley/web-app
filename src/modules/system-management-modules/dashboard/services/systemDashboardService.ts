import { CampService } from "../../../../services/CampService";
import { ProfessionService } from "../../../../services/ProfessionService";
import { ResourceService } from "../../../../services/ResourceService";
import { UserService } from "../../../../services/UserService";
import type { SystemDashboardData } from "../schemas/system-dashboard.schema";

const campService = new CampService();
const userService = new UserService();
const resourceService = new ResourceService();
const professionService = new ProfessionService();

function unwrap<T>(response: Awaited<ReturnType<CampService["findAll"]>>, key: string): T[] {
    if (!response.getEstado()) {
        throw new Error(response.getMensaje());
    }

    return response.getResultado<T[]>(key) ?? [];
}

export const systemDashboardService = {
    async getOverview(): Promise<SystemDashboardData> {
        const [camps, users, resources, professions] = await Promise.all([
            campService.findAll(),
            userService.findAllWithProfile(),
            resourceService.findAll(),
            professionService.findAll(),
        ]);

        return {
            camps: unwrap(camps, "registros"),
            users: unwrap(users, "registros"),
            resources: unwrap(resources, "registros"),
            professions: unwrap(professions, "registros"),
        };
    },
};
