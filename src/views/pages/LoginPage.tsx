import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import { AuthService } from "../../services/AuthService";

const authService = new AuthService();

export function LoginPage() {
    const navigate = useNavigate();

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
                if (token) localStorage.setItem("token", token);
                navigate(ROUTES.DASHBOARD);
            } else {
                setError(resp.getMensaje() || "INVALID CREDENTIALS");
            }
        } catch {
            setError("COULD NOT CONNECT TO SERVER");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-app px-4">
            <div className="w-[400px] bg-bg-primary border border-border-default border-t-2 border-t-accent p-10 flex flex-col gap-8">

                {/* Header */}
                <div className="flex flex-col items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 48 48">
                        <path fill="none" stroke="#E85D04" strokeLinecap="round" strokeLinejoin="round" d="m22.5 2.902l-16.021 9.25a3 3 0 0 0-1.5 2.598v18.5a3 3 0 0 0 1.5 2.598l16.021 9.25a3 3 0 0 0 3 0l16.021-9.25a3 3 0 0 0 1.5-2.598v-18.5a3 3 0 0 0-1.5-2.598L25.5 2.902a3 3 0 0 0-3 0" />
                        <circle cx="24" cy="18" r="6" fill="none" stroke="#E85D04" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="24" cy="15.696" r="1.5" fill="none" stroke="#E85D04" strokeLinecap="round" strokeLinejoin="round" />
                        <path fill="none" stroke="#E85D04" strokeLinecap="round" strokeLinejoin="round" d="M22.034 23.669v3.427l1.26 1.173l-1.26 1.173l1.26 1.173l-1.26 1.173v2.745L24 35.79l1.965-1.257V23.67" />
                    </svg>
                    <span className="font-mono font-bold text-md uppercase tracking-wide text-txt-primary">
                        LOG IN
                    </span>
                    <span className="font-mono text-xs uppercase tracking-label text-txt-secondary">
                        RESTRICTED ACCESS
                    </span>
                </div>

                {/* Form */}
                <form className="flex flex-col gap-4 w-full" onSubmit={(e) => { e.preventDefault(); void handleSubmit(); }}>
                    <div className="relative mt-3">
                        <span className="field-label">USERNAME</span>
                        <input
                            className="w-full bg-bg-tertiary text-txt-primary font-mono text-base border border-border-default rounded-none px-3 py-2.5 outline-none transition-colors duration-base focus:border-border-accent placeholder:text-txt-disabled"
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div className="relative mt-3">
                        <span className="field-label">PASSWORD</span>
                        <input
                            className="w-full bg-bg-tertiary text-txt-primary font-mono text-base border border-border-default rounded-none px-3 py-2.5 outline-none transition-colors duration-base focus:border-border-accent"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div role="alert" className="w-full text-center py-1 font-mono text-xs text-status-critical tracking-label uppercase">
                            [ {error} ]
                        </div>
                    )}

                    <button
                        className="mt-2 w-full bg-accent text-accent-fg font-mono font-bold text-sm uppercase tracking-label rounded-none px-5 py-2.5 hover:bg-accent-hover transition-colors duration-base cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "AUTHENTICATING..." : "LOG IN"}
                    </button>
                </form>
            </div>
        </div>
    );
}