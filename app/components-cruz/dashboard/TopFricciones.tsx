import {
  AlertTriangle,
  CreditCard,
  Receipt,
  ShoppingBag,
  ShoppingCart,
  Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import userData from "../../data/user.json";
import { mapFrictions } from "../../lib/mapFrictions";

interface Friccion {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  loss: number;
}

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

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "USD",
  signDisplay: "always",
});

const fricciones: Friccion[] = mapFrictions(userData)
  .sort((a, b) => b.monthlyImpact - a.monthlyImpact)
  .slice(0, 4)
  .map((f) => ({
    id: f.type,
    title: f.label,
    subtitle: f.meta?.[0] ?? f.detectedAt,
    icon: iconByType[f.type] ?? AlertTriangle,
    loss: -Math.abs(f.monthlyImpact),
  }));

export default function TopFricciones() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Top Fricciones</h2>
        <Link href="/fricciones" className="text-sm font-medium text-primary hover:underline">
          Ver todas
        </Link>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {fricciones.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 leading-tight">{f.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{f.subtitle}</p>
              </div>
              <span className="text-sm font-bold text-critical shrink-0">{currency.format(f.loss)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
