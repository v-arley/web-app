import type { User } from "../../../../models/User";
import { UserService } from "../../../../services/UserService";

const userService = new UserService();

export const adminCandidateService = {
    async findAll(): Promise<User[]> {
        const response = await userService.findAllWithProfile();
        if (!response.getEstado()) {
            throw new Error(response.getMensaje());
        }

        return response.getResultado<User[]>("registros") ?? [];
    },
};
