import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Person } from "../../../../models/Person";
import type { WorkerProfessionSummary } from "../../../../models/PersonProfession";
import { useClientPagination } from "../../shared/hooks/useClientPagination";
import PaginationFooter from "../../shared/components/PaginationFooter";

function getProfessionName(worker: Person): string {
    const summary = worker.profession as WorkerProfessionSummary | null | undefined;
    return summary?.base?.name ?? summary?.temporary?.name ?? "—";
}

function normalize(value: string) {
    return value.trim().toLowerCase();
}

interface WorkersListTableProps {
    workers: Person[];
    selectedIds: number[];
    onToggle: (id: number) => void;
    onToggleAll: () => void;
    isLoading: boolean;
    assignedPersonIds?: Set<number>;
}

const PAGE_SIZE = 10;

export function WorkersListTable({
    workers,
    selectedIds,
    onToggle,
    onToggleAll,
    isLoading,
    assignedPersonIds = new Set(),
}: WorkersListTableProps) {
    const [query, setQuery] = useState("");

    const activeWorkers = useMemo(
        () => workers.filter((w) => w.state === "A" || w.state === "active" || !w.state || w.state.toUpperCase() === "A"),
        [workers],
    );

    const filteredWorkers = useMemo(() => {
        const q = normalize(query);
        if (!q) return activeWorkers;
        return activeWorkers.filter((w) => {
            const fullName = normalize(`${w.name ?? ""} ${w.last_name ?? ""}`);
            const dni = normalize(w.dni ?? "");
            return fullName.includes(q) || dni.includes(q);
        });
    }, [activeWorkers, query]);

    const pagination = useClientPagination(filteredWorkers, PAGE_SIZE);

    const allPageSelected =
        pagination.pagedItems.length > 0 &&
        pagination.pagedItems
            .filter((w) => !assignedPersonIds.has(w.id!))
            .every((w) => selectedIds.includes(w.id!));

    function handleTogglePageAll() {
        const pageAvailable = pagination.pagedItems.filter((w) => !assignedPersonIds.has(w.id!));
        const allSelected = pageAvailable.every((w) => selectedIds.includes(w.id!));
        if (allSelected) {
            pageAvailable.forEach((w) => {
                if (selectedIds.includes(w.id!)) onToggle(w.id!);
            });
        } else {
            pageAvailable.forEach((w) => {
                if (!selectedIds.includes(w.id!)) onToggle(w.id!);
            });
        }
    }

    if (isLoading) {
        return (
            <div className="app-loading-state">
                <span className="app-muted">Loading workers...</span>
            </div>
        );
    }

    if (activeWorkers.length === 0) {
        return (
            <div className="app-empty-state">
                <span className="app-muted">No active workers found for this camp.</span>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid var(--color-border-subtle)" }}>
                <div className="app-input" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Search size={12} style={{ flexShrink: 0, color: "var(--color-txt-muted)" }} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); pagination.setPage(1); }}
                        placeholder="Search by name or DNI..."
                        style={{
                            flex: 1,
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            fontFamily: "inherit",
                            fontSize: "11px",
                            color: "var(--color-txt-primary)",
                        }}
                    />
                </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
                {filteredWorkers.length === 0 ? (
                    <div className="app-empty-state">
                        <span className="app-muted">No workers match your search.</span>
                    </div>
                ) : (
                    <table className="app-table">
                        <thead>
                            <tr>
                                <th style={{ width: "2.5rem" }}>
                                    <input
                                        type="checkbox"
                                        checked={allPageSelected}
                                        onChange={handleTogglePageAll}
                                        title="Select all on this page"
                                    />
                                </th>
                                <th>Name</th>
                                <th>DNI</th>
                                <th>Profession</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagination.pagedItems.map((worker) => {
                                const isSelected = selectedIds.includes(worker.id!);
                                const isAlreadyAssigned = assignedPersonIds.has(worker.id!);
                                return (
                                    <tr
                                        key={worker.id}
                                        onClick={() => !isAlreadyAssigned && onToggle(worker.id!)}
                                        style={{ cursor: isAlreadyAssigned ? "not-allowed" : "pointer", opacity: isAlreadyAssigned ? 0.5 : 1 }}
                                    >
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                disabled={isAlreadyAssigned}
                                                onChange={() => !isAlreadyAssigned && onToggle(worker.id!)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </td>
                                        <td>{worker.name} {worker.last_name}</td>
                                        <td className="app-muted">{worker.dni}</td>
                                        <td className="app-muted" style={{ fontSize: "0.7rem" }}>
                                            {getProfessionName(worker)}
                                        </td>
                                        <td>
                                            {isAlreadyAssigned ? (
                                                <span className="app-badge app-badge--warn">Assigned</span>
                                            ) : (
                                                <span className="app-badge app-badge--ok">Available</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <PaginationFooter
                page={pagination.page}
                setPage={pagination.setPage}
                totalPages={pagination.totalPages}
                totalRecords={filteredWorkers.length}
                compact
            />
        </div>
    );
}
