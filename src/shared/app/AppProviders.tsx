import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router";
import { SharedModalProvider } from "../components/SharedModal";
import { ToastProvider } from "../components/Toast";
import { AuthProvider } from "./AuthContext";
import { NotificationProvider } from "./NotificationProvider";

function shouldRetryQuery(failureCount: number, error: unknown): boolean {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (typeof status === "number" && status >= 400 && status < 500) return false;

    const message = error instanceof Error ? error.message : String(error ?? "");
    if (
        message.includes("ERR_CONNECTION_REFUSED") ||
        message.includes("Network Error") ||
        message.includes("Failed to fetch")
    ) {
        return false;
    }

    return failureCount < 1;
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: shouldRetryQuery,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            staleTime: 30_000,
        },
        mutations: {
            retry: false,
        },
    },
});

export default function AppProviders() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ToastProvider>
                    <NotificationProvider>
                        <SharedModalProvider>
                            <RouterProvider router={router} />
                        </SharedModalProvider>
                    </NotificationProvider>
                </ToastProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
