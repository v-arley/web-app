import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type Ref,} from "react";
import { AlertTriangle, CheckCircle2, GitMerge, Pencil, Plus, RotateCcw, Search, Trash2,} from "lucide-react";

import { useRules } from "../hooks/useRule";
import { useToast } from "../hooks/useToast";
import { getAuthContextFromToken } from "../utils/authAccess";
import { RuleService } from "../../services/RuleService";
import type { CreateRule, Rule, UpdateRule } from "../../models/Rule";

const PAGE_SIZE = 7;
const ruleService = new RuleService();

type RuleFormState = {
  name: string;
  description: string;
  condition: string;
  status: "A" | "I";
};

const emptyForm: RuleFormState = {
  name: "",
  description: "",
  condition: "",
  status: "A",
};

function formatRuleName(value?: string) {
  const raw = value?.trim();

  if (!raw) return "";

  return raw
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeRuleName(value: string) {
  return value.trim().toUpperCase();
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

export function RulesView() {
  const { toast } = useToast();
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const authContext = getAuthContextFromToken();
  const { data: rules, isLoading, error, create, remove, reload } = useRules();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [form, setForm] = useState<RuleFormState>(emptyForm);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredRules = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return rules;

    return rules.filter((rule) =>
      [rule.name, rule.description, rule.condition, rule.status]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [rules, searchTerm]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredRules.length / PAGE_SIZE));
  }, [filteredRules.length]);

  const pageItems = useMemo(() => {
    return filteredRules.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  }, [filteredRules, page]);

  const canEditForm = !selectedId || editMode;

  const canSubmit =
    form.name.trim().length > 0 &&
    form.description.trim().length > 0 &&
    form.condition.trim().length > 0;

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

  const handleSelectRule = (rule: Rule) => {
    setSelectedId(rule.id);
    setEditMode(false);
    setFeedback(null);

    setForm({
      name: formatRuleName(rule.name),
      description: rule.description ?? "",
      condition: rule.condition ?? "",
      status: rule.status === "I" ? "I" : "A",
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

    if (authContext.campId == null) {
      setFeedback({
        type: "error",
        message: "No se pudo identificar el campamento del usuario.",
      });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const isUpdateMode = Boolean(selectedId && editMode);

    try {
      if (isUpdateMode && selectedId) {
        const payload: UpdateRule = {
          name: normalizeRuleName(form.name),
          description: form.description.trim(),
          condition: form.condition.trim(),
          status: form.status,
          camp_id: authContext.campId,
        };

        const response = await ruleService.update(selectedId, payload);

        if (!response.getEstado()) {
          setFeedback({
            type: "error",
            message: response.getMensaje() || "Rule could not be updated.",
          });
          return;
        }

        toast({
          tone: "success",
          title: "Rule updated",
          message: "Rule updated successfully.",
        });
      } else {
        const payload: CreateRule = {
          camp_id: authContext.campId,
          name: normalizeRuleName(form.name),
          description: form.description.trim(),
          condition: form.condition.trim(),
          status: "A",
        };

        const success = await create(payload);

        if (!success) {
          setFeedback({
            type: "error",
            message: "Rule could not be created.",
          });
          return;
        }

        toast({
          tone: "success",
          title: "Rule created",
          message: "Rule created successfully.",
        });
      }

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
          message: "Rule could not be deleted.",
        });
        return;
      }

      toast({
        tone: "success",
        title: "Rule deleted",
        message: "Rule deleted successfully.",
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
            placeholder="SEARCH BY RULE NAME, CONDITION OR DESCRIPTION..."
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

        <div className="grid grid-cols-[190px_minmax(0,1fr)_90px] gap-5 border-b border-border-default px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.16em] text-txt-secondary">
          <div>Rule Name</div>
          <div>Condition</div>
          <div>Status</div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto border border-border-default bg-bg-primary">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-[12px] font-bold uppercase tracking-[0.18em] text-txt-disabled">
              Loading rules...
            </div>
          ) : pageItems.length === 0 ? (
            <div className="flex h-full items-center justify-center text-[12px] font-bold uppercase tracking-[0.18em] text-txt-disabled">
              No rules found.
            </div>
          ) : (
            pageItems.map((rule) => {
              const isSelected = rule.id === selectedId;
              const isActive = rule.status !== "I";

              return (
                <button
                  key={rule.id}
                  type="button"
                  onClick={() => handleSelectRule(rule)}
                  className={`grid w-full grid-cols-[190px_minmax(0,1fr)_90px] items-start gap-5 border-b border-border-subtle px-4 py-4 text-left transition-colors ${
                    isSelected
                      ? "border-l-2 border-l-accent bg-accent/10"
                      : "border-l-2 border-l-transparent hover:bg-bg-secondary"
                  }`}
                >
                  <div className="min-w-0 text-[12px] font-bold uppercase tracking-[0.08em] text-accent">
                    <span className="block leading-relaxed">
                      {formatRuleName(rule.name)}
                    </span>
                  </div>

                  <div className="min-w-0 whitespace-normal break-words text-[12px] font-medium leading-relaxed tracking-[0.05em] text-txt-secondary">
                    {rule.condition}
                  </div>

                  <div
                    className={`text-[12px] font-bold uppercase tracking-[0.08em] ${
                      isActive ? "text-status-ok" : "text-status-inactive"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="flex h-10 shrink-0 items-center border border-border-default bg-bg-primary px-5">
          <span className="text-[13px] font-bold uppercase tracking-[0.18em] text-txt-primary">
            Found: {String(filteredRules.length).padStart(4, "0")}
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
                  id="rule-name"
                  label="Rule Name"
                  value={form.name}
                  required
                  readOnly={!canEditForm}
                  inputRef={firstFieldRef}
                  onKeyDown={handleEnterToNextField}
                  placeholder="Example: Daily Ration Required"
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      name: value,
                    }))
                  }
                />

                <FormTextarea
                  id="rule-description"
                  label="Description"
                  value={form.description}
                  required
                  readOnly={!canEditForm}
                  onKeyDown={handleEnterToNextField}
                  placeholder="Describe rule purpose..."
                  rows={3}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      description: value,
                    }))
                  }
                />

                <FormTextarea
                  id="rule-condition"
                  label="Condition"
                  value={form.condition}
                  required
                  readOnly={!canEditForm}
                  onKeyDown={handleEnterToNextField}
                  placeholder="Example: Every assigned person must receive daily ration"
                  rows={4}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      condition: value,
                    }))
                  }
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
                      onKeyDown={handleEnterToNextField}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          status: event.target.value as "A" | "I",
                        }))
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
            onClick={() => void handleSave()}
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
              Delete Rule
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