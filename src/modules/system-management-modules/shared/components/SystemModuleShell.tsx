import type { ReactNode } from "react";
import "../../../../system-aspect.css";

export type SystemTab<T extends string> = {
    key: T;
    label: string;
    description: string;
    icon: ReactNode;
};

type SystemModuleShellProps<T extends string> = {
    title: string;
    subtitle: string;
    tabs?: Array<SystemTab<T>>;
    activeTab?: T;
    onTabChange?: (tab: T) => void;
    rightContent?: ReactNode;
    children: ReactNode;
};

export function SystemModuleShell<T extends string>({
    title,
    subtitle,
    tabs = [],
    activeTab,
    onTabChange,
    rightContent,
    children,
}: SystemModuleShellProps<T>) {
    return (
        <article className="rmm-scope flex h-full min-h-0 flex-col bg-transparent overflow-hidden relative no-scrollbar border border-border-default">
            <header className="rmm-module-header flex items-stretch bg-black/50 backdrop-blur-lg shrink-0 z-10">
                <div className="rmm-module-brand flex items-center gap-3 shrink-0">
                    <div className="rmm-module-accent w-0.75 self-stretch bg-accent" />
                    <div className="rmm-module-copy py-2 px-3">
                        <div className="rmm-module-title text-xl font-abril font-bold uppercase tracking-widest text-txt-primary leading-none">{title}</div>
                        <p className="rmm-module-subtitle text-[9px] text-txt-muted uppercase tracking-wide mt-0.5">{subtitle}</p>
                    </div>
                </div>

                {tabs.length > 0 ? (
                    <nav className="rmm-module-tabs flex items-stretch flex-1 justify-end">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.key;

                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => onTabChange?.(tab.key)}
                                    className={`rmm-module-tab relative flex items-center gap-2.5 px-5 border-r border-border-subtle transition-all group ${
                                isActive
                                    ? "rmm-module-tab--active bg-bg-app/60 text-[#CC361E]"
                                    : "text-txt-muted hover:bg-bg-secondary/40 hover:text-txt-primary"
                            }`}
                                >
                                    {isActive ? <div className="rmm-module-tab-indicator absolute bottom-0 left-0 right-0 h-0.5 bg-[#CC361E]" /> : null}
                                    <span className={`rmm-module-tab-icon ${isActive ? "text-[#CC361E]" : "text-txt-disabled group-hover:text-txt-secondary"}`}>
                                        {tab.icon}
                                    </span>
                                    <div className="rmm-module-tab-copy text-left">
                                        <div className="rmm-module-tab-label font-mono text-[10px] font-bold uppercase tracking-widest">{tab.label}</div>
                                        {tab.description ? (
                                            <div className="rmm-module-tab-desc text-[8px] text-txt-muted uppercase tracking-wide leading-tight">
                                                {tab.description}
                                            </div>
                                        ) : null}
                                    </div>
                                </button>
                            );
                        })}
                    </nav>
                ) : (
                    <div className="flex-1" />
                )}

                {rightContent ? (
                    <div className="rmm-module-actions flex items-center px-4 border-l border-border-default shrink-0 gap-3">{rightContent}</div>
                ) : null}
            </header>

            <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-transparent overflow-hidden relative">{children}</main>
        </article>
    );
}

export default SystemModuleShell;
