import type { CreateResource, Resource, UpdateResource } from "../../../../models/Resource";

export type ResourceCatalogRecord = Resource;
export type ResourceCatalogFormValues = CreateResource;
export type ResourceCatalogUpdateValues = UpdateResource;

export const EMPTY_RESOURCE_FORM: ResourceCatalogFormValues = {
    code: "",
    name: "",
    description: "",
    category: "",
    unitOfMeasure: "",
    consumable: false,
    state: "A",
};
