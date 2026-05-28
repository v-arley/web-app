import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-full flex flex-col bg-bg-app overflow-hidden">
            {/* Header bar — mismo estilo que otras vistas */}
            <div className="w-full bg-bg-secondary border-b border-border-default px-8 py-3 flex items-center justify-between shrink-0">
                <div className="text-[12px] font-mono tracking-wide text-txt-secondary uppercase font-bold">
                    Error
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col items-center justify-center gap-6">
                <span className="font-mono text-8xl font-bold text-[#E85D04] tracking-tight select-none">
                    404
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-txt-secondary">
                    ROUTE NOT FOUND
                </span>
                <button
                    onClick={() => navigate(ROUTES.DASHBOARD, { replace: true })}
                    className="font-mono text-[11px] uppercase tracking-label border border-border-default px-6 py-2 text-txt-secondary hover:bg-bg-secondary transition-colors cursor-pointer"
                >
                    BACK TO DASHBOARD
                </button>
            </div>
        </div>
    );
}


