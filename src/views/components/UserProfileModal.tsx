import {
  MonitorCog,
  Pickaxe,
  Power,
  PowerOff,
  ShelvingUnit,
  TentTree,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type UserDetailModalProps = {
  name: string;
  lastName: string;
  role: string;
  sex: string;
  id: string;
  active: boolean;
  profession: string;
  registrationDate: Date;
  birthdate: Date;
  imageUrl?: string;
  onToggleActive: () => void;
  onClose: () => void;
};

export function UserProfileModal({
  name,
  lastName,
  role,
  sex,
  id,
  active,
  profession,
  registrationDate,
  birthdate,
  imageUrl,
  onToggleActive,
  onClose,
}: UserDetailModalProps) {
  const [isToggleAnimating, setIsToggleAnimating] = useState(false);
  const toggleAnimationTimerRef = useRef<number | null>(null);

  const clearToggleTimer = () => {
    if (toggleAnimationTimerRef.current !== null) {
      window.clearTimeout(toggleAnimationTimerRef.current);
      toggleAnimationTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearToggleTimer();
    };
  }, []);

  const handleToggleClick = () => {
    onToggleActive();
    setIsToggleAnimating(true);
    clearToggleTimer();

    toggleAnimationTimerRef.current = window.setTimeout(() => {
      setIsToggleAnimating(false);
      toggleAnimationTimerRef.current = null;
    }, 1000);
  };

  const defaultButtonBackground = active ? "bg-[#FEBBC3]" : "bg-[#CCFFCC]";
  const defaultButtonText = active ? "text-[#EB021F]" : "text-[#00cc00]";
  const transitionButtonBackground = active ? "bg-[#EB021F]" : "bg-[#00cc00]";
  const isTextWhite = isToggleAnimating;
  const valueTextClass =
    "m-0 font-mono text-[24px] leading-[118%] tracking-[-0.24px] md:text-[20px]";

  const professionIcon = (() => {
    switch (profession) {
      case "Trabajador":
        return <Pickaxe className="h-6 w-6 text-[#FF6600]" />;
      case "Líder de expedición":
        return <TentTree className="h-6 w-6 text-[#FF6600]" />;
      case "Administrador de sistemas":
        return <MonitorCog className="h-6 w-6 text-[#FF6600]" />;
      case "Gestor de recursos":
        return <ShelvingUnit className="h-6 w-6 text-[#FF6600]" />;
      default:
        return null;
    }
  })();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6 md:p-10 lg:p-12 xl:p-16"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-[1100px] flex-col overflow-y-auto bg-white font-mono lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="m-0 flex w-full shrink-0 flex-col items-center justify-start bg-[#333333] p-0 pt-0 text-center text-white lg:w-[38%]">
          <div className="mb-[15px] h-[80px] w-[70px] shrink-0 bg-[#FF6600]"></div>
          <div className="mb-6 mt-0 flex w-[calc(100%-3rem)] max-w-[320px] flex-col items-center justify-start gap-[10px] rounded-xl border-[3px] border-[#666666] bg-[#212121] p-4 text-center shadow-[0_0_10px_rgba(0,0,0,0.35),0_14px_28px_rgba(0,0,0,0.4)] lg:mb-[50px] lg:mt-0 lg:p-[25px]">
            <div className="mb-[30px] h-[8px] w-[200px] rounded-full bg-[#6666664D] sm:w-[220px]"></div>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Profile"
                className="h-[200px] w-[200px] object-cover object-center sm:h-[220px] sm:w-[220px]"
              />
            )}
            <p className="m-0 font-mono text-[24px] leading-[118%] tracking-[-0.24px] text-[#FF6600] md:text-[20px]">
              {role}
            </p>
            <p>
              {name} {lastName}
            </p>
            <div className="mt-[10px] flex w-full items-center justify-center">
              {professionIcon}
            </div>
          </div>
        </div>
        <div className="flex w-full min-w-0 flex-1 flex-col gap-[20px] p-6 sm:p-8 md:p-10 lg:p-[60px]">
          <div>
            <p className="text-[15px] text-[#8C8C8C]">CEDULA</p>
            <p className={valueTextClass} style={{ color: "#000000" }}>
              {id}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2">
            <div>
              <p className="text-[15px] text-[#8C8C8C]">NOMBRE</p>
              <p className={valueTextClass} style={{ color: "#000000" }}>
                {name}
              </p>
            </div>
            <div>
              <p className="text-[15px] text-[#8C8C8C]">APELLIDO</p>
              <p className={valueTextClass} style={{ color: "#000000" }}>
                {lastName}
              </p>
            </div>
            <div>
              <p className="text-[15px] text-[#8C8C8C]">SEXO</p>
              <p className={valueTextClass} style={{ color: "#000000" }}>
                {sex}
              </p>
            </div>
            <div>
              <p className="text-[15px] text-[#8C8C8C]">FECHA NACIMIENTO</p>
              <p className={valueTextClass} style={{ color: "#000000" }}>
                {birthdate.toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="border-b border-[#C4C4C4] pb-[24px]">
            <p className="text-[15px] text-[#8C8C8C]">PROFESIÓN</p>
            <select
              defaultValue={profession}
              className="font-mono w-full rounded-none border border-[#D9D9D9] bg-[#E6E6E6] px-3 py-2 text-black outline-none transition-all duration-200 hover:shadow-[0_0_0_3px_rgba(115,115,115,0.22),0_8px_18px_rgba(80,80,80,0.22)] focus:border-[#D9D9D9] focus:text-[#FF6600] focus:ring-0 [&_option]:bg-[#E6E6E6] [&_option]:font-mono [&_option]:text-black [&_option:hover]:bg-[#1A1A1A] [&_option:hover]:text-[#FF6600]"
            >
              <option value="Administrador de sistemas">
                Administrador de sistemas
              </option>
              <option value="Trabajador">Trabajador</option>
              <option value="Gestor de recursos">Gestor de recursos</option>
              <option value="Líder de expedición">Líder de expedición</option>
            </select>
          </div>
          <div>
            <p className="text-[15px] text-[#8C8C8C]">FECHA DE REGISTRO</p>
            <p className={valueTextClass} style={{ color: "#737373" }}>
              {registrationDate.toLocaleDateString()}
            </p>
          </div>
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={handleToggleClick}
              className={`font-mono rounded px-4 py-2 font-semibold transition-all transition-colors duration-1000 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,0,0,0.35)] ${
                isTextWhite ? "text-white" : defaultButtonText
              } ${
                isToggleAnimating
                  ? `${transitionButtonBackground} scale-105`
                  : `${defaultButtonBackground} scale-100`
              }`}
            >
              {active ? (
                <PowerOff className="mr-2 inline-block h-4 w-4" />
              ) : (
                <Power className="mr-2 inline-block h-4 w-4" />
              )}
              {active ? "DESACTIVAR PERFIL" : "ACTIVAR PERFIL"}
            </button>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}
