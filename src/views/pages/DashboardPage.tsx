import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";

export function DashboardPage() {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour12: false });
    };

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}:${month}:${year}`;
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate(ROUTES.LOGIN);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#cfcfcf]">
            <header className="w-full py-2 px-2 flex justify-center">
                <div className="bg-[#272727] rounded-md px-1 py-1 pt-4 sm:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full shadow-lg border border-[#3a3a3a] relative overflow-hidden">
                    <div className="flex flex-col w-full">
                        <div className="flex justify-center w-full">
                            <span className="text-[#a0a0a0] font-mono text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-widest uppercase">
                                ADMIN: vargas &nbsp;|&nbsp; X: -70.000, Y: 10.000
                            </span>
                        </div>
                        <div className="flex justify-center w-full">
                            <h1 className="font-wearing text-white">CAMPAMENTO</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="px-2 py-2 flex-1 flex w-full">
                {/* Center Main Area */}
                <div className="flex-1 w-full rounded-lg bg-black/10 border border-black/20 shadow-[inset_2px_2px_8px_rgba(0,0,0,0.2),inset_-1px_-1px_4px_rgba(255,255,255,0.05)]"></div>
            </main>

            <footer className="w-full py-2 px-2 flex justify-center">
                <div className="bg-[#272727] rounded-md px-2 py-1 flex flex-col sm:flex-row items-center justify-between w-full shadow-lg border border-[#3a3a3a]">
                    <div className="flex flex-col sm:flex-row items-center justify-start gap-2 sm:gap-4 text-[10px] sm:text-[11px] text-[#a0a0a0] font-mono tracking-[0.15em] sm:tracking-widest uppercase w-full sm:w-auto">
                        <span>TIME: {formatTime(currentDate)}</span>
                        <span className="text-[#666] hidden sm:block">|</span>
                        <span>DATE: {formatDate(currentDate)}</span>
                        <span className="text-[#666] hidden sm:block">|</span>
                        <div className="flex items-center gap-2 pl-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#008f6b] shadow-[0_0_8px_rgba(0,143,107,0.8)]"></div>
                            <span>ONLINE</span>
                        </div>
                    </div>
                    <div className="flex justify-start w-full sm:w-auto mb-3 sm:mb-0">
                        <button className="text-[10px] sm:text-[11px] font-mono uppercase text-[#d4d4d4] hover:text-orange-500 transition-colors tracking-widest" onClick={handleLogout}>[ LOG OUT ]</button>
                    </div>
                </div>
            </footer>
        </div>
    );
}