import { Response as Respuesta, type BackendListPayload, type BackendResponse } from "../utils/Response";
import {User, type CreateUser, type UpdateUser } from "../models/User";
import { AxiosBaseService } from "./AxiosBaseService";

export class UserService extends AxiosBaseService {

    async save(register: CreateUser): Promise<Respuesta> {
        try {
            const { data } = await this.client.post<BackendResponse<{ item: User }> | User>("/users", register);
            const user = this.extractItem<User>(data);
                
            return new Respuesta(true, "Registro creado correctamente.", "", "registro", user);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
        }
    }

    async update(id: number, register: UpdateUser): Promise<Respuesta> {
        try {
            const { data } = await this.client.put<BackendResponse<{ item: User }> | User>(`/users/${id}`, register);
            const user = this.extractItem<User>(data);
                
            return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", user);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
        }
    }

    async remove(id: number): Promise<Respuesta> {
		try {
			await this.client.delete(`/users/${id}`);
			
			return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
		}
	}

    async findAll(): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<User>> | User[]>("/users");
            const user = this.extractItems<User>(data).map((user) => new User(user));
                
            return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", user);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
        }
    }

    async findProfessions(): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<BackendResponse<BackendListPayload<string>> | string[]>("/users/professions");
            const professions = this.extractItems<string>(data);

            return new Respuesta(true, "Profesiones obtenidas correctamente.", "", "registros", professions);
        } catch (error) {
            return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener las profesiones"), "", "registros", []);
        }
    }

    async findById(id: number): Promise<Respuesta> {
            try {
                const { data } = await this.client.get<BackendResponse<{ item: User }> | User>(`/users/${id}`);
                const userData = this.extractItem<User>(data);
                const user = userData ? new User(userData) : null;
                
                return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", user);
            } catch (error) {
                return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
            }
        }
}

