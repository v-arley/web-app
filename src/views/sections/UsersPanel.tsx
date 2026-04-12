import { UserRoundSearch } from "lucide-react";
import { UserRoundPlus } from "lucide-react";
import { UserCheck, UserRoundMinus, UsersRound } from "lucide-react";
import { UserCard } from "../components/UserCard";
import { UserProfileModal } from "../components/UserProfileModal";
import { useState } from "react";

const professionLabels: Record<string, string> = {
  system_administrator: "Administrador de sistemas",
  worker: "Trabajador",
  resource_manager: "Gestor de recursos",
  expedition_leader: "Líder de expedición",
};

type ProfessionKey =
  | "system_administrator"
  | "worker"
  | "resource_manager"
  | "expedition_leader";

type StatusFilter = "activos" | "inactivos" | "todos";

type UserCardData = {
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

const initialUsers: UserCardData[] = [
  {
    id: "45.281.902-K",
    name: "Stephen",
    lastName: "Cole",
    role: "Thermal Controls",
    sex: "M",
    profession: "system_administrator",
    active: true,
    registrationDate: new Date("2023-01-15"),
    birthdate: new Date("1985-03-20"),
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "31.992.188-B",
    name: "Elena",
    lastName: "Rodriguez",
    role: "Aerospace Design",
    sex: "F",
    profession: "resource_manager",
    active: true,
    registrationDate: new Date("2023-09-08"),
    birthdate: new Date("1992-11-03"),
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "22.881.004-C",
    name: "Sarah",
    lastName: "Jenkins",
    role: "Human Factors",
    sex: "F",
    profession: "worker",
    active: true,
    registrationDate: new Date("2024-03-21"),
    birthdate: new Date("1995-07-18"),
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "18.330.441-X",
    name: "Marcus",
    lastName: "Thorne",
    role: "Information Defense",
    sex: "M",
    profession: "expedition_leader",
    active: true,
    registrationDate: new Date("2023-12-01"),
    birthdate: new Date("1986-02-27"),
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
  },
];

export function UsersPanel() {
  const [users, setUsers] = useState<UserCardData[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<UserCardData | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("activos");

  const filteredUsers = users.filter((user) => {
    if (statusFilter === "todos") return true;
    if (statusFilter === "activos") return user.active;
    return !user.active;
  });

  const statusTitleMap: Record<StatusFilter, string> = {
    activos: "PERSONAL ACTIVOS",
    inactivos: "PERSONAL INACTIVOS",
    todos: "TODO EL PERSONAL",
  };

  const statusIcon =
    statusFilter === "activos" ? (
      <UserCheck className="text-[#343434] bg-[#A6A6A6] rounded-md p-1 w-8 h-8" />
    ) : statusFilter === "inactivos" ? (
      <UserRoundMinus className="text-[#343434] bg-[#A6A6A6] rounded-md p-1 w-8 h-8" />
    ) : (
      <UsersRound className="text-[#343434] bg-[#A6A6A6] rounded-md p-1 w-8 h-8" />
    );

  const handleToggleUserActive = () => {
    if (!selectedUser) return;

    const nextActive = !selectedUser.active;
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id ? { ...user, active: nextActive } : user,
      ),
    );
    setSelectedUser((prevSelected) =>
      prevSelected ? { ...prevSelected, active: nextActive } : prevSelected,
    );
  };

  const handleChangeProfession = (nextProfession: ProfessionKey) => {
    if (!selectedUser) return;

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id
          ? { ...user, profession: nextProfession }
          : user,
      ),
    );

    setSelectedUser((prevSelected) =>
      prevSelected
        ? { ...prevSelected, profession: nextProfession }
        : prevSelected,
    );
  };

  return (
    <>
      <div className="flex min-h-[calc(100vh-120px)] flex-col gap-6 p-4 font-mono sm:gap-7 sm:p-6 lg:p-[30px]">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4 lg:gap-[30px]">
          <div className="group flex w-full flex-1 items-center gap-3 rounded-lg border border-[#B8B8B8] bg-[#CCCCCC] px-3 py-3 shadow-[0_1px_6px_rgba(0,0,0,0.10)] transition-colors focus-within:border-[#FF6600] sm:gap-5 sm:py-[15px] lg:gap-[30px]">
            <UserRoundSearch className="self-center text-gray-500 transition-colors group-focus-within:text-[#FF6600]" />
            <input
              type="text"
              placeholder="Buscar personal por nombre o rol..."
              className="w-full self-center bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="w-full rounded-lg border border-black bg-black px-4 py-2 text-white outline-none transition-all duration-200 hover:border-[#FF6600] hover:text-[#FF6600] hover:shadow-[0_10px_20px_rgba(0,0,0,0.35)] focus:border-black focus:bg-black focus:text-white focus:ring-0 sm:w-auto"
          >
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
            <option value="todos">Todos</option>
          </select>
          <button className="group flex w-full items-center justify-center gap-[10px] rounded-lg border border-black bg-black px-4 py-2 text-white transition-colors hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-black sm:w-auto sm:justify-start">
            <UserRoundPlus className="text-white transition-colors group-hover:text-black" />
            Registrar personal
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-[5px]">
          <div className="w-full flex items-center gap-[10px] border-b border-[#B8B8B8] shadow-[0_10px_8px_-8px_rgba(0,0,0,0.45)] px-3 py-2 text-[#343434]">
            {statusIcon}
            <p>{statusTitleMap[statusFilter]}</p>
          </div>
          <div className="mt-6 grid min-h-[calc(100vh-320px)] flex-1 grid-cols-1 content-start gap-6 rounded-xl bg-[#cecece] p-[25px] shadow-[0_0_18px_rgba(0,0,0,0.35),inset_0_0_14px_rgba(115,115,115,0.33)] md:grid-cols-2 xl:grid-cols-3">
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
    </>
  );
}
