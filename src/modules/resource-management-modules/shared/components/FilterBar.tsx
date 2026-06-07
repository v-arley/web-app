import React from "react";

interface Props {
  children: React.ReactNode;
  wrapperClassName?: string;
}

export function FilterBar({ children, wrapperClassName = "" }: Props) {
  return (
    <div className={`rmm-filter-shell shrink-0 ${wrapperClassName}`}>
      <div className="rmm-filter-row">
        {children}
      </div>
    </div>
  );
}

export default FilterBar;
