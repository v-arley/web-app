import axiosClient from "../api/axiosClient";
import { ResourceService } from "../services/ResourceService";
import { WarehouseService } from "../services/WarehouseService";
import { ResourceWarehouseService } from "../services/ResourceWarehouseService";
import { ResourceMovementService } from "../services/ResourceMovementService";
import { ResourceAlertService } from "../services/ResourceAlertService";
import { PersonService } from "../services/PersonService";
import { UserService } from "../services/UserService";

/**
 * Tipado del catálogo de servicios de inventario.
 */
interface InventoryServices {
    resource: ResourceService;
    warehouse: WarehouseService;
    resourceWarehouse: ResourceWarehouseService;
    resourceMovement: ResourceMovementService;
    resourceAlert: ResourceAlertService;
    person: PersonService;
    user: UserService;
}

/**
 * Contenedor de servicios (patrón Singleton + lazy-loading).
 * Centraliza la creación de instancias para desacoplar los consumidores
 * (hooks, stores) de las implementaciones concretas.
 *
 * Todos los servicios comparten el `axiosClient` centralizado,
 * lo que garantiza que los interceptores JWT se apliquen en toda la app.
 */
class ServiceContainer {
    private static instance: ServiceContainer;
    private _services: Partial<InventoryServices> = {};

    private constructor() {}

    public static getInstance(): ServiceContainer {
        if (!ServiceContainer.instance) {
            ServiceContainer.instance = new ServiceContainer();
        }
        return ServiceContainer.instance;
    }

    get resource(): ResourceService {
        if (!this._services.resource) {
            this._services.resource = new ResourceService(axiosClient);
        }
        return this._services.resource;
    }

    get warehouse(): WarehouseService {
        if (!this._services.warehouse) {
            this._services.warehouse = new WarehouseService(axiosClient);
        }
        return this._services.warehouse;
    }

    get resourceWarehouse(): ResourceWarehouseService {
        if (!this._services.resourceWarehouse) {
            this._services.resourceWarehouse = new ResourceWarehouseService(axiosClient);
        }
        return this._services.resourceWarehouse;
    }

    get resourceMovement(): ResourceMovementService {
        if (!this._services.resourceMovement) {
            this._services.resourceMovement = new ResourceMovementService(axiosClient);
        }
        return this._services.resourceMovement;
    }

    get resourceAlert(): ResourceAlertService {
        if (!this._services.resourceAlert) {
            this._services.resourceAlert = new ResourceAlertService(axiosClient);
        }
        return this._services.resourceAlert;
    }

    get person(): PersonService {
        if (!this._services.person) {
            this._services.person = new PersonService(axiosClient);
        }
        return this._services.person;
    }

    get user(): UserService {
        if (!this._services.user) {
            this._services.user = new UserService(axiosClient);
        }
        return this._services.user;
    }
}

/**
 * Instancia exportada del contenedor de servicios de inventario.
 * @example
 *   import { inventoryContainer } from '@/di/container';
 *   const resources = await inventoryContainer.resource.findAll();
 */
export const inventoryContainer = ServiceContainer.getInstance();
