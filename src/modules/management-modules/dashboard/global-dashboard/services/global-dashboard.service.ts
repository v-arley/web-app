import type { AdmissionRequest } from "../../../../../models/AdmissionRequest";
import type { Camp } from "../../../../../models/Camp";
import type { Exploration } from "../../../../../models/Exploration";
import type { Person } from "../../../../../models/Person";
import type { ResourceAlert } from "../../../../../models/ResourceAlert";
import type { ResourceMovement } from "../../../../../models/ResourceMovement";
import type { Resource } from "../../../../../models/Resource";
import type { Shipment } from "../../../../../models/Shipment";
import type { UserRol } from "../../../../../models/UserRol";
import type { Warehouse } from "../../../../../models/Warehouse";
import { AdmissionRequestService } from "../../../../../services/AdmissionRequestService";
import { CampService } from "../../../../../services/CampService";
import { ExplorationService } from "../../../../../services/ExplorationService";
import { PersonService } from "../../../../../services/PersonService";
import { ResourceAlertService } from "../../../../../services/ResourceAlertService";
import { ResourceMovementService } from "../../../../../services/ResourceMovementService";
import { ResourceService } from "../../../../../services/ResourceService";
import { ShipmentService } from "../../../../../services/ShipmentService";
import { UserRoleService } from "../../../../../services/UserRoleService";
import { WarehouseService } from "../../../../../services/WarehouseService";
import { GLOBAL_DASHBOARD_CONTRACT_ERROR_MESSAGE } from "../utils/global-dashboard.constants";
import type { GlobalDashboardQueryData } from "../utils/global-dashboard.types";

const campService = new CampService();
const warehouseService = new WarehouseService();
const resourceService = new ResourceService();
const alertService = new ResourceAlertService();
const admissionService = new AdmissionRequestService();
const personService = new PersonService();
const explorationService = new ExplorationService();
const shipmentService = new ShipmentService();
const movementService = new ResourceMovementService();
const userRoleService = new UserRoleService();

export class GlobalDashboardService {
    async getSnapshot(): Promise<GlobalDashboardQueryData> {
        const [
            campResp,
            warehouseResp,
            resourceResp,
            alertResp,
            admissionResp,
            personResp,
            explorationResp,
            shipmentResp,
            movementResp,
            userRoleResp,
        ] = await Promise.all([
            campService.findAll(),
            warehouseService.findAll(),
            resourceService.findAll(),
            alertService.findAll(),
            admissionService.findAll(),
            personService.findAll(),
            explorationService.findAll(),
            shipmentService.findAll(),
            movementService.findAll(),
            userRoleService.findAll(),
        ]);

        const responses = [
            campResp,
            warehouseResp,
            resourceResp,
            alertResp,
            admissionResp,
            personResp,
            explorationResp,
            shipmentResp,
            movementResp,
        ];
        const failed = responses.find((response) => !response.getEstado());

        const snapshot = {
            camps: campResp.getEstado() ? campResp.getResultado<Camp[]>("registros") ?? [] : [],
            warehouses: warehouseResp.getEstado() ? warehouseResp.getResultado<Warehouse[]>("registros") ?? [] : [],
            resources: resourceResp.getEstado() ? resourceResp.getResultado<Resource[]>("registros") ?? [] : [],
            alerts: alertResp.getEstado() ? alertResp.getResultado<ResourceAlert[]>("registros") ?? [] : [],
            admissions: admissionResp.getEstado() ? admissionResp.getResultado<AdmissionRequest[]>("registros") ?? [] : [],
            people: personResp.getEstado() ? personResp.getResultado<Person[]>("registros") ?? [] : [],
            explorations: explorationResp.getEstado() ? explorationResp.getResultado<Exploration[]>("registros") ?? [] : [],
            shipments: shipmentResp.getEstado() ? shipmentResp.getResultado<Shipment[]>("registros") ?? [] : [],
            movements: movementResp.getEstado() ? movementResp.getResultado<ResourceMovement[]>("registros") ?? [] : [],
            userRoles: userRoleResp.getEstado() ? userRoleResp.getResultado<UserRol[]>("registros") ?? [] : [],
        };

        const everyCollectionIsArray = Object.values(snapshot).every(Array.isArray);
        if (!everyCollectionIsArray) {
            throw new Error(GLOBAL_DASHBOARD_CONTRACT_ERROR_MESSAGE);
        }

        return {
            failedMessage:
                failed?.getMensaje() || (failed ? "No se pudo sincronizar el dashboard." : null),
            snapshot,
        };
    }
}

export const globalDashboardService = new GlobalDashboardService();
