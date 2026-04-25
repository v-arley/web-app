import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  UserCheck,
  UserRoundMinus,
  UserRoundPlus,
  UserRoundSearch,
  UsersRound,
} from "lucide-react";
import type { CreateUser, User } from "../../models/User";
import type { Person } from "../../models/Person";
import { useUsers } from "../../hooks/useUsers";
import { UserCard } from "../components/UserCard";
import { UserProfileModal } from "../components/UserProfileModal";
import { RegistrationPanel } from "./RegistrationPanel";
import { useState } from "react";

const professionLabels: Record<string, string> = {
  system_administrator: "System Administrator",
  worker: "Worker",
  resource_manager: "Resource Manager",
  expedition_leader: "Expedition Leader",
};

type ProfessionKey =
  | "system_administrator"
  | "worker"
  | "resource_manager"
  | "expedition_leader";

type StatusFilter = "active" | "inactive" | "all";

type EnrichedUserCardData = {
  userId: number;
  personId: number | null;
  id: string;
  name: string;
  lastName: string;
  role: string;
  sex: "M" | "F";
  profession: ProfessionKey;
  active: boolean;
  registrationDate: Date;
  birthdate: Date;
  imageUrl: string;
  rawUser: User;
};

const fallbackImageUrl =
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop";

function safeText(value: unknown, fallback: string) {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function safeDate(value: unknown, fallback = new Date()) {
  if (!value) return fallback;
  const date = new Date(value as string | number | Date);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

function getUserPersonId(user: User) {
  return user.person_id ?? user.person?.id ?? null;
}

function buildPeopleById(people: Person[]) {
  return new Map(
    people
      .filter((person) => person?.id != null)
      .map((person) => [person.id as number, person]),
  );
}

function enrichUser(user: User, peopleById: Map<number, Person>): EnrichedUserCardData {
  const personId = getUserPersonId(user);
  const person = user.person ?? (personId != null ? peopleById.get(personId) : null);
  const userId = user.id ?? 0;
  const username = safeText(user.username ?? user.name, `usuario-${userId || "nuevo"}`);

  return {
    userId,
    personId,
    id: safeText(person?.dni, userId ? `USR-${userId}` : username),
    name: safeText(person?.name, username),
    lastName: safeText(person?.last_name ?? person?.surname, "Acceso"),
    role: username,
    sex: person?.sex === "F" ? "F" : "M",
    profession: normalizeProfession(user.profession),
    active: user.state ? user.state === "A" : user.active ?? true,
    registrationDate: safeDate(user.created_at),
    birthdate: safeDate(person?.date_birth ?? person?.date_of_birth),
    imageUrl: safeText(person?.photo, fallbackImageUrl),
    rawUser: user,
  };
}

export function UsersView() {
  const {
    users,
    people,
    isLoading,
    isLoadingPeople,
    error,
    refresh,
    create,
    update,
    remove,
    clearError,
  } = useUsers();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isRegistrationPanelOpen, setIsRegistrationPanelOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [isStatusSelectFocused, setIsStatusSelectFocused] = useState(false);

  const filteredUsers = users.filter((user) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return user.active;
    return !user.active;
  });

  const statusTitleMap: Record<StatusFilter, string> = {
    active: "ACTIVE STAFF",
    inactive: "INACTIVE STAFF",
    all: "ALL STAFF",
  };

  const statusIcon =
    statusFilter === "active" ? (
      <UserCheck className="text-[#343434] bg-[#A6A6A6] rounded-md p-1 w-8 h-8" />
    ) : statusFilter === "inactive" ? (
      <UserRoundMinus className="text-[#343434] bg-[#A6A6A6] rounded-md p-1 w-8 h-8" />
    ) : (
      <UsersRound className="h-8 w-8 rounded-md bg-bg-tertiary p-1 text-txt-secondary" />
    );

  const viewError = localError ?? error;

  const handleRefresh = async () => {
    setLocalError(null);
    clearError();
    await refresh();
  };

  const handleCreateAccess = async (payload: CreateUser) => {
    setLocalError(null);
    clearError();
    const ok = await create(payload);
    if (!ok) {
      setLocalError("No se pudo crear el acceso de usuario.");
      return false;
    }

    await refresh();
    return true;
  };

  const handleToggleUserActive = async () => {
    if (!selectedUser || selectedUser.userId === 0) return;

    setLocalError(null);
    clearError();

    const ok = await update(selectedUser.userId, {
      state: selectedUser.active ? "I" : "A",
    });

    if (!ok) {
      setLocalError("No se pudo actualizar el estado del usuario.");
    }
  };

  const handleChangeProfession = async (nextProfession: ProfessionKey) => {
    if (!selectedUser || selectedUser.userId === 0) return;

    setLocalError(null);
    clearError();

    const ok = await update(selectedUser.userId, {
      profession: toBackendProfession(nextProfession),
    });

    if (!ok) {
      setLocalError("No se pudo actualizar el perfil operativo.");
    }
  };

  const handleRemoveAccess = async () => {
    if (!selectedUser || selectedUser.userId === 0) return;

    setLocalError(null);
    clearError();

    const ok = await remove(selectedUser.userId);
    if (!ok) {
      setLocalError("No se pudo eliminar el acceso de usuario.");
      return;
    }

    setSelectedUserId(null);
  };

  return (
    <>
      <div className="flex h-[calc(100vh-120px)] min-h-[calc(100vh-120px)] flex-col gap-6 p-4 font-mono sm:gap-7 sm:p-6 lg:p-[30px]">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4 lg:gap-[30px]">
          <div className="group flex w-full flex-1 items-center gap-3 rounded-lg border border-[#B8B8B8] bg-[#CCCCCC] px-3 py-3 shadow-[0_1px_6px_rgba(0,0,0,0.10)] transition-colors focus-within:border-[#FF6600] sm:gap-5 sm:py-[15px] lg:gap-[30px]">
            <UserRoundSearch className="self-center text-gray-500 transition-colors group-focus-within:text-[#FF6600]" />
            <input
              type="text"
              placeholder="Search staff by name or role..."
              className="w-full self-center bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
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
          <button
            type="button"
            onClick={() => setIsRegistrationPanelOpen(true)}
            className="group flex w-full items-center justify-center gap-[10px] rounded-lg border border-black bg-black px-4 py-2 text-white transition-colors hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-black sm:w-auto sm:justify-start"
          >
            <UserRoundPlus className="text-white transition-colors group-hover:text-black" />
            Register staff
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-[5px]">
          <div className="w-full flex items-center gap-[10px] border-b border-[#B8B8B8] shadow-[0_10px_8px_-8px_rgba(0,0,0,0.45)] px-3 py-2 text-[#343434]">
            {statusIcon}
            <p>{statusTitleMap[statusFilter]}</p>
          </div>
          <div className="mt-6 grid min-h-0 flex-1 grid-cols-1 content-start gap-6 overflow-y-auto rounded-xl bg-transparent p-[25px] shadow-none md:grid-cols-2 xl:grid-cols-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="relative transition-all duration-250 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_16px_28px_rgba(0,0,0,0.42),0_0_18px_rgba(51,19,1,0.55)]"
                onClick={() => setSelectedUser(user)}
              >
                <UserCard
                  name={user.name}
                  lastName={user.lastName}
                  role={user.role}
                  id={user.id}
                  active={user.active}
                  profession={professionLabels[user.profession]}
                  imageUrl={user.imageUrl}
                />
              </div>
            ))}
          </div>
        </div>
        </div>
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
          registrationDate={selectedUser.registrationDate}
          birthdate={selectedUser.birthdate}
          imageUrl={selectedUser.imageUrl}
          onToggleActive={() => {
            void handleToggleUserActive();
          }}
          onChangeProfession={(profession) => {
            void handleChangeProfession(profession);
          }}
          onRemove={() => {
            void handleRemoveAccess();
          }}
          onClose={() => setSelectedUserId(null)}
        />
      )}

      {isRegistrationPanelOpen && (
        <RegistrationPanel onClose={() => setIsRegistrationPanelOpen(false)} />
      )}

      {isUserAccessModalOpen && (
        <UserAccessModal
          people={people}
          isLoadingPeople={isLoadingPeople}
          error={error}
          isSaving={isLoading}
          onClose={() => setIsUserAccessModalOpen(false)}
          onCreate={handleCreateAccess}
        />
      )}
    </>
  );
}
