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
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#cfcfcf] px-4">
            <div className="bg-[#272727] px-8 py-10 flex flex-col items-center w-full max-w-sm shadow-lg relative overflow-hidden">
                <header className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="8em" height="8em" viewBox="0 0 48 48">
                        <path fill="none" stroke="#a0a0a0" stroke-linecap="round" stroke-linejoin="round" d="m22.5 2.902l-16.021 9.25a3 3 0 0 0-1.5 2.598v18.5a3 3 0 0 0 1.5 2.598l16.021 9.25a3 3 0 0 0 3 0l16.021-9.25a3 3 0 0 0 1.5-2.598v-18.5a3 3 0 0 0-1.5-2.598L25.5 2.902a3 3 0 0 0-3 0" />
                        <circle cx="24" cy="18" r="6" fill="none" stroke="#a0a0a0" stroke-linecap="round" stroke-linejoin="round" />
                        <circle cx="24" cy="15.696" r="1.5" fill="none" stroke="#a0a0a0" stroke-linecap="round" stroke-linejoin="round" />
                        <path fill="none" stroke="#a0a0a0" stroke-linecap="round" stroke-linejoin="round" d="M22.034 23.669v3.427l1.26 1.173l-1.26 1.173l1.26 1.173l-1.26 1.173v2.745L24 35.79l1.965-1.257V23.67" />
                    </svg>

                    <h1 className="text-3xl sm:text-4xl text-[#a0a0a0] font-abril tracking-[0.2em] font-normal leading-none -ml-1">
                        LOG IN
                    </h1>

                    <span className="text-[#a0a0a0] font-mono text-[10px] tracking-widest uppercase mt-3">
                        RESTRICTED ACCESS
                    </span>
                </header>

                <form className="flex flex-col gap-2 w-full" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] sm:text-[11px] font-mono text-[#a0a0a0] tracking-widest uppercase" htmlFor="username">USERNAME</label>
                        <input
                            className="bg-black/20 px-4 py-2.5 text-[#d4d4d4] font-mono text-sm focus:outline-none transition-colors shadow-inner w-full"
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] sm:text-[11px] font-mono text-[#a0a0a0] tracking-widest uppercase" htmlFor="password">PASSWORD</label>
                        <input
                            className="bg-black/20 px-4 py-2.5 text-[#d4d4d4] font-mono text-sm focus:outline-none transition-colors shadow-inner w-full"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div role="alert" className="w-full text-center py-1 text-[10px] font-mono text-orange-500 tracking-widest uppercase">
                            [ ERROR: {error.replace('fail: ', '')} ]
                        </div>
                    )}

                    <div className="flex justify-center mt-3">
                        <button
                            className="text-[11px] sm:text-xs font-mono uppercase text-[#d4d4d4] hover:text-green-500 transition-colors tracking-widest pb-0.5"
                            type="submit"
                        >
                            {loading ? "[ AUTHENTICATING... ]" : "[ LOG IN ]"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}