import { FileText, Database, Headphones, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface Friccion {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  loss: string;
}

const fricciones: Friccion[] = [
  {
    id: "1",
    title: "Aprobación de viáticos",
    subtitle: "Demora media: 4.2 días",
    icon: FileText,
    loss: "-$92.00",
  },
  {
    id: "2",
    title: "Duplicidad de datos CRM",
    subtitle: "Impacto: 12 usuarios",
    icon: Database,
    loss: "-$45.50",
  },
  {
    id: "3",
    title: "Feedback tardío soporte",
    subtitle: "Alta prioridad",
    icon: Headphones,
    loss: "-$31.00",
  },
  {
    id: "4",
    title: "Stockout preventivo",
    subtitle: "Riesgo operativo",
    icon: Package,
    loss: "-$16.00",
  },
];

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
              <span className="text-sm font-bold text-critical shrink-0">{f.loss}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
