import { Outlet, useLocation } from "react-router-dom";
import { Suspense, Component, useEffect, useState, type ReactNode, type ErrorInfo } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { NavigationProvider } from "../app/NavigationContext";
import { InactivityGuard } from "../app/InactivityGuard";

//  Fallback de carga :::
function SectionLoader() {
    return (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Loading...
        </div>
    );
}

//  Error boundary para chunks lazy :::
type EBState = { hasError: boolean };

class SectionErrorBoundary extends Component<{ children: ReactNode }, EBState> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): EBState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        console.error("[SectionErrorBoundary]", error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-sm text-muted-foreground">
                    <span>Error loading section.</span>
                    <button
                        className="underline text-xs"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Retry
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// Layout principal :::
export default function AppLayout() {
    // key por pathname: resetea el ErrorBoundary al cambiar de sección
    const { pathname } = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    return (
        <NavigationProvider>
            {/* Gestión de cierre automático por inactividad — sin salida visual */}
            <InactivityGuard />
            <div className="app-shell">
                <div className="content-layout">
                    <Sidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />
                    <button
                        type="button"
                        className={`sidebar-overlay${isSidebarOpen ? " is-visible" : ""}`}
                        aria-label="Cerrar navegacion"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    <main className="main-content">
                        <Header
                            isSidebarOpen={isSidebarOpen}
                            onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
                        />
                        <div className="content-area">
                            <SectionErrorBoundary key={pathname}>
                                <Suspense fallback={<SectionLoader />}>
                                    <Outlet />
                                </Suspense>
                            </SectionErrorBoundary>
                        </div>
                    </main>
                </div>
            </div>
        </NavigationProvider>
    );
}
