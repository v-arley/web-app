import { useState } from "react";
import { Plus, GitMerge, Trash2, Search } from "lucide-react";
import { useRules } from "../../hooks/useRule";
import type { CreateRule } from "../../models/Rule";
import { TextFieldFloat } from "../components/TextFielFloat";
import { getAuthContextFromToken } from "../../utils/authAccess";
import "../components/TextFielFloat.css";

const PAGE_SIZE = 7;

const STATUS_LABELS: Record<"A" | "I", { label: string; className: string }> = {
  A: { label: "ACTIVE", className: "text-status-ok" },
  I: { label: "INACTIVE", className: "text-status-inactive" },
};

type FormState = {
  name: string;
  description: string;
  condition: string;
  status: "A" | "I";
};

const emptyForm: FormState = {
  name: "",
  description: "",
  condition: "",
  status: "A",
};

export function RulesView() {
  const authContext = getAuthContextFromToken();
  const { data: rules, isLoading, error, create, remove } = useRules();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const selectedRule = rules.find((rule) => rule.id === selectedId) ?? null;

  const filtered = rules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(rule.id).includes(searchTerm),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleRowClick = (rule: (typeof rules)[0]) => {
    if (selectedId === rule.id) {
      setSelectedId(null);
      setEditMode(false);
      setForm(emptyForm);
      return;
    }

    setSelectedId(rule.id);
    setEditMode(false);
    setForm({
      name: rule.name,
      description: rule.description,
      condition: rule.condition,
      status: rule.status,
    });
  };

  const handleEditToggle = () => {
    if (editMode && selectedRule) {
      setForm({
        name: selectedRule.name,
        description: selectedRule.description,
        condition: selectedRule.condition,
        status: selectedRule.status,
      });
    }

    setEditMode((current) => !current);
  };

  const handleSave = async () => {
    if (!form.name || !form.description || !form.condition) return;

    if (authContext.campId == null) {
      console.error("No se pudo identificar el campamento del usuario.");
      return;
    }

    setIsSaving(true);

    try {
      if (!selectedId) {
        const payload: CreateRule = {
          camp_id: authContext.campId,
          name: form.name,
          description: form.description,
          condition: form.condition,
          status: "A",
        };

        const ok = await create(payload);

        if (ok) {
          setForm(emptyForm);
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    setIsSaving(true);

    try {
      const ok = await remove(selectedId);

      if (ok) {
        setSelectedId(null);
        setEditMode(false);
        setForm(emptyForm);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-row flex-1 min-h-0 w-full h-full overflow-hidden border border-border-default">
      {/* LEFT PANEL */}
      <div
        className="flex flex-col bg-[#FBFBFB] shrink-0 p-6 gap-2"
        style={{ width: "54%" }}
      >
        <div className="relative w-full shrink-0">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary"
            size={16}
          />
          <input
            type="text"
            placeholder="SEARCH BY ID OR RULE NAME..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPage(0);
            }}
            className="w-full bg-bg-tertiary pl-9 pr-4 py-2 font-mono text-sm font-bold tracking-wide uppercase text-txt-primary border border-border-default rounded-none outline-none focus:border-border-accent transition-colors placeholder:text-txt-disabled"
          />
        </div>

        <div className="flex items-stretch h-8 gap-2 shrink-0">
          <div className="flex-1 bg-bg-secondary border border-border-default flex items-center px-4">
            <span className="text-txt-primary font-bold font-mono text-sm tracking-wide uppercase">
              LIST
            </span>
          </div>
          <div className="bg-[#E85D04] px-4 flex items-center justify-center">
            <span className="text-accent-fg font-mono text-sm font-bold tracking-wide">
              PG&#8209;{String(page + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[0.5fr_1.5fr_2fr_0.8fr] px-1 py-1 border-b border-border-default shrink-0">
          {["ID", "RULE NAME", "CONDITION", "STATUS"].map((header) => (
            <div
              key={header}
              className="text-xs font-mono font-bold tracking-label text-txt-secondary uppercase text-center"
            >
              {header}
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-border-default border-t-accent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && error && (
          <div className="flex-1 flex items-center justify-center">
            <span className="font-mono text-xs text-status-critical tracking-label uppercase">
              {error}
            </span>
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex-1 overflow-y-auto">
            {pageItems.map((rule) => {
              const isSelected = selectedId === rule.id;
              const statusInfo = STATUS_LABELS[rule.status];

              return (
                <div
                  key={rule.id}
                  onClick={() => handleRowClick(rule)}
                  className={`grid grid-cols-[0.5fr_1.5fr_2fr_0.8fr] px-1 py-1.5 cursor-pointer select-none text-center border-b border-border-subtle transition-colors ${
                    isSelected
                      ? "bg-bg-selected border-l-2 border-l-accent"
                      : "hover:bg-bg-tertiary border-l-2 border-l-transparent"
                  }`}
                >
                  <div className="font-mono text-xs font-bold text-accent flex items-center justify-center">
                    {String(rule.id).padStart(3, "0")}
                  </div>
                  <div className="font-mono text-xs text-txt-primary uppercase flex items-center justify-center truncate px-1">
                    {rule.name}
                  </div>
                  <div className="font-mono text-xs text-status-info flex items-center justify-center truncate px-1">
                    {rule.condition}
                  </div>
                  <div className="flex items-center justify-center">
                    <span
                      className={`font-mono text-xs font-bold uppercase ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              );
            })}

            {pageItems.length === 0 && (
              <div className="py-10 text-center font-mono text-xs text-txt-disabled uppercase tracking-label">
                No rules found.
              </div>
            )}
          </div>
        )}

        <div className="bg-bg-secondary border-t border-border-default px-4 py-1.5 shrink-0">
          <span className="font-mono text-xs text-txt-secondary tracking-wide uppercase">
            FOUND: {String(filtered.length).padStart(4, "0")}
          </span>
        </div>

        <div className="flex gap-2 h-10 shrink-0">
          <button
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={page === 0}
            className="flex-1 bg-bg-tertiary border border-border-default text-txt-primary font-mono font-bold text-sm tracking-wide uppercase hover:bg-bg-selected hover:border-accent transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-default rounded-none"
          >
            PREV
          </button>

          <button
            onClick={() =>
              setPage((current) => Math.min(totalPages - 1, current + 1))
            }
            disabled={page >= totalPages - 1}
            className="flex-1 bg-accent text-accent-fg font-mono font-bold text-sm tracking-wide uppercase hover:bg-accent-hover transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-default rounded-none"
          >
            NEXT
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col flex-1 bg-bg-secondary border-l border-border-default relative min-h-0">
        <div className="flex items-center justify-between px-6 py-3 border-b border-border-default shrink-0">
          <div className="flex items-center gap-2">
            <GitMerge size={14} className="text-accent" />
            <span className="font-mono text-xs font-bold text-txt-secondary uppercase tracking-label">
              {selectedId ? "Rule Details" : "New Rule"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedId && (
              <button
                onClick={() => {
                  void handleDelete();
                }}
                disabled={isSaving}
                className="p-1.5 text-txt-secondary hover:text-status-critical border border-border-subtle hover:border-status-critical rounded-none transition-colors cursor-pointer disabled:opacity-30"
                title="Delete Rule"
              >
                <Trash2 size={14} />
              </button>
            )}

            {selectedId && (
              <button
                onClick={handleEditToggle}
                className={`px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-label rounded-none transition-colors cursor-pointer ${
                  editMode
                    ? "bg-bg-tertiary text-txt-primary border border-border-default"
                    : "bg-accent text-accent-fg hover:bg-accent-hover"
                }`}
              >
                {editMode ? "Cancel" : "Edit"}
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 px-8 pt-8 pb-4 flex flex-col gap-3 overflow-y-auto">
          {selectedId && (
            <TextFieldFloat
              label="ID"
              value={String(selectedId).padStart(3, "0")}
              readOnly
            />
          )}

          <TextFieldFloat
            label="RULE NAME"
            value={form.name}
            readOnly={!!selectedId && !editMode}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
          />

          <TextFieldFloat
            label="DESCRIPTION"
            value={form.description}
            readOnly={!!selectedId && !editMode}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
          />

          <TextFieldFloat
            label="CONDITION"
            value={form.condition}
            readOnly={!!selectedId && !editMode}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                condition: event.target.value,
              }))
            }
          />
        </div>

        <div className="px-8 py-6 shrink-0 flex flex-col gap-2">
          {!selectedId && (
            <button
              onClick={() => {
                void handleSave();
              }}
              disabled={
                isSaving || !form.name || !form.description || !form.condition
              }
              className="w-full bg-accent text-accent-fg font-mono font-bold text-sm uppercase tracking-label py-2.5 hover:bg-accent-hover transition-colors rounded-none disabled:opacity-30 disabled:cursor-default cursor-pointer"
            >
              <Plus size={14} className="inline mr-2" />
              {isSaving ? "Saving..." : "Create Rule"}
            </button>
          )}

          <button
            onClick={() => {
              setSelectedId(null);
              setEditMode(false);
              setForm(emptyForm);
            }}
            className="w-full bg-transparent text-txt-secondary font-mono text-xs uppercase tracking-label py-2 border border-border-default hover:border-border-strong hover:text-txt-primary transition-colors rounded-none cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}