import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  rightContent?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, icon, rightContent, className = "" }: Props) {
  return (
    <header className={`rmm-page-header border-b border-border-subtle bg-bg-secondary/50 shrink-0 flex ${className}`}>
      <div className="rmm-page-header__identity">
        <div className="w-0.5 self-stretch bg-accent" />
        {icon}
        <div className="min-w-0">
          <div className="rmm-page-header__title font-mono font-bold text-txt-primary uppercase">{title}</div>
          {subtitle ? (
            <div className="rmm-page-header__subtitle font-mono text-txt-muted uppercase mt-0.5">{subtitle}</div>
          ) : null}
        </div>
      </div>

      {rightContent ? <div className="rmm-page-header__actions text-txt-muted">{rightContent}</div> : null}
    </header>
  );
}

export default PageHeader;
