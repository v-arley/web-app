import {
  AlertTriangle,
  CheckCircle2,
  GitMerge,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import type { KeyboardEvent, Ref } from "react";

type RuleFormState = {
  name: string;
  description: string;
  condition: string;
  status: "A" | "I";
};

type RuleFeedback = {
  type: "success" | "error";
  message: string;
} | null;

type RuleFormPanelProps = {
  selectedId: number | null;
  editMode: boolean;
  form: RuleFormState;
  feedback: RuleFeedback;
  error: string | null;
  canEditForm: boolean;
  canSubmit: boolean;
  isSaving: boolean;
  firstFieldRef: Ref<HTMLInputElement>;
  onToggleEdit: () => void;
  onFormFieldChange: (field: keyof RuleFormState, value: string) => void;
  onEnterToNextField: (
    event: KeyboardEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onSave: () => void;
  onClear: () => void;
  onDelete: () => void;
  onReload: () => void;
};

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
  readOnly?: boolean;
  inputRef?: Ref<HTMLInputElement>;
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

function FormTextarea({
  id,
  label,
  value,
  placeholder,
  required,
  readOnly,
  rows = 4,
  onKeyDown,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  readOnly?: boolean;
  rows?: number;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-[13px] font-bold uppercase tracking-[0.16em] text-txt-primary">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </span>

      <textarea
        id={id}
        value={value}
        readOnly={readOnly}
        rows={rows}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full resize-none border border-border-default bg-bg-tertiary px-4 py-3 text-[13px] font-bold uppercase leading-relaxed tracking-[0.1em] text-txt-primary outline-none placeholder:text-txt-disabled/70 transition-colors focus:border-accent ${
          readOnly ? "cursor-not-allowed opacity-60" : ""
        }`}
      />
    </label>
  );
}

export function RuleFormPanel({
  selectedId,
  editMode,
  form,
  feedback,
  error,
  canEditForm,
  canSubmit,
  isSaving,
  firstFieldRef,
  onToggleEdit,
  onFormFieldChange,
  onEnterToNextField,
  onSave,
  onClear,
  onDelete,
  onReload,
}: RuleFormPanelProps) {
  return (
    <section className="flex min-w-0 flex-1 flex-col bg-bg-secondary">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border-default px-8">
        <div className="flex items-center gap-3">
          <GitMerge size={16} className="text-accent" />

          <div>
            <h2 className="text-[18px] font-bold uppercase tracking-[0.18em] text-txt-primary">
              {selectedId ? "Rule Detail" : "New Rule"}
            </h2>

            <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.16em] text-txt-secondary">
              Rule registry / camp control
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={!selectedId}
          onClick={onToggleEdit}
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
                  Rule Information
                </p>

                <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-txt-secondary">
                  Register rule name, description and condition
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
                id="rule-name"
                label="Rule Name"
                value={form.name}
                required
                readOnly={!canEditForm}
                inputRef={firstFieldRef}
                onKeyDown={onEnterToNextField}
                placeholder="Example: Daily Ration Required"
                onChange={(value) => onFormFieldChange("name", value)}
              />

              <FormTextarea
                id="rule-description"
                label="Description"
                value={form.description}
                required
                readOnly={!canEditForm}
                onKeyDown={onEnterToNextField}
                placeholder="Describe rule purpose..."
                rows={3}
                onChange={(value) => onFormFieldChange("description", value)}
              />

              <FormTextarea
                id="rule-condition"
                label="Condition"
                value={form.condition}
                required
                readOnly={!canEditForm}
                onKeyDown={onEnterToNextField}
                placeholder="Example: Every assigned person must receive daily ration"
                rows={4}
                onChange={(value) => onFormFieldChange("condition", value)}
              />

              {selectedId ? (
                <label className="block" htmlFor="rule-status">
                  <span className="mb-2 block text-[13px] font-bold uppercase tracking-[0.16em] text-txt-primary">
                    Status
                  </span>

                  <select
                    id="rule-status"
                    aria-label="Rule status"
                    value={form.status}
                    disabled={!canEditForm}
                    onKeyDown={onEnterToNextField}
                    onChange={(event) =>
                      onFormFieldChange(
                        "status",
                        event.target.value as "A" | "I",
                      )
                    }
                    className="h-12 w-full border border-border-default bg-bg-tertiary px-4 text-[13px] font-bold uppercase tracking-[0.12em] text-txt-primary outline-none transition-colors focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="A">Active</option>
                    <option value="I">Inactive</option>
                  </select>
                </label>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-[1fr_160px] gap-4 border-t border-border-default bg-bg-primary px-8 py-5">
        <button
          type="button"
          onClick={onSave}
          disabled={!canEditForm || !canSubmit || isSaving}
          className="flex h-12 items-center justify-center gap-2 border border-accent bg-accent text-[13px] font-bold uppercase tracking-[0.18em] text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Plus size={15} />
          {isSaving
            ? "Saving..."
            : selectedId && editMode
              ? "Update Rule"
              : "Create Rule"}
        </button>

        <button
          type="button"
          onClick={onClear}
          className="h-12 border border-border-default bg-bg-tertiary text-[13px] font-bold uppercase tracking-[0.18em] text-txt-primary transition-colors hover:border-accent hover:text-accent"
        >
          Clear
        </button>

        {selectedId ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={isSaving}
            className="col-span-2 flex h-10 items-center justify-center gap-2 border border-status-critical/40 bg-status-critical/10 text-[12px] font-bold uppercase tracking-[0.16em] text-status-critical transition-colors hover:bg-status-critical hover:text-txt-primary disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Trash2 size={14} />
            Delete Rule
          </button>
        ) : (
          <button
            type="button"
            onClick={onReload}
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