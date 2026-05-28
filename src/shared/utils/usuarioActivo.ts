// import type { UsuarioTemporal } from "../../features/LoginTemporal/models/usuario";
// // es temporal, se eliminará cuando se implemente el login normal
// // Este archivo contiene funciones relacionadas con el usuario activo, que actualmente es un usuario temporal almacenado en sessionStorage.
// export function getUsuarioActivo(): UsuarioTemporal | null {
//     const stored = sessionStorage.getItem("usuarioActivo");

//     if (!stored) {
//         return null;
//     }

//     try {
//         return JSON.parse(stored) as UsuarioTemporal;
//     } catch {
//         sessionStorage.removeItem("usuarioActivo");
//         return null;
//     }
// }

// export function usuarioTieneRol(
//     usuario: UsuarioTemporal | null,
//     roles: string[],
// ): boolean {
//     if (!usuario) {
//         return false;
//     }

//     const rolesNormalizados = roles.map((rol) => rol.toLowerCase());

//     return usuario.roles.some((rol) =>
//         rolesNormalizados.includes(rol.toLowerCase()),
//     );
// }