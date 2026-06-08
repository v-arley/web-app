import type { Camp, CreateCamp, UpdateCamp } from "../../../../models/Camp";

export type CampRecord = Camp;

export type CampFormValues = CreateCamp & {
    id?: number | null;
    warehouse_name?: string;
    warehouse_location_details?: string;
};

export type CampUpdateValues = UpdateCamp;

export const EMPTY_CAMP_FORM: CampFormValues = {
    id: null,
    code: "",
    description: "",
    capacity: 0,
    location_x: 0,
    location_y: 0,
    active: true,
    state: "A",
    admin_id: undefined,
    warehouse_name: "",
    warehouse_location_details: "",
};
