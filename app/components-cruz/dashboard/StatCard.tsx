import { AlertTriangle, TrendingDown, PiggyBank } from "lucide-react";
import CircularProgress from "./CircularProgress";

type StatCardVariant = "frictions" | "loss" | "savings" | "health";

interface StatCardProps {
  variant: StatCardVariant;
  value: number | string;
}

export default function StatCard({ variant, value }: StatCardProps) {
  if (variant === "frictions") {
    return (
      <div className="rounded-2xl bg-[#D95F35] p-5 flex flex-col justify-between min-h-[140px]">
        <div className="flex items-start justify-between">
          <AlertTriangle size={45} className="text-[#7B2D0A]" />
          <span className="text-5xl font-bold text-[#7B2D0A]">{value}</span>
        </div>
        <p className="text-base font-semibold text-[#7B2D0A] mt-4">Fricciones activas</p>
      </div>
    );
  }

  if (variant === "loss") {
    return (
      <div className="rounded-2xl bg-white border border-gray-100 p-5 flex flex-col justify-between min-h-[140px] shadow-sm">
        <div className="flex items-center gap-2">
          <TrendingDown size={20} className="text-critical" />
          <span className="text-2xl font-bold text-critical">{value}</span>
        </div>
        <p className="text-sm text-gray-400 mt-auto">Pérdida mensual</p>
      </div>
    );
  }

  if (variant === "savings") {
    return (
      <div className="rounded-2xl bg-sky-50 border-2 border-primary p-5 flex flex-col justify-between min-h-[140px]">
        <div className="flex items-bottom gap-2">
          <PiggyBank size={60} className="text-primary" />
          <span className="text-2xl font-bold text-primary">{value}</span>
        </div>
        <p className="text-sm font-semibold text-primary mt-auto">Ahorro potencial</p>
      </div>
    );
  }

  // health
  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-5 flex flex-col items-center justify-center min-h-[140px] shadow-sm gap-2">
      <div className="relative flex items-center justify-center">
        <CircularProgress value={Number(value)} />
        <span className="absolute text-xl font-bold text-gray-800">{value}</span>
      </div>
      <p className="text-sm text-gray-400">Salud Operativa</p>
    </div>
  );
}
