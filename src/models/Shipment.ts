
export class Shipment {

    id?: number | null;
    departure_date!: Date;
    arrival_date?: Date;
    status!: string;
    observations?: string;
    created_at?: Date;

    request_id!: number;

    constructor(data?: Partial<Shipment>) {
        Object.assign(this, data);
    }

}

export type CreateShipment = Omit<Shipment, "id" | "created_at">;
export type UpdateShipment = Partial<Omit<Shipment, "id" | "created_at">>;

export type responseShipment = Shipment;