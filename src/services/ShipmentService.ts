import { Response as Respuesta, type BackendListPayload, type BackendResponse } from "../utils/Response";
import { Shipment, type CreateShipment, type UpdateShipment } from "../models/Shipment";
import { AxiosBaseService } from "./AxiosBaseService";

export class ShipmentService extends AxiosBaseService {

    async save(register: CreateShipment): Promise<Respuesta> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: Shipment }> | Shipment>("/shipments", register);
            const shipment = this.extractItem<Shipment>(data);

            return new Respuesta(true, "Registro creado correctamente.", "", "registro", shipment);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
        }
    }

    async update(id: number, register: UpdateShipment): Promise<Respuesta> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: Shipment }> | Shipment>(`/shipments/${id}`, register);
            const shipment = this.extractItem<Shipment>(data);

            return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", shipment);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
        }
    }

    async remove(id: number): Promise<Respuesta> {
        try {
            await this.client.delete(`/shipments/${id}`);

            return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
        }
    }

    async findAll(): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<Shipment>> | Shipment[]>("/shipments");
            const shipments = this.extractItems<Shipment>(data).map((item) => new Shipment(item));

            return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", shipments);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
        }
    }

    async findById(id: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<{ item: Shipment }> | Shipment>(`/shipments/${id}`);
            const shipmentData = this.extractItem<Shipment>(data);
            const shipment = shipmentData ? new Shipment(shipmentData) : null;

            return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", shipment);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
        }
    }
}