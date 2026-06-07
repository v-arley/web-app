import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { Key, Plus, RotateCcw, Search, Shield, Trash2 } from "lucide-react";

import { ModalPerms } from "./ModalPerms";
import { useToast } from "../hooks/useToast";
import {
  ACTION_COLOR,
  PERMS_LIST,
  useRolesView,
} from "../hooks/useRolesView";

function sanitizeRoleName(value: string) {
  return value
    .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^\s+/g, "")
    .toUpperCase();
}

function FieldLabel({
  children,
  htmlFor,
  required = false,
}: {
  children: ReactNode;
  htmlFor: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[13px] font-bold uppercase tracking-[0.14em] text-txt-primary"
    >
      {children}
      {required ? <span className="ml-1 text-status-critical">*</span> : null}
    </label>
  );
}

function FormField({
  id,
  label,
  value,
  readOnly,
  required = false,
  placeholder,
  inputRef,
  onKeyDown,
  onChange,
}: {
  id: string;
  label: string;
  value: string | number;
  readOnly?: boolean;
  required?: boolean;
  placeholder?: string;
  inputRef?: Ref<HTMLInputElement>;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>

      <input
        ref={inputRef}
        id={id}
        aria-label={label}
        title={label}
        type="text"
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        onChange={(event) => onChange?.(event.target.value)}
        className={[
          "h-12 w-full border border-border-default bg-bg-tertiary px-4",
          "text-[15px] font-bold tracking-[0.05em] text-txt-primary",
          "outline-none transition-all placeholder:text-txt-disabled",
          "focus:border-accent focus:shadow-[0_0_0_2px_rgba(232,93,4,0.22)]",
          readOnly ? "cursor-default opacity-70" : "",
        ].join(" ")}
      />
    </div>
  );
}

