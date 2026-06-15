import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { CampService } from "../../../../services/CampService";
import { SearchPickerButton, SearchPickerModal, type SearchPickerOption } from "./SearchPickerModal";

const campService = new CampService();

type Props = {
  selectedId: number;
  onChange: (id: number) => void;
  options?: SearchPickerOption[];
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
};

export function CampSearchPicker({
  selectedId,
  onChange,
  options,
  placeholder = "[ SELECT CAMP ]",
  disabled = false,
  allowClear = false,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const { data = [], isLoading } = useQuery({
    queryKey: ["search-picker-camps-for-requests"],
    queryFn: async () => {
      const response = await campService.findAllForRequests();
      const camps = response.getResultado<Array<{ id?: number; code?: string; description?: string }>>("registros") ?? [];
      return camps.map((camp) => ({
        id: camp.id ?? 0,
        label: camp.code || camp.description || `Camp #${camp.id ?? 0}`,
        description: camp.description ?? "",
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
        title="Search Camp"
        icon={<MapPin size={16} />}
        items={items}
        columns={[
          { key: "label", header: "Camp", render: (item) => <span className="truncate">{item.label}</span> },
          { key: "description", header: "Description", render: (item) => <span className="truncate text-txt-secondary">{String(item.description ?? "")}</span> },
        ]}
        searchFields={["label", "description"]}
        onSelect={(item) => onChange(item.id)}
        onClose={() => setOpen(false)}
        isLoading={isLoading}
      />
    </>
  );
}

