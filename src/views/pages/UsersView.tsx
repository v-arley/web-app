import { UserRoundSearch } from "lucide-react";
import { UserRoundPlus } from "lucide-react";
import { UserCheck, UserRoundMinus, UsersRound } from "lucide-react";
import { UserCard } from "../components/UserCard";
import { UserProfileModal } from "../components/UserProfileModal";
import { RegistrationPanel } from "./RegistrationPanel";
import { useState, useEffect } from "react";
import { UserService } from "../../services/UserService";
import type { User } from "../../models/User";

const userService = new UserService();

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

type UserCardData = {
  idUser: number;
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
};



export function UsersView() {
  const [users, setUsers] = useState<UserCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserCardData | null>(null);
  const [isRegistrationPanelOpen, setIsRegistrationPanelOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [isStatusSelectFocused, setIsStatusSelectFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) => {
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? user.active
        : !user.active;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      user.name.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      professionLabels[user.profession]?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
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
      <UsersRound className="text-[#343434] bg-[#A6A6A6] rounded-md p-1 w-8 h-8" />
    );

  const handleToggleUserActive = async () => {
    if (!selectedUser) return;
    const nextActive = !selectedUser.active;

    if (selectedUser.idUser) {
      await userService.update(selectedUser.idUser, { active: nextActive });
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, active: nextActive } : u,
      ),
    );
    setSelectedUser((prev) => (prev ? { ...prev, active: nextActive } : prev));
  };

  const handleChangeProfession = async (nextProfession: ProfessionKey) => {
    if (!selectedUser) return;

    if (selectedUser.idUser) {
      await userService.update(selectedUser.idUser, {
        profession: nextProfession,
      });
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, profession: nextProfession } : u,
      ),
    );
    setSelectedUser((prev) =>
      prev ? { ...prev, profession: nextProfession } : prev,
    );
  };

  useEffect(() => {
    let active = true;
    userService.findAll().then((resp) => {
      if (!active) return;
      if (resp.getEstado()) {
        const apiUsers = resp.getResultado<User[]>("registros") ?? [];
        const mapped: UserCardData[] = apiUsers.map((u) => ({
          idUser: u.id ?? 0,
          id: u.person?.dni ?? String(u.id ?? ""),
          name: u.person?.name ?? u.name ?? "",
          lastName: u.person?.last_name ?? u.person?.surname ?? "",
          role: u.username ?? "",
          sex: (u.person?.sex ?? "M") as "M" | "F",
          profession: (u.profession ?? "worker") as ProfessionKey,
          active: u.active ?? u.state === "A",
          registrationDate: u.created_at ? new Date(u.created_at) : new Date(),
          birthdate: u.person?.date_birth
            ? new Date(u.person.date_birth)
            : new Date(),
          imageUrl: u.person?.photo ?? "",
        }));
        setUsers(mapped);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <div className="flex h-[calc(100vh-120px)] min-h-[calc(100vh-120px)] flex-col gap-6 p-4 font-mono sm:gap-7 sm:p-6 lg:p-[30px]">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4 lg:gap-[30px]">
          <div className="group flex w-full flex-1 items-center gap-3 rounded-lg border border-[#B8B8B8] bg-[#CCCCCC] px-3 py-3 shadow-[0_1px_6px_rgba(0,0,0,0.10)] transition-colors focus-within:border-[#FF6600] sm:gap-5 sm:py-[15px] lg:gap-[30px]">
            <UserRoundSearch className="self-center text-gray-500 transition-colors group-focus-within:text-[#FF6600]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            {searchQuery && (
              <span className="ml-auto text-xs text-gray-500">
                {filteredUsers.length} resultado{filteredUsers.length !== 1 ? "s" : ""}
              </span>
            )}
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
              ))
            )}
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
          onToggleActive={handleToggleUserActive}
          onChangeProfession={handleChangeProfession}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {isRegistrationPanelOpen && (
        <RegistrationPanel onClose={() => setIsRegistrationPanelOpen(false)} />
      )}
    </>
  );
}