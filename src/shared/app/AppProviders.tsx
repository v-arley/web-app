import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router";
import { SharedModalProvider } from "../components/SharedModal";
import { ToastProvider } from "../components/Toast";

const queryClient = new QueryClient();

export default function AppProviders() {
    return (
        <QueryClientProvider client={queryClient}>
            <ToastProvider>
                <SharedModalProvider>
                    <RouterProvider router={router} />
                </SharedModalProvider>
            </ToastProvider>
        </QueryClientProvider>
    );
}