export function RolesView() {
  const { toast } = useToast();
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const {
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
    loading,
    error,

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
  } = useRolesView();

  const canEditForm = !selectedId || editMode;
  const canSave = (!selectedId || editMode) && form.name.trim().length > 0;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 80);

    return () => window.clearTimeout(timeout);
  }, []);

  const handleEnterToNextField = (
    event: KeyboardEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    if (event.key !== "Enter") return;

    event.preventDefault();

    const formContainer = event.currentTarget.closest("[data-enter-form]");

    if (!formContainer) return;

    const fields = Array.from(
      formContainer.querySelectorAll<
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
        | HTMLButtonElement
      >(
        "input:not([disabled]):not([readonly]), textarea:not([disabled]):not([readonly]), select:not([disabled]), button:not([disabled])",
      ),
    ).filter((field) => field.offsetParent !== null);

    const currentIndex = fields.indexOf(event.currentTarget);

    if (currentIndex < 0) return;

    fields[currentIndex + 1]?.focus();
  };

  const handleSaveWithToast = async () => {
    const result = await handleSave();

    if (!result) return;

    toast({
      tone: "success",
      title: result === "updated" ? "Role updated" : "Role created",
      message:
        result === "updated"
          ? "Role updated successfully."
          : "Role created successfully.",
    });

    window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 80);
  };

  const handleDeleteWithToast = async () => {
    const deleted = await handleDelete();

    if (!deleted) return;

    toast({
      tone: "success",
      title: "Role deleted",
      message: "Role deleted successfully.",
    });

    window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 80);
  };

  const handleClearAndFocus = () => {
    handleClear();

    window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 80);
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-1 overflow-hidden border border-border-default bg-bg-app font-mono">
      <section className="flex w-[54%] shrink-0 flex-col border-r border-border-default bg-bg-secondary p-5">
        <div className="relative shrink-0">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-secondary"
            size={18}
          />

          <input
            type="text"
            aria-label="Search roles"
            title="Search roles"
            placeholder="Search by ID or role name..."
            value={searchTerm}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="h-12 w-full border border-border-default bg-bg-tertiary pl-12 pr-4 text-[15px] font-bold uppercase tracking-[0.06em] text-txt-primary outline-none transition-colors placeholder:text-txt-disabled focus:border-accent"
          />
        </div>

        <div className="mt-4 flex h-11 shrink-0 items-stretch gap-3">
          <div className="flex flex-1 items-center border border-border-default bg-bg-primary px-4">
            <span className="text-[15px] font-bold uppercase tracking-[0.16em] text-txt-primary">
              List
            </span>
          </div>

          <div className="flex items-center justify-center bg-accent px-5">
            <span className="text-[14px] font-bold uppercase tracking-[0.12em] text-accent-fg">
              PG-{String(page + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-hidden border border-border-default bg-bg-primary">
          <div className="grid grid-cols-[0.8fr_1.7fr_2.6fr] border-b border-border-default bg-bg-secondary px-4 py-3">
            {["ID", "Role Name", "Description"].map((header) => (
              <div
                key={header}
                className="text-center text-[12px] font-bold uppercase tracking-[0.14em] text-txt-secondary"
              >
                {header}
              </div>
            ))}
          </div>

          <div className="h-full overflow-y-auto pb-10">
            {loading ? (
              <div className="flex h-full min-h-[240px] items-center justify-center text-[14px] font-bold uppercase tracking-[0.15em] text-txt-disabled">
                Loading roles...
              </div>
            ) : pageItems.length === 0 ? (
              <div className="flex h-full min-h-[240px] items-center justify-center text-[14px] font-bold uppercase tracking-[0.15em] text-txt-disabled">
                No roles found.
              </div>
            ) : (
              pageItems.map((role) => {
                const isSelected = selectedId === role.id;

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRowClick(role)}
                    className={[
                      "grid w-full grid-cols-[0.8fr_1.7fr_2.6fr] border-b border-border-default px-4 py-4 text-left transition-colors",
                      isSelected
                        ? "border-l-2 border-l-accent bg-bg-tertiary"
                        : "border-l-2 border-l-transparent hover:bg-bg-tertiary/70",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-center text-[14px] font-bold tracking-[0.08em] text-accent">
                      R-{String(role.id).padStart(3, "0")}
                    </div>

                    <div className="flex items-center justify-center px-2 text-[14px] font-bold uppercase tracking-[0.07em] text-txt-primary">
                      {role.name}
                    </div>

                    <div className="flex items-center justify-center truncate px-2 text-[13px] font-bold tracking-[0.04em] text-txt-secondary">
                      {role.description}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-4 flex h-10 shrink-0 items-center border border-border-default bg-bg-primary px-4">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-txt-secondary">
            Found: {String(filtered.length).padStart(4, "0")}
          </span>
        </div>

        <div className="mt-3 flex h-11 shrink-0 gap-3">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={page === 0}
            className="flex-1 border border-border-default bg-bg-secondary text-[14px] font-bold uppercase tracking-[0.13em] text-txt-primary transition-colors hover:border-accent hover:bg-bg-tertiary hover:text-accent disabled:cursor-default disabled:opacity-40"
          >
            Prev
          </button>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
            className="flex-1 border border-accent bg-accent text-[14px] font-bold uppercase tracking-[0.13em] text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-default disabled:border-border-default disabled:bg-bg-tertiary disabled:text-txt-disabled disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </section>

      <section className="flex min-h-0 flex-1 flex-col bg-bg-secondary">
        <div className="flex shrink-0 items-center justify-between border-b border-border-default px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-accent" />

            <div>
              <p className="text-[18px] font-bold uppercase tracking-[0.18em] text-txt-primary">
                {selectedId ? "Role Details" : "New Role"}
              </p>

              <p className="mt-1 text-[12px] uppercase tracking-[0.16em] text-txt-secondary">
                Role registry / permissions control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedId ? (
              <button
                type="button"
                onClick={handleOpenPermissionsModal}
                className="flex h-10 items-center justify-center gap-2 border border-border-default bg-bg-primary px-4 text-[12px] font-bold uppercase tracking-[0.13em] text-txt-primary transition-colors hover:border-accent hover:bg-bg-tertiary hover:text-accent"
                title="Manage permissions"
              >
                <Key size={15} />
                Permissions
              </button>
            ) : null}

            <button
              type="button"
              onClick={selectedId ? handleEditToggle : undefined}
              disabled={!selectedId}
              className={[
                "h-10 border px-5 text-[12px] font-bold uppercase tracking-[0.13em] transition-colors",
                editMode
                  ? "border-border-default bg-bg-primary text-txt-primary hover:border-accent hover:bg-bg-tertiary hover:text-accent"
                  : "border-accent bg-accent text-accent-fg hover:bg-accent-hover",
                "disabled:cursor-default disabled:border-border-default disabled:bg-bg-tertiary disabled:text-txt-disabled disabled:opacity-40",
              ].join(" ")}
            >
              {editMode ? "Cancel" : "Edit"}
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-7">
          <div className="flex min-h-full flex-col">
            {error ? (
              <div className="mb-5 border border-status-critical/40 bg-status-critical/10 px-5 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-status-critical">
                {error}
              </div>
            ) : null}

            <div className="border border-border-default bg-bg-primary px-6 py-6">
              <div className="mb-6 flex items-center justify-between border-b border-border-default pb-4">
                <div>
                  <p className="text-[15px] font-bold uppercase tracking-[0.16em] text-txt-primary">
                    Role Information
                  </p>

                  <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-txt-secondary">
                    Register role name and description
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
                  id="role-name"
                  label="Role Name"
                  value={form.name}
                  required
                  readOnly={!canEditForm}
                  inputRef={firstFieldRef}
                  onKeyDown={handleEnterToNextField}
                  placeholder="Example: LOGISTICS OFFICER"
                  onChange={(value) =>
                    handleFormFieldChange("name", sanitizeRoleName(value))
                  }
                />

                <FormField
                  id="role-description"
                  label="Description"
                  value={form.description}
                  readOnly={!canEditForm}
                  onKeyDown={handleEnterToNextField}
                  placeholder="Describe role responsibilities..."
                  onChange={(value) =>
                    handleFormFieldChange("description", value)
                  }
                />
              </div>
            </div>

            {selectedRole ? (
              <div className="mt-5 border border-border-default bg-bg-primary">
                <div className="flex items-center gap-3 border-b border-border-default px-5 py-4">
                  <Key size={16} className="text-accent" />

                  <span className="text-[14px] font-bold uppercase tracking-[0.15em] text-txt-primary">
                    Assigned Permissions
                  </span>

                  <span className="ml-auto text-[12px] font-bold uppercase tracking-[0.12em] text-txt-disabled">
                    {rolePermissions.length} / {PERMS_LIST.length}
                  </span>
                </div>

                {rolePermissions.length === 0 ? (
                  <div className="px-5 py-6 text-[13px] font-bold uppercase tracking-[0.13em] text-txt-disabled">
                    No permissions assigned to this role.
                  </div>
                ) : (
                  <div className="max-h-[260px] divide-y divide-border-default overflow-y-auto">
                    {rolePermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-bg-secondary"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-bold uppercase tracking-[0.08em] text-txt-primary">
                            {permission.resource}
                          </p>

                          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-txt-disabled">
                            Permission ID: {permission.id}
                          </p>
                        </div>

                        <span
                          className={[
                            "shrink-0 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]",
                            ACTION_COLOR[permission.action] ??
                              "bg-bg-tertiary text-txt-secondary",
                          ].join(" ")}
                        >
                          {permission.action}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            <div className="flex-1" />
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-[1fr_180px] gap-4 border-t border-border-default bg-bg-primary px-8 py-5">
          <button
            type="button"
            onClick={() => void handleSaveWithToast()}
            disabled={!canSave || loading}
            className="flex h-12 items-center justify-center gap-2 border border-accent bg-accent text-[14px] font-bold uppercase tracking-[0.13em] text-accent-fg shadow-[0_0_12px_rgba(232,93,4,0.18)] transition-colors hover:bg-accent-hover disabled:cursor-default disabled:border-border-default disabled:bg-bg-tertiary disabled:text-txt-disabled disabled:opacity-45 disabled:shadow-none"
          >
            <Plus size={16} />
            {selectedId ? "Save Changes" : "Create Role"}
          </button>

          <button
            type="button"
            onClick={handleClearAndFocus}
            className="flex h-12 items-center justify-center border border-border-strong bg-bg-secondary text-[14px] font-bold uppercase tracking-[0.13em] text-txt-primary transition-colors hover:border-accent hover:bg-bg-tertiary hover:text-accent"
          >
            Clear
          </button>

          {selectedId ? (
            <button
              type="button"
              onClick={() => void handleDeleteWithToast()}
              className="col-span-2 flex h-10 items-center justify-center gap-2 border border-status-critical/40 bg-status-critical/10 text-[12px] font-bold uppercase tracking-[0.16em] text-status-critical transition-colors hover:bg-status-critical hover:text-white"
            >
              <Trash2 size={14} />
              Delete Role
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClearAndFocus}
              className="col-span-2 flex h-10 items-center justify-center gap-2 border border-border-default bg-transparent text-[12px] font-bold uppercase tracking-[0.16em] text-txt-secondary transition-colors hover:border-accent hover:text-accent"
            >
              <RotateCcw size={14} />
              Refresh List
            </button>
          )}
        </div>
      </section>

      <ModalPerms
        isOpen={isModalOpen}
        onClose={handleClosePermissionsModal}
        roleName={modalRole}
      />
    </div>
  );
}