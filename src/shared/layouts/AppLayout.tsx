import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { NavigationProvider } from "../app/NavigationContext";

import './App.css';

export default function AppLayout() {
    return (
        <NavigationProvider>
            <div className="app-shell">
                <div className="content-layout">
                    <Sidebar />
                    <main className="main-content">
                        <Header />
                        <div className="content-area">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </NavigationProvider>
    );
}