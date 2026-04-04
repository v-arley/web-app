import axios, { AxiosError, type AxiosInstance } from "axios";
import { Response as Respuesta, type BackendListPayload, type BackendResponse } from "../utils/Response";
import { Person, type CreatePerson, type UpdatePerson } from "../models/Person";

export class AxiosPersonService {
	private client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
			headers: {
				"Content-Type": "application/json; charset=UTF-8",
			},
		});
	}

	async save(register: CreatePerson): Promise<Respuesta> {
		try {
			const { data } = await this.client.post<BackendResponse<{ item: Person }> | Person>("/people", register);
			const person = this.extractItem<Person>(data);
			
			return new Respuesta(true, "Registro creado correctamente.", "", "registro", person);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear el registro"), "", "registro", null);
		}
	}

	async update(id: number, register: UpdatePerson): Promise<Respuesta> {
		try {
			const { data } = await this.client.put<BackendResponse<{ item: Person }> | Person>(`/people/${id}`, register);
			const person = this.extractItem<Person>(data);
			
			return new Respuesta(true, "Registro actualizado correctamente.", "", "registro", person);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar el registro"), "", "registro", null);
		}
	}

	async remove(id: number): Promise<Respuesta> {
		try {
			await this.client.delete(`/people/${id}`);
			
			return new Respuesta(true, "Registro eliminado correctamente.", "", "registro", null);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar el registro"), "", "registro", null);
		}
	}

	async findAll(): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<Person>> | Person[]>("/people");
			const people = this.extractItems<Person>(data).map((person) => new Person(person));
			
			return new Respuesta(true, "Registros obtenidos correctamente.", "", "registros", people);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener los registros"), "");
		}
	}

	async findById(id: number): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<{ item: Person }> | Person>(`/people/${id}`);
			const personData = this.extractItem<Person>(data);
			const person = personData ? new Person(personData) : null;
			
			return new Respuesta(true, "Registro obtenido correctamente.", "", "registro", person);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener el registro"), "", "registro", null);
		}
	}

	private extractItem<T>(data: BackendResponse<{ item: T }> | T): T {
		if (data && typeof data === "object" && "resultado" in data) {
			const wrapped = data as BackendResponse<{ item: T }>;
			
			return wrapped.resultado?.item;
		}
		return data as T;
	}

	// utility method to extract items from either a wrapped response or a direct array

	private extractItems<T>(data: BackendResponse<BackendListPayload<T>> | T[]): T[] {
		if (Array.isArray(data)) {
			return data;
		}

		if (data && typeof data === "object" && "resultado" in data) {
			const wrapped = data as BackendResponse<BackendListPayload<T>>;
			return wrapped.resultado?.items ?? [];
		}

		return [];
	}

	private extractErrorMessage(error: unknown, fallback: string): string {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError<unknown>;
			const responseData = axiosError.response?.data;

			if (typeof responseData === "string" && responseData.trim()) {
				return responseData;
			}

			if (responseData && typeof responseData === "object") {
				const obj = responseData as Record<string, unknown>;

				if (typeof obj.mensaje === "string" && obj.mensaje.trim()) {
					return obj.mensaje;
				}

				if (typeof obj.message === "string" && obj.message.trim()) {
					return obj.message;
				}

				if (typeof obj.error === "string" && obj.error.trim()) {
					return obj.error;
				}
			}

			return axiosError.message || fallback;
		}

		if (error instanceof Error && error.message.trim()) {
			return error.message;
		}

		return fallback;
	}
}
