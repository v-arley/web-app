import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { useRules } from "../hooks/useRule";
import { useToast } from "../hooks/useToast";
import { getAuthContextFromToken } from "../utils/authAccess";
import { RuleService } from "../../services/RuleService";
import type { CreateRule, Rule, UpdateRule } from "../../models/Rule";
import { RulesListPanel } from "../components/RulesComponents/RulesListPanel";
import { RuleFormPanel } from "../components/RulesComponents/RuleFormPanel";

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

  const handleFormFieldChange = (field: keyof RuleFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
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
      <RulesListPanel
        searchTerm={searchTerm}
        page={page}
        selectedId={selectedId}
        filteredCount={filteredRules.length}
        totalPages={totalPages}
        pageItems={pageItems}
        isLoading={isLoading}
        onSearchChange={handleSearchChange}
        onSelectRule={handleSelectRule}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />

      <RuleFormPanel
        selectedId={selectedId}
        editMode={editMode}
        form={form}
        feedback={feedback}
        error={error}
        canEditForm={canEditForm}
        canSubmit={canSubmit}
        isSaving={isSaving}
        firstFieldRef={firstFieldRef}
        onToggleEdit={() => setEditMode((current) => !current)}
        onFormFieldChange={handleFormFieldChange}
        onEnterToNextField={handleEnterToNextField}
        onSave={() => void handleSave()}
        onClear={handleClear}
        onDelete={() => void handleDelete()}
        onReload={() => void reload()}
      />
    </div>
  );
}