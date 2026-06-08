import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import { useNavigation } from "../app/NavigationContext";

export default function ForbiddenPage() {
    const navigate = useNavigate();
    const { sections } = useNavigation();
    const fallbackPath = sections[0]?.path ?? ROUTES.LOGIN;

    return (
        <div className="w-full h-full flex flex-col bg-bg-app overflow-hidden">
            <div className="w-full bg-bg-secondary border-b border-border-default px-8 py-3 flex items-center justify-between shrink-0">
                <div className="text-[12px] font-mono tracking-wide text-txt-secondary uppercase font-bold">
                    Access Control
                </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-6">
                <span className="font-mono text-8xl font-bold text-[#E85D04] tracking-tight select-none">
                    403
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-txt-secondary">
                    ACCESS DENIED
                </span>
                <button
                    onClick={() => navigate(fallbackPath, { replace: true })}
                    className="font-mono text-[11px] uppercase tracking-label border border-border-default px-6 py-2 text-txt-secondary hover:bg-bg-secondary transition-colors cursor-pointer"
                >
                    BACK TO AVAILABLE SECTION
                </button>
            </div>
        </div>
    );
}
