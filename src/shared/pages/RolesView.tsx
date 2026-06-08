import {
  useEffect,
  useRef,
  type KeyboardEvent,
} from "react";

import { ModalPerms } from "./ModalPerms";
import { useToast } from "../hooks/useToast";
import { useRolesView } from "../hooks/useRolesView";
import { RolesListPanel } from "../components/RolesComponents/RolesListPanel";
import { RoleFormPanel } from "../components/RolesComponents/RoleFormPanel";

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

  const focusFirstField = () => {
    window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 80);
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

    focusFirstField();
  };

  const handleDeleteWithToast = async () => {
    const deleted = await handleDelete();

    if (!deleted) return;

    toast({
      tone: "success",
      title: "Role deleted",
      message: "Role deleted successfully.",
    });

    focusFirstField();
  };

  const handleClearAndFocus = () => {
    handleClear();
    focusFirstField();
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-1 overflow-hidden border border-border-default bg-bg-app font-mono">
      <RolesListPanel
        searchTerm={searchTerm}
        page={page}
        selectedId={selectedId}
        filteredCount={filtered.length}
        totalPages={totalPages}
        pageItems={pageItems}
        loading={loading}
        onSearchChange={handleSearchChange}
        onRoleClick={handleRowClick}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />

      <RoleFormPanel
        selectedId={selectedId}
        editMode={editMode}
        form={form}
        selectedRole={selectedRole}
        rolePermissions={rolePermissions}
        error={error}
        canEditForm={canEditForm}
        canSave={canSave}
        loading={loading}
        firstFieldRef={firstFieldRef}
        onEditToggle={handleEditToggle}
        onOpenPermissionsModal={handleOpenPermissionsModal}
        onFormFieldChange={handleFormFieldChange}
        onEnterToNextField={handleEnterToNextField}
        onSave={() => void handleSaveWithToast()}
        onClear={handleClearAndFocus}
        onDelete={() => void handleDeleteWithToast()}
      />

      <ModalPerms
        isOpen={isModalOpen}
        onClose={handleClosePermissionsModal}
        roleName={modalRole}
      />
    </div>
  );
}