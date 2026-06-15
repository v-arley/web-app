import type { ReactNode } from "react";

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
        <article className="app-scope app-module">
            <header className="app-module-header">
                <div className="app-module-brand">
                    <div className="app-module-copy">
                        <div className="app-module-title">{title}</div>
                        <p className="app-module-subtitle">{subtitle}</p>
                    </div>
                </div>

                {tabs.length > 0 ? (
                    <nav className="app-module-tabs">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.key;

                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => onTabChange?.(tab.key)}
                                    className={`app-module-tab ${isActive ? "app-module-tab--active" : ""}`}
                                >
                                    {isActive ? <div className="app-module-tab-indicator" /> : null}
                                    {tab.icon ? (
                                        <span className="app-module-tab-icon">{tab.icon}</span>
                                    ) : null}
                                    <div className="app-module-tab-copy">
                                        <div className="app-module-tab-label">{tab.label}</div>
                                        {tab.description ? (
                                            <div className="app-module-tab-desc">
                                                {tab.description}
                                            </div>
                                        ) : null}
                                    </div>
                                </button>
                            );
                        })}
                    </nav>
                ) : (
                    <div className="app-module-tabs" />
                )}

                {rightContent ? (
                    <div className="app-module-actions">{rightContent}</div>
                ) : null}
            </header>

            <main className="app-module-body">
                <div
                    key={activeTab ?? "content"}
                    className="app-animate-in"
                    style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}
                >
                    {children}
                </div>
            </main>
        </article>
    );
}

export default SystemModuleShell;
