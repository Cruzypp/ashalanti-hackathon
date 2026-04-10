import userData from "@/app/data/user.json";
import { computeHealthScore, scoreMessage } from "@/app/utils/healthScore";
import { mapFrictions } from "@/app/lib/mapFrictions";
import HealthScoreCard from "@/app/components-cruz/ejecutivo/HealthScoreCard";
import Top5FriccionesTable from "@/app/components-cruz/ejecutivo/Top5FriccionesTable";
import SideStats from "@/app/components-cruz/ejecutivo/SideStats";

export default function EjecutivoPage() {
  const breakdown = computeHealthScore(userData);
  const { total, ...rest } = breakdown;
  const message = scoreMessage(total, userData.user.name);
  const frictions = mapFrictions(userData);
  const { total_monthly_loss, potential_savings } = userData.friction_summary;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Resumen Ejecutivo</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Diagnóstico financiero · {userData.user.name}
        </p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
        {/* Left — Health Score */}
        <HealthScoreCard score={total} message={message} breakdown={rest} />

        {/* Right — Table + stats */}
        <div className="flex flex-col gap-6">
          <Top5FriccionesTable frictions={frictions} />

          <SideStats
            totalMonthlyLoss={total_monthly_loss}
            potentialSavings={potential_savings}
            monthlyIncome={userData.user.monthly_income}
          />
        </div>
      </div>
    </div>
  );
}
