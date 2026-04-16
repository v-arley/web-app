import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../utils/Response";
import { PermissionRol, type CreatePermissionRol } from "../models/PermissionRol";
import { AxiosBaseService } from "./AxiosBaseService";

export class RolePermissionService extends AxiosBaseService {

	async save(register: CreatePermissionRol): Promise<Respuesta> {
		try {
			const { data } = await this.client.post<BackendResponse<{ item: PermissionRol }> | PermissionRol>(
				"/role-permissions",
				register
			);
			const rolePermission = this.extractItem<PermissionRol>(data);

			return new Respuesta(true, "Registro creado correctamente.", "", "registro", rolePermission);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
		}
	}

	async update(id: number, register: PermissionRol): Promise<Respuesta> {
		try {
			const { data } = await this.client.put<BackendResponse<{ item: PermissionRol }> | PermissionRol>(
				`/role-permissions/${id}`,
				register
			);
			const rolePermission = this.extractItem<PermissionRol>(data);

			return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", rolePermission);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
		}
	}

	async remove(id: number): Promise<Respuesta> {
		try {
			await this.client.delete(`/role-permissions/${id}`);

			return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
		}
	}

	async findAll(): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<PermissionRol>> | PermissionRol[]>(
				"/role-permissions"
			);
			const rolePermissions = this.extractItems<PermissionRol>(data).map(
				(permissionRol) => new PermissionRol(permissionRol)
			);

			return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", rolePermissions);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
		}
	}

	async findById(id: number): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<{ item: PermissionRol }> | PermissionRol>(
				`/role-permissions/${id}`
			);
			const rolePermissionData = this.extractItem<PermissionRol>(data);
			const rolePermission = rolePermissionData ? new PermissionRol(rolePermissionData) : null;

			return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", rolePermission);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
		}
	}
}