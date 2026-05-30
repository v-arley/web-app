import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router";
import { SharedModalProvider } from "../components/SharedModal";
import { ToastProvider } from "../components/Toast";
import { AuthProvider } from "./AuthContext";
import { NotificationProvider } from "./NotificationProvider";

const queryClient = new QueryClient();

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
