import {
  AlertTriangle,
  CreditCard,
  Receipt,
  ShoppingBag,
  ShoppingCart,
  Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Friction } from "@/app/types/friction";

const iconByType: Record<string, LucideIcon> = {
  compra_impulsiva: ShoppingCart,
  suscripcion_zombie: CreditCard,
  riesgo_liquidez: AlertTriangle,
  comision_evitable: Receipt,
  pago_duplicado: CreditCard,
  inflacion_personal: Utensils,
  gasto_hormiga: ShoppingBag,
  compra_hora_inusual: AlertTriangle,
};

const severityBadge: Record<Friction["severity"], { label: string; className: string }> = {
  critical: { label: "Crítico", className: "bg-red-50 text-red-600" },
  medium:   { label: "Medio",   className: "bg-amber-50 text-amber-600" },
  attention:{ label: "Atención",className: "bg-sky-50 text-sky-600" },
};

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

interface Props {
  frictions: Friction[];
}

export default function Top5FriccionesTable({ frictions }: Props) {
  const top5 = frictions
    .sort((a, b) => b.monthlyImpact - a.monthlyImpact)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Top 5 Fricciones</h2>

      <div className="overflow-hidden rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Fricción</th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">Detalle</th>
              <th className="px-4 py-3 text-center">Severidad</th>
              <th className="px-4 py-3 text-right">Impacto / mes</th>
            </tr>
          </thead>
          <tbody>
            {top5.map((f, i) => {
              const Icon = iconByType[f.type] ?? AlertTriangle;
              const badge = severityBadge[f.severity];
              return (
                <tr
                  key={f.type}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                >
                  <td className="px-4 py-3 text-gray-400 font-medium">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Icon size={15} className="text-gray-500" />
                      </div>
                      <span className="font-semibold text-gray-800">{f.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden sm:table-cell max-w-[200px] truncate">
                    {f.meta?.[0] ?? f.detectedAt}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-critical">
                    -{currency.format(f.monthlyImpact)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
