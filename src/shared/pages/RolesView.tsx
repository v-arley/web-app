import { Plus, Shield, Trash2, Key, Search } from "lucide-react";
import { ModalPerms } from "./ModalPerms";
import { TextFieldFloat } from "../components/TextFielFloat";
import {
  ACTION_COLOR,
  PERMS_LIST,
  useRolesView,
} from "../hooks/useRolesView";

export function RolesView() {
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

  return (
    <div className="flex flex-row flex-1 min-h-0 w-full h-full overflow-hidden border border-border-default">
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
            placeholder="SEARCH BY ID OR ROLE NAME..."
            value={searchTerm}
            onChange={(event) => handleSearchChange(event.target.value)}
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

        <div className="grid grid-cols-[0.7fr_2fr_3fr] px-1 py-1 border-b border-border-default shrink-0">
          {["ID", "ROLE NAME", "DESCRIPTION"].map((header) => (
            <div
              key={header}
              className="text-xs font-mono font-bold tracking-label text-txt-secondary uppercase text-center"
            >
              {header}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {pageItems.map((role) => {
            const isSelected = selectedId === role.id;

            return (
              <div
                key={role.id}
                onClick={() => handleRowClick(role)}
                className={`grid grid-cols-[0.7fr_2fr_3fr] px-1 py-1.5 cursor-pointer select-none text-center border-b border-border-subtle transition-colors ${
                  isSelected
                    ? "bg-bg-selected border-l-2 border-l-accent"
                    : "hover:bg-bg-tertiary border-l-2 border-l-transparent"
                }`}
              >
                <div className="font-mono text-xs font-bold text-txt-secondary flex items-center justify-center">
                  {role.id}
                </div>
                <div className="font-mono text-xs text-txt-secondary uppercase flex items-center justify-center">
                  {role.name}
                </div>
                <div className="font-mono text-xs text-txt-secondary flex items-center justify-center truncate px-1">
                  {role.description}
                </div>
              </div>
            );
          })}

          {pageItems.length === 0 && (
            <div className="py-10 text-center font-mono text-xs text-txt-disabled uppercase tracking-label">
              No roles found.
            </div>
          )}
        </div>

        <div className="bg-bg-secondary border-t border-border-default px-4 py-1.5 shrink-0">
          <span className="font-mono text-xs text-txt-secondary tracking-wide uppercase">
            FOUND: {String(filtered.length).padStart(4, "0")}
          </span>
        </div>

        <div className="flex gap-2 h-10 shrink-0">
          <button
            onClick={handlePrevPage}
            disabled={page === 0}
            className="flex-1 bg-bg-tertiary border border-border-default text-txt-primary font-mono font-bold text-sm tracking-wide uppercase hover:bg-bg-selected hover:border-accent transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-default rounded-none"
          >
            PREV
          </button>

          <button
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
            className="flex-1 bg-accent text-accent-fg font-mono font-bold text-sm tracking-wide uppercase hover:bg-accent-hover transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-default rounded-none"
          >
            NEXT
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 bg-bg-secondary border-l border-border-default relative min-h-0">
        <div className="flex items-center justify-between px-6 py-3 border-b border-border-default shrink-0">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-accent" />
            <span className="font-mono text-xs font-bold text-txt-secondary uppercase tracking-label">
              {selectedId ? "Role Details" : "New Role"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedId && (
              <>
                <button
                  onClick={handleOpenPermissionsModal}
                  className="p-1.5 font-mono text-xs text-txt-secondary hover:text-accent border border-border-subtle hover:border-accent rounded-none transition-colors cursor-pointer"
                  title="Manage Permissions"
                >
                  <Key size={14} />
                </button>

                <button
                  onClick={handleDelete}
                  className="p-1.5 font-mono text-xs text-txt-secondary hover:text-status-critical border border-border-subtle hover:border-status-critical rounded-none transition-colors cursor-pointer"
                  title="Delete Role"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}

            <button
              onClick={selectedId ? handleEditToggle : undefined}
              disabled={!selectedId}
              className={`px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-label rounded-none transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default ${
                editMode
                  ? "bg-bg-tertiary text-txt-primary border border-border-default hover:border-border-strong"
                  : "bg-accent text-accent-fg hover:bg-accent-hover"
              }`}
            >
              {editMode ? "Cancel" : "Edit"}
            </button>
          </div>
        </div>

        <div className="flex-1 px-8 pt-8 pb-4 flex flex-col gap-3 overflow-y-auto">
          <TextFieldFloat label="ID" value={selectedId ?? ""} readOnly />

          <TextFieldFloat
            label="ROLE NAME"
            value={form.name}
            readOnly={!editMode && !!selectedId}
            onChange={(event) =>
              handleFormFieldChange("name", event.target.value)
            }
          />

          <TextFieldFloat
            label="DESCRIPTION"
            value={form.description}
            readOnly={!editMode && !!selectedId}
            onChange={(event) =>
              handleFormFieldChange("description", event.target.value)
            }
          />

          {selectedRole && (
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 pb-2 border-b border-border-default">
                <Key size={12} className="text-accent" />
                <span className="text-[9px] font-mono font-bold text-txt-secondary uppercase tracking-label">
                  Assigned Permissions
                </span>
                <span className="ml-auto text-[8px] font-mono font-bold text-txt-disabled">
                  {rolePermissions.length} / {PERMS_LIST.length}
                </span>
              </div>

              {rolePermissions.length === 0 ? (
                <span className="text-[9px] font-mono text-txt-disabled uppercase tracking-label py-3">
                  No permissions assigned to this role.
                </span>
              ) : (
                <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto pr-1">
                  {rolePermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between py-1.5 px-3 bg-bg-tertiary border border-border-subtle"
                    >
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[9px] font-mono font-bold text-txt-primary uppercase truncate">
                          {permission.resource}
                        </span>
                        <span className="text-[7px] font-mono text-txt-disabled uppercase tracking-label">
                          {permission.id}
                        </span>
                      </div>

                      <span
                        className={`text-[8px] font-mono font-bold px-2 py-0.5 uppercase shrink-0 ${
                          ACTION_COLOR[permission.action] ??
                          "text-txt-secondary bg-bg-selected"
                        }`}
                      >
                        {permission.action}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-8 py-6 shrink-0 flex flex-col gap-2">
          <button
            onClick={handleSave}
            disabled={(!!selectedId && !editMode) || !form.name}
            className="w-full bg-accent text-accent-fg font-mono font-bold text-sm uppercase tracking-label py-2.5 hover:bg-accent-hover transition-colors rounded-none disabled:opacity-30 disabled:cursor-default cursor-pointer"
          >
            <Plus size={14} className="inline mr-2" />
            {selectedId ? "Save Changes" : "Create Role"}
          </button>

          <button
            onClick={handleClear}
            className="w-full bg-transparent text-txt-secondary font-mono text-xs uppercase tracking-label py-2 border border-border-default hover:border-border-strong hover:text-txt-primary transition-colors rounded-none cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      <ModalPerms
        isOpen={isModalOpen}
        onClose={handleClosePermissionsModal}
        roleName={modalRole}
      />
    </div>
  );
}