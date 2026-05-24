export type AuditLogAction = "INSERT" | "UPDATE" | "DELETE" | string;

export class AuditLog {
    id!: string | number;
    table_name!: string;
    record_id?: number | null;
    action!: AuditLogAction;
    performed_by?: number | null;
    old_values?: Record<string, unknown> | null;
    new_values?: Record<string, unknown> | null;
    ip_address?: string | null;
    user_agent?: string | null;
    created_at?: string | Date;

    constructor(data?: Partial<AuditLog>) {
        Object.assign(this, data);
    }
}

export type CreateAuditLog = {
    table_name: string;
    record_id?: number | null;
    action: AuditLogAction;
    performed_by?: number | null;
    old_values?: Record<string, unknown> | null;
    new_values?: Record<string, unknown> | null;
    ip_address?: string | null;
    user_agent?: string | null;
};

export type UpdateAuditLog = Partial<CreateAuditLog>;

export type responseAuditLog = AuditLog;