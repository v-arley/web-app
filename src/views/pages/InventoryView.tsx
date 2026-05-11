import { Trash2, Search } from "lucide-react";
import { TextFieldFloat } from "../components/TextFielFloat";
import { ComboboxFloat } from "../../components/ui/combobox";
import {
  RESOURCE_CATEGORIES,
  STATUS_LABELS,
  UNITS_OF_MEASURE,
  useInventoryView,
} from "../../hooks/useInventoryView";

import "../components/TextFielFloat.css";

export function InventoryView() {
  const {
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
  } = useInventoryView();

  return (
    <div className="flex flex-row flex-1 min-h-0 w-full h-full overflow-hidden p-0 border border-border-default">
      <div
        className="flex flex-col bg-[#FBFBFB] shrink-0 p-8 gap-2"
        style={{ width: "52%" }}
      >
        <div className="relative w-full shrink-0">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary"
            size={16}
          />
          <input
            type="text"
            placeholder="SEARCH BY ID, CODE OR NAME..."
            value={searchTerm}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="w-full bg-bg-tertiary pl-9 pr-4 py-2 font-mono text-sm font-bold tracking-wide uppercase text-txt-primary border border-border-default rounded-none outline-none focus:border-border-accent transition-colors duration-base placeholder:text-txt-disabled"
          />
        </div>

        <div className="flex items-stretch h-8 gap-2">
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

        <div className="grid grid-cols-[0.5fr_1fr_2fr_1.2fr_0.8fr] px-1 py-1 border-b border-border-default">
          {["ID", "CODE", "NAME", "CATEGORY", "STATUS"].map((header) => (
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
            {pageItems.map((item) => {
              const isSelected = selectedId === item.id;
              const statusInfo = item.status
                ? STATUS_LABELS[item.status]
                : null;

              return (
                <div
                  key={item.id}
                  onClick={() => handleRowClick(item)}
                  className={`grid grid-cols-[0.5fr_1fr_2fr_1.2fr_0.8fr] px-1 py-1.5 cursor-pointer select-none text-center border-b border-border-subtle transition-colors duration-fast
                    ${
                      isSelected
                        ? "bg-bg-selected border-l-2 border-l-accent"
                        : "hover:bg-bg-tertiary border-l-2 border-l-transparent"
                    }`}
                >
                  <div className="font-mono text-xs text-txt-secondary flex items-center justify-center">
                    {item.id}
                  </div>
                  <div className="font-mono text-xs text-txt-secondary flex items-center justify-center">
                    {item.code}
                  </div>
                  <div className="font-mono text-xs text-txt-secondary uppercase flex items-center justify-center">
                    {item.name}
                  </div>
                  <div className="font-mono text-xs text-txt-secondary flex items-center justify-center">
                    {item.category}
                  </div>
                  <div className="flex items-center justify-center">
                    {statusInfo ? (
                      <span
                        className={`font-mono text-xs font-bold uppercase tracking-ui ${statusInfo.className}`}
                      >
                        {statusInfo.label}
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-txt-disabled">
                        —
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-bg-secondary border-t border-border-default px-4 py-1.5">
          <span className="font-mono text-xs text-txt-secondary tracking-wide uppercase">
            FOUND: {String(filteredResources.length).padStart(4, "0")}
          </span>
        </div>

        <div className="flex gap-2 h-10">
          <button
            onClick={handlePrevPage}
            disabled={page === 0}
            className="flex-1 bg-bg-tertiary border border-border-default text-txt-primary font-mono font-bold text-sm tracking-wide uppercase hover:bg-bg-selected hover:border-accent transition-colors duration-base disabled:opacity-40 cursor-pointer disabled:cursor-default rounded-none"
          >
            PREV
          </button>

          <button
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
            className="flex-1 bg-accent text-accent-fg font-mono font-bold text-sm tracking-wide uppercase hover:bg-accent-hover transition-colors duration-base disabled:opacity-40 cursor-pointer disabled:cursor-default rounded-none"
          >
            NEXT
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 bg-bg-secondary relative min-h-0 border-l border-border-default">
        <div
          className={`absolute top-0 left-0 w-28 h-28 z-10 transition-opacity
            ${
              selectedId !== null && !isSaving
                ? "cursor-pointer hover:brightness-110"
                : "cursor-default opacity-30"
            }`}
          onClick={
            selectedId !== null && !isSaving
              ? () => {
                  void handleDelete();
                }
              : undefined
          }
          title={
            selectedId !== null
              ? "Eliminar registro seleccionado"
              : "Sin selección"
          }
        >
          <Trash2
            size={24}
            color="#c85a27"
            strokeWidth={2}
            className="absolute top-4 left-4"
          />
        </div>

        <div className="flex justify-end p-8 z-10 shrink-0">
          <button
            onClick={handleEditToggle}
            disabled={isSaving}
            className={`px-10 text-[14px] font-mono font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer
              disabled:opacity-40 disabled:cursor-default
              ${
                editMode
                  ? "bg-bg-tertiary text-accent hover:bg-bg-selected"
                  : "bg-accent text-accent-fg hover:bg-accent-hover"
              }`}
          >
            {editMode ? "CANCEL" : "EDITAR"}
          </button>
        </div>

        <div className="flex-1 px-20 pt-10 pb-4 flex flex-col gap-2 overflow-y-auto">
          <TextFieldFloat
            label="ID"
            value={selectedItem ? String(selectedItem.id) : ""}
            readOnly
          />

          <div className="grid grid-cols-2 gap-4">
            <TextFieldFloat
              label="CODE"
              value={form.code}
              readOnly={!editMode}
              onChange={(event) =>
                handleFieldChange("code", event.target.value)
              }
            />
            <TextFieldFloat
              label="NAME"
              value={form.name}
              readOnly={!editMode}
              onChange={(event) =>
                handleFieldChange("name", event.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ComboboxFloat
              label="CATEGORY"
              value={form.category}
              options={RESOURCE_CATEGORIES}
              readOnly={!editMode}
              onChange={(value) => handleFieldChange("category", value)}
            />
            <ComboboxFloat
              label="UNIT"
              value={form.unitOfMeasure}
              options={UNITS_OF_MEASURE}
              readOnly={!editMode}
              onChange={(value) => handleFieldChange("unitOfMeasure", value)}
            />
          </div>

          <TextFieldFloat
            label="DESCRIPTION"
            value={form.description}
            readOnly={!editMode}
            onChange={(event) =>
              handleFieldChange("description", event.target.value)
            }
          />

          <div className="flex items-center gap-4 mt-2">
            <label className="text-[10px] text-[#a0a0a0] font-mono uppercase tracking-[0.2em]">
              CONSUMABLE
            </label>
            <button
              disabled={!editMode}
              onClick={handleToggleConsumable}
              className={`px-4 py-1 text-[11px] font-mono font-bold tracking-widest uppercase transition-colors
                ${
                  form.consumable
                    ? "bg-accent text-accent-fg"
                    : "bg-bg-primary text-txt-disabled border border-border-default"
                }
                ${
                  !editMode
                    ? "opacity-40 cursor-default"
                    : "cursor-pointer"
                }`}
            >
              {form.consumable ? "YES" : "NO"}
            </button>
          </div>
        </div>

        <div className="px-16 py-8 shrink-0 flex flex-col items-center gap-3">
          <button
            onClick={() => {
              void handleSave();
            }}
            disabled={!editMode || isSaving}
            className="w-full max-w-[400px] bg-accent text-accent-fg font-ibmplex text-[16px] font-bold tracking-[0.2em] uppercase py-2
              hover:bg-accent-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
          >
            {isSaving ? "SAVING..." : "SAVE AND SUBMIT"}
          </button>

          <button
            onClick={handleClear}
            disabled={isSaving}
            className="w-full max-w-[400px] bg-transparent text-accent border-2 border-accent font-ibmplex text-[14px] font-bold tracking-[0.2em] uppercase py-1.5
              hover:bg-accent hover:text-accent-fg transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-accent disabled:cursor-default"
          >
            CLEAR FORM
          </button>
        </div>
      </div>
    </div>
  );
}