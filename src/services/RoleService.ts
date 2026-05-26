import { Response as Respuesta, type BackendListPayload, type BackendResponse } from "../shared/utils/Response";
import { Role, type CreateRole, type UpdateRole } from "../models/Role";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";

export class RoleService extends AxiosBaseService {
    async save(register: CreateRole): Promise<Respuesta> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: Role }> | Role>("/roles", register);
            const role = this.extractItem<Role>(data);
            return new Respuesta(true, "Registro creado correctamente.", "", "registro", role);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
        }
    }

    async update(id: number, register: UpdateRole): Promise<Respuesta> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: Role }> | Role>(`/roles/${id}`, register);
            const role = this.extractItem<Role>(data);
            return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", role);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
        }
    }

    async remove(id: number): Promise<Respuesta> {
        try {
            await this.client.delete(`/roles/${id}`);
            return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
        }
    }

    async findAll(): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<Role>> | Role[]>("/roles");
            const roles = this.extractItems<Role>(data).map((role) => new Role(role));
            return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", roles);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
        }
    }
}

