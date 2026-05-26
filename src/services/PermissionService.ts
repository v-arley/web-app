import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../shared/utils/Response";
import { Permission, type CreatePermission, type UpdatePermission } from "../models/Permision";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";


export class PermissionService extends AxiosBaseService{
   
    async save (register: CreatePermission): Promise<Respuesta>{
        try {
			const { data } = await this.client.post<BackendResponse<{ item: Permission }> | Permission>("/permissions", register);
			const permission = this.extractItem<Permission>(data);

			return new Respuesta(true, "Registro creado correctamente.", "", "registro", permission);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
		}
    }
    

    async update(id: number, register: UpdatePermission): Promise<Respuesta> {
		try {
			const { data } = await this.client.put<BackendResponse<{ item: Permission }> | Permission>(`/permissions/${id}`, register);
			const permission = this.extractItem<Permission>(data);

			return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", permission);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
		}
	}

	async remove(id: number): Promise<Respuesta> {
		try {
			await this.client.delete(`/permissions/${id}`);

			return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
		}
	}

	async findAll(): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<Permission>> | Permission[]>("/permissions");
			const permissions = this.extractItems<Permission>(data).map((permission) => new Permission(permission));

			return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", permissions);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
		}
	}

	async findById(id: number): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<{ item: Permission }> | Permission>(`/permissions/${id}`);
			const permissionData = this.extractItem<Permission>(data);
			const permission = permissionData ? new Permission(permissionData) : null;

			return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", permission);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
		}
	}
}
