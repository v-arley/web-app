import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router";
import { SharedModalProvider } from "../components/SharedModal";
import { ToastProvider } from "../components/Toast";
import { AuthProvider } from "./AuthContext";

const queryClient = new QueryClient();

export default function AppProviders() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ToastProvider>
                    <SharedModalProvider>
                        <RouterProvider router={router} />
                    </SharedModalProvider>
                </ToastProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
