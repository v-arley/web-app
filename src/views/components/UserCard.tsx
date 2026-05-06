import { Activity } from "lucide-react";
import { LineDotRightHorizontal } from "lucide-react";
import { IdCard } from "lucide-react";
import { UserRoundX } from "lucide-react";

type UserCardProps = {
  name: string;
  lastName: string;
  role: string;
  id: string;
  active: boolean;
  profession: string;
  imageUrl: string;
};

export function UserCard({
  name,
  lastName,
  role,
  id,
  active,
  profession,
  imageUrl,
}: UserCardProps) {
  return (
    <div className="bg-[#1d1d1d] font-mono">
      <div className="relative overflow-visible">
        <div className="absolute right-3 top-3 z-10 flex min-w-[140px] items-center justify-between rounded-full bg-black/60 px-4 py-2 text-white sm:min-w-[150px] sm:px-[19px] sm:py-[10.5px]">
          {active ? (
            <Activity className="h-6 w-6 text-[#00cc00] sm:h-7 sm:w-7" />
          ) : (
            <LineDotRightHorizontal className="h-6 w-6 text-[#ff3131] sm:h-7 sm:w-7" />
          )}
          <p
            className={
              active ? "text-[#66ff66] text-sm" : "text-[#ff3131] text-sm"
            }
          >
            {active ? "Activo" : "Inactivo"}
          </p>
        </div>
        <img
          src={imageUrl}
          alt={name}
          className={`block h-[260px] w-full object-cover object-center sm:h-[295px] ${
            active ? "" : "grayscale"
          }`}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1d1d1d] via-[rgb(29_29_29_/_0.6)] to-transparent" />
      </div>
      <div className="flex flex-col gap-2.5 p-5 sm:p-[30px]">
        <div>
          <h2 className={active ? "text-white" : "text-[#a6a6a6]"}>{name}</h2>
          <h2 className={active ? "text-white" : "text-[#a6a6a6]"}>
            {lastName}
          </h2>
        </div>
        <div className="border-b border-[#737373]">
          <p className={active ? "text-[#ff6600]" : "text-[#a6a6a6]"}>
            {profession}
          </p>
          <p className="text-[#c0c0c0]">{role}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#a6a6a6]">ID</p>
            <p className="text-[#d9d9d9]">{id}</p>
          </div>
          <div>
            {active ? (
              <IdCard
                strokeWidth={1.25}
                className="h-9 w-9 text-[#ff6600] sm:h-10 sm:w-10"
              />
            ) : (
              <UserRoundX className="h-9 w-9 text-[#a6a6a6] sm:h-10 sm:w-10" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
