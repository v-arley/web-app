import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { Warehouse, type CreateWarehouse, type UpdateWarehouse } from "../models/Warehouse";
import { AxiosBaseService } from "./AxiosBaseService";

export class WarehouseService extends AxiosBaseService {

	async save(register: CreateWarehouse): Promise<Respuesta> {
		try {
			const { data } = await this.client.post<BackendResponse<{ item: Warehouse }> | Warehouse>(
				"/warehouses",
				register
			);
			const warehouse = this.extractItem<Warehouse>(data);

			return new Respuesta(true, "Registro creado correctamente.", "", "registro", warehouse);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
		}
	}

	async update(id: number, register: UpdateWarehouse): Promise<Respuesta> {
		try {
			const { data } = await this.client.put<BackendResponse<{ item: Warehouse }> | Warehouse>(
				`/warehouses/${id}`,
				register
			);
			const warehouse = this.extractItem<Warehouse>(data);

			return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", warehouse);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
		}
	}

	async remove(id: number): Promise<Respuesta> {
		try {
			await this.client.delete(`/warehouses/${id}`);

			return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
		}
	}

	async findAll(): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<Warehouse>> | Warehouse[]>(
				"/warehouses"
			);
			const warehouses = this.extractItems<Warehouse>(data).map(
				(warehouse) => new Warehouse(warehouse)
			);

			return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", warehouses);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
		}
	}

	async findById(id: number): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<{ item: Warehouse }> | Warehouse>(
				`/warehouses/${id}`
			);
			const warehouseData = this.extractItem<Warehouse>(data);
			const warehouse = warehouseData ? new Warehouse(warehouseData) : null;

			return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", warehouse);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
		}
	}
}