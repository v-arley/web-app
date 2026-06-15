import { useQuery } from "@tanstack/react-query";
import { BriefcaseBusiness } from "lucide-react";
import { useMemo, useState } from "react";
import { ProfessionService } from "../../../../services/ProfessionService";
import { SearchPickerButton, SearchPickerModal, type SearchPickerOption } from "./SearchPickerModal";

const professionService = new ProfessionService();

type Props = {
  selectedId: number;
  onChange: (id: number) => void;
  options?: SearchPickerOption[];
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
};

export function ProfessionSearchPicker({
  selectedId,
  onChange,
  options,
  placeholder = "[ SELECT PROFESSION ]",
  disabled = false,
  allowClear = false,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const { data = [], isLoading } = useQuery({
    queryKey: ["search-picker-professions"],
    queryFn: async () => {
      const response = await professionService.findAll();
      const professions = response.getResultado<Array<{ id?: number; name?: string }>>("registros") ?? [];
      return professions.map((profession) => ({
        id: profession.id ?? 0,
        label: profession.name ?? `Profession #${profession.id ?? 0}`,
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
        title="Search Profession"
        icon={<BriefcaseBusiness size={16} />}
        items={items}
        columns={[
          { key: "label", header: "Profession", render: (item) => <span className="truncate">{item.label}</span> },
        ]}
        searchFields={["label"]}
        onSelect={(item) => onChange(item.id)}
        onClose={() => setOpen(false)}
        isLoading={isLoading}
      />
    </>
  );
}

