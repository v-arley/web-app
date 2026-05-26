import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../app/router";
import { useNavigation } from "../app/NavigationContext";
import { getRoleLabel } from "../utils/authAccess";

export default function Header() {
    const { authContext, activeCamp } = useNavigation();
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const roleLabel = useMemo(() => getRoleLabel(authContext), [authContext]);

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

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        sessionStorage.removeItem("activeUser");
        navigate(ROUTES.LOGIN);
    };

    return (
        <header className="topbar">
            {/* Left: camp info + auth context */}
            <div>
                <div className="topbar-meta">
                    <span>ADMIN: {authContext.name}</span>
                    <span>|</span>
                    <span>ROLE: {roleLabel}</span>
                    {authContext.profession && (
                        <>
                            <span>|</span>
                            <span>PROFILE: {authContext.profession}</span>
                        </>
                    )}
                    {activeCamp?.location_x != null &&
                        activeCamp?.location_y != null && (
                            <>
                                <span>|</span>
                                <span>
                                    COORDS: {activeCamp.location_x.toFixed(3)},{" "}
                                    {activeCamp.location_y.toFixed(3)}
                                </span>
                            </>
                        )}
                </div>
                <div className="topbar-title">
                    <span>CAMP </span>
                    <span className="topbar-camp-code">
                        {activeCamp?.code ?? "ALPHA"}
                    </span>
                </div>
            </div>

            {/* Right: clock, status, logout */}
            <div className="topbar-right">
                <div className="topbar-clock">
                    <span>
                        Time: <strong>{formatTime(currentDate)}</strong>
                    </span>
                    <span>
                        Date: <strong>{formatDate(currentDate)}</strong>
                    </span>
                </div>
                <div className="topbar-status">
                    <div className="status-dot online" />
                    <span>Online</span>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    [ Log Out ]
                </button>
            </div>
        </header>
    );
}
