import { useQuery } from "@tanstack/react-query";
import { PersonService } from "../../../../services/PersonService";
import type { Person } from "../../../../models/Person";

const personService = new PersonService();

export const WORKERS_QUERY_KEY = ["resource-management-modules", "task-management", "workers"] as const;

export function useWorkersQuery(campId: number, enabled = true) {
    return useQuery({
        queryKey: [...WORKERS_QUERY_KEY, campId],
        queryFn: async () => {
            const response = await personService.findAll();
            const people = response.getResultado<Person[]>("registros") ?? [];
            return people.filter((p) => p.camp_id === campId);
        },
        enabled: enabled && campId > 0,
    });
}
