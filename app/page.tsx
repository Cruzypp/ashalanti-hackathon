import { FrictionCard, type FrictionCardProps } from './comp/FrictionCard'
import { OptimizacionBanner } from './comp/OptimizacionBanner'
import { SeverityLegend } from './comp/SeverityLegend'

const FRICTIONS: Omit<FrictionCardProps, 'onViewDetail'>[] = [
  { severity: 'critical',  amount: 45,  title: 'Suscripción Zombie',  description: "Servicio 'CloudStorage Pro' facturado tres veces este mes.", detectedAt: 'Detectado hace 2 días'    },
  { severity: 'medium',    amount: 12.9,title: 'Cobro Duplicado',     description: "Doble cargo detectado en 'Starbucks' el día 3.",            detectedAt: 'Detectado hace 5 días'   },
  { severity: 'attention', amount: 3.5, title: 'Inflación de Precio', description: 'Incremento del 15% en tarifa mensual detectado.',           detectedAt: 'Detectado ayer'          },
  { severity: 'critical',  amount: 120, title: 'Membresía Fantasma',  description: "Cargo anual de 'Global Gym' activo pese a cancelación.",    detectedAt: 'Detectado hace 1 semana' },
]

export default function FrictionsPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Listado de Fricciones</h1>
          <p className="text-sm text-gray-500 mt-1">Monitorea y resuelve las anomalías financieras detectadas.</p>
        </div>
        <SeverityLegend />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {FRICTIONS.map((f, i) => (
          <FrictionCard key={i} {...f} />
        ))}
      </div>

      {/* Banner */}
      <OptimizacionBanner
        recoveredAmount={245}
        recoveryPercent={12}
        progressPercent={62}
      />
    </main>
  )
}