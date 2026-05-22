import {
    Response as Respuesta,
    type BackendListPayload,
    type BackendResponse,
} from "../utils/Response";
import {
    Profession,
    type CreateProfession,
    type UpdateProfession,
} from "../models/Profession";
import { AxiosBaseService } from "./AxiosBaseService";

export class ProfessionService extends AxiosBaseService {
    async save(register: CreateProfession): Promise<Respuesta> {
        try {
            const { data } = await this.client.post<
                BackendResponse<{ item: Profession }> | Profession
            >("/professions", register);

            const item = this.extractItem<Profession>(data);

            return new Respuesta(
                true,
                "Profesión creada correctamente.",
                "",
                "registro",
                item,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudo crear la profesión"),
                "",
                "registro",
                null,
            );
        }
    }

    async update(id: number, register: UpdateProfession): Promise<Respuesta> {
        try {
            const { data } = await this.client.put<
                BackendResponse<{ item: Profession }> | Profession
            >(`/professions/${id}`, register);

            const item = this.extractItem<Profession>(data);

            return new Respuesta(
                true,
                "Profesión actualizada correctamente.",
                "",
                "registro",
                item,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudo actualizar la profesión"),
                "",
                "registro",
                null,
            );
        }
    }

    async remove(id: number): Promise<Respuesta> {
        try {
            await this.client.delete(`/professions/${id}`);

            return new Respuesta(
                true,
                "Profesión eliminada correctamente.",
                "",
                "registro",
                null,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudo eliminar la profesión"),
                "",
                "registro",
                null,
            );
        }
    }

    async findAll(): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<
                BackendResponse<BackendListPayload<Profession>> | Profession[]
            >("/professions");

            const items = this.extractItems<Profession>(data).map(
                (item) => new Profession(item),
            );

            return new Respuesta(
                true,
                "Profesiones obtenidas correctamente.",
                "",
                "registros",
                items,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudieron obtener las profesiones"),
                "",
                "registros",
                [],
            );
        }
    }

    async findById(id: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<
                BackendResponse<{ item: Profession }> | Profession
            >(`/professions/${id}`);

            const professionData = this.extractItem<Profession>(data);
            const profession = professionData
                ? new Profession(professionData)
                : null;

            return new Respuesta(
                true,
                "Profesión obtenida correctamente.",
                "",
                "registro",
                profession,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudo obtener la profesión"),
                "",
                "registro",
                null,
            );
        }
    }
}