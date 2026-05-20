import { useCallback, useEffect, useMemo, useState } from "react";
import { UserService } from "../services/UserService";
import type { User } from "../models/User";

const userService = new UserService();

export type ProfessionKey = string;

type UserRoleProfile = {
  id: number;
  name: string;
  description?: string | null;
  state: string;
};

export type StatusFilter = "active" | "inactive" | "all";

type ChangeProfessionOptions = {
  isTemporary: boolean;
  temporaryUntil?: string;
};

type UpdateUserProfessionPayload = {
  profession: string;
  is_temporary?: "Y" | "N";
  temporary_until?: string;
};

export type UserCardData = {
  idUser: number;
  id: string;
  name: string;
  lastName: string;
  role: string;
  sex: "M" | "F";
  profession: ProfessionKey;
  active: boolean;
  registrationDate: Date;
  birthdate: Date;
  imageUrl: string;
};

export function formatProfession(profession?: string | null): string {
  if (!profession) return "SIN PROFESIÓN";

  return profession
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getMainRole(user: User): string {
  const firstRole = user.roles?.[0];

  if (!firstRole) return "NO ROLE";

  if (typeof firstRole === "string") return firstRole;

  return (firstRole as UserRoleProfile).name;
}

export function useUsersView() {
  const [users, setUsers] = useState<UserCardData[]>([]);
  const [professions, setProfessions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserCardData | null>(null);
  const [isRegistrationPanelOpen, setIsRegistrationPanelOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [isStatusSelectFocused, setIsStatusSelectFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);

      const [usersResp, professionsResp] = await Promise.all([
        userService.findAllWithProfile(),
        userService.findProfessions(),
      ]);

      if (professionsResp.getEstado()) {
        const apiProfessions =
          professionsResp.getResultado<string[]>("registros") ?? [];

        setProfessions(apiProfessions);
      }

      if (usersResp.getEstado()) {
        const apiUsers = usersResp.getResultado<User[]>("registros") ?? [];

        const mapped: UserCardData[] = apiUsers.map((user) => ({
          idUser: user.id ?? 0,
          id: user.person?.dni ?? String(user.id ?? ""),
          name: user.person?.name ?? user.name ?? user.username ?? "",
          lastName: user.person?.surname ?? user.person?.last_name ?? "",
          role: getMainRole(user),
          sex: user.person?.sex === "F" ? "F" : "M",
          profession: user.profession ?? "SIN_PROFESION",
          active: user.state === "A",
          registrationDate: user.created_at
            ? new Date(user.created_at)
            : new Date(),
          birthdate: user.person?.date_of_birth
            ? new Date(user.person.date_of_birth)
            : user.person?.date_birth
              ? new Date(user.person.date_birth)
              : new Date(),
          imageUrl: user.person?.photo ?? "",
        }));

        setUsers(mapped);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? user.active
            : !user.active;

      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        query === "" ||
        user.name.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        formatProfession(user.profession).toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [users, statusFilter, searchQuery]);

  const statusTitleMap: Record<StatusFilter, string> = {
    active: "ACTIVE STAFF",
    inactive: "INACTIVE STAFF",
    all: "ALL STAFF",
  };

  const handleToggleUserActive = async () => {
    if (!selectedUser) return;

    const nextActive = !selectedUser.active;

    if (selectedUser.idUser) {
      const resp = await userService.update(selectedUser.idUser, {
        state: nextActive ? "A" : "I",
      });

      if (!resp.getEstado()) return;
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.idUser === selectedUser.idUser
          ? { ...user, active: nextActive }
          : user,
      ),
    );

    setSelectedUser((prev) => (prev ? { ...prev, active: nextActive } : prev));
  };

  const handleChangeProfession = async (
    nextProfession: ProfessionKey,
    options?: ChangeProfessionOptions,
  ) => {
    if (!selectedUser) return;

    const payload: UpdateUserProfessionPayload = {
      profession: nextProfession,
      is_temporary: options?.isTemporary ? "Y" : "N",
      temporary_until: options?.isTemporary
        ? options.temporaryUntil
        : undefined,
    };

    if (selectedUser.idUser) {
      const resp = await userService.update(selectedUser.idUser, payload);

      if (!resp.getEstado()) return;
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.idUser === selectedUser.idUser
          ? { ...user, profession: nextProfession }
          : user,
      ),
    );

    setSelectedUser((prev) =>
      prev ? { ...prev, profession: nextProfession } : prev,
    );
  };

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  return {
    users,
    professions,
    loading,
    selectedUser,
    setSelectedUser,
    isRegistrationPanelOpen,
    setIsRegistrationPanelOpen,
    statusFilter,
    setStatusFilter,
    isStatusSelectFocused,
    setIsStatusSelectFocused,
    searchQuery,
    setSearchQuery,
    filteredUsers,
    statusTitleMap,
    handleToggleUserActive,
    handleChangeProfession,
    formatProfession,
    loadUsers,
  };
}