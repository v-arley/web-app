import { RefreshCw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CampUpdateValues, CampFormValues } from "../schemas/camp.schema";
import { useToast } from "../../../../shared/hooks/useToast";
import SystemFloatingFormPanel from "../../shared/components/SystemFloatingFormPanel";
import SystemModuleShell from "../../shared/components/SystemModuleShell";
import { getInitialSidePanelOpenState } from "../../../resource-management-modules/shared/components/CollapsibleSidePanel";
import PaginationFooter from "../../../resource-management-modules/shared/components/PaginationFooter";
import useClientPagination from "../../../resource-management-modules/shared/hooks/useClientPagination";
import CampsTable from "../components/CampsTable";
import CreateCampForm from "../components/CreateCampForm";
import { useAdminCandidates, useCampManagement } from "../hooks/useCampManagement";

export function CreateCampModulePage() {
    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(getInitialSidePanelOpenState);
    const { toast } = useToast();
    const camps = useCampManagement();
    const adminCandidates = useAdminCandidates();

    useEffect(() => {
        if (camps.query.isError) {
            toast({ tone: "error", title: "Camps", message: camps.query.error.message });
        }
    }, [camps.query.error, camps.query.isError, toast]);

    useEffect(() => {
        if (adminCandidates.isError) {
            toast({ tone: "error", title: "Camps", message: adminCandidates.error.message });
        }
    }, [adminCandidates.error, adminCandidates.isError, toast]);

    const adminNameById = useMemo(
        () =>
            new Map(
                (adminCandidates.data ?? [])
                    .filter((user) => user.id != null)
                    .map((user) => [user.id as number, user.username ?? user.name ?? `User #${user.id}`]),
            ),
        [adminCandidates.data],
    );

    const filteredCamps = useMemo(() => {
        const value = search.trim().toLowerCase();
        if (!value) return camps.records;
        return camps.records.filter((camp) =>
            [camp.code, camp.description, camp.state, camp.admin_id, camp.user_admin_id]
                .filter((field) => field !== undefined && field !== null)
                .some((field) => String(field).toLowerCase().includes(value)),
        );
    }, [camps.records, search]);
    const pagination = useClientPagination(filteredCamps, 20);

    const save = async (values: CampFormValues) => {
        try {
            await camps.mutations.create.mutateAsync(values);
            toast({ tone: "success", title: "Camps", message: "Camp created." });
        } catch (error) {
            toast({ tone: "error", title: "Camps", message: error instanceof Error ? error.message : "Camp create failed." });
        }
    };

    const update = async (id: number, values: CampUpdateValues) => {
        try {
            await camps.mutations.update.mutateAsync({ id, payload: values });
            toast({ tone: "success", title: "Camps", message: "Camp updated." });
        } catch (error) {
            toast({ tone: "error", title: "Camps", message: error instanceof Error ? error.message : "Camp update failed." });
        }
    };

    const remove = async (id: number) => {
        try {
            await camps.mutations.remove.mutateAsync(id);
            toast({ tone: "success", title: "Camps", message: "Camp deleted." });
        } catch (error) {
            toast({ tone: "error", title: "Camps", message: error instanceof Error ? error.message : "Camp delete failed." });
        }
    };

    const isLoading = camps.query.isLoading || adminCandidates.isLoading;
    const isSaving  = camps.mutations.create.isPending || camps.mutations.update.isPending || camps.mutations.remove.isPending;

    return (
        <SystemModuleShell
            title="Create Camps"
            subtitle="System Management"
        >
            <div className="app-content-body app-content-body--gap">
                <div className="app-split app-split--glass">
                    <section className="app-split__main">
                        <div className="app-panel-header">
                            <div>
                                <div className="app-panel-title">Camps Registry</div>
                            </div>
                            <div className="app-panel-actions">
                                <label style={{ position: "relative", minWidth: 0, width: "12rem" }}>
                                    <Search
                                        size={13}
                                        style={{ position: "absolute", left: "0.5rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-txt-disabled)", pointerEvents: "none" }}
                                    />
                                    <input
                                        className="app-input-default"
                                        style={{ paddingLeft: "1.75rem" }}
                                        value={search}
                                        placeholder="Search camps"
                                        onChange={(event) => { setSearch(event.target.value); pagination.setPage(1); }}
                                    />
                                </label>
                                <button
                                    type="button"
                                    className="app-btn app-btn--outline app-btn--sm"
                                    disabled={camps.query.isFetching || adminCandidates.isFetching}
                                    onClick={() => { void camps.query.refetch(); void adminCandidates.refetch(); }}
                                >
                                    <RefreshCw size={13} className={camps.query.isFetching || adminCandidates.isFetching ? "animate-spin" : ""} />
                                    Refresh
                                </button>
                            </div>
                        </div>

                        <CampsTable
                            camps={pagination.pagedItems}
                            selectedId={camps.selectedId}
                            isLoading={isLoading}
                            adminNameById={adminNameById}
                            onSelect={(id) => { camps.selectRecord(id); setIsFormOpen(true); }}
                        />
                        <PaginationFooter
                            page={pagination.page}
                            setPage={pagination.setPage}
                            totalPages={pagination.totalPages}
                            totalRecords={pagination.totalRecords}
                            compact
                            className="app-pagination-footer--compact"
                            leftContent={
                                <span>
                                    Total: <span style={{ color: "var(--color-accent)" }}>{String(pagination.totalRecords).padStart(4, "0")}</span>
                                    {/* <span style={{ opacity: 0.3, margin: "0 1rem" }}>|</span> */}
                                    {/* Scope: <span style={{ color: "var(--color-status-ok)", fontWeight: 700 }}>[CAMPS]</span> */}
                                </span>
                            }
                        />
                    </section>

                    <SystemFloatingFormPanel
                        isOpen={isFormOpen}
                        label="Camp management form"
                        collapsedLabel="FORM"
                        onOpen={() => setIsFormOpen(true)}
                        onClose={() => setIsFormOpen(false)}
                    >
                        <CreateCampForm
                            selectedRecord={camps.selectedRecord}
                            adminOptions={adminCandidates.data ?? []}
                            isSaving={isSaving}
                            onSave={save}
                            onUpdate={update}
                            onDelete={remove}
                            onClear={() => { camps.clearSelection(); }}
                        />
                    </SystemFloatingFormPanel>
                </div>
            </div>
        </SystemModuleShell>
    );
}
