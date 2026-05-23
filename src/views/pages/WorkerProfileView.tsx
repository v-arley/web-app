import {
    AlertTriangle,
    BadgeCheck,
    Briefcase,
    Calendar,
    HeartPulse,
    IdCard,
    MapPin,
    RefreshCw,
    Shield,
    User,
} from "lucide-react";
import { useWorkerProfile } from "../../hooks/useWorkerProfile";

function formatDate(value?: Date | string | null) {
    if (!value) return "N/A";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("es-CR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

function getSexLabel(sex?: string) {
    if (sex === "M") return "Masculino";
    if (sex === "F") return "Femenino";
    if (sex === "O") return "Otro";
    return "N/A";
}

function getStateLabel(state?: string) {
    if (state === "A") return "Active";
    if (state === "I") return "Inactive";
    return "Unknown";
}

function getStateClass(state?: string) {
    if (state === "A") return "text-status-ok border-status-ok bg-status-ok/10";
    if (state === "I") return "text-status-inactive border-status-inactive bg-status-inactive/10";
    return "text-txt-disabled border-border-default bg-bg-tertiary";
}

export function WorkerProfileView() {
    const { profile, loading, error, reload } = useWorkerProfile();

    const fullName = profile
        ? `${profile.name ?? ""} ${profile.surname ?? profile.last_name ?? ""}`.trim()
        : "Worker profile";

    const baseProfession = profile?.profession?.base ?? null;
    const temporaryProfession = profile?.profession?.temporary ?? null;

    return (
        <div className="w-full h-full flex flex-col bg-bg-app overflow-hidden">
            <div className="w-full bg-bg-secondary border-b border-border-default px-6 py-3 flex items-center justify-between shrink-0">
                <div className="flex flex-col">
                    <span className="text-[12px] font-mono font-bold text-txt-secondary uppercase tracking-label">
                        Worker Registry
                    </span>
                    <span className="text-[10px] font-mono text-txt-disabled uppercase tracking-label">
                        Personal profile / camp assignment / profession status
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => void reload()}
                    className="flex items-center gap-2 text-[11px] font-mono text-txt-disabled hover:text-accent uppercase tracking-label transition-colors"
                >
                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
                <div className="p-4 flex flex-col gap-4">
                    {error && (
                        <div className="border border-status-critical bg-status-critical/10 text-status-critical px-4 py-3 font-mono text-xs uppercase tracking-label flex items-center gap-2">
                            <AlertTriangle size={15} />
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="border border-border-default bg-bg-primary p-6 font-mono text-xs text-txt-disabled uppercase tracking-label">
                            Loading worker profile...
                        </div>
                    )}

                    {!loading && !profile && !error && (
                        <div className="border border-border-default bg-bg-primary p-6 font-mono text-xs text-txt-disabled uppercase tracking-label">
                            No worker profile data available.
                        </div>
                    )}

                    {!loading && profile && (
                        <>
                            <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-4">
                                <section className="border border-border-default bg-bg-primary p-5">
                                    <div className="flex flex-col md:flex-row gap-5">
                                        <div className="shrink-0 flex flex-col items-center gap-3">
                                            <div className="relative w-36 h-36 border-2 border-accent bg-bg-app overflow-hidden flex items-center justify-center">
                                                <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-accent" />
                                                <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-accent" />
                                                <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-accent" />
                                                <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-accent" />

                                                {profile.photo ? (
                                                    <img
                                                        src={profile.photo}
                                                        alt={fullName}
                                                        className="w-full h-full object-cover grayscale"
                                                    />
                                                ) : (
                                                    <User size={58} className="text-accent" />
                                                )}

                                                <div className="absolute bottom-0 left-0 right-0 bg-accent text-accent-fg text-[10px] font-mono font-bold text-center uppercase tracking-label py-1">
                                                    {getStateLabel(profile.state)}
                                                </div>
                                            </div>

                                            <div
                                                className={`border px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-label ${getStateClass(profile.state)}`}
                                            >
                                                {getStateLabel(profile.state)}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="border-b border-border-default pb-3 mb-4">
                                                <span className="text-[10px] text-accent font-mono uppercase tracking-label">
                                                    Identity file
                                                </span>
                                                <h1 className="text-[26px] text-txt-primary font-mono font-bold uppercase tracking-wide leading-tight">
                                                    {fullName}
                                                </h1>
                                                <p className="text-[12px] text-txt-secondary font-mono mt-1">
                                                    DNI:{" "}
                                                    <span className="text-txt-primary">
                                                        {profile.dni ?? "N/A"}
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                                <div className="border border-border-default bg-bg-app p-3">
                                                    <span className="block text-[10px] text-txt-disabled font-mono uppercase tracking-label mb-1">
                                                        Sex
                                                    </span>
                                                    <span className="text-[13px] text-txt-primary font-mono">
                                                        {getSexLabel(profile.sex)}
                                                    </span>
                                                </div>

                                                <div className="border border-border-default bg-bg-app p-3">
                                                    <span className="block text-[10px] text-txt-disabled font-mono uppercase tracking-label mb-1">
                                                        Digital ID
                                                    </span>
                                                    <span className="text-[13px] text-txt-primary font-mono flex items-center gap-2">
                                                        <IdCard size={14} className="text-accent" />
                                                        {profile.idCardUrl || profile.id_card_url
                                                            ? "Available"
                                                            : "Not assigned"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="border border-border-default bg-bg-app p-4">
                                                <span className="block text-[10px] text-txt-disabled font-mono uppercase tracking-label mb-2">
                                                    Background description
                                                </span>
                                                <p className="text-[13px] text-txt-secondary font-mono leading-relaxed">
                                                    {profile.description || "No description registered."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="border border-border-default bg-bg-primary p-5">
                                    <div className="flex items-center gap-2 border-b border-border-default pb-3 mb-4">
                                        <HeartPulse size={17} className="text-status-critical" />
                                        <h2 className="text-[13px] font-mono text-txt-primary font-bold uppercase tracking-label">
                                            Health conditions
                                        </h2>
                                    </div>

                                    <div className="bg-bg-app border border-border-default p-4 min-h-28">
                                        <p className="text-[13px] text-txt-secondary font-mono leading-relaxed">
                                            {profile.conditions || "No health conditions registered."}
                                        </p>
                                    </div>

                                    <div className="mt-4 border border-status-warning/50 bg-status-warning/10 p-3">
                                        <div className="flex items-center gap-2 text-status-warning font-mono text-[11px] uppercase tracking-label font-bold">
                                            <Shield size={14} />
                                            Medical registry
                                        </div>
                                        <p className="text-[11px] text-txt-disabled font-mono mt-1">
                                            Health data is consultative for operational assignment.
                                        </p>
                                    </div>
                                </section>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                                <section className="border border-border-default bg-bg-primary p-5">
                                    <div className="flex items-center gap-2 border-b border-border-default pb-3 mb-4">
                                        <MapPin size={16} className="text-accent" />
                                        <h2 className="text-[13px] font-mono text-txt-primary font-bold uppercase tracking-label">
                                            Assigned camp
                                        </h2>
                                    </div>

                                    <div className="space-y-3 font-mono text-xs">
                                        <div className="flex justify-between gap-4 border-b border-border-default pb-2">
                                            <span className="text-txt-disabled uppercase">Code</span>
                                            <span className="text-txt-primary text-right">
                                                {profile.camp?.code ?? "N/A"}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="block text-txt-disabled uppercase mb-2">
                                                Description
                                            </span>
                                            <p className="text-txt-secondary leading-relaxed">
                                                {profile.camp?.description ?? "No camp description available."}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section className="border border-border-default bg-bg-primary p-5">
                                    <div className="flex items-center justify-between border-b border-border-default pb-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Briefcase size={16} className="text-accent" />
                                            <h2 className="text-[13px] font-mono text-txt-primary font-bold uppercase tracking-label">
                                                Base profession
                                            </h2>
                                        </div>
                                        <span className="border border-accent text-accent bg-accent/10 px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-label">
                                            Base
                                        </span>
                                    </div>

                                    {baseProfession ? (
                                        <div className="space-y-3 font-mono text-xs">
                                            <div className="flex justify-between gap-4 border-b border-border-default pb-2">
                                                <span className="text-txt-disabled uppercase">Name</span>
                                                <span className="text-txt-primary text-right font-bold">
                                                    {baseProfession.name}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4 border-b border-border-default pb-2">
                                                <span className="text-txt-disabled uppercase">Code</span>
                                                <span className="text-accent text-right font-bold">
                                                    {baseProfession.code}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4">
                                                <span className="text-txt-disabled uppercase">Assigned</span>
                                                <span className="text-txt-secondary text-right flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {formatDate(baseProfession.assignedAt)}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border border-border-default bg-bg-app p-4 text-[12px] font-mono text-txt-disabled uppercase tracking-label">
                                            No base profession assigned.
                                        </div>
                                    )}
                                </section>

                                <section className="border border-border-default bg-bg-primary p-5">
                                    <div className="flex items-center justify-between border-b border-border-default pb-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            <BadgeCheck size={16} className="text-status-info" />
                                            <h2 className="text-[13px] font-mono text-txt-primary font-bold uppercase tracking-label">
                                                Temporary assignment
                                            </h2>
                                        </div>

                                        {temporaryProfession ? (
                                            <span className="border border-status-info text-status-info bg-status-info/10 px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-label">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="border border-border-default text-txt-disabled bg-bg-tertiary px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-label">
                                                None
                                            </span>
                                        )}
                                    </div>

                                    {temporaryProfession ? (
                                        <div className="space-y-3 font-mono text-xs">
                                            <div className="flex justify-between gap-4 border-b border-border-default pb-2">
                                                <span className="text-txt-disabled uppercase">Name</span>
                                                <span className="text-txt-primary text-right font-bold">
                                                    {temporaryProfession.name}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4 border-b border-border-default pb-2">
                                                <span className="text-txt-disabled uppercase">Code</span>
                                                <span className="text-status-info text-right font-bold">
                                                    {temporaryProfession.code}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4 border-b border-border-default pb-2">
                                                <span className="text-txt-disabled uppercase">Assigned</span>
                                                <span className="text-txt-secondary text-right">
                                                    {formatDate(temporaryProfession.assignedAt)}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4">
                                                <span className="text-txt-disabled uppercase">Until</span>
                                                <span className="text-status-warning text-right font-bold">
                                                    {formatDate(temporaryProfession.temporaryUntil)}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border border-border-default bg-bg-app p-4 text-[12px] font-mono text-txt-disabled uppercase tracking-label">
                                            No active temporary profession detected.
                                        </div>
                                    )}
                                </section>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}