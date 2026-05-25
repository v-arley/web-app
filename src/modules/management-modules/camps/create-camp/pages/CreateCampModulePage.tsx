import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CreateCampForm } from "../components/CreateCampForm";
import { CreateCampToolbar } from "../components/CreateCampToolbar";
import { CampsTable } from "../components/CampsTable";
import type { CampRecord } from "../schemas/camp.schema";
import type { CampFormValues } from "../schemas/create-camp.schema";
import type { UserRecord } from "../schemas/user.schema";
import { useCampMutations } from "../hooks/useCampMutations";
import { useCampQuery } from "../hooks/useCampQuery";
import { useAdminCandidatesQuery } from "../hooks/useAdminCandidatesQuery";
import { useCreateCampTable } from "../hooks/useCreateCampTable";
import { useUserQuery } from "../hooks/useUserQuery";
import { useWarehouseMutations } from "../hooks/useWarehouseMutations";

function AlertBanner({
    tone,
    message,
}: {
    tone: "error" | "success";
    message: string;
}) {
    const toneClassName =
        tone === "error"
            ? "bg-status-critical/10 border-status-critical/30 text-status-critical"
            : "bg-status-ok/10 border-status-ok/30 text-status-ok";

    return (
        <div className={`px-4 py-3 border font-mono text-[11px] uppercase tracking-widest ${toneClassName}`}>
            {message}
        </div>
    );
}

