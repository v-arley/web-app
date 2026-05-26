import { useMemo, useState } from "react";
import {
  ClipboardList,
  UserRoundSearch,
  UserRoundPlus,
  UserCheck,
  UserRoundMinus,
  UsersRound,
  Download,
  RotateCcw,
} from "lucide-react";
import { UserCard } from "../components/UserCard";
import { UserProfileModal } from "../components/UserProfileModal";
import { AdmissionRequestsPanel } from "../components/AdmissionRequestsPanel";
import { RegistrationPanel } from "./RegistrationPanel";
import {
  useUsersView,
  type StatusFilter,
  type HealthFilter,
  type AgeFilter,
} from "../hooks/useUsersView";

type UsersPanel = "staff" | "admissions";

const professionNameMap: Record<string, string> = {
  "PROF-MED": "Medicine",
  "PROF-LOG": "Logistics",
  "PROF-AGR": "Agriculture",
  "PROF-EXP": "Exploration",
  "PROF-COC": "Cooking",
  "PROF-COOK": "Cooking",

  MEDICINA: "Medicine",
  LOGISTICA: "Logistics",
  LOGÍSTICA: "Logistics",
  AGRICULTURA: "Agriculture",
  EXPLORACION: "Exploration",
  EXPLORACIÓN: "Exploration",
  COCINA: "Cooking",
  COOKING: "Cooking",
};

