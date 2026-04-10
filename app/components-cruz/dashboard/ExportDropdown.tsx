"use client";

import { FileDown } from "lucide-react";

export interface MonthOption {
  key: string;    // "2025-03"
  label: string;  // "Marzo 2025"
}

interface ExportDropdownProps {
  months: MonthOption[];
  onExport: (monthKey: string | null) => void;
}

export default function ExportDropdown({ months, onExport }: ExportDropdownProps) {
  return (
    <div className="absolute left-0 top-full mt-2 z-50 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Exportar por período</p>
      </div>

      {/* All option */}
      <button
        onClick={() => onExport(null)}
        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
      >
        <FileDown size={14} className="text-gray-400 shrink-0" />
        <span className="text-sm font-semibold text-gray-700">Todos los meses</span>
      </button>

      {/* Divider */}
      <div className="mx-4 h-px bg-gray-100" />

      {/* Month options */}
      <div className="py-1 max-h-52 overflow-y-auto">
        {months.map((m) => (
          <button
            key={m.key}
            onClick={() => onExport(m.key)}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 hover:text-primary transition-colors text-left"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
            <span className="text-sm text-gray-600 capitalize">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
