import { useQuery } from "@tanstack/react-query";
import { UserSearch } from "lucide-react";
import { useMemo, useState } from "react";
import { PersonService } from "../../../../services/PersonService";
import { SearchPickerButton, SearchPickerModal, type SearchPickerOption } from "./SearchPickerModal";

const personService = new PersonService();

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

export function PersonSearchPicker({
  selectedId,
  onChange,
  campId,
  options,
  placeholder = "[ SELECT WORKER ]",
  disabled = false,
  allowClear = false,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const { data = [], isLoading } = useQuery({
    queryKey: ["search-picker-persons", campId],
    queryFn: async () => {
      const response = await personService.findAll();
      const persons = response.getResultado<Array<{ id: number; name?: string; last_name?: string; dni?: string; camp_id?: number }>>("registros") ?? [];
      return persons
        .filter((person) => !campId || person.camp_id === campId)
        .map((person) => ({
          id: person.id,
          label: `${person.name ?? ""} ${person.last_name ?? ""}`.trim() || `Person #${person.id}`,
          dni: person.dni ?? "",
          campId: person.camp_id ?? "",
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
        title="Search Worker"
        icon={<UserSearch size={16} />}
        items={items}
        columns={[
          { key: "label", header: "Worker", render: (item) => <span className="truncate">{item.label}</span> },
          { key: "dni", header: "DNI", className: "text-right", render: (item) => <span className="text-txt-secondary">{String(item.dni ?? "")}</span> },
        ]}
        searchFields={["label", "dni"]}
        onSelect={(item) => onChange(item.id)}
        onClose={() => setOpen(false)}
        isLoading={isLoading}
      />
    </>
  );
}

