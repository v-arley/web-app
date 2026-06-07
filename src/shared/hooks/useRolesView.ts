import { useCallback, useEffect, useMemo, useState } from "react";

import { RoleService } from "../../services/RoleService";
import type { CreateRole, Role, UpdateRole } from "../../models/Role";

export interface Permission {
  id: string;
  resource: string;
  action: string;
}

type FormState = {
  name: string;
  description: string;
};

export type RoleSaveResult = "created" | "updated" | null;

export const PERMS_LIST: Permission[] = [
  { id: "P-001", resource: "Users", action: "CREATE" },
  { id: "P-002", resource: "Users", action: "READ" },
  { id: "P-003", resource: "Settings", action: "UPDATE" },
  { id: "P-004", resource: "Inventory", action: "DELETE" },
  { id: "P-005", resource: "Inventory", action: "READ" },
  { id: "P-006", resource: "Inventory", action: "UPDATE" },
  { id: "P-007", resource: "Alerts", action: "READ" },
];

export const ROLE_PERMS_MAP: Record<number, string[]> = {
  1: ["P-001", "P-002", "P-003", "P-004", "P-005", "P-006", "P-007"],
  2: ["P-002", "P-003", "P-005", "P-007"],
  3: ["P-004", "P-005", "P-006"],
  4: ["P-002", "P-005", "P-007"],
};

export const ACTION_COLOR: Record<string, string> = {
  CREATE: "text-status-ok bg-status-ok/10",
  READ: "text-status-info bg-status-info/10",
  UPDATE: "text-status-warning bg-status-warning/10",
  DELETE: "text-status-critical bg-status-critical/10",
};

const PAGE_SIZE = 7;
const roleService = new RoleService();

const emptyForm: FormState = {
  name: "",
  description: "",
};

function normalizeRole(raw: any): Role {
  return {
    id: Number(raw.id),
    name: String(raw.name ?? ""),
    description: String(raw.description ?? ""),
    state: raw.state ?? "A",
    created_at: raw.created_at,
  } as Role;
}

function sortRolesNewestFirst(roles: Role[]) {
  return [...roles].sort((a, b) => Number(b.id) - Number(a.id));
}

function extractRoles(response: any): Role[] {
  const possiblePayloads = [
    response?.getResultado?.("registros"),
    response?.getResultado?.("items"),
    response?.getResultado?.("resultado"),
    response?.getResultado?.(),
    response?.resultado,
    response?.data,
    response?.items,
    response?.registros,
  ];

  for (const payload of possiblePayloads) {
    if (Array.isArray(payload)) {
      return sortRolesNewestFirst(
        payload.map(normalizeRole).filter((role) => Number.isFinite(role.id)),
      );
    }

    if (Array.isArray(payload?.items)) {
      return sortRolesNewestFirst(
        payload.items
          .map(normalizeRole)
          .filter((role: Role) => Number.isFinite(role.id)),
      );
    }

    if (Array.isArray(payload?.registros)) {
      return sortRolesNewestFirst(
        payload.registros
          .map(normalizeRole)
          .filter((role: Role) => Number.isFinite(role.id)),
      );
    }
  }

  return [];
}

function extractRole(response: any): Role | null {
  const possiblePayloads = [
    response?.getResultado?.("registro"),
    response?.getResultado?.("item"),
    response?.getResultado?.("resultado"),
    response?.getResultado?.(),
    response?.resultado,
    response?.data,
    response?.item,
    response?.registro,
  ];

  for (const payload of possiblePayloads) {
    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
      const role = normalizeRole(payload);

      if (Number.isFinite(role.id)) {
        return role;
      }
    }
  }

  return null;
}

function responseIsOk(response: any) {
  if (typeof response?.getEstado === "function") {
    return response.getEstado();
  }

  if (typeof response?.estado === "boolean") {
    return response.estado;
  }

  if (typeof response?.success === "boolean") {
    return response.success;
  }

  return true;
}

function responseMessage(response: any, fallback: string) {
  if (typeof response?.getMensaje === "function") {
    return response.getMensaje() || fallback;
  }

  return response?.mensaje || response?.message || fallback;
}

