import { useMemo, useState } from "react";

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
}

type FormState = {
  name: string;
  description: string;
};

export const INITIAL_ROLES: Role[] = [
  {
    id: "R-001",
    name: "Administrator",
    description: "Full system access and configurations",
  },
  {
    id: "R-002",
    name: "Commander",
    description: "Oversight of camp operations and personnel",
  },
  {
    id: "R-003",
    name: "Logistics Officer",
    description: "Manages warehouse and resource routing",
  },
  {
    id: "R-004",
    name: "Field Operative",
    description: "Executes tasks and explorations",
  },
];

export const PERMS_LIST: Permission[] = [
  { id: "P-001", resource: "Users", action: "CREATE" },
  { id: "P-002", resource: "Users", action: "READ" },
  { id: "P-003", resource: "Settings", action: "UPDATE" },
  { id: "P-004", resource: "Inventory", action: "DELETE" },
  { id: "P-005", resource: "Inventory", action: "READ" },
  { id: "P-006", resource: "Inventory", action: "UPDATE" },
  { id: "P-007", resource: "Alerts", action: "READ" },
];

export const ROLE_PERMS_MAP: Record<string, string[]> = {
  "R-001": ["P-001", "P-002", "P-003", "P-004", "P-005", "P-006", "P-007"],
  "R-002": ["P-002", "P-003", "P-005", "P-007"],
  "R-003": ["P-004", "P-005", "P-006"],
  "R-004": ["P-002", "P-005", "P-007"],
};

export const ACTION_COLOR: Record<string, string> = {
  CREATE: "text-status-ok bg-status-ok/10",
  READ: "text-status-info bg-status-info/10",
  UPDATE: "text-status-warning bg-status-warning/10",
  DELETE: "text-status-critical bg-status-critical/10",
};

const PAGE_SIZE = 7;

const emptyForm: FormState = {
  name: "",
  description: "",
};

export function useRolesView() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState<string | null>(null);

  const selectedRole = useMemo(() => {
    return roles.find((role) => role.id === selectedId) ?? null;
  }, [roles, selectedId]);

  const rolePermissions = useMemo(() => {
    if (!selectedId) return [];

    return PERMS_LIST.filter((permission) =>
      (ROLE_PERMS_MAP[selectedId] ?? []).includes(permission.id),
    );
  }, [selectedId]);

  const filtered = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(query) ||
        role.id.toLowerCase().includes(query),
    );
  }, [roles, searchTerm]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  }, [filtered.length]);

  const pageItems = useMemo(() => {
    return filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  }, [filtered, page]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleRowClick = (role: Role) => {
    if (selectedId === role.id) {
      setSelectedId(null);
      setEditMode(false);
      setForm(emptyForm);
      return;
    }

    setSelectedId(role.id);
    setEditMode(false);
    setForm({
      name: role.name,
      description: role.description,
    });
  };

  const handleEditToggle = () => {
    if (editMode && selectedRole) {
      setForm({
        name: selectedRole.name,
        description: selectedRole.description,
      });
    }

    setEditMode((current) => !current);
  };

  const handleFormFieldChange = (
    field: keyof FormState,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!editMode || !form.name) return;

    if (selectedId) {
      setRoles((prev) =>
        prev.map((role) =>
          role.id === selectedId ? { ...role, ...form } : role,
        ),
      );

      setEditMode(false);
      return;
    }

    const newId = `R-${String(roles.length + 1).padStart(3, "0")}`;

    setRoles((prev) => [
      ...prev,
      {
        id: newId,
        ...form,
      },
    ]);

    setForm(emptyForm);
  };

  const handleDelete = () => {
    if (!selectedId) return;

    setRoles((prev) => prev.filter((role) => role.id !== selectedId));
    setSelectedId(null);
    setEditMode(false);
    setForm(emptyForm);
  };

  const handleClear = () => {
    setSelectedId(null);
    setEditMode(false);
    setForm(emptyForm);
  };

  const handlePrevPage = () => {
    setPage((current) => Math.max(0, current - 1));
  };

  const handleNextPage = () => {
    setPage((current) => Math.min(totalPages - 1, current + 1));
  };

  const handleOpenPermissionsModal = () => {
    setModalRole(selectedRole?.name ?? null);
    setIsModalOpen(true);
  };

  const handleClosePermissionsModal = () => {
    setIsModalOpen(false);
  };

  return {
    roles,
    selectedId,
    editMode,
    form,
    searchTerm,
    page,
    isModalOpen,
    modalRole,

    selectedRole,
    rolePermissions,
    filtered,
    totalPages,
    pageItems,

    setIsModalOpen,

    handleSearchChange,
    handleRowClick,
    handleEditToggle,
    handleFormFieldChange,
    handleSave,
    handleDelete,
    handleClear,
    handlePrevPage,
    handleNextPage,
    handleOpenPermissionsModal,
    handleClosePermissionsModal,
  };
}