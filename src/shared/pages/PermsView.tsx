import {useEffect, useMemo, useRef, useState, type KeyboardEvent, type Ref,} from "react";
import {AlertTriangle, CheckCircle2, KeyRound, Pencil, Plus, RotateCcw, Search, Trash2,} from "lucide-react";
import { usePermissions } from "../hooks/usePermission";
import { useToast } from "../hooks/useToast";
import type { CreatePermission, Permission } from "../../models/Permision";

const PAGE_SIZE = 7;

type PermissionFormState = {
  code: string;
  name: string;
  description: string;
};

const emptyForm: PermissionFormState = {
  code: "",
  name: "",
  description: "",
};

function normalizePermissionCode(value: string) {
  return value
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/[^A-Z0-9_]/g, "");
}

function formatPermissionName(value?: string) {
  const raw = value?.trim();

  if (!raw) return "";

  return raw
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatPermissionCode(value?: string) {
  return value?.trim().toUpperCase() ?? "";
}

function FormField({
  id,
  label,
  value,
  placeholder,
  required,
  readOnly,
  inputRef,
  onKeyDown,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  readOnly?: boolean;inputRef?: Ref<HTMLInputElement>;
  
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-[13px] font-bold uppercase tracking-[0.16em] text-txt-primary">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </span>

      <input
        ref={inputRef}
        id={id}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        onChange={(event) => onChange(event.target.value)}
        className={`h-12 w-full border border-border-default bg-bg-tertiary px-4 text-[13px] font-bold uppercase tracking-[0.12em] text-txt-primary outline-none placeholder:text-txt-disabled/70 transition-colors focus:border-accent ${
          readOnly ? "cursor-not-allowed opacity-60" : ""
        }`}
      />
    </label>
  );
}

export function PermsView() {
  const { toast } = useToast();
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const { data, isLoading, error, create, update, remove, reload } =
    usePermissions();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [form, setForm] = useState<PermissionFormState>(emptyForm);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredPermissions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return data;

    return data.filter((permission) =>
      [permission.code, permission.name, permission.description]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [data, searchTerm]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredPermissions.length / PAGE_SIZE));
  }, [filteredPermissions.length]);

  const pageItems = useMemo(() => {
    return filteredPermissions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  }, [filteredPermissions, page]);

  const canEditForm = !selectedId || editMode;

  const canSubmit =
    form.code.trim().length > 0 &&
    form.name.trim().length > 0 &&
    form.description.trim().length > 0;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 80);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);

  const handleEnterToNextField = (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    if (event.key !== "Enter") return;

    event.preventDefault();

    const formContainer = event.currentTarget.closest("[data-enter-form]");

    if (!formContainer) return;

    const fields = Array.from(
      formContainer.querySelectorAll<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement
      >(
        "input:not([disabled]):not([readonly]), textarea:not([disabled]):not([readonly]), select:not([disabled]), button:not([disabled])",
      ),
    ).filter((field) => field.offsetParent !== null);

    const currentIndex = fields.indexOf(event.currentTarget);

    if (currentIndex < 0) return;

    fields[currentIndex + 1]?.focus();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleSelectPermission = (permission: Permission) => {
    setSelectedId(permission.id);
    setEditMode(false);
    setFeedback(null);

    setForm({
      code: formatPermissionCode(permission.code),
      name: formatPermissionName(permission.name),
      description: permission.description ?? "",
    });
  };

  const handleClear = () => {
    setSelectedId(null);
    setEditMode(false);
    setFeedback(null);
    setForm(emptyForm);
    window.setTimeout(() => firstFieldRef.current?.focus(), 80);
  };

  const handleSave = async () => {
    if (!canSubmit || isSaving) return;

    setIsSaving(true);
    setFeedback(null);

    const isUpdateMode = Boolean(selectedId && editMode);

    const payload: CreatePermission = {
      code: normalizePermissionCode(form.code),
      name: form.name.trim().toUpperCase(),
      description: form.description.trim(),
    };

    try {
      const success =
        isUpdateMode && selectedId
          ? await update(selectedId, payload)
          : await create(payload);

      if (!success) {
        setFeedback({
          type: "error",
          message: isUpdateMode
            ? "Permission could not be updated."
            : "Permission could not be created.",
        });
        return;
      }

      toast({
        tone: "success",
        title: isUpdateMode ? "Permission updated" : "Permission created",
        message: isUpdateMode
          ? "Permission updated successfully."
          : "Permission created successfully.",
      });

      setSelectedId(null);
      setEditMode(false);
      setForm(emptyForm);

      await reload();
      window.setTimeout(() => firstFieldRef.current?.focus(), 80);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId || isSaving) return;

    setIsSaving(true);
    setFeedback(null);

    try {
      const success = await remove(selectedId);

      if (!success) {
        setFeedback({
          type: "error",
          message: "Permission could not be deleted.",
        });
        return;
      }

      toast({
        tone: "success",
        title: "Permission deleted",
        message: "Permission deleted successfully.",
      });

      setSelectedId(null);
      setEditMode(false);
      setForm(emptyForm);

      await reload();
      window.setTimeout(() => firstFieldRef.current?.focus(), 80);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrevPage = () => {
    setPage((current) => Math.max(0, current - 1));
  };

  const handleNextPage = () => {
    setPage((current) => Math.min(totalPages - 1, current + 1));
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-row overflow-hidden border border-border-default bg-bg-app">
      <section
        className="flex shrink-0 flex-col gap-4 border-r border-border-default bg-bg-secondary p-6"
        style={{ width: "52%" }}
      >
        <div className="relative shrink-0">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-disabled"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="SEARCH BY CODE, NAME OR DESCRIPTION..."
            className="h-12 w-full border border-border-default bg-bg-tertiary pl-11 pr-4 text-[13px] font-bold uppercase tracking-[0.12em] text-txt-primary outline-none placeholder:text-txt-disabled focus:border-accent"
          />
        </div>

        <div className="flex h-11 shrink-0 items-stretch gap-3">
          <div className="flex flex-1 items-center border border-border-default bg-bg-primary px-5">
            <span className="text-[14px] font-bold uppercase tracking-[0.18em] text-txt-primary">
              List
            </span>
          </div>

          <div className="flex items-center justify-center bg-accent px-6">
            <span className="text-[13px] font-black uppercase tracking-[0.12em] text-accent-fg">
              PG-{String(page + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[180px_190px_minmax(0,1fr)] gap-5 border-b border-border-default px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.16em] text-txt-secondary">
          <div>Code</div>
          <div>Name</div>
          <div>Description</div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto border border-border-default bg-bg-primary">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-[12px] font-bold uppercase tracking-[0.18em] text-txt-disabled">
              Loading permissions...
            </div>
          ) : pageItems.length === 0 ? (
            <div className="flex h-full items-center justify-center text-[12px] font-bold uppercase tracking-[0.18em] text-txt-disabled">
              No permissions found.
            </div>
          ) : (
            pageItems.map((permission) => {
              const isSelected = permission.id === selectedId;

              return (
                <button
                  key={permission.id}
                  type="button"
                  onClick={() => handleSelectPermission(permission)}
                  className={`grid w-full grid-cols-[180px_190px_minmax(0,1fr)] items-start gap-5 border-b border-border-subtle px-4 py-4 text-left transition-colors ${
                    isSelected
                      ? "border-l-2 border-l-accent bg-accent/10"
                      : "border-l-2 border-l-transparent hover:bg-bg-secondary"
                  }`}
                >
                  <div className="min-w-0 overflow-hidden text-[12px] font-bold uppercase tracking-[0.08em] text-accent">
                    <span className="block truncate">
                      {formatPermissionCode(permission.code)}
                    </span>
                  </div>

                  <div className="min-w-0 text-[12px] font-bold uppercase tracking-[0.08em] text-txt-primary">
                    <span className="block leading-relaxed">
                      {formatPermissionName(permission.name)}
                    </span>
                  </div>

                  <div className="min-w-0 whitespace-normal break-words text-[12px] font-medium leading-relaxed tracking-[0.05em] text-txt-secondary">
                    {permission.description}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="flex h-10 shrink-0 items-center border border-border-default bg-bg-primary px-5">
          <span className="text-[13px] font-bold uppercase tracking-[0.18em] text-txt-primary">
            Found: {String(filteredPermissions.length).padStart(4, "0")}
          </span>
        </div>

        <div className="grid h-12 shrink-0 grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={page === 0}
            className="border border-border-default bg-bg-tertiary text-[13px] font-bold uppercase tracking-[0.18em] text-txt-secondary transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
          >
            Prev
          </button>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
            className="border border-border-default bg-bg-tertiary text-[13px] font-bold uppercase tracking-[0.18em] text-txt-secondary transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </section>

      <section className="flex min-w-0 flex-1 flex-col bg-bg-secondary">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border-default px-8">
          <div className="flex items-center gap-3">
            <KeyRound size={16} className="text-accent" />

            <div>
              <h2 className="text-[18px] font-bold uppercase tracking-[0.18em] text-txt-primary">
                {selectedId ? "Permission Detail" : "New Permission"}
              </h2>

              <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.16em] text-txt-secondary">
                Permission registry / access control
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={!selectedId}
            onClick={() => setEditMode((current) => !current)}
            className={`flex h-10 items-center gap-2 border px-5 text-[12px] font-bold uppercase tracking-[0.15em] transition-colors ${
              selectedId
                ? editMode
                  ? "border-status-critical/50 bg-status-critical/10 text-status-critical hover:bg-status-critical hover:text-txt-primary"
                  : "border-border-default bg-bg-tertiary text-txt-secondary hover:border-accent hover:text-accent"
                : "cursor-not-allowed border-border-default bg-bg-tertiary text-txt-disabled opacity-40"
            }`}
          >
            <Pencil size={14} />
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-7">
          <div className="flex min-h-full flex-col">
            {(error || feedback) && (
              <div
                className={`mb-5 flex items-center gap-3 border px-5 py-4 text-[13px] font-bold uppercase tracking-[0.12em] ${
                  feedback?.type === "success"
                    ? "border-status-ok/40 bg-status-ok/10 text-status-ok"
                    : "border-status-critical/40 bg-status-critical/10 text-status-critical"
                }`}
              >
                {feedback?.type === "success" ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <AlertTriangle size={17} />
                )}

                {feedback?.message ?? error}
              </div>
            )}

            <div className="border border-border-default bg-bg-primary px-6 py-6">
              <div className="mb-6 flex items-center justify-between border-b border-border-default pb-4">
                <div>
                  <p className="text-[15px] font-bold uppercase tracking-[0.16em] text-txt-primary">
                    Permission Information
                  </p>

                  <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-txt-secondary">
                    Register permission code, name and description
                  </p>
                </div>

                <div className="border border-accent/50 bg-accent/10 px-5 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                    Mode
                  </p>

                  <p className="mt-1 text-[14px] font-bold uppercase tracking-[0.08em] text-txt-primary">
                    {selectedId
                      ? editMode
                        ? "Editing"
                        : "Viewing"
                      : "Creating"}
                  </p>
                </div>
              </div>

              <div className="space-y-6" data-enter-form>
                <FormField
                  id="permission-code"
                  label="Code"
                  value={form.code}
                  required
                  readOnly={!canEditForm}
                  inputRef={firstFieldRef}
                  onKeyDown={handleEnterToNextField}
                  placeholder="Example: USERS_MANAGE"
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      code: normalizePermissionCode(value),
                    }))
                  }
                />

                <FormField
                  id="permission-name"
                  label="Permission Name"
                  value={form.name}
                  required
                  readOnly={!canEditForm}
                  onKeyDown={handleEnterToNextField}
                  placeholder="Example: Manage Users"
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      name: value,
                    }))
                  }
                />

                <FormField
                  id="permission-description"
                  label="Description"
                  value={form.description}
                  required
                  readOnly={!canEditForm}
                  onKeyDown={handleEnterToNextField}
                  placeholder="Describe permission scope..."
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      description: value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-[1fr_160px] gap-4 border-t border-border-default bg-bg-primary px-8 py-5">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!canEditForm || !canSubmit || isSaving}
            className="flex h-12 items-center justify-center gap-2 border border-accent bg-accent text-[13px] font-bold uppercase tracking-[0.18em] text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Plus size={15} />
            {isSaving
              ? "Saving..."
              : selectedId && editMode
                ? "Update Permission"
                : "Create Permission"}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="h-12 border border-border-default bg-bg-tertiary text-[13px] font-bold uppercase tracking-[0.18em] text-txt-primary transition-colors hover:border-accent hover:text-accent"
          >
            Clear
          </button>

          {selectedId ? (
            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={isSaving}
              className="col-span-2 flex h-10 items-center justify-center gap-2 border border-status-critical/40 bg-status-critical/10 text-[12px] font-bold uppercase tracking-[0.16em] text-status-critical transition-colors hover:bg-status-critical hover:text-txt-primary disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Trash2 size={14} />
              Delete Permission
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void reload()}
              className="col-span-2 flex h-10 items-center justify-center gap-2 border border-border-default bg-transparent text-[12px] font-bold uppercase tracking-[0.16em] text-txt-secondary transition-colors hover:border-accent hover:text-accent"
            >
              <RotateCcw size={14} />
              Refresh List
            </button>
          )}
        </div>
      </section>
    </div>
  );
}