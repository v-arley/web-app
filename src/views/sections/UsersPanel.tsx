import { UserRoundSearch } from "lucide-react";
import { UserRoundPlus } from "lucide-react";
import { UserCheck } from "lucide-react";
import { UserCard } from "../components/UserCard";
import { UserProfileModal } from "../components/UserProfileModal";
import { useState } from "react";

const professionLabels: Record<string, string> = {
  system_administrator: "Administrador de sistemas",
  worker: "Trabajador",
  resource_manager: "Gestor de recursos",
  expedition_leader: "Líder de expedición",
};

type UserCardData = {
  id: string;
  name: string;
  lastName: string;
  role: string;
  profession: string;
  active: boolean;
  imageUrl: string;
};

const initialUsers: UserCardData[] = [
  {
    id: "45.281.902-K",
    name: "Stephen",
    lastName: "Cole",
    role: "Thermal Controls",
    profession: "system_administrator",
    active: true,
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "31.992.188-B",
    name: "Elena",
    lastName: "Rodriguez",
    role: "Aerospace Design",
    profession: "resource_manager",
    active: true,
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "22.881.004-C",
    name: "Sarah",
    lastName: "Jenkins",
    role: "Human Factors",
    profession: "worker",
    active: true,
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "18.330.441-X",
    name: "Marcus",
    lastName: "Thorne",
    role: "Information Defense",
    profession: "expedition_leader",
    active: true,
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
  },
];

export function UsersPanel() {
  const [users, setUsers] = useState<UserCardData[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<UserCardData | null>(null);

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

  return (
    <>
      <div className="flex flex-col font-mono gap-[35px] p-[30px]">
        <div className="flex items-center gap-[30px]">
          <div className="flex-1 flex items-center gap-[30px] rounded-lg bg-[#CCCCCC] px-3 py-[15px] border border-[#B8B8B8] shadow-[0_1px_6px_rgba(0,0,0,0.10)] active:border-[#FF6600] focus-within:border-[#FF6600] transition-colors group">
            <UserRoundSearch className="self-center text-gray-500 transition-colors group-focus-within:text-[#FF6600]" />
            <input
              type="text"
              placeholder="Buscar personal por nombre o rol..."
              className="self-center w-full bg-transparent outline-none text-sm text-gray-500 placeholder:text-gray-500"
            />
          </div>
          <button className="group flex items-center gap-[10px] rounded-lg border border-black bg-black px-4 py-2 text-white transition-colors hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-black">
            <UserRoundPlus className="text-white transition-colors group-hover:text-black" />
            Registrar personal
          </button>
        </div>
        <div className="flex flex-col gap-[5px]">
          <div className="w-full flex items-center gap-[10px] border-b border-[#B8B8B8] shadow-[0_10px_8px_-8px_rgba(0,0,0,0.45)] px-3 py-2 text-[#343434]">
            <UserCheck className="text-[#343434] bg-[#A6A6A6] rounded-md p-1 w-8 h-8" />
            <p>PERSONAL ACTIVOS</p>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 rounded-xl p-[25px] bg-[#cecece] shadow-[0_0_18px_rgba(0,0,0,0.35),inset_0_0_14px_rgba(115,115,115,0.33)]">
            {users.map((user) => (
              <div
                key={user.id}
                className="relative shadow-[0_0_14px_rgba(51,19,1,0.45)]"
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
          sex="M"
          id={selectedUser.id}
          active={selectedUser.active}
          profession={professionLabels[selectedUser.profession]}
          registrationDate={new Date("2024-01-15")}
          birthdate={new Date("1988-05-12")}
          imageUrl={selectedUser.imageUrl}
          onToggleActive={handleToggleUserActive}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
}
