import { useEffect, useMemo, useState } from "react";
import { useNavigation } from "../app/NavigationContext";
import { getRoleLabel } from "../utils/authAccess";
import { NotificationBell } from "./NotificationBell";
import { Menu } from "lucide-react";

type HeaderProps = {
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
};

export default function Header({ isSidebarOpen, onToggleSidebar }: HeaderProps) {
    const { authContext, activeCamp } = useNavigation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const roleLabel = useMemo(() => getRoleLabel(authContext), [authContext]);
    const campLabel = useMemo(() => {
        const campCode = activeCamp?.code?.trim();

        if (campCode) {
            return campCode;
        }

        return "NOT RESOLVED";
    }, [activeCamp]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (d: Date) =>
        d.toLocaleTimeString("en-US", { hour12: false });

    const formatDate = (d: Date) => {
        const dd = d.getDate().toString().padStart(2, "0");
        const mm = (d.getMonth() + 1).toString().padStart(2, "0");
        return `${dd}/${mm}/${d.getFullYear()}`;
    };

    return (
        <header className="topbar">
            {/* Left: camp info + auth context */}
            <div className="topbar-left">
                <button
                    type="button"
                    className="sidebar-toggle-btn"
                    aria-label={isSidebarOpen ? "Ocultar navegacion" : "Mostrar navegacion"}
                    aria-controls="app-sidebar"
                    aria-expanded={isSidebarOpen}
                    onClick={onToggleSidebar}
                >
                    <Menu size={18} aria-hidden="true" />
                </button>
                <div className="topbar-identity">
                    <div className="topbar-meta">
                        <span>ADMIN: {authContext.name}</span>
                        <span className="topbar-meta-separator">|</span>
                        <span className="topbar-meta-optional">ROLE: {roleLabel}</span>
                        {authContext.profession && (
                            <>
                                <span className="topbar-meta-separator topbar-meta-optional">|</span>
                                <span className="topbar-meta-optional">PROFILE: {authContext.profession}</span>
                            </>
                        )}
                        {activeCamp?.location_x != null &&
                            activeCamp?.location_y != null && (
                                <>
                                    <span className="topbar-meta-separator topbar-meta-optional">|</span>
                                    <span className="topbar-meta-optional">
                                        COORDS: {activeCamp.location_x.toFixed(3)},{" "}
                                        {activeCamp.location_y.toFixed(3)}
                                    </span>
                                </>
                            )}
                    </div>
                    <div className="topbar-title">
                        <span>CAMP </span>
                        <span className="topbar-camp-code">
                            {campLabel}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: notifications, clock, status */}
            <div className="topbar-right">
                <NotificationBell />
                <div className="topbar-clock">
                    <span>
                        <span className="topbar-clock-label">Time: </span><strong>{formatTime(currentDate)}</strong>
                    </span>
                    <span>
                        <span className="topbar-clock-label">Date: </span><strong>{formatDate(currentDate)}</strong>
                    </span>
                </div>
                {/* <div className="topbar-presence">
                    <div className="topbar-status">
                        <div className="status-dot online" />
                        <span>Online</span>
                    </div>
                </div> */}
            </div>
        </header>
    );
}
