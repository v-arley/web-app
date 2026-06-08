import { Navigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import { useAuth } from "./AuthContext";
import { SECTIONS } from "./sections";
import { getInitialSectionPath } from "../utils/authAccess";

export function AppIndexRedirect() {
    const { user } = useAuth();

    return <Navigate to={user ? getInitialSectionPath(SECTIONS, user) : ROUTES.LOGIN} replace />;
}