function formatProfessionName(value?: string | null) {
  if (!value) return "No profession";

  const normalized = value.trim().toUpperCase();

  if (professionNameMap[normalized]) {
    return professionNameMap[normalized];
  }

  return value
    .replace(/^PROF[-_]/i, "")
    .replace(/[-_]/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function UsersView() {
  const [activePanel, setActivePanel] = useState<UsersPanel>("staff");

  const {
    professions,
    loading,
    selectedUser,
    setSelectedUser,
    isRegistrationPanelOpen,
    setIsRegistrationPanelOpen,
    statusFilter,
    setStatusFilter,
    professionFilter,
    setProfessionFilter,
    healthFilter,
    setHealthFilter,
    ageFilter,
    setAgeFilter,
    isStatusSelectFocused,
    setIsStatusSelectFocused,
    searchQuery,
    setSearchQuery,
    filteredUsers,
    statusTitleMap,
    handleToggleUserActive,
    handleChangeProfession,
    handleUpdatePersonProfile,
    formatProfession,
    loadUsers,
    resetFilters,
    exportFilteredUsers,
  } = useUsersView();

  const professionFilterOptions = useMemo(() => {
    const mergedProfessions = [...professions, "PROF-COC"];

    return Array.from(new Set(mergedProfessions.filter(Boolean))).map(
      (profession) => ({
        rawValue: profession,
        filterValue: formatProfession(profession),
        label: formatProfessionName(profession),
      }),
    );
  }, [professions, formatProfession]);

  const statusIcon =
    statusFilter === "active" ? (
      <UserCheck className="h-7 w-7 rounded-md bg-[#A6A6A6] p-1 text-[#343434]" />
    ) : statusFilter === "inactive" ? (
      <UserRoundMinus className="h-7 w-7 rounded-md bg-[#A6A6A6] p-1 text-[#343434]" />
    ) : (
      <UsersRound className="h-7 w-7 rounded-md bg-[#A6A6A6] p-1 text-[#343434]" />
    );

  const filterSelectClass =
    "h-9 w-full rounded-lg border border-[#2A2A2A] bg-black px-3 text-sm text-white outline-none transition-colors hover:border-[#FF6600] hover:text-[#FF6600] sm:w-auto";

  const actionButtonClass =
    "flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#2A2A2A] bg-black px-3 text-sm text-white transition-colors hover:border-[#FF6600] hover:text-[#FF6600] sm:w-auto";

  return (
    <>
      <div className="flex h-[calc(100vh-95px)] min-h-[calc(100vh-95px)] flex-col gap-3 p-3 font-mono sm:p-4 lg:p-5">
        <div className="rounded-2xl border border-[#242424] bg-[#111111] px-4 py-3 shadow-[0_8px_18px_rgba(0,0,0,0.22)]">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              {activePanel === "staff" && (
                <div className="group flex h-10 w-full flex-1 items-center gap-3 rounded-xl border border-[#303030] bg-[#D1D1D1] px-4 transition-colors focus-within:border-[#FF6600]">
                  <UserRoundSearch className="h-5 w-5 shrink-0 text-gray-500 transition-colors group-focus-within:text-[#FF6600]" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search staff by name, DNI, role or profession..."
                    className="h-10 w-full bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-500"
                  />
                </div>
              )}

              {activePanel === "admissions" && (
                <div className="flex h-10 w-full flex-1 items-center rounded-xl border border-[#303030] bg-[#D1D1D1] px-4">
                  <span className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                    Pending admission requests
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex xl:shrink-0">
                <button
                  type="button"
                  onClick={() => setActivePanel("admissions")}
                  className={`group flex h-10 w-full items-center justify-center gap-[10px] rounded-xl border px-4 text-sm transition-colors xl:w-auto ${
                    activePanel === "admissions"
                      ? "border-[#FF6600] bg-[#FF6600] text-black"
                      : "border-[#2A2A2A] bg-black text-white hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-black"
                  }`}
                >
                  <ClipboardList
                    className={`h-5 w-5 transition-colors ${
                      activePanel === "admissions"
                        ? "text-black"
                        : "text-white group-hover:text-black"
                    }`}
                  />
                  Admissions
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActivePanel("staff");
                    setIsRegistrationPanelOpen(true);
                  }}
                  className="group flex h-10 w-full items-center justify-center gap-[10px] rounded-xl border border-[#2A2A2A] bg-black px-4 text-sm text-white transition-colors hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-black xl:w-auto"
                >
                  <UserRoundPlus className="h-5 w-5 text-white transition-colors group-hover:text-black" />
                  Register staff
                </button>
              </div>
            </div>

            {activePanel === "staff" && (
              <div className="border-t border-[#242424] pt-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">
                    Filters
                  </p>

                  <p className="text-xs text-gray-500">
                    {filteredUsers.length} result
                    {filteredUsers.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:flex xl:flex-wrap">
                    <select
                      value={statusFilter}
                      onChange={(event) =>
                        setStatusFilter(event.target.value as StatusFilter)
                      }
                      onFocus={() => setIsStatusSelectFocused(true)}
                      onBlur={() => setIsStatusSelectFocused(false)}
                      className={`h-9 w-full rounded-lg border px-3 text-sm outline-none transition-all duration-200 sm:w-auto ${
                        isStatusSelectFocused
                          ? "border-[#FF6600] bg-[#FF6600] text-black"
                          : "border-[#2A2A2A] bg-black text-white hover:border-[#FF6600] hover:text-[#FF6600]"
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="all">All status</option>
                    </select>

                    <select
                      value={professionFilter}
                      onChange={(event) =>
                        setProfessionFilter(event.target.value)
                      }
                      className={filterSelectClass}
                    >
                      <option value="all">All professions</option>

                      {professionFilterOptions.map((profession) => (
                        <option
                          key={profession.rawValue}
                          value={profession.filterValue}
                        >
                          {profession.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={healthFilter}
                      onChange={(event) =>
                        setHealthFilter(event.target.value as HealthFilter)
                      }
                      className={filterSelectClass}
                    >
                      <option value="all">All health</option>
                      <option value="healthy">Healthy</option>
                      <option value="has-condition">Has condition</option>
                    </select>

                    <select
                      value={ageFilter}
                      onChange={(event) =>
                        setAgeFilter(event.target.value as AgeFilter)
                      }
                      className={filterSelectClass}
                    >
                      <option value="all">All ages</option>
                      <option value="under-18">Under 18</option>
                      <option value="18-30">18 - 30</option>
                      <option value="31-50">31 - 50</option>
                      <option value="51-plus">51+</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:shrink-0">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className={actionButtonClass}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </button>

                    <button
                      type="button"
                      onClick={exportFilteredUsers}
                      className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#FF6600] bg-[#FF6600] px-4 text-sm text-black transition-colors hover:bg-black hover:text-[#FF6600] sm:w-auto"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {activePanel === "staff" && (
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <div className="flex w-full items-center gap-[10px] border-b border-[#B8B8B8] px-3 py-2 text-[#343434] shadow-[0_8px_8px_-8px_rgba(0,0,0,0.45)]">
              {statusIcon}

              <p className="text-sm">{statusTitleMap[statusFilter]}</p>

              <span className="ml-auto text-xs text-gray-500">
                {filteredUsers.length} result
                {filteredUsers.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 content-start gap-5 overflow-y-auto rounded-xl bg-transparent px-3 py-4 shadow-none md:grid-cols-2 xl:grid-cols-3">
              {loading ? (
                <div className="col-span-full flex items-center justify-center py-20">
                  <span className="animate-pulse font-mono text-sm uppercase tracking-widest text-gray-500">
                    Loading staff...
                  </span>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="col-span-full flex items-center justify-center py-20">
                  <span className="font-mono text-sm uppercase tracking-widest text-gray-500">
                    No staff found
                  </span>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.idUser}
                    className="relative transition-all duration-250 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_16px_28px_rgba(0,0,0,0.42),0_0_18px_rgba(51,19,1,0.55)]"
                    onClick={() => setSelectedUser(user)}
                  >
                    <UserCard
                      name={user.name}
                      lastName={user.lastName}
                      role={user.role}
                      id={user.id}
                      active={user.active}
                      profession={formatProfessionName(user.profession)}
                      imageUrl={user.imageUrl}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activePanel === "admissions" && (
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <div className="flex w-full items-center gap-[10px] border-b border-[#B8B8B8] px-3 py-2 text-[#343434] shadow-[0_8px_8px_-8px_rgba(0,0,0,0.45)]">
              <ClipboardList className="h-7 w-7 rounded-md bg-[#A6A6A6] p-1 text-[#343434]" />
              <p className="text-sm">PENDING ADMISSIONS</p>
            </div>

            <AdmissionRequestsPanel
              onAdmissionResolved={loadUsers}
              onBackToStaff={() => setActivePanel("staff")}
            />
          </div>
        )}
      </div>

      {selectedUser && (
        <UserProfileModal
          name={selectedUser.name}
          lastName={selectedUser.lastName}
          role={selectedUser.role}
          sex={selectedUser.sex}
          id={selectedUser.id}
          active={selectedUser.active}
          profession={selectedUser.profession}
          professions={[...professions, "PROF-COC"]}
          registrationDate={selectedUser.registrationDate}
          birthdate={selectedUser.birthdate}
          imageUrl={selectedUser.imageUrl}
          personId={selectedUser.personId}
          idCardUrl={selectedUser.idCardUrl}
          description={selectedUser.description}
          conditions={selectedUser.conditions}
          onToggleActive={handleToggleUserActive}
          onChangeProfession={handleChangeProfession}
          onUpdatePersonProfile={handleUpdatePersonProfile}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {isRegistrationPanelOpen && (
        <RegistrationPanel onClose={() => setIsRegistrationPanelOpen(false)} />
      )}
    </>
  );
}