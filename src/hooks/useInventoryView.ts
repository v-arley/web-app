import { useMemo, useState } from "react";
import { useResources } from "./useResource";
import type { Resource } from "../models/Resource";

const PAGE_SIZE = 5;

export const RESOURCE_CATEGORIES = [
  "ALIMENTACIÓN",
  "BEBIDAS",
  "MEDICAMENTOS",
  "HERRAMIENTAS",
  "EQUIPAMIENTO",
  "VESTUARIO",
  "COMUNICACIONES",
  "TRANSPORTE",
  "SEGURIDAD",
  "OTROS",
] as const;

export const UNITS_OF_MEASURE = [
  "UND",
  "KG",
  "G",
  "L",
  "ML",
  "M",
  "M2",
  "PAR",
  "CAJA",
  "PKG",
] as const;

export type InventoryStatus = "C" | "M" | "O";

export type InventoryFormState = {
  code: string;
  name: string;
  category: string;
  unitOfMeasure: string;
  description: string;
  consumable: boolean;
  status: InventoryStatus | "";
};

export const emptyInventoryForm: InventoryFormState = {
  code: "",
  name: "",
  category: "",
  unitOfMeasure: "",
  description: "",
  consumable: false,
  status: "",
};

export const STATUS_LABELS: Record<
  InventoryStatus,
  { label: string; className: string }
> = {
  C: { label: "CRITICAL", className: "text-status-critical" },
  M: { label: "MODERATE", className: "text-status-warning" },
  O: { label: "OK", className: "text-status-ok" },
};

function mapResourceToForm(item: Resource): InventoryFormState {
  return {
    code: item.code,
    name: item.name,
    category: item.category,
    unitOfMeasure: item.unitOfMeasure,
    description: item.description,
    consumable: item.consumable,
    status: item.status ?? "",
  };
}

export function useInventoryView() {
  const {
    data: resources,
    isLoading,
    error,
    create,
    update,
    remove,
  } = useResources();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] =
    useState<InventoryFormState>(emptyInventoryForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const selectedItem = useMemo<Resource | null>(() => {
    return resources.find((resource) => resource.id === selectedId) ?? null;
  }, [resources, selectedId]);

  const filteredResources = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return resources.filter(
      (resource) =>
        resource.name.toLowerCase().includes(query) ||
        resource.code.toLowerCase().includes(query) ||
        String(resource.id).includes(query),
    );
  }, [resources, searchTerm]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredResources.length / PAGE_SIZE));
  }, [filteredResources.length]);

  const pageItems = useMemo(() => {
    return filteredResources.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  }, [filteredResources, page]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleRowClick = (item: Resource) => {
    if (selectedId === item.id) {
      setSelectedId(null);
      setEditMode(false);
      setForm(emptyInventoryForm);
      return;
    }

    setSelectedId(item.id);
    setEditMode(false);
    setForm(mapResourceToForm(item));
  };

  const handleEditToggle = () => {
    if (editMode) {
      if (selectedItem) {
        setForm(mapResourceToForm(selectedItem));
      } else {
        setForm(emptyInventoryForm);
      }
    }

    setEditMode((prev) => !prev);
  };

  const handleDelete = async () => {
    if (selectedId === null) return;

    setIsSaving(true);

    const ok = await remove(selectedId);

    if (ok) {
      setSelectedId(null);
      setEditMode(false);
      setForm(emptyInventoryForm);
    }

    setIsSaving(false);
  };

  const handleSave = async () => {
    if (!editMode) return;

    setIsSaving(true);

    if (selectedId !== null) {
      const ok = await update(selectedId, {
        ...form,
        status: (form.status || undefined) as
          | InventoryStatus
          | undefined,
      });

      if (ok) setEditMode(false);
    } else {
      const ok = await create({
        ...form,
        status: (form.status || undefined) as
          | InventoryStatus
          | undefined,
        state: "A",
      });

      if (ok) {
        setEditMode(false);
        setForm(emptyInventoryForm);
      }
    }

    setIsSaving(false);
  };

  const handleFieldChange = (
    field: keyof InventoryFormState,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleToggleConsumable = () => {
    setForm((prev) => ({
      ...prev,
      consumable: !prev.consumable,
    }));
  };

  const handleClear = () => {
    setForm(emptyInventoryForm);
    setSelectedId(null);
    setEditMode(false);
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return {
    resources,
    isLoading,
    error,

    selectedId,
    selectedItem,
    page,
    editMode,
    form,
    searchTerm,
    isSaving,

    filteredResources,
    totalPages,
    pageItems,

    setForm,

    handleSearchChange,
    handleRowClick,
    handleEditToggle,
    handleDelete,
    handleSave,
    handleFieldChange,
    handleToggleConsumable,
    handleClear,
    handlePrevPage,
    handleNextPage,
  };
}