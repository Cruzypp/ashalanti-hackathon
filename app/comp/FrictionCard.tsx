import { CalendarDays } from 'lucide-react'
import Link from 'next/link'

export type Severity = 'critical' | 'medium' | 'attention'

export interface FrictionCardProps {
  severity: Severity
  amount: number
  title: string
  description: string
  meta?: string[]
  detectedAt: string
  detailHref: string
}

const config: Record<Severity, { label: string; badge: string; amount: string; border: string }> = {
  critical:  { label: 'CRITICAL',  badge: 'bg-orange-100 text-orange-800', amount: 'text-orange-600', border: 'border-l-orange-500' },
  medium:    { label: 'MEDIUM',    badge: 'bg-amber-100 text-amber-800',   amount: 'text-amber-600',  border: 'border-l-amber-500'  },
  attention: { label: 'ATTENTION', badge: 'bg-blue-100 text-blue-800',     amount: 'text-blue-700',   border: 'border-l-blue-500'   },
}

export function FrictionCard({ severity, amount, title, description, meta, detectedAt, detailHref }: FrictionCardProps) {
  const c = config[severity]
  const formatted = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', signDisplay: 'always' }).format(-Math.abs(amount))

  return (
    <div className={`bg-white rounded-2xl p-5 border border-gray-100 border-l-4 ${c.border}`}>
      <div className="flex items-center justify-between mb-2.5">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide ${c.badge}`}>{c.label}</span>
        <span className={`text-lg font-semibold ${c.amount}`}>{formatted}</span>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-400 truncate mb-3.5">{description}</p>
      {meta?.length ? (
        <div className="flex flex-wrap gap-2 mb-3.5">
          {meta.map((item) => (
            <span key={item} className="text-[10px] font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {item}
            </span>
          ))}
        </div>
      ) : null}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <CalendarDays size={12} />
          {detectedAt}
        </span>
        <Link
          href={detailHref}
          className="text-xs px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Ver Detalle
        </Link>
      </div>
    </div>
  )
}
