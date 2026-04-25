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
import { UserAccessModal } from "./UserAccessModal";
import {
  PROFESSION_LABELS,
  normalizeProfession,
  toBackendProfession,
  type ProfessionKey,
} from "../../utils/authAccess";

type StatusFilter = "activos" | "inactivos" | "todos";
type PageSize = 8 | 12 | 16 | 24;

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
  const [isUserAccessModalOpen, setIsUserAccessModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("activos");
  const [isStatusSelectFocused, setIsStatusSelectFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(12);
  const [localError, setLocalError] = useState<string | null>(null);

  const peopleById = useMemo(() => buildPeopleById(people), [people]);

  const enrichedUsers = useMemo(
    () =>
      users
        .filter((user) => user?.id != null)
        .map((user) => enrichUser(user, peopleById)),
    [users, peopleById],
  );

  const selectedUser =
    selectedUserId != null
      ? enrichedUsers.find((user) => user.userId === selectedUserId) ?? null
      : null;

  const filteredUsers = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();

    return enrichedUsers.filter((user) => {
      const matchesSearch =
        !searchValue ||
        [
          user.name,
          user.lastName,
          user.role,
          user.id,
          PROFESSION_LABELS[user.profession],
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchValue);

      if (!matchesSearch) return false;
      if (statusFilter === "todos") return true;
      if (statusFilter === "activos") return user.active;
      return !user.active;
    });
  }, [enrichedUsers, searchTerm, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const pageStart = (safeCurrentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(pageStart, pageStart + pageSize);
  const visibleStart = filteredUsers.length === 0 ? 0 : pageStart + 1;
  const visibleEnd = Math.min(pageStart + pageSize, filteredUsers.length);

  const statusTitleMap: Record<StatusFilter, string> = {
    activos: "USUARIOS ACTIVOS",
    inactivos: "USUARIOS INACTIVOS",
    todos: "TODOS LOS USUARIOS",
  };

  const statusIcon =
    statusFilter === "activos" ? (
      <UserCheck className="h-8 w-8 rounded-md bg-accent p-1 text-accent-fg" />
    ) : statusFilter === "inactivos" ? (
      <UserRoundMinus className="h-8 w-8 rounded-md bg-bg-tertiary p-1 text-txt-secondary" />
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
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-bg-app font-mono">
        <div className="flex shrink-0 flex-col gap-3 border-b border-border-default bg-bg-secondary px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="font-aquire text-[24px] font-bold uppercase tracking-[0.3em] text-accent">
              Users
            </div>
            <div className="font-ibmplex text-[10px] font-bold uppercase tracking-[0.3em] text-txt-secondary">
              Access control / admitted personnel
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
            <button
              type="button"
              onClick={() => setIsRegistrationPanelOpen(true)}
              className="group flex w-full items-center justify-center gap-[10px] border border-border-default bg-bg-primary px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-txt-primary transition-colors hover:border-accent hover:text-accent sm:w-auto sm:justify-start"
            >
              <UserRoundPlus className="h-5 w-5 transition-colors group-hover:text-accent" />
              Registrar personal
            </button>
            <button
              type="button"
              onClick={() => setIsUserAccessModalOpen(true)}
              className="group flex w-full items-center justify-center gap-[10px] bg-accent px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-accent-fg transition-colors hover:bg-accent-hover sm:w-auto sm:justify-start"
            >
              <UserRoundPlus className="h-5 w-5" />
              Crear acceso
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden p-4 sm:p-6 lg:p-[30px]">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4 lg:gap-[30px]">
            <div className="group flex w-full flex-1 items-center gap-3 border border-border-default bg-bg-tertiary px-3 py-3 shadow-[0_1px_6px_rgba(0,0,0,0.10)] transition-colors focus-within:border-accent sm:gap-5 sm:py-[15px] lg:gap-[30px]">
              <UserRoundSearch className="self-center text-txt-secondary transition-colors group-focus-within:text-accent" />
              <input
                type="text"
                placeholder="Buscar usuario por nombre, DNI o perfil..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full self-center bg-transparent text-sm font-bold text-txt-primary outline-none placeholder:text-txt-disabled"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as StatusFilter);
                setCurrentPage(1);
              }}
              onFocus={() => setIsStatusSelectFocused(true)}
              onBlur={() => setIsStatusSelectFocused(false)}
              className={`w-full border px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] outline-none transition-all duration-200 sm:w-auto ${
                isStatusSelectFocused
                  ? "border-accent bg-accent text-accent-fg"
                  : "border-border-default bg-bg-primary text-txt-primary hover:border-accent hover:text-accent"
              }`}
            >
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
              <option value="todos">Todos</option>
            </select>
          </div>

        <div className="flex min-h-0 flex-1 flex-col gap-[5px] overflow-hidden">
          <div className="flex w-full flex-col gap-3 border-b border-border-default bg-[#FBFBFB] px-3 py-2 text-txt-primary shadow-[0_10px_8px_-8px_rgba(0,0,0,0.22)] lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-[10px]">
              {statusIcon}
              <p className="font-ibmplex text-xs font-bold uppercase tracking-label">
                {statusTitleMap[statusFilter]}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-txt-secondary">
                <span>
                  {visibleStart}-{visibleEnd} / {filteredUsers.length}
                </span>
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value) as PageSize);
                    setCurrentPage(1);
                  }}
                  className="border border-border-default bg-bg-secondary px-2 py-1 text-[10px] font-bold uppercase text-txt-primary outline-none transition-colors hover:border-accent focus:border-accent"
                  aria-label="Usuarios por pagina"
                >
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={16}>16</option>
                  <option value={24}>24</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
                  disabled={safeCurrentPage === 1 || isLoading || isLoadingPeople}
                  className="flex h-8 w-8 items-center justify-center border border-border-default text-txt-secondary transition-colors hover:border-accent hover:text-accent disabled:cursor-default disabled:opacity-30"
                  aria-label="Pagina anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="min-w-[76px] text-center text-[10px] font-bold uppercase tracking-[0.18em] text-txt-secondary">
                  {safeCurrentPage} / {pageCount}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.min(pageCount, safeCurrentPage + 1))}
                  disabled={safeCurrentPage === pageCount || isLoading || isLoadingPeople}
                  className="flex h-8 w-8 items-center justify-center border border-border-default text-txt-secondary transition-colors hover:border-accent hover:text-accent disabled:cursor-default disabled:opacity-30"
                  aria-label="Pagina siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  void handleRefresh();
                }}
                disabled={isLoading || isLoadingPeople}
                className="flex items-center justify-center gap-2 border border-border-default px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-txt-secondary transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
              >
                <RotateCcw
                  className={`h-4 w-4 ${isLoading || isLoadingPeople ? "animate-spin" : ""}`}
                />
                Refrescar
              </button>
            </div>
          </div>

          {viewError && (
            <div className="border border-status-critical bg-bg-secondary px-4 py-3 text-sm font-semibold text-status-critical">
              {viewError}
            </div>
          )}

          <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 content-start gap-3 overflow-y-auto overscroll-contain border border-border-default bg-[#FBFBFB] p-4 pr-3 shadow-[0_10px_30px_rgba(0,0,0,0.10)] lg:grid-cols-2 2xl:grid-cols-3">
            {(isLoading || isLoadingPeople) && (
              <div className="col-span-full flex min-h-[280px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-default border-t-accent" />
              </div>
            )}

            {!isLoading && !isLoadingPeople && filteredUsers.length === 0 && (
              <div className="col-span-full flex min-h-[280px] items-center justify-center px-6 text-center text-sm uppercase tracking-[0.2em] text-txt-secondary">
                No hay usuarios para mostrar.
              </div>
            )}

            {!isLoading &&
              !isLoadingPeople &&
              paginatedUsers.map((user) => (
                <div
                  key={user.userId}
                  className="relative cursor-pointer transition-all duration-250 ease-out hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(0,0,0,0.28)]"
                  onClick={() => setSelectedUserId(user.userId)}
                >
                  <UserCard
                    name={user.name}
                    lastName={user.lastName}
                    role={user.role}
                    id={user.id}
                    active={user.active}
                    profession={PROFESSION_LABELS[user.profession]}
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
