import {
  Key,
  Plus,
  RotateCcw,
  Shield,
  Trash2,
} from "lucide-react";
import type {
  KeyboardEvent,
  ReactNode,
  Ref,
} from "react";
import type { Role } from "../../../models/Role";
import {
  ACTION_COLOR,
  PERMS_LIST,
  type Permission,
} from "../../hooks/useRolesView";

type RoleFormState = {
  name: string;
  description: string;
};

type RoleFormPanelProps = {
  selectedId: number | null;
  editMode: boolean;
  form: RoleFormState;
  selectedRole: Role | null;
  rolePermissions: Permission[];
  error: string | null;
  canEditForm: boolean;
  canSave: boolean;
  loading: boolean;
  firstFieldRef: Ref<HTMLInputElement>;
  onEditToggle: () => void;
  onOpenPermissionsModal: () => void;
  onFormFieldChange: (field: keyof RoleFormState, value: string) => void;
  onEnterToNextField: (
    event: KeyboardEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onSave: () => void;
  onClear: () => void;
  onDelete: () => void;
};

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

export function RoleFormPanel({
  selectedId,
  editMode,
  form,
  selectedRole,
  rolePermissions,
  error,
  canEditForm,
  canSave,
  loading,
  firstFieldRef,
  onEditToggle,
  onOpenPermissionsModal,
  onFormFieldChange,
  onEnterToNextField,
  onSave,
  onClear,
  onDelete,
}: RoleFormPanelProps) {
  return (
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
              onClick={onOpenPermissionsModal}
              className="flex h-10 items-center justify-center gap-2 border border-border-default bg-bg-primary px-4 text-[12px] font-bold uppercase tracking-[0.13em] text-txt-primary transition-colors hover:border-accent hover:bg-bg-tertiary hover:text-accent"
              title="Manage permissions"
            >
              <Key size={15} />
              Permissions
            </button>
          ) : null}

          <button
            type="button"
            onClick={selectedId ? onEditToggle : undefined}
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
                  {selectedId ? (editMode ? "Editing" : "Viewing") : "Creating"}
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
                onKeyDown={onEnterToNextField}
                placeholder="Example: LOGISTICS OFFICER"
                onChange={(value) =>
                  onFormFieldChange("name", sanitizeRoleName(value))
                }
              />

              <FormField
                id="role-description"
                label="Description"
                value={form.description}
                readOnly={!canEditForm}
                onKeyDown={onEnterToNextField}
                placeholder="Describe role responsibilities..."
                onChange={(value) => onFormFieldChange("description", value)}
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
          onClick={onSave}
          disabled={!canSave || loading}
          className="flex h-12 items-center justify-center gap-2 border border-accent bg-accent text-[14px] font-bold uppercase tracking-[0.13em] text-accent-fg shadow-[0_0_12px_rgba(232,93,4,0.18)] transition-colors hover:bg-accent-hover disabled:cursor-default disabled:border-border-default disabled:bg-bg-tertiary disabled:text-txt-disabled disabled:opacity-45 disabled:shadow-none"
        >
          <Plus size={16} />
          {selectedId ? "Save Changes" : "Create Role"}
        </button>

        <button
          type="button"
          onClick={onClear}
          className="flex h-12 items-center justify-center border border-border-strong bg-bg-secondary text-[14px] font-bold uppercase tracking-[0.13em] text-txt-primary transition-colors hover:border-accent hover:bg-bg-tertiary hover:text-accent"
        >
          Clear
        </button>

        {selectedId ? (
          <button
            type="button"
            onClick={onDelete}
            className="col-span-2 flex h-10 items-center justify-center gap-2 border border-status-critical/40 bg-status-critical/10 text-[12px] font-bold uppercase tracking-[0.16em] text-status-critical transition-colors hover:bg-status-critical hover:text-white"
          >
            <Trash2 size={14} />
            Delete Role
          </button>
        ) : (
          <button
            type="button"
            onClick={onClear}
            className="col-span-2 flex h-10 items-center justify-center gap-2 border border-border-default bg-transparent text-[12px] font-bold uppercase tracking-[0.16em] text-txt-secondary transition-colors hover:border-accent hover:text-accent"
          >
            <RotateCcw size={14} />
            Refresh List
          </button>
        )}
      </div>
    </section>
  );
}