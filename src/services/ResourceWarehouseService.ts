import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../shared/utils/Response";
import { WarehouseResource, type CreateWarehouseResource } from "../models/WarehouseResource";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";

export class ResourceWarehouseService extends AxiosBaseService {

	async save(register: CreateWarehouseResource): Promise<Respuesta> {
		try {
			const { data } = await this.client.post<BackendResponse<{ item: WarehouseResource }> | WarehouseResource>(
				"/warehouse-resources",
				register
			);
			const warehouseResource = this.extractItem<WarehouseResource>(data);

			return new Respuesta(true, "Registro creado correctamente.", "", "registro", warehouseResource);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
		}
	}

	async update(id: number, register: WarehouseResource): Promise<Respuesta> {
		try {
			const { data } = await this.client.put<BackendResponse<{ item: WarehouseResource }> | WarehouseResource>(
				`/warehouse-resources/${id}`,
				register
			);
			const warehouseResource = this.extractItem<WarehouseResource>(data);

			return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", warehouseResource);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
		}
	}

	async remove(id: number): Promise<Respuesta> {
		try {
			await this.client.delete(`/warehouse-resources/${id}`);

			return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
		}
	}

	async findAll(): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<WarehouseResource>> | WarehouseResource[]>(
				"/warehouse-resources"
			);
			const warehouseResources = this.extractItems<WarehouseResource>(data).map(
				(warehouseResource) => new WarehouseResource(warehouseResource)
			);

			return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", warehouseResources);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
		}
	}

	async findByWarehouse(warehouseId: number): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<WarehouseResource>> | WarehouseResource[]>(
				`/warehouse-resources?warehouse_id=${warehouseId}`
			);
			const warehouseResources = this.extractItems<WarehouseResource>(data).map(
				(warehouseResource) => new WarehouseResource(warehouseResource)
			);

			return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", warehouseResources);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
		}
	}
}
