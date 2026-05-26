import {
  BriefcaseBusiness,
  HeartPulse,
  Map,
  Package,
  Shield,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type UseUserProfileModalParams = {
  active: boolean;
  profession: string;
  professions: string[];
  onToggleActive: () => void;
};

const professionIconMap: Record<string, LucideIcon> = {
  MEDICINA: HeartPulse,
  EXPLORACION: Map,
  LOGISTICA: Package,
  MANTENIMIENTO: Wrench,
  SEGURIDAD: Shield,
  OPERACIONES: BriefcaseBusiness,
};

export function formatProfession(value?: string | null) {
  if (!value) return "SIN PROFESIÓN";

  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function useUserProfileModal({
  active,
  profession,
  professions,
  onToggleActive,
}: UseUserProfileModalParams) {
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

  const professionOptions = professions.includes(profession)
    ? professions
    : [profession, ...professions].filter(Boolean);

  const handleToggleClick = () => {
    onToggleActive();
    setIsToggleAnimating(true);
    clearToggleTimer();

    toggleAnimationTimerRef.current = window.setTimeout(() => {
      setIsToggleAnimating(false);
      toggleAnimationTimerRef.current = null;
    }, 1000);
  };

  const defaultButtonBackground = active
    ? "user-profile-toggle-bg-off"
    : "user-profile-toggle-bg-on";

  const defaultButtonText = active
    ? "user-profile-toggle-text-off"
    : "user-profile-toggle-text-on";

  const transitionButtonBackground = active
    ? "user-profile-toggle-bg-off-strong"
    : "user-profile-toggle-bg-on-strong";

  const isTextWhite = isToggleAnimating;

  const iconColorClass = active
    ? "user-profile-icon-active"
    : "user-profile-icon-inactive";

  const ProfessionIcon = professionIconMap[profession] ?? BriefcaseBusiness;

  return {
    isToggleAnimating,
    professionOptions,
    handleToggleClick,
    defaultButtonBackground,
    defaultButtonText,
    transitionButtonBackground,
    isTextWhite,
    iconColorClass,
    ProfessionIcon,
    formatProfession,
  };
}