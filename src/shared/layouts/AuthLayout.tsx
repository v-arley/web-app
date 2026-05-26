// layouts/AuthLayout.tsx
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="auth-layout">
            <section className="flex flex-col items-center justify-center">
                <div className="auth-content">
                    <Outlet />
                </div>
            </section>
        </div>
    );
}