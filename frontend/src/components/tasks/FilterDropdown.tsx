'use client';

import { Filter } from 'lucide-react';

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function FilterDropdown({ value, onChange }: FilterDropdownProps) {
  return (
    <div className="relative">
      <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field pl-10 pr-8 appearance-none cursor-pointer min-w-[180px]"
      >
        <option value="">All Statuses</option>
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="h-4 w-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
