import { RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { CampUpdateValues, CampFormValues } from "../schemas/camp.schema";
import SystemFeedback, { type FeedbackTone } from "../../shared/components/SystemFeedback";
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
    const [feedback, setFeedback] = useState<{ tone: FeedbackTone; message: string } | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(getInitialSidePanelOpenState);
    const camps = useCampManagement();
    const adminCandidates = useAdminCandidates();

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
            setFeedback({ tone: "success", message: "Camp created." });
        } catch (error) {
            setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Camp create failed." });
        }
    };

    const update = async (id: number, values: CampUpdateValues) => {
        try {
            await camps.mutations.update.mutateAsync({ id, payload: values });
            setFeedback({ tone: "success", message: "Camp updated." });
        } catch (error) {
            setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Camp update failed." });
        }
    };

    const remove = async (id: number) => {
        try {
            await camps.mutations.remove.mutateAsync(id);
            setFeedback({ tone: "success", message: "Camp deleted." });
        } catch (error) {
            setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Camp delete failed." });
        }
    };

    const isLoading = camps.query.isLoading || adminCandidates.isLoading;
    const isSaving = camps.mutations.create.isPending || camps.mutations.update.isPending || camps.mutations.remove.isPending;

    return (
        <SystemModuleShell
            title="Create Camps"
            subtitle="System Management"
            rightContent={
                <button
                    type="button"
                    className="rmm-btn rmm-btn-outline px-3 py-1.5 text-[10px]"
                    disabled={camps.query.isFetching || adminCandidates.isFetching}
                    onClick={() => {
                        void camps.query.refetch();
                        void adminCandidates.refetch();
                    }}
                >
                    <RefreshCw size={13} className={camps.query.isFetching ? "animate-spin" : ""} />
                    Sync
                </button>
            }
        >
            <div className="flex flex-1 min-h-0 flex-col rmm-content-pad bg-transparent gap-4">
                {feedback ? <SystemFeedback tone={feedback.tone} message={feedback.message} /> : null}
                {camps.query.isError ? <SystemFeedback tone="error" message={camps.query.error.message} /> : null}
                {adminCandidates.isError ? <SystemFeedback tone="error" message={adminCandidates.error.message} /> : null}

                <div className="relative flex min-h-0 flex-1 overflow-hidden bg-black/50 backdrop-blur-lg border border-border-default ">
                    <section className="flex-1 flex min-w-0 min-h-0 flex-col overflow-hidden border-r border-border-default">
                        <div className="rmm-panel-header border-b border-border-default bg-bg-secondary/30 shrink-0">
                            <div>
                                <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-wide">Camps Registry</div>
                                <div className="font-mono text-[11px] text-txt-muted uppercase tracking-widest mt-0.5">{filteredCamps.length} records in current scope</div>
                            </div>
                            <label className="relative min-w-0 w-full sm:w-48">
                                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-txt-muted" size={14} />
                                <input
                                    className="rmm-input pl-7 py-1 text-[11px]"
                                    value={search}
                                    placeholder="Search camps"
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        pagination.setPage(1);
                                    }}
                                />
                            </label>
                        </div>

                        <CampsTable
                            camps={pagination.pagedItems}
                            selectedId={camps.selectedId}
                            isLoading={isLoading}
                            adminNameById={adminNameById}
                            onSelect={(id) => {
                                camps.selectRecord(id);
                                setIsFormOpen(true);
                            }}
                        />
                        <PaginationFooter
                            page={pagination.page}
                            setPage={pagination.setPage}
                            totalPages={pagination.totalPages}
                            totalRecords={pagination.totalRecords}
                            compact
                            className="rmm-pagination-footer--compact"
                            leftContent={
                                <span>
                                    Total: <span className="text-accent">{String(pagination.totalRecords).padStart(4, "0")}</span>
                                    <span className="opacity-30 mx-4">|</span>
                                    Scope: <span className="text-status-ok font-bold">[CAMPS]</span>
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
                            onClear={() => {
                                camps.clearSelection();
                                setFeedback(null);
                            }}
                        />
                    </SystemFloatingFormPanel>
                </div>
            </div>
        </SystemModuleShell>
    );
}
