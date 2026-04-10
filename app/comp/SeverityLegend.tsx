import type { Severity } from './FrictionCard'

const items: { severity: Severity; label: string }[] = [
  { severity: 'critical',  label: 'Critical'  },
  { severity: 'medium',    label: 'Medium'    },
  { severity: 'attention', label: 'Attention' },
]

const dotColor: Record<Severity, string> = {
  critical:  'bg-orange-500',
  medium:    'bg-amber-600',
  attention: 'bg-blue-600',
}

export function SeverityLegend() {
  return (
    <div className="flex items-center gap-2">
      {items.map(({ severity, label }) => (
        <div key={severity} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-sm text-gray-700">
          <span className={`w-2 h-2 rounded-full ${dotColor[severity]}`} />
          {label}
        </div>
      ))}
    </div>
  )
}