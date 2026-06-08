import type { CreateProfession, Profession, UpdateProfession } from "../../../../models/Profession";

export type ProfessionCatalogRecord = Profession;
export type ProfessionCatalogFormValues = CreateProfession;
export type ProfessionCatalogUpdateValues = UpdateProfession;

export const EMPTY_PROFESSION_FORM: ProfessionCatalogFormValues = {
    code: "",
    name: "",
    description: "",
    default_resource_id: null,
    default_production_amount: null,
    state: "A",
};
