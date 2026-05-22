import { useState } from "react";
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
} from "../../hooks/useUsersView";

type UsersPanel = "staff" | "admissions";

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

  const statusIcon =
    statusFilter === "active" ? (
      <UserCheck className="text-[#343434] bg-[#A6A6A6] rounded-md p-1 w-8 h-8" />
    ) : statusFilter === "inactive" ? (
      <UserRoundMinus className="text-[#343434] bg-[#A6A6A6] rounded-md p-1 w-8 h-8" />
    ) : (
      <UsersRound className="text-[#343434] bg-[#A6A6A6] rounded-md p-1 w-8 h-8" />
    );

  const filterSelectClass =
    "w-full rounded-lg border border-black bg-black px-4 py-2 text-sm text-white outline-none transition-colors hover:border-[#FF6600] hover:text-[#FF6600] sm:w-auto";

  return (
    <>
      <div className="flex h-[calc(100vh-120px)] min-h-[calc(100vh-120px)] flex-col gap-5 p-4 font-mono sm:gap-6 sm:p-6 lg:p-[30px]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4 lg:gap-[30px]">
            {activePanel === "staff" && (
              <>
                <div className="group flex w-full flex-1 items-center gap-3 rounded-lg border border-[#B8B8B8] bg-[#CCCCCC] px-3 py-3 shadow-[0_1px_6px_rgba(0,0,0,0.10)] transition-colors focus-within:border-[#FF6600] sm:gap-5 sm:py-[15px] lg:gap-[30px]">
                  <UserRoundSearch className="self-center text-gray-500 transition-colors group-focus-within:text-[#FF6600]" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search staff by name, DNI, role or profession..."
                    className="w-full self-center bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as StatusFilter)
                  }
                  onFocus={() => setIsStatusSelectFocused(true)}
                  onBlur={() => setIsStatusSelectFocused(false)}
                  className={`w-full rounded-lg border px-4 py-2 outline-none transition-all duration-200 hover:shadow-[0_10px_20px_rgba(0,0,0,0.35)] sm:w-auto ${
                    isStatusSelectFocused
                      ? "border-[#FF6600] bg-[#FF6600] text-black"
                      : "border-black bg-black text-white hover:border-[#FF6600] hover:text-[#FF6600]"
                  }`}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="all">All</option>
                </select>
              </>
            )}

            {activePanel === "admissions" && (
              <div className="flex w-full flex-1 items-center rounded-lg border border-[#B8B8B8] bg-[#CCCCCC] px-3 py-3 shadow-[0_1px_6px_rgba(0,0,0,0.10)] sm:py-[15px]">
                <span className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                  Pending admission requests
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setActivePanel("admissions")}
              className={`group flex w-full items-center justify-center gap-[10px] rounded-lg border px-4 py-2 transition-colors sm:w-auto sm:justify-start ${
                activePanel === "admissions"
                  ? "border-[#FF6600] bg-[#FF6600] text-black"
                  : "border-black bg-black text-white hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-black"
              }`}
            >
              <ClipboardList
                className={`transition-colors ${
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
              className="group flex w-full items-center justify-center gap-[10px] rounded-lg border border-black bg-black px-4 py-2 text-white transition-colors hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-black sm:w-auto sm:justify-start"
            >
              <UserRoundPlus className="text-white transition-colors group-hover:text-black" />
              Register staff
            </button>
          </div>

          {activePanel === "staff" && (
            <div className="flex flex-col gap-2 rounded-lg border border-[#262626] bg-[#141414] p-3 sm:flex-row sm:flex-wrap sm:items-center">
              <select
                value={professionFilter}
                onChange={(event) => setProfessionFilter(event.target.value)}
                className={filterSelectClass}
              >
                <option value="all">All professions</option>
                {professions.map((profession) => (
                  <option key={profession} value={formatProfession(profession)}>
                    {formatProfession(profession)}
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

              <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-black bg-black px-4 py-2 text-sm text-white transition-colors hover:border-[#FF6600] hover:text-[#FF6600] sm:w-auto"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>

                <button
                  type="button"
                  onClick={exportFilteredUsers}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#FF6600] bg-[#FF6600] px-4 py-2 text-sm text-black transition-colors hover:bg-black hover:text-[#FF6600] sm:w-auto"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          )}
        </div>

        {activePanel === "staff" && (
          <div className="flex min-h-0 flex-1 flex-col gap-[5px]">
            <div className="w-full flex items-center gap-[10px] border-b border-[#B8B8B8] shadow-[0_10px_8px_-8px_rgba(0,0,0,0.45)] px-3 py-2 text-[#343434]">
              {statusIcon}

              <p>{statusTitleMap[statusFilter]}</p>

              <span className="ml-auto text-xs text-gray-500">
                {filteredUsers.length} result
                {filteredUsers.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="mt-6 grid min-h-0 flex-1 grid-cols-1 content-start gap-6 overflow-y-auto rounded-xl bg-transparent p-[25px] shadow-none md:grid-cols-2 xl:grid-cols-3">
              {loading ? (
                <div className="col-span-full flex items-center justify-center py-20">
                  <span className="font-mono text-sm text-gray-500 animate-pulse uppercase tracking-widest">
                    Loading staff...
                  </span>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="col-span-full flex items-center justify-center py-20">
                  <span className="font-mono text-sm text-gray-500 uppercase tracking-widest">
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
                      profession={formatProfession(user.profession)}
                      imageUrl={user.imageUrl}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activePanel === "admissions" && (
          <div className="flex min-h-0 flex-1 flex-col gap-[5px]">
            <div className="w-full flex items-center gap-[10px] border-b border-[#B8B8B8] shadow-[0_10px_8px_-8px_rgba(0,0,0,0.45)] px-3 py-2 text-[#343434]">
              <ClipboardList className="text-[#343434] bg-[#A6A6A6] rounded-md p-1 w-8 h-8" />
              <p>PENDING ADMISSIONS</p>
            </div>

            <AdmissionRequestsPanel onAdmissionResolved={loadUsers} />
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
          professions={professions}
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