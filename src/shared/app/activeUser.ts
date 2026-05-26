/* The commented out code block in the TypeScript file is importing a type `UsuarioTemporal` from a
specific file path. It then defines two functions related to managing active users in a temporary
access scenario. */

//import type { UsuarioTemporal } from "../../features/LoginTemporal/models/usuario";

export function getUsuarioActivo(): UsuarioTemporal | null {
    const stored = localStorage.getItem("usuarioActivo");

    if (!stored) {
        return null;
    }

    try {
        return JSON.parse(stored) as UsuarioTemporal;
    } catch {
        localStorage.removeItem("usuarioActivo");
        return null;
    }
}

export function userRol(user: UsuarioTemporal | null, roles: string[] ): boolean {
    if (!user) {
        return false;
    }

    const rolesNormalizados = roles.map((rol) => rol.toLowerCase());

    return user.roles.some((rol) =>
        rolesNormalizados.includes(rol.toLowerCase()),
    );
}