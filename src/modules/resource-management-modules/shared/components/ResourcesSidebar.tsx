import type { ReactNode } from "react";

interface Item {
  id: number | string;
  label: string;
  value?: string | number;
}

interface Props {
  items: Item[];
  title?: string;
  className?: string;
  renderItem?: (item: Item) => ReactNode;
}

export function ResourcesSidebar({ items, title = "Resources", className = "", renderItem }: Props) {
  return (
    <aside className={`w-64 p-4 border-l border-border-subtle bg-bg-secondary/40 ${className}`}>
      <div className="font-mono text-[10px] text-txt-muted uppercase tracking-widest mb-3">{title}</div>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.id} className="flex items-center justify-between text-[13px] text-txt-primary">
            {renderItem ? renderItem(it) : <span className="truncate">{it.label}</span>}
            {it.value !== undefined ? <span className="text-txt-muted text-[12px] ml-2">{String(it.value)}</span> : null}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default ResourcesSidebar;
