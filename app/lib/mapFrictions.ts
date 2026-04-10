import type { Friction } from '../types/friction'

const severityMap: Record<string, Friction['severity']> = {
  critico:  'critical',
  medio:    'medium',
  atencion: 'attention',
}

export function mapFrictions(data: typeof import('../data/user.json')): Friction[] {
  const { frictions } = data.friction_summary
  const { historical_comparison } = data

  return frictions.map((f): Friction => {
    const monthlyImpact = f.monthly_impact ?? 0

    switch (f.type) {
      case 'compra_impulsiva':
        return {
          type: f.type,
          label: f.label,
          severity: severityMap[f.severity],
          monthlyImpact,
          count: f.count,
          description: `Amazon, Mercado Libre, Shein, Steam, Liverpool…`,
          meta: [`${f.count} eventos`, `+${historical_comparison.ecommerce.pct_change_vs_q_prev} vs trimestre`],
          detectedAt: 'Detectado este mes',
        }
      case 'suscripcion_zombie':
        return {
          type: f.type,
          label: f.label,
          severity: severityMap[f.severity],
          monthlyImpact,
          count: f.count,
          description: (f.services ?? []).join(', ') + '…',
          meta: [`${f.count} servicios`, `+${historical_comparison.subscriptions.pct_change_vs_q_prev} vs trimestre`],
          detectedAt: 'Detectado este mes',
        }
      case 'riesgo_liquidez':
        return {
          type: f.type,
          label: f.label,
          severity: severityMap[f.severity],
          monthlyImpact: Math.abs(f.projected_shortfall_amount ?? 0),
          description: 'Cuenta Banorte en cero antes de próxima nómina…',
          meta: ['Déficit proyectado', `$${Math.abs(f.projected_shortfall_amount ?? 0).toLocaleString('es-MX')}`],
          detectedAt: `Día ${f.projected_shortfall_day}`,
        }
      case 'comision_evitable':
        return {
          type: f.type,
          label: f.label,
          severity: severityMap[f.severity],
          monthlyImpact,
          count: f.count,
          description: f.detail ?? '',
          meta: [`${f.count} eventos`, `+${historical_comparison.atm_fees.pct_change_vs_q_prev} vs trimestre`],
          detectedAt: 'Detectado este mes',
        }
      case 'pago_duplicado':
        return {
          type: f.type,
          label: f.label,
          severity: severityMap[f.severity],
          monthlyImpact,
          count: f.count,
          description: (f.services ?? []).join(' y ') + ' activos junto con Netflix…',
          meta: [`${f.count} servicios`, 'Triple streaming'],
          detectedAt: 'Detectado este mes',
        }
      case 'inflacion_personal':
        return {
          type: f.type,
          label: f.label,
          severity: severityMap[f.severity],
          monthlyImpact,
          description: 'La Única, VIPS, Don Sirloin, Sushi Roll…',
          meta: [`${f.vs_last_quarter} vs trimestre`],
          detectedAt: 'Detectado este mes',
        }
      case 'gasto_hormiga':
        return {
          type: f.type,
          label: f.label,
          severity: severityMap[f.severity],
          monthlyImpact,
          count: f.count,
          description: 'Oxxo diario + Starbucks 3x semana en Garza Sada…',
          meta: [`${f.count} eventos`],
          detectedAt: 'Patrón diario detectado',
        }
      case 'compra_hora_inusual':
        return {
          type: f.type,
          label: f.label,
          severity: severityMap[f.severity],
          monthlyImpact,
          count: f.count,
          description: 'Compras 1am–4am en establecimientos sin nombre…',
          meta: [`${f.count} eventos`],
          detectedAt: 'Viernes y sábados',
        }
      default:
        return {
          type: f.type,
          label: f.label,
          severity: severityMap[f.severity] ?? 'attention',
          monthlyImpact: f.monthly_impact ?? 0,
          description: f.detail ?? '',
          detectedAt: 'Detectado este mes',
        }
    }
  })
}
