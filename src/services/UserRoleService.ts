import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../shared/utils/Response";
import { UserRol, type CreateUserRol } from "../models/UserRol";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";

export class UserRoleService extends AxiosBaseService {

	async save(register: CreateUserRol): Promise<Respuesta> {
		try {
			const { data } = await this.client.post<BackendResponse<{ item: UserRol }> | UserRol>("/user-roles",register);
			const userRole = this.extractItem<UserRol>(data);

			return new Respuesta(true, "Registro creado correctamente.", "", "registro", userRole);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
		}
	}

	async update(id: number, register: UserRol): Promise<Respuesta> {
		try {
			const { data } = await this.client.put<BackendResponse<{ item: UserRol }> | UserRol>(`/user-roles/${id}`,register);
			const userRole = this.extractItem<UserRol>(data);

			return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", userRole);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
		}
	}

	async remove(id: number): Promise<Respuesta> {
		try {
			await this.client.delete(`/user-roles/${id}`);

			return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
		}
	}

	async findAll(): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<UserRol>> | UserRol[]>(
				"/user-roles"
			);
			const userRoles = this.extractItems<UserRol>(data).map(
				(userRol) => new UserRol(userRol)
			);

			return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", userRoles);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
		}
	}

	async findById(id: number): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<{ item: UserRol }> | UserRol>(
				`/user-roles/${id}`
			);
			const userRoleData = this.extractItem<UserRol>(data);
			const userRole = userRoleData ? new UserRol(userRoleData) : null;

			return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", userRole);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
		}
	}
}
