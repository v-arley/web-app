import { useQuery } from "@tanstack/react-query";
import { Warehouse } from "lucide-react";
import { useMemo, useState } from "react";
import { WarehouseService } from "../../../../services/WarehouseService";
import { SearchPickerButton, SearchPickerModal, type SearchPickerOption } from "./SearchPickerModal";

const warehouseService = new WarehouseService();

type Props = {
  selectedId: number;
  onChange: (id: number) => void;
  campId?: number;
  options?: SearchPickerOption[];
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
};

export function WarehouseSearchPicker({
  selectedId,
  onChange,
  campId,
  options,
  placeholder = "[ SELECT WAREHOUSE ]",
  disabled = false,
  allowClear = false,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const { data = [], isLoading } = useQuery({
    queryKey: ["search-picker-warehouses", campId],
    queryFn: async () => {
      const response = await warehouseService.findAll();
      const warehouses = response.getResultado<Array<{ id: number; name?: string; camp_id?: number }>>("registros") ?? [];
      return warehouses
        .filter((warehouse) => !campId || warehouse.camp_id === campId)
        .map((warehouse) => ({
          id: warehouse.id,
          label: warehouse.name ?? `Warehouse #${warehouse.id}`,
          campId: warehouse.camp_id ?? "",
        }));
    },
    enabled: !options && (!campId || campId > 0),
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
        title="Search Warehouse"
        icon={<Warehouse size={16} />}
        items={items}
        columns={[
          { key: "label", header: "Warehouse", render: (item) => <span className="truncate">{item.label}</span> },
        ]}
        searchFields={["label"]}
        onSelect={(item) => onChange(item.id)}
        onClose={() => setOpen(false)}
        isLoading={isLoading}
      />
    </>
  );
}

