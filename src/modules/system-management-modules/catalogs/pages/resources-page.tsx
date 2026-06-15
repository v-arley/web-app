import { useEffect, useMemo, useState } from "react";
import { useToast } from "../../../../shared/hooks/useToast";
import { getInitialSidePanelOpenState } from "../../../resource-management-modules/shared/components/CollapsibleSidePanel";
import PaginationFooter from "../../../resource-management-modules/shared/components/PaginationFooter";
import useClientPagination from "../../../resource-management-modules/shared/hooks/useClientPagination";
import SystemFloatingFormPanel from "../../shared/components/SystemFloatingFormPanel";
import CatalogTable, { type CatalogColumn } from "../components/CatalogTable";
import CatalogToolbar from "../components/CatalogToolbar";
import ResourceCatalogForm from "../components/ResourceCatalogForm";
import { useResourceCatalog } from "../hooks/useResourceCatalog";
import type { ResourceCatalogFormValues, ResourceCatalogRecord } from "../schemas/resource.schema";

export function ResourcesPage() {
    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(getInitialSidePanelOpenState);
    const { toast } = useToast();
    const catalog = useResourceCatalog();

    useEffect(() => {
        if (catalog.query.isError) {
            toast({ tone: "error", title: "Resources", message: catalog.query.error.message });
        }
    }, [catalog.query.error, catalog.query.isError, toast]);

    const filteredRecords = useMemo(() => {
        const value = search.trim().toLowerCase();
        if (!value) return catalog.records;

        return catalog.records.filter((record) =>
            [record.code, record.name, record.category, record.unitOfMeasure, record.description]
                .filter(Boolean)
                .some((field) => String(field).toLowerCase().includes(value)),
        );
    }, [catalog.records, search]);
    const pagination = useClientPagination(filteredRecords, 20);

    const columns: Array<CatalogColumn<ResourceCatalogRecord>> = [
        { key: "id", label: "ID", render: (record) => record.id ?? "AUTO" },
        { key: "code", label: "Code", render: (record) => record.code },
        { key: "name", label: "Name", render: (record) => record.name },
        { key: "category", label: "Category", render: (record) => record.category },
        { key: "unit", label: "Unit", render: (record) => record.unitOfMeasure },
        { key: "state", label: "State", render: (record) => record.state },
    ];

    const save = async (values: ResourceCatalogFormValues, id: number | null) => {
        try {
            if (id == null) {
                await catalog.mutations.create.mutateAsync(values);
                toast({ tone: "success", title: "Resources", message: "Resource created." });
            } else {
                await catalog.mutations.update.mutateAsync({ id, payload: values });
                toast({ tone: "success", title: "Resources", message: "Resource updated." });
            }
        } catch (error) {
            toast({ tone: "error", title: "Resources", message: error instanceof Error ? error.message : "Resource save failed." });
        }
    };

    const remove = async (id: number) => {
        try {
            await catalog.mutations.remove.mutateAsync(id);
            toast({ tone: "success", title: "Resources", message: "Resource deleted." });
        } catch (error) {
            toast({ tone: "error", title: "Resources", message: error instanceof Error ? error.message : "Resource delete failed." });
        }
    };

    return (
        <div className="app-content-body">
            <div className="app-split app-split--glass">
                <section className="app-split__main">
                    <CatalogToolbar
                        search={search}
                        total={filteredRecords.length}
                        isLoading={catalog.query.isFetching}
                        onSearchChange={(value) => {
                            setSearch(value);
                            pagination.setPage(1);
                        }}
                        onRefresh={() => void catalog.query.refetch()}
                    />
                    <CatalogTable
                        records={pagination.pagedItems}
                        columns={columns}
                        selectedId={catalog.selectedId}
                        isLoading={catalog.query.isLoading}
                        emptyMessage="No resources found"
                        onSelect={(id) => {
                            catalog.selectRecord(id);
                            setIsFormOpen(true);
                        }}
                    />
                    <PaginationFooter
                        page={pagination.page}
                        setPage={pagination.setPage}
                        totalPages={pagination.totalPages}
                        totalRecords={pagination.totalRecords}
                        compact
                        leftContent={
                            <span>
                                Total: <span className="text-accent font-bold">{String(pagination.totalRecords).padStart(4, "0")}</span>
                                {/* <span className="opacity-30 mx-4">|</span> */}
                                {/* Scope: <span className="text-status-ok font-bold">[RESOURCES]</span> */}
                            </span>
                        }
                    />
                </section>

                <SystemFloatingFormPanel
                    isOpen={isFormOpen}
                    label="Resource catalog form"
                    collapsedLabel="FORM"
                    onOpen={() => setIsFormOpen(true)}
                    onClose={() => setIsFormOpen(false)}
                >
                    <ResourceCatalogForm
                        selectedRecord={catalog.selectedRecord}
                        isSaving={catalog.mutations.create.isPending || catalog.mutations.update.isPending || catalog.mutations.remove.isPending}
                        onSave={save}
                        onDelete={remove}
                        onClear={() => {
                            catalog.clearSelection();
                        }}
                    />
                </SystemFloatingFormPanel>
            </div>
        </div>
    );
}
