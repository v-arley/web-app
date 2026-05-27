import { Suspense, lazy, Component, type ReactNode, type ErrorInfo } from "react";
import { useNavigation } from "../app/NavigationContext";

const WarehouseView = lazy(() =>
    import("./WarehouseView").then((m) => ({ default: m.WarehouseView })),
);

// Fallback de carga :::
function SectionLoader() {
    return (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Cargando...
        </div>
    );
}

// Error Boundary para chunks lazy :::
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
                    <span>Error al cargar la sección.</span>
                    <button
                        className="underline text-xs"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Reintentar
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

/**
 * DashboardPage — renderiza la sección activa del NavigationContext.
 * El layout (Sidebar + Header) lo provee AppLayout.
 * ErrorBoundary + Suspense garantizan que errores de chunks lazy no crasheen la app.
 */
export function DashboardPage() {
    const { activeSection, activeCamp } = useNavigation();

    if (!activeSection) return null;

    if (activeSection.key === "warehouse") {
        return (
            <SectionErrorBoundary>
                <Suspense fallback={<SectionLoader />}>
                    <WarehouseView activeCamp={activeCamp} />
                </Suspense>
            </SectionErrorBoundary>
        );
    }

    return (
        <SectionErrorBoundary>
            <Suspense fallback={<SectionLoader />}>
                {activeSection.component()}
            </Suspense>
        </SectionErrorBoundary>
    );
}

