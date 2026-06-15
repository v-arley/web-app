import React from "react";

interface Props {
  children: React.ReactNode;
  wrapperClassName?: string;
}

export function FilterBar({ children, wrapperClassName = "" }: Props) {
  return (
    <div className={`app-filter-shell shrink-0 ${wrapperClassName}`}>
      <div className="app-filter-row">
        {children}
      </div>
    </div>
  );
}

export default FilterBar;
