import userData from '../data/user.json'
import { mapFrictions } from './mapFrictions'

const currency = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

type RawData = typeof userData
type Transaction = RawData['transactions'][number]
type SummaryFriction = RawData['friction_summary']['frictions'][number]

export interface FrictionHistoryItem {
  id: string
  merchant: string
  subtitle: string
  amountLabel: string
  initials: string
}

export interface FrictionDetailViewModel {
  type: string
  title: string
  breadcrumb: string[]
  severityLabel: string
  severityTone: string
  messageTitle: string
  messageBody: string
  savingsLabel: string
  confidenceLabel: string
  currentState: string
  currentStateSince: string
  healthScore: number
  recommendationTitle: string
  recommendationBody: string
  bankOriginLabel: string
  recentHistory: FrictionHistoryItem[]
}

function formatMoney(value: number) {
  return currency.format(Math.abs(value))
}

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T12:00:00`))
}

function getInitials(merchant: string) {
  const words = merchant.replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean)
  if (!words.length) return '?'
  if (words.length === 1) return words[0].slice(0, 1).toUpperCase()
  return `${words[0][0]}${words[1][0]}`.toUpperCase()
}

function getSeverityTone(severity: string) {
  if (severity === 'critico') return 'bg-orange-500 text-white'
  if (severity === 'medio') return 'bg-amber-500 text-white'
  return 'bg-sky-500 text-white'
}

function getSeverityLabel(severity: string) {
  if (severity === 'critico') return 'ALTA FRICCION'
  if (severity === 'medio') return 'FRICCION MEDIA'
  return 'FRICCION ACTIVA'
}

function getScore(summary: SummaryFriction, all: SummaryFriction[]) {
  const maxImpact = Math.max(
    ...all.map((item) => Math.abs(item.monthly_impact ?? item.projected_shortfall_amount ?? 0)),
    1,
  )
  const impact = Math.abs(summary.monthly_impact ?? summary.projected_shortfall_amount ?? 0)
  const severityPenalty = summary.severity === 'critico' ? 28 : summary.severity === 'medio' ? 16 : 10
  const countPenalty = 'count' in summary && summary.count ? Math.min(summary.count * 3, 18) : 8
  const normalizedPenalty = Math.round((impact / maxImpact) * 40)
  return Math.max(18, 100 - severityPenalty - countPenalty - normalizedPenalty)
}

function getHistory(type: string, transactions: Transaction[]): FrictionHistoryItem[] {
  return transactions
    .filter((transaction) => transaction.friction === type)
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 6)
    .map((transaction) => ({
      id: transaction.txn_id,
      merchant: transaction.merchant,
      subtitle: `${formatDate(transaction.date)} • ${transaction.channel}`,
      amountLabel: formatMoney(transaction.amount),
      initials: getInitials(transaction.merchant),
    }))
}

function getDominantBank(type: string, transactions: Transaction[]) {
  const matches = transactions.filter((transaction) => transaction.friction === type)
  if (!matches.length) {
    if (type === 'riesgo_liquidez') {
      return 'Banorte • Cuenta Nómina Banorte • ****9012'
    }
    return 'Sin cuenta principal detectada'
  }

  const counts = new Map<string, number>()
  for (const transaction of matches) {
    const key = `${transaction.bank} • ****${transaction.card_last4}`
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
  return top ?? 'Sin cuenta principal detectada'
}

function getMessage(summary: SummaryFriction, history: FrictionHistoryItem[]) {
  switch (summary.type) {
    case 'suscripcion_zombie':
      return {
        title: 'Hay pagos activos que ya no se estan usando',
        body: `Detectamos ${summary.count ?? 0} cargos recurrentes con muy baja actividad. El historial reciente confirma cobros en servicios que ya no se usan de forma constante.`,
        state: 'Sin uso reciente',
        since: 'Entre 46 y 86 dias de inactividad',
        recommendationTitle: 'ACCION RECOMENDADA',
        recommendationBody: 'Cancela primero las suscripciones con mas dias inactivos y mayor monto mensual para recuperar ahorro rapido.',
        confidence: '98%',
      }
    case 'pago_duplicado':
      return {
        title: 'Estas pagando servicios que se traslapan',
        body: 'Encontramos cargos que cubren la misma necesidad de entretenimiento o envios. El historial solo muestra compras bajo este concepto duplicado.',
        state: 'Duplicado',
        since: 'Detectado este mes',
        recommendationTitle: 'ACCION RECOMENDADA',
        recommendationBody: 'Conserva solo la plataforma que mas usas y cancela el servicio complementario para evitar cargos repetidos.',
        confidence: '97%',
      }
    case 'gasto_hormiga':
      return {
        title: 'Se detecto un patron repetido de pequenos gastos',
        body: 'Las compras son frecuentes y de ticket bajo, pero sumadas generan una perdida mensual relevante en conveniencia y cafe.',
        state: 'Patron repetitivo',
        since: 'Consumo casi diario en marzo',
        recommendationTitle: 'ACCION RECOMENDADA',
        recommendationBody: 'Pon un limite semanal para cafe y conveniencia, o concentra esas compras en un solo presupuesto visible.',
        confidence: '95%',
      }
    case 'compra_impulsiva':
      return {
        title: 'Hay compras de alto ticket hechas por impulso',
        body: 'Las transacciones asociadas muestran recurrencia en e-commerce y compras nocturnas que elevan el gasto sin planeacion previa.',
        state: 'Impulsiva',
        since: 'Escalada fuerte este mes',
        recommendationTitle: 'ACCION RECOMENDADA',
        recommendationBody: 'Activa una regla de enfriamiento de 24 horas antes de cerrar compras online y revisa wishlist contra presupuesto.',
        confidence: '94%',
      }
    case 'comision_evitable':
      return {
        title: 'Estas absorbiendo costos bancarios que se podrian evitar',
        body: 'El historial reciente confirma retiros fuera de red y cobros financieros derivados de una mala secuencia de pagos.',
        state: 'Costo recurrente',
        since: 'Multiples eventos en marzo',
        recommendationTitle: 'ACCION RECOMENDADA',
        recommendationBody: 'Usa cajeros de tu red y liquida mas del minimo cuando ya exista saldo disponible en debito.',
        confidence: '96%',
      }
    case 'inflacion_personal':
      return {
        title: 'El gasto en restaurantes va por encima de tu base normal',
        body: 'Las compras recientes bajo este concepto muestran un alza respecto al trimestre anterior y una frecuencia mayor a la habitual.',
        state: 'Sobre consumo',
        since: 'Incremento trimestral sostenido',
        recommendationTitle: 'ACCION RECOMENDADA',
        recommendationBody: 'Reduce una salida por semana y reemplazala por un gasto de comida previamente presupuestado.',
        confidence: '93%',
      }
    case 'compra_hora_inusual':
      return {
        title: 'Hay cargos en horarios con mayor probabilidad de decision impulsiva',
        body: 'Las compras registradas entre madrugada y fines de semana concentran montos altos y baja trazabilidad del comercio.',
        state: 'Horario inusual',
        since: 'Actividad 1am a 4am',
        recommendationTitle: 'ACCION RECOMENDADA',
        recommendationBody: 'Desactiva pagos rapidos de madrugada o fija alertas para revisar estas compras al dia siguiente.',
        confidence: '92%',
      }
    case 'riesgo_liquidez':
      return {
        title: 'Tu flujo actual pone en riesgo el saldo antes de la siguiente nomina',
        body: 'El sistema proyecta un faltante por ritmo de gasto. No hay compras historicas directas bajo este concepto porque se trata de una alerta de liquidez agregada.',
        state: 'Liquidez comprometida',
        since: `Proyeccion al dia ${'projected_shortfall_day' in summary ? summary.projected_shortfall_day : '-'}`,
        recommendationTitle: 'ACCION RECOMENDADA',
        recommendationBody: 'Reprograma o recorta los cargos menos prioritarios del mes para evitar caer en saldo cero antes del deposito.',
        confidence: '90%',
      }
    default:
      return {
        title: summary.label,
        body: history.length
          ? 'El sistema encontro compras recientes asociadas directamente con este concepto.'
          : 'No hay historial reciente directamente etiquetado bajo este concepto.',
        state: 'Activo',
        since: 'Detectado este mes',
        recommendationTitle: 'ACCION RECOMENDADA',
        recommendationBody: 'Revisa este patron y prioriza las transacciones con mayor impacto economico.',
        confidence: '90%',
      }
  }
}

export function getFrictionDetail(type: string): FrictionDetailViewModel | null {
  const summary = userData.friction_summary.frictions.find((item) => item.type === type)
  if (!summary) return null

  const mapped = mapFrictions(userData).find((item) => item.type === type)
  const history = getHistory(type, userData.transactions)
  const score = getScore(summary, userData.friction_summary.frictions)
  const message = getMessage(summary, history)
  const amount = Math.abs(summary.monthly_impact ?? summary.projected_shortfall_amount ?? 0)

  return {
    type,
    title: mapped?.label ?? summary.label,
    breadcrumb: ['FRICCIONES', 'DETALLE'],
    severityLabel: getSeverityLabel(summary.severity),
    severityTone: getSeverityTone(summary.severity),
    messageTitle: message.title,
    messageBody: message.body,
    savingsLabel: `${formatMoney(amount)} / mes`,
    confidenceLabel: message.confidence,
    currentState: message.state,
    currentStateSince: message.since,
    healthScore: score,
    recommendationTitle: message.recommendationTitle,
    recommendationBody: message.recommendationBody,
    bankOriginLabel: getDominantBank(type, userData.transactions),
    recentHistory: history,
  }
}
