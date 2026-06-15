import { useQuery } from "@tanstack/react-query";
import { PackageSearch } from "lucide-react";
import { useMemo, useState } from "react";
import { ResourceService } from "../../../../services/ResourceService";
import { SearchPickerButton, SearchPickerModal, type SearchPickerOption } from "./SearchPickerModal";

const resourceService = new ResourceService();

type Props = {
  selectedId: number;
  onChange: (id: number) => void;
  options?: SearchPickerOption[];
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
};

export function ResourceSearchPicker({
  selectedId,
  onChange,
  options,
  placeholder = "[ SELECT RESOURCE ]",
  disabled = false,
  allowClear = false,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const { data = [], isLoading } = useQuery({
    queryKey: ["search-picker-resources"],
    queryFn: async () => {
      const response = await resourceService.findAll();
      const resources = response.getResultado<Array<{ id: number; code?: string; name?: string; unit_of_measure?: string }>>("registros") ?? [];
      return resources.map((resource) => ({
        id: resource.id,
        label: resource.code ? `${resource.code} - ${resource.name ?? ""}` : resource.name ?? `Resource #${resource.id}`,
        code: resource.code ?? "",
        name: resource.name ?? "",
        unit: resource.unit_of_measure ?? "",
      }));
    },
    enabled: !options,
  });
  const items = options ?? data;
  const selected = useMemo(() => items.find((item) => item.id === selectedId), [items, selectedId]);

  return (
    <>
      <SearchPickerButton
        label={selected?.label ?? ""}
        placeholder={placeholder}
        onOpen={() => setOpen(true)}
        onClear={allowClear ? () => onChange(0) : undefined}
        disabled={disabled}
        className={className}
      />
      <SearchPickerModal
        isOpen={open}
        title="Search Resource"
        icon={<PackageSearch size={16} />}
        items={items}
        columns={[
          { key: "label", header: "Resource", render: (item) => <span className="truncate">{item.label}</span> },
          { key: "unit", header: "Unit", className: "text-right", render: (item) => <span className="text-txt-secondary">{String(item.unit ?? "")}</span> },
        ]}
        searchFields={["label", "code", "name", "unit"]}
        onSelect={(item) => onChange(item.id)}
        onClose={() => setOpen(false)}
        isLoading={isLoading}
      />
    </>
  );
}

