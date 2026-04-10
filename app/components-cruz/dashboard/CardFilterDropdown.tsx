"use client";

import Image from "next/image";

interface Account {
  account_id: string;
  bank: string;
  type: string;
  card_last4: string;
  product: string;
}

interface CardFilterDropdownProps {
  accounts: Account[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
}

function bankSvg(bank: string, type: string): string {
  const bankMap: Record<string, string> = {
    BBVA: "bbva",
    Nu: "nu",
    Citibanamex: "banamex",
    Banorte: "banorte",
  };
  const base = bankMap[bank] ?? bank.toLowerCase();
  const debitVariants = ["bbva", "banamex"];
  if (type === "debito" && debitVariants.includes(base)) return `/${base}_debito.svg`;
  return `/${base}.svg`;
}

export default function CardFilterDropdown({
  accounts,
  selectedIds,
  onToggle,
  onToggleAll,
}: CardFilterDropdownProps) {
  const allSelected = selectedIds.size === accounts.length;

  return (
    <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filtrar por tarjeta</span>
        <button
          onClick={onToggleAll}
          className="text-xs font-semibold text-primary hover:underline"
        >
          {allSelected ? "Limpiar" : "Todas"}
        </button>
      </div>

      {/* Options */}
      <div className="py-2 max-h-72 overflow-y-auto">
        {accounts.map((acc) => {
          const checked = selectedIds.has(acc.account_id);
          const svgSrc = bankSvg(acc.bank, acc.type);
          const typeLabel = acc.type === "debito" ? "Débito" : "Crédito";

          return (
            <button
              key={acc.account_id}
              onClick={() => onToggle(acc.account_id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left ${
                checked ? "bg-primary/5" : ""
              }`}
            >
              {/* Custom checkbox */}
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                  checked
                    ? "bg-primary border-primary"
                    : "border-gray-300 bg-white"
                }`}
              >
                {checked && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>

              {/* Bank logo */}
              <div className="w-10 h-6 rounded bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden p-0.5 shrink-0">
                <Image src={svgSrc} alt={acc.bank} width={32} height={20} className="object-contain" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 leading-tight">{acc.bank}</p>
                <p className="text-xs text-gray-400">{typeLabel} ···· {acc.card_last4}</p>
              </div>

              {/* Type badge */}
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  acc.type === "debito"
                    ? "bg-gray-100 text-gray-500"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {typeLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-400 text-center">
          {selectedIds.size === 0
            ? "Sin tarjetas seleccionadas"
            : selectedIds.size === accounts.length
            ? "Mostrando todas las tarjetas"
            : `${selectedIds.size} de ${accounts.length} tarjetas`}
        </p>
      </div>
    </div>
  );
}