function CreateCampModuleContent() {
    const [feedback, setFeedback] = useState<{ tone: "error" | "success"; message: string } | null>(null);
    const [search, setSearch] = useState("");
    const { selectedId, selectCamp, clearSelection } = useCreateCampTable();
    const campsQuery = useCampQuery(search).query;
    const allCampsQuery = useCampQuery().query;
    const usersQuery = useUserQuery().query;
    const adminCandidatesQuery = useAdminCandidatesQuery(selectedId).query;
    const camps = useMemo(() => campsQuery.data ?? [], [campsQuery.data]);
    const allCamps = useMemo(() => allCampsQuery.data ?? [], [allCampsQuery.data]);
    const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);
    const adminOptions = useMemo(() => adminCandidatesQuery.data ?? [], [adminCandidatesQuery.data]);
    const adminById = useMemo(
        () =>
            new Map(
                users
                    .filter((user): user is UserRecord & { id: number } => user.id != null)
                    .map((user) => [user.id, user]),
            ),
        [users],
    );
    const campMutations = useCampMutations();
    const warehouseMutations = useWarehouseMutations();

    const selectedCamp = useMemo<CampRecord | undefined>(
        () => allCamps.find((camp) => camp.id != null && camp.id === selectedId),
        [allCamps, selectedId],
    );

    const initialData = useMemo<CampFormValues | undefined>(
        () =>
            selectedCamp
                ? {
                      id: selectedCamp.id ?? null,
                      code: selectedCamp.code,
                      description: selectedCamp.description,
                      capacity: selectedCamp.capacity,
                      location_x: selectedCamp.location_x,
                      location_y: selectedCamp.location_y,
                      admin_id: selectedCamp.admin_id,
                      state: selectedCamp.state,
                      warehouse_name: "",
                      warehouse_location_details: "",
                      created_at: selectedCamp.created_at ?? null,
                  }
                : undefined,
        [selectedCamp],
    );

    const queryError = campsQuery.error || allCampsQuery.error || usersQuery.error || adminCandidatesQuery.error;
    const isLoading = campsQuery.isLoading;

    const handleSave = async (values: CampFormValues): Promise<boolean> => {
        const selectedAdminId = values.admin_id;
        if (selectedAdminId != null && !adminOptions.some((option) => option.id === selectedAdminId)) {
            setFeedback({
                tone: "error",
                message: "Seleccione un administrador con rol ADMIN y sin campamento asignado.",
            });
            return false;
        }

        try {
            const createdCamp = await campMutations.create.mutateAsync(values);

            if (!createdCamp.id) {
                throw new Error(
                    "Campamento creado, pero no se pudo obtener su identificador para crear el almacen inicial.",
                );
            }

            await warehouseMutations.create.mutateAsync({
                name: values.warehouse_name,
                location_details: values.warehouse_location_details,
                camp_id: createdCamp.id,
                admin_id: values.admin_id,
            });

            setFeedback({
                tone: "success",
                message: "Campamento y almacen inicial creados.",
            });
            clearSelection();
            return true;
        } catch (error) {
            setFeedback({
                tone: "error",
                message: error instanceof Error ? error.message : "No se pudo guardar el campamento.",
            });
            return false;
        }
    };

    const handleUpdate = async (id: number, values: Partial<CampFormValues>): Promise<boolean> => {
        const selectedAdminId = values.admin_id;
        if (selectedAdminId != null && !adminOptions.some((option) => option.id === selectedAdminId)) {
            setFeedback({
                tone: "error",
                message: "Seleccione un administrador con rol ADMIN y sin campamento asignado.",
            });
            return false;
        }

        try {
            await campMutations.update.mutateAsync({ id, data: values });
            setFeedback({ tone: "success", message: "Campamento actualizado." });
            clearSelection();
            return true;
        } catch (error) {
            setFeedback({
                tone: "error",
                message: error instanceof Error ? error.message : "No se pudo actualizar el campamento.",
            });
            return false;
        }
    };

    const handleDelete = async (values: CampFormValues) => {
        if (values.id == null) {
            return;
        }

        try {
            await campMutations.remove.mutateAsync(values.id);
            setFeedback({ tone: "success", message: "Campamento eliminado." });
            clearSelection();
        } catch (error) {
            setFeedback({
                tone: "error",
                message: error instanceof Error ? error.message : "No se pudo eliminar el campamento.",
            });
        }
    };

    const handleClear = () => {
        clearSelection();
        setFeedback(null);
    };

    return (
        <div className="mm-scope flex h-full min-h-0 flex-col p-4 md:p-6 bg-bg-app">
            <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em] mb-4">
                Gestion de Campamentos / Module Slice
            </div>

            {feedback ? <AlertBanner tone={feedback.tone} message={feedback.message} /> : null}
            {queryError ? <AlertBanner tone="error" message={queryError.message} /> : null}

            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-bg-secondary border border-border-default shadow-2xl">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" />

                <div className="min-h-0 flex-1">
                    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
                        <div className="flex flex-col lg:w-1/2 xl:w-[55%] border-b lg:border-b-0 lg:border-r border-border-default overflow-hidden">
                            <CreateCampToolbar
                                search={search}
                                onSearchChange={setSearch}
                                totalRows={camps.length}
                                isLoading={isLoading}
                                isSaving={false}
                                onRefresh={() => {
                                    void Promise.all([
                                        campsQuery.refetch(),
                                        allCampsQuery.refetch(),
                                        usersQuery.refetch(),
                                        adminCandidatesQuery.refetch(),
                                    ]);
                                }}
                            />

                            {isLoading ? (
                                <div className="flex flex-1 items-center justify-center bg-bg-primary/10">
                                    <div className="h-4 w-4 animate-spin border-2 border-accent border-t-transparent rounded-full" />
                                </div>
                            ) : (
                                <CampsTable
                                    camps={camps}
                                    selectedId={selectedId}
                                    adminById={adminById}
                                    onSelect={selectCamp}
                                />
                            )}
                        </div>

                        <div className="flex flex-col flex-1 bg-bg-primary/20 overflow-hidden">
                            <CreateCampForm
                                initialData={initialData}
                                adminOptions={adminOptions}
                                onSave={handleSave}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                                onClear={handleClear}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CreateCampModulePage() {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <CreateCampModuleContent />
        </QueryClientProvider>
    );
}
