
// const { canEdit, canDelete } = usePermissions(user);

export function usePermissions(user) {
    const roles = user?.roles || [];

    return {
        canEdit: roles.includes("editor"),
        canDelete: roles.includes("admin"),
        canViewReports: roles.includes("manager")
    };
}
