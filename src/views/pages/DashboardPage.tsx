
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";

export function DashboardPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate(ROUTES.LOGIN);
    };

    return (
        <div>
            <header className="px-6 py-4 flex flex-col items-center justify-between">
                <div className="">
                    <h1 className="text-2xl font-bold">DASHBOARD</h1>
                    <button className="border border-gray-300 bg-gray-500 text-white rounded-md px-4 py-2" onClick={handleLogout}>Log Out</button>
                </div>
            </header>
            <main className="px-6 py-8">
            </main>
        </div>
    );
}