import Link from 'next/link'

interface Props {
  recoveredAmount: number
  recoveryPercent: number
  progressPercent: number
}

const SPARK_HEIGHTS = [28, 45, 35, 60, 50, 80, 100]

export function OptimizacionBanner({ recoveredAmount, recoveryPercent, progressPercent }: Props) {
  const formatted = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(recoveredAmount)
  const progress = Math.min(100, Math.max(0, progressPercent))

  return (
    <div className="bg-sky-200 rounded-2xl p-7 flex items-center justify-between gap-6">
      <div className="flex-1">
        <h2 className="text-xl font-bold text-sky-900 mb-2">Optimización Inteligente</h2>
        <p className="text-sm text-sky-800 leading-relaxed mb-5">
          Has recuperado un total de <span className="font-semibold text-sky-900">{formatted}</span> este mes resolviendo fricciones. ¡Sigue así!
        </p>
        <Link
          href="/reporte-mensual"
          className="inline-flex bg-sky-900 text-sky-100 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-sky-800 transition-colors"
        >
          Generar Reporte Mensual
        </Link>
      </div>

      <div className="bg-white/40 rounded-xl p-4 min-w-[175px] flex flex-col gap-3">
        <div className="flex items-end justify-between">
          <div className="flex items-end gap-0.5 h-11">
            {SPARK_HEIGHTS.map((h, i) => (
              <div key={i} className="w-2.5 rounded-t bg-sky-400" style={{ height: `${h}%` }} />
            ))}
          </div>
          <span className="bg-sky-900 text-sky-200 text-[10px] font-semibold px-2.5 py-1 rounded-full">
            +{recoveryPercent}% Recup.
          </span>
        </div>
        <div>
          <p className="text-[9px] tracking-widest text-sky-700 uppercase mb-1.5">Estado general</p>
          <div className="h-1.5 bg-sky-900/15 rounded-full overflow-hidden">
            <div className="h-full bg-sky-900 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
