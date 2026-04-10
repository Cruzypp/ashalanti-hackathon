"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import {
  Coffee, ShoppingBag, Tv, Music, HelpCircle,
  Utensils, Package, BookOpen, Heart, Cpu, Receipt,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import CardFilterDropdown from "./CardFilterDropdown";
import ExportDropdown from "./ExportDropdown";
import type { MonthOption } from "./ExportDropdown";
import { exportPurchasesPDF } from "@/app/utils/exportPDF";

/* types */

export interface Account {
  account_id: string;
  bank: string;
  type: string;
  card_last4: string;
  product: string;
}

export interface Transaction {
  txn_id: string;
  account_id: string;
  bank: string;
  card_last4: string;
  date: string;
  merchant: string;
  category: string;
  subcategory?: string;
  amount: number;
  type: string;
}

/* helpers */

const BANK_MAP: Record<string, string> = {
  BBVA: "bbva",
  Nu: "nu",
  Citibanamex: "banamex",
  Banorte: "banorte",
};

function bankSvg(bank: string, type: string): string {
  const base = BANK_MAP[bank] ?? bank.toLowerCase();
  const debitVariants = ["bbva", "banamex"];
  if (type === "debito" && debitVariants.includes(base)) return `/${base}_debito.svg`;
  return `/${base}.svg`;
}

function merchantIcon(category: string, subcategory: string): LucideIcon {
  if (subcategory === "Café") return Coffee;
  if (subcategory === "Conveniencia") return ShoppingBag;
  if (subcategory?.includes("Streaming")) return Tv;
  if (subcategory === "Música") return Music;
  if (subcategory === "Bienestar") return Heart;
  if (subcategory === "Educación") return BookOpen;
  if (subcategory === "Almacenamiento") return Cpu;
  if (subcategory === "Software / IA") return Cpu;
  if (subcategory === "E-commerce") return Package;
  if (category === "Comida") return Utensils;
  if (category === "Suscripción") return Tv;
  if (subcategory === "Sin clasificar") return HelpCircle;
  return Receipt;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-MX", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function formatAmount(amount: number): string {
  return `$${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

/* component */

interface Props {
  accounts: Account[];
  transactions: Transaction[];
}

export default function PurchaseHistory({ accounts, transactions }: Props) {
  const gastos = transactions
    .filter((t) => t.type === "gasto")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const accountMap: Record<string, Account> = Object.fromEntries(
    accounts.map((a) => [a.account_id, a])
  );

  // Meses disponibles derivados de los datos
  const months: MonthOption[] = Array.from(
    new Set(gastos.map((t) => t.date.slice(0, 7)))
  )
    .sort((a, b) => b.localeCompare(a))
    .map((key) => ({
      key,
      label: new Date(key + "-01").toLocaleDateString("es-MX", { month: "long", year: "numeric" }),
    }));

  const allIds = new Set<string>(accounts.map((a) => a.account_id));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(allIds));
  const [filterOpen, setFilterOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    }
    if (filterOpen || exportOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [filterOpen, exportOpen]);

  function toggleCard(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  function toggleAll() {
    setSelectedIds((prev) =>
      prev.size === accounts.length ? new Set<string>() : new Set<string>(allIds)
    );
  }

  const filtered = gastos.filter((t) => selectedIds.has(t.account_id)).slice(0, 6);
  const activeFilters = selectedIds.size < accounts.length ? accounts.length - selectedIds.size : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Historial de Compras</h2>
        <div className="flex gap-2 items-center">
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setExportOpen((o) => !o)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                exportOpen ? "bg-gray-200 text-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Exportar
            </button>
            {exportOpen && (
              <ExportDropdown
                months={months}
                onExport={(monthKey) => {
                  setExportOpen(false);
                  exportPurchasesPDF(gastos, monthKey);
                }}
              />
            )}
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className={`relative px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                filterOpen || activeFilters > 0
                  ? "bg-primary text-white"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              Filtrar
              {activeFilters > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-critical text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>

            {filterOpen && (
              <CardFilterDropdown
                accounts={accounts}
                selectedIds={selectedIds}
                onToggle={toggleCard}
                onToggleAll={toggleAll}
              />
            )}
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Sin transacciones para las tarjetas seleccionadas.</p>
        ) : (
          filtered.map((t, i) => {
            const account = accountMap[t.account_id];
            const Icon = merchantIcon(t.category, t.subcategory ?? "");
            const svgSrc = bankSvg(t.bank, account?.type ?? "credito");

            return (
              <div key={t.txn_id}>
                <div className="flex items-center gap-3 py-4 px-2">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-800 leading-tight">{t.merchant}</p>
                        <p className="text-xs text-gray-400">{t.category}</p>
                      </div>
                      <p className="text-xs text-gray-400 shrink-0">{formatDate(t.date)}</p>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-11 h-7 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden p-1 shrink-0">
                          <Image src={svgSrc} alt={t.bank} width={36} height={24} className="object-contain" />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">{t.bank}</span>
                        <span className="text-xs text-gray-400">···· {t.card_last4}</span>
                      </div>
                      <p className="text-sm font-bold text-gray-800 shrink-0">{formatAmount(t.amount)}</p>
                    </div>
                  </div>
                </div>
                {i < filtered.length - 1 && (
                  <div className="mx-2 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 text-center">
        <Link href="/compras" className="text-sm font-medium text-primary hover:underline">
          Ver historial completo
        </Link>
      </div>
    </div>
  );
}