export function useRolesView() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await roleService.findAll();

      if (!responseIsOk(response)) {
        setError(responseMessage(response, "No se pudieron cargar los roles."));
        setRoles([]);
        return;
      }

      setRoles(extractRoles(response));
    } catch {
      setError("No se pudieron cargar los roles.");
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

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

    if (!query) return roles;

    return roles.filter(
      (role) =>
        String(role.id).includes(query) ||
        role.name.toLowerCase().includes(query) ||
        (role.description ?? "").toLowerCase().includes(query),
    );
  }, [roles, searchTerm]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  }, [filtered.length]);

  const pageItems = useMemo(() => {
    return filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);

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
      name: role.name ?? "",
      description: role.description ?? "",
    });
  };

  const handleEditToggle = () => {
    if (!selectedId) return;

    if (editMode && selectedRole) {
      setForm({
        name: selectedRole.name ?? "",
        description: selectedRole.description ?? "",
      });
    }

    setEditMode((current) => !current);
  };

  const handleFormFieldChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (): Promise<RoleSaveResult> => {
    const cleanName = form.name.trim();
    const cleanDescription = form.description.trim();

    if (!cleanName) return null;

    try {
      setError(null);

      if (selectedId) {
        if (!editMode) return null;

        const payload: UpdateRole = {
          name: cleanName,
          description: cleanDescription,
        };

        const response = await roleService.update(selectedId, payload);

        if (!responseIsOk(response)) {
          setError(responseMessage(response, "No se pudo actualizar el rol."));
          return null;
        }

        const updatedRole =
          extractRole(response) ??
          ({
            id: selectedId,
            name: cleanName,
            description: cleanDescription,
          } as Role);

        setRoles((current) =>
          sortRolesNewestFirst(
            current.map((role) =>
              role.id === selectedId ? { ...role, ...updatedRole } : role,
            ),
          ),
        );

        setEditMode(false);
        setForm({
          name: updatedRole.name ?? cleanName,
          description: updatedRole.description ?? cleanDescription,
        });

        await loadRoles();
        return "updated";
      }

      const payload: CreateRole = {
        name: cleanName,
        description: cleanDescription,
      };

      const response = await roleService.save(payload);

      if (!responseIsOk(response)) {
        setError(responseMessage(response, "No se pudo crear el rol."));
        return null;
      }

      const createdRole = extractRole(response);

      if (createdRole) {
        setRoles((current) =>
          sortRolesNewestFirst([
            createdRole,
            ...current.filter((role) => role.id !== createdRole.id),
          ]),
        );

        setSelectedId(createdRole.id);
        setForm({
          name: createdRole.name ?? cleanName,
          description: createdRole.description ?? cleanDescription,
        });
      } else {
        setSelectedId(null);
        setForm(emptyForm);
      }

      setEditMode(false);
      setSearchTerm("");
      setPage(0);

      await loadRoles();

      return "created";
    } catch {
      setError("No se pudo guardar el rol.");
      return null;
    }
  };

  const handleDelete = async (): Promise<boolean> => {
    if (!selectedId) return false;

    try {
      setError(null);

      const response = await roleService.remove(selectedId);

      if (!responseIsOk(response)) {
        setError(responseMessage(response, "No se pudo eliminar el rol."));
        return false;
      }

      setRoles((current) => current.filter((role) => role.id !== selectedId));
      setSelectedId(null);
      setEditMode(false);
      setForm(emptyForm);
      setSearchTerm("");
      setPage(0);

      await loadRoles();

      return true;
    } catch {
      setError("No se pudo eliminar el rol.");
      return false;
    }
  };

  const handleClear = () => {
    setSelectedId(null);
    setEditMode(false);
    setForm(emptyForm);
    setSearchTerm("");
    setPage(0);
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
    loading,
    error,

    selectedRole,
    rolePermissions,
    filtered,
    totalPages,
    pageItems,

    setIsModalOpen,

    reload: loadRoles,
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