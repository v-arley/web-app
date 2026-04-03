import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import { AuthService } from "../../services/AuthService";

const authService = new AuthService();

export function LoginPage() {
    const navigate = useNavigate();

    // TODO: guardar globalmente el usuario y el token
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        setError("");
        setLoading(true);

        try {
            const resp = await authService.login(username, password);

            if (resp.getEstado()) {
                const token = resp.getResultado<string>("token");
                if (token) {
                    localStorage.setItem("token", token);
                }
                navigate(ROUTES.DASHBOARD);
            } else {
                setError(resp.getMensaje() || "fail: invalid credentials");
            }
        } catch {
            setError("fail: could not connect to server");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen">
            <header className="">
                <div>
                    <h1 className="text-2xl font-bold">LOG IN</h1>
                </div>
            </header>

            <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="username">Username</label>
                    <input className="border border-gray-300 rounded-md px-4 py-2" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password">Password</label>
                    <input className="border border-gray-300 rounded-md px-4 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                {error && (
                    <div role="alert" className="px-4 py-3 text-sm text-red-500">
                        {error}
                    </div>
                )}

                <button className="border border-gray-300 bg-gray-500 text-white rounded-md px-4 py-2" type="submit">{loading ? "Loading..." : "Continue"}</button>
            </form>
        </div>
    );
}