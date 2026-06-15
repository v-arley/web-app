import { Users } from "lucide-react";
import { useMemo, useState } from "react";
import type { User } from "../../../../models/User";
import { SearchPickerButton, SearchPickerModal } from "../../../resource-management-modules/shared/components/SearchPickerModal";

type Props = {
  selectedId: number | undefined;
  users: User[];
  onChange: (id: number | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
};

export function UserSearchPicker({
  selectedId,
  users,
  onChange,
  placeholder = "[ SELECT ADMIN ]",
  disabled = false,
  allowClear = false,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);

  const items = useMemo(
    () =>
      users.map((user) => ({
        id: user.id!,
        label: user.username ?? user.name ?? `User #${user.id}`,
        username: user.username ?? "",
        name: user.name ?? "",
      })),
    [users],
  );

  const selected = useMemo(() => items.find((item) => item.id === selectedId), [items, selectedId]);

  return (
    <>
      <SearchPickerButton
        label={selected?.label ?? ""}
        placeholder={placeholder}
        onOpen={() => setOpen(true)}
        onClear={allowClear ? () => onChange(undefined) : undefined}
        disabled={disabled}
        className={className}
      />
      <SearchPickerModal
        isOpen={open}
        title="Search User / Admin"
        icon={<Users size={16} />}
        items={items}
        columns={[
          {
            key: "username",
            header: "Username",
            render: (item) => <span className="truncate">{String(item.username ?? "")}</span>,
          },
          {
            key: "name",
            header: "Full Name",
            render: (item) => <span className="truncate text-txt-secondary">{String(item.name ?? "")}</span>,
          },
        ]}
        searchFields={["username", "name", "label"]}
        onSelect={(item) => onChange(item.id as number)}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export default UserSearchPicker;
