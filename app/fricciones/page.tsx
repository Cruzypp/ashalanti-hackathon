import userData from '../data/user.json'
import { mapFrictions } from '../lib/mapFrictions'
import { FrictionCard } from '../comp/FrictionCard'
import { OptimizacionBanner } from '../comp/OptimizacionBanner'
import { SeverityLegend } from '../comp/SeverityLegend'

export default function FriccionPage() {
  const frictions = mapFrictions(userData)
  const { total_monthly_loss, potential_savings, health_score } = userData.friction_summary

  const recoveryPercent = total_monthly_loss > 0 ? Math.round((potential_savings / total_monthly_loss) * 100) : 0

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Listado de Fricciones
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitorea y resuelve las anomalías financieras detectadas — Marzo 2025
          </p>
        </div>
        <SeverityLegend />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {frictions.map((f) => (
          <FrictionCard
            key={f.type}
            severity={f.severity}
            amount={f.monthlyImpact}
            title={f.label}
            description={f.description}
            meta={f.meta}
            detectedAt={f.detectedAt}
            detailHref={`/fricciones/${f.type}`}
          />
        ))}
      </div>

      <OptimizacionBanner
        recoveredAmount={potential_savings}
        recoveryPercent={recoveryPercent}
        progressPercent={health_score}
      />
    </main>
  )
}
