import {
    Response as Respuesta,
    type BackendListPayload,
    type BackendResponse,
} from "../shared/utils/Response";
import {
    AuditLog,
    type CreateAuditLog,
    type UpdateAuditLog,
} from "../models/AuditLog";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";

export class AuditLogService extends AxiosBaseService {
    async save(register: CreateAuditLog): Promise<Respuesta> {
        try {
            const { data } = await this.client.post<
                BackendResponse<{ item: AuditLog }> | AuditLog
            >("/audit-logs", register);

            const item = this.extractItem<AuditLog>(data);

            return new Respuesta(
                true,
                "Registro de auditorÃ­a creado correctamente.",
                "",
                "registro",
                item,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudo crear el registro de auditorÃ­a"),
                "",
                "registro",
                null,
            );
        }
    }

    async update(id: string | number, register: UpdateAuditLog): Promise<Respuesta> {
        try {
            const { data } = await this.client.put<
                BackendResponse<{ item: AuditLog }> | AuditLog
            >(`/audit-logs/${id}`, register);

            const item = this.extractItem<AuditLog>(data);

            return new Respuesta(
                true,
                "Registro de auditorÃ­a actualizado correctamente.",
                "",
                "registro",
                item,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudo actualizar el registro de auditorÃ­a"),
                "",
                "registro",
                null,
            );
        }
    }

    async remove(id: string | number): Promise<Respuesta> {
        try {
            await this.client.delete(`/audit-logs/${id}`);

            return new Respuesta(
                true,
                "Registro de auditorÃ­a eliminado correctamente.",
                "",
                "registro",
                null,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudo eliminar el registro de auditorÃ­a"),
                "",
                "registro",
                null,
            );
        }
    }

    async findAll(): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<
                BackendResponse<BackendListPayload<AuditLog>> | AuditLog[]
            >("/audit-logs");

            const items = this.extractItems<AuditLog>(data).map(
                (item) => new AuditLog(item),
            );

            return new Respuesta(
                true,
                "Registros de auditorÃ­a obtenidos correctamente.",
                "",
                "registros",
                items,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudieron obtener los registros de auditorÃ­a"),
                "",
                "registros",
                [],
            );
        }
    }

    async findById(id: string | number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<
                BackendResponse<{ item: AuditLog }> | AuditLog
            >(`/audit-logs/${id}`);

            const auditLogData = this.extractItem<AuditLog>(data);
            const auditLog = auditLogData ? new AuditLog(auditLogData) : null;

            return new Respuesta(
                true,
                "Registro de auditorÃ­a obtenido correctamente.",
                "",
                "registro",
                auditLog,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudo obtener el registro de auditorÃ­a"),
                "",
                "registro",
                null,
            );
        }
    }

    async findByTableName(tableName: string): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<
                BackendResponse<BackendListPayload<AuditLog>> | AuditLog[]
            >(`/audit-logs/table/${tableName}`);

            const items = this.extractItems<AuditLog>(data).map(
                (item) => new AuditLog(item),
            );

            return new Respuesta(
                true,
                "Registros de auditorÃ­a obtenidos correctamente.",
                "",
                "registros",
                items,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudieron obtener los registros de auditorÃ­a"),
                "",
                "registros",
                [],
            );
        }
    }

    async findByUserId(userId: number): Promise<Respuesta> {
        try {
            const { data } = await this.client.get<
                BackendResponse<BackendListPayload<AuditLog>> | AuditLog[]
            >(`/audit-logs/user/${userId}`);

            const items = this.extractItems<AuditLog>(data).map(
                (item) => new AuditLog(item),
            );

            return new Respuesta(
                true,
                "Registros de auditorÃ­a obtenidos correctamente.",
                "",
                "registros",
                items,
            );
        } catch (error) {
            return new Respuesta(
                false,
                this.extractErrorMessage(error, "No se pudieron obtener los registros de auditorÃ­a"),
                "",
                "registros",
                [],
            );
        }
    }
}
