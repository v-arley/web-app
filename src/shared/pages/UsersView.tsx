import {
  AlertTriangle,
  ClipboardList,
  Download,
  FilterX,
  RefreshCw,
  Search,
  UserPlus,
  Users as UsersIcon,
} from "lucide-react";

import { UserCard } from "../components/UserCard";
import { UserProfileModal } from "../components/UserProfileModal";
import { AdmissionRequestsPanel } from "../components/AdmissionRequestsPanel";
import { RegistrationPanel } from "./RegistrationPanel";
import { useUsersView } from "../hooks/useUsersView";
import { useToast } from "../hooks/useToast";

export function UsersView() {
  const { toast } = useToast();

  const {
    displayedUsers,
    professions,
    professionOptions,

    selectedUser,
    setSelectedUser,

    isRegistrationPanelOpen,
    setIsRegistrationPanelOpen,

    showAdmissions,
    setShowAdmissions,

    loading,
    error,

    searchQuery,
    setSearchQuery,

    statusFilter,
    setStatusFilter,

    professionFilter,
    setProfessionFilter,

    healthFilter,
    setHealthFilter,

    ageFilter,
    setAgeFilter,

    handleToggleUserActive,
    handleChangeProfession,
    handleUpdatePersonProfile,

    loadUsers,
    resetFilters,
    exportFilteredUsers,

    activeUsers,
    inactiveUsers,
    totalUsers,
    totalFilteredUsers,
  } = useUsersView();

  const handleRefresh = async () => {
    try {
      await loadUsers();
      toast({
        tone: "success",
        title: "Users refreshed",
        message: "Users loaded successfully.",
      });
    } catch (err) {
      toast({
        tone: "error",
        title: "Refresh failed",
        message: err instanceof Error ? err.message : "Users could not be loaded.",
      });
    }
  };

  const handleExport = async () => {
    try {
      await exportFilteredUsers();
      toast({
        tone: "success",
        title: "Export completed",
        message: "Users exported successfully.",
      });
    } catch (err) {
      toast({
        tone: "error",
        title: "Export failed",
        message: err instanceof Error ? err.message : "Users could not be exported.",
      });
    }
  };

  const handleToggleActiveWithToast = async () => {
    try {
      await handleToggleUserActive();
      toast({
        tone: "success",
        title: "Status updated",
        message: "User status updated successfully.",
      });
    } catch (err) {
      toast({
        tone: "error",
        title: "Update failed",
        message: err instanceof Error ? err.message : "User status could not be updated.",
      });
    }
  };

  const handleChangeProfessionWithToast = async (
    profession: string,
    options?: { isTemporary: boolean; temporaryUntil?: string },
  ) => {
    try {
      await handleChangeProfession(profession, options);
      toast({
        tone: "success",
        title: "Profession updated",
        message: options?.isTemporary
          ? "Temporary profession assigned successfully."
          : "Profession updated successfully.",
      });
    } catch (err) {
      toast({
        tone: "error",
        title: "Update failed",
        message: err instanceof Error ? err.message : "Profession could not be updated.",
      });
    }
  };

  const handleUpdateProfileWithToast = async (
    personId: number,
    payload: {
      photo?: string;
      description?: string;
      conditions?: string;
    },
  ) => {
    try {
      await handleUpdatePersonProfile(personId, payload);
      toast({
        tone: "success",
        title: "Profile updated",
        message: "User profile updated successfully.",
      });
    } catch (err) {
      toast({
        tone: "error",
        title: "Update failed",
        message: err instanceof Error ? err.message : "Profile could not be updated.",
      });
    }
  };

  if (showAdmissions) {
    return (
      <div className="flex h-full min-h-0 w-full flex-col bg-bg-app">
        <AdmissionRequestsPanel
          onBackToStaff={() => setShowAdmissions(false)}
          onAdmissionResolved={async () => {
            await loadUsers();
            toast({
              tone: "success",
              title: "Admission processed",
              message: "Admission request processed successfully.",
            });
          }}
        />
      </div>
    );
  }

  const getUserAccessibleName = (user: any) => {
    const fullName =
      user.fullName ??
      user.name ??
      [user.firstName, user.lastName].filter(Boolean).join(" ") ??
      [user.names, user.surnames].filter(Boolean).join(" ");

    return fullName?.trim() || user.dni || "selected user";
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-bg-app">
      <div className="shrink-0 border-b border-border-default bg-bg-secondary px-6 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-txt-disabled">
              Camp population
            </p>

            <h1 className="mt-1 flex items-center gap-3 text-[24px] font-black uppercase tracking-[0.12em] text-txt-primary">
              <UsersIcon size={24} className="text-accent" />
              Users
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowAdmissions(true)}
              className="flex items-center gap-2 border border-border-default bg-bg-tertiary px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-txt-secondary transition-colors hover:border-accent hover:text-accent"
            >
              <ClipboardList size={14} />
              Admissions
            </button>

            <button
              type="button"
              onClick={() => void handleExport()}
              className="flex items-center gap-2 border border-border-default bg-bg-tertiary px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-txt-secondary transition-colors hover:border-accent hover:text-accent"
            >
              <Download size={14} />
              Export
            </button>

            <button
              type="button"
              onClick={() => void handleRefresh()}
              className="flex items-center gap-2 border border-border-default bg-bg-tertiary px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-txt-secondary transition-colors hover:border-accent hover:text-accent"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => setIsRegistrationPanelOpen(true)}
              className="flex items-center gap-2 border border-accent bg-accent px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-accent-fg transition-colors hover:bg-accent-hover"
            >
              <UserPlus size={14} />
              New user
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="border border-border-default bg-bg-primary px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-txt-disabled">
              Total
            </p>
            <p className="mt-1 text-[22px] font-black text-txt-primary">
              {totalUsers}
            </p>
          </div>

          <div className="border border-border-default bg-bg-primary px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-txt-disabled">
              Active
            </p>
            <p className="mt-1 text-[22px] font-black text-status-ok">
              {activeUsers.length}
            </p>
          </div>

          <div className="border border-border-default bg-bg-primary px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-txt-disabled">
              Inactive
            </p>
            <p className="mt-1 text-[22px] font-black text-status-critical">
              {inactiveUsers.length}
            </p>
          </div>

          <div className="border border-border-default bg-bg-primary px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-txt-disabled">
              Showing
            </p>
            <p className="mt-1 text-[22px] font-black text-accent">
              {totalFilteredUsers}
            </p>
          </div>
        </div>
      </div>

     <div className="shrink-0 border-b border-border-default bg-bg-primary px-6 py-4">
  <div className="space-y-3">
    <div className="relative">
      <Search
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-disabled"
      />

      <input
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search by name, DNI, role or profession..."
        className="h-12 w-full border border-border-default bg-bg-tertiary pl-11 pr-4 text-[12px] font-bold uppercase tracking-[0.08em] text-txt-primary outline-none placeholder:text-txt-disabled focus:border-accent"
      />
    </div>

    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1.1fr_1fr_1fr_auto]">
      <select
        aria-label="Filter users by status"
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value as any)}
        className="h-10 border border-border-default bg-bg-tertiary px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-txt-primary outline-none focus:border-accent"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="all">All</option>
        </select>

          <select
            aria-label="Filter users by profession"
            value={professionFilter}
            onChange={(event) => setProfessionFilter(event.target.value)}
            className="h-10 border border-border-default bg-bg-tertiary px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-txt-primary outline-none focus:border-accent"
          >
            <option value="all">All professions</option>
            {professionOptions.map((profession) => (
              <option key={profession} value={profession}>
                {profession}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter users by health condition"
            value={healthFilter}
            onChange={(event) => setHealthFilter(event.target.value as any)}
            className="h-10 border border-border-default bg-bg-tertiary px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-txt-primary outline-none focus:border-accent"
          >
            <option value="all">All health</option>
            <option value="healthy">Healthy</option>
            <option value="has-condition">Has condition</option>
          </select>

          <select
            aria-label="Filter users by age"
            value={ageFilter}
            onChange={(event) => setAgeFilter(event.target.value as any)}
            className="h-10 border border-border-default bg-bg-tertiary px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-txt-primary outline-none focus:border-accent"
          >
            <option value="all">All ages</option>
            <option value="under-18">Under 18</option>
            <option value="18-30">18 - 30</option>
            <option value="31-50">31 - 50</option>
            <option value="51-plus">51+</option>
          </select>
            <button
              type="button"
              onClick={resetFilters}
              className="flex h-10 items-center justify-center gap-2 border border-accent/60 bg-accent/10 px-5 text-[11px] font-black uppercase tracking-[0.16em] text-accent transition-colors hover:bg-accent hover:text-accent-fg"
            >
              <FilterX size={14} />
              Clear filters
            </button>
          </div>
        </div>
    </div>
      {error ? (
        <div className="mx-6 mt-4 flex shrink-0 items-center gap-2 border border-status-critical bg-status-critical/10 px-4 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-status-critical">
          <AlertTriangle size={16} />
          {error}
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {loading ? (
          <div className="flex h-full items-center justify-center text-[12px] font-bold uppercase tracking-[0.18em] text-txt-disabled">
            Loading users...
          </div>
        ) : displayedUsers.length === 0 ? (
          <div className="flex h-full items-center justify-center text-[12px] font-bold uppercase tracking-[0.18em] text-txt-disabled">
            No users found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {displayedUsers.map((user) => (
            <button
              key={`${user.userId ?? "u"}-${user.personId ?? user.dni}`}
              type="button"
              aria-label={`Open user details for ${getUserAccessibleName(user)}`}
              title={`Open user details for ${getUserAccessibleName(user)}`}
              onClick={() => setSelectedUser(user)}
              className="text-left"
            >
                <UserCard
                  name={user.name}
                  lastName={user.lastName}
                  role={user.role}
                  id={user.dni || user.id}
                  active={user.active}
                  profession={user.profession}
                  temporaryProfession={user.temporaryProfession}
                  temporaryUntil={user.temporaryUntil}
                  imageUrl={user.imageUrl}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedUser ? (
        <UserProfileModal
          name={selectedUser.name}
          lastName={selectedUser.lastName}
          role={selectedUser.role}
          sex={selectedUser.sex}
          id={selectedUser.dni || selectedUser.id}
          active={selectedUser.active}
          profession={selectedUser.profession}
          professions={professions}
          registrationDate={selectedUser.registrationDate}
          birthdate={selectedUser.birthdate}
          imageUrl={selectedUser.imageUrl}
          personId={selectedUser.personId}
          idCardUrl={selectedUser.idCardUrl}
          description={selectedUser.description}
          conditions={selectedUser.conditions}
          onToggleActive={handleToggleActiveWithToast}
          onChangeProfession={handleChangeProfessionWithToast}
          onUpdatePersonProfile={handleUpdateProfileWithToast}
          onClose={() => setSelectedUser(null)}
        />
      ) : null}

      {isRegistrationPanelOpen ? (
        <RegistrationPanel
          onClose={() => setIsRegistrationPanelOpen(false)}
          onSuccess={async () => {
            setIsRegistrationPanelOpen(false);
            await loadUsers();
            toast({
              tone: "success",
              title: "User processed",
              message: "User request created successfully.",
            });
          }}
        />
      ) : null}
    </div>
  );
}