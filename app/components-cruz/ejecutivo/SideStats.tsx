import { TrendingUp, ShieldAlert } from "lucide-react";

interface Props {
  totalMonthlyLoss: number;
  potentialSavings: number;
  monthlyIncome: number;
}

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export default function SideStats({ totalMonthlyLoss, potentialSavings, monthlyIncome }: Props) {
  const lossPercent = Math.round((totalMonthlyLoss / monthlyIncome) * 100);
  const savingsPercent = Math.round((potentialSavings / monthlyIncome) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Ingreso en Riesgo */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <ShieldAlert size={17} className="text-critical" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ingreso en Riesgo</p>
            <p className="text-2xl font-black text-critical leading-tight">
              {mxn.format(totalMonthlyLoss)}
            </p>
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-red-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-critical transition-all duration-700"
            style={{ width: `${Math.min(lossPercent, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">
          El <span className="font-bold text-critical">{lossPercent}%</span> de tu ingreso mensual
          se va en fricciones evitables.
        </p>
      </div>

      {/* Crecimiento Potencial */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <TrendingUp size={17} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Crecimiento Potencial</p>
            <p className="text-2xl font-black text-emerald-500 leading-tight">
              +{mxn.format(potentialSavings)}
            </p>
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-emerald-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-700"
            style={{ width: `${Math.min(savingsPercent, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">
          Si eliminas las fricciones recuperas el{" "}
          <span className="font-bold text-emerald-500">{savingsPercent}%</span> de tu ingreso.
        </p>
      </div>
    </div>
  );
}
