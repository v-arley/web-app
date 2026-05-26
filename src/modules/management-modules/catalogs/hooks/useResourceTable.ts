import type { ResourceFormValues } from "../schemas/resource.schema";

type UseResourceTableParams = {
    resources: ResourceFormValues[];
    selectedId?: number | null;
    onSelect?: (resource: ResourceFormValues | undefined) => void;
};

export function useResourceTable({
    resources,
    selectedId = null,
    onSelect,
}: UseResourceTableParams) {
    const handleSelect = (resource: ResourceFormValues) => {
        if (resource.id === selectedId) {
            onSelect?.(undefined);
            return;
        }

        onSelect?.(resource);
    };

    return {
        resources,
        selectedId,
        handleSelect,
    };
}
