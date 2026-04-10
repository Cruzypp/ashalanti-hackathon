import userData from '../data/user.json'

type Account = (typeof userData.accounts)[number]

interface ReportMetric {
  label: string
  value: string
  detail: string
}

interface FrictionPriority {
  type: string
  label: string
  impactLabel: string
  shareLabel: string
  severityLabel: string
  barWidth: number
  href: string
}

interface CategoryBreakdownItem {
  label: string
  amountLabel: string
  shareLabel: string
  barWidth: number
}

interface NotableMovement {
  id: string
  merchant: string
  dateLabel: string
  amountLabel: string
  frictionLabel: string
  channel: string
  note: string
}

interface AccountSnapshot {
  id: string
  bank: string
  product: string
  typeLabel: string
  balanceLabel: string
  secondaryLabel: string
  accentColor: string
}

export interface MonthlyReportViewModel {
  periodLabel: string
  userName: string
  city: string
  headline: string
  summary: string
  metrics: ReportMetric[]
  balanceUsedPercent: number
  balanceRemainingPercent: number
  usedLabel: string
  remainingLabel: string
  frictionSpendLabel: string
  savingsLabel: string
  healthScore: number
  topFricciones: FrictionPriority[]
  categoryBreakdown: CategoryBreakdownItem[]
  notableMovements: NotableMovement[]
  accounts: AccountSnapshot[]
  recommendations: string[]
}

const money = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
})

const preciseMoney = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

function formatMoney(value: number) {
  return money.format(value)
}

function formatPreciseMoney(value: number) {
  return preciseMoney.format(value)
}

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T12:00:00`))
}

function getSeverityLabel(severity: string) {
  if (severity === 'critico') return 'Alta'
  if (severity === 'medio') return 'Media'
  return 'Atencion'
}

function getFrictionLabel(type: string) {
  const item = userData.friction_summary.frictions.find((friction) => friction.type === type)
  return item?.label ?? 'Sin clasificar'
}

function getCreditSecondary(account: Account) {
  if (account.type !== 'credito' || !account.credit_limit) {
    return `Saldo disponible ${formatPreciseMoney(account.balance)}`
  }

  const used = Math.abs(account.balance)
  const usage = Math.round((used / account.credit_limit) * 100)
  return `Uso de linea ${usage}% · Limite ${formatMoney(account.credit_limit)}`
}

function getRecommendations(topTypes: string[]) {
  const copy: Record<string, string> = {
    compra_impulsiva: 'Fija una regla de enfriamiento de 24 horas para compras online y revisa primero las partidas de e-commerce y ropa.',
    suscripcion_zombie: 'Haz una limpieza de suscripciones y conserva solo las que realmente sigan aportando valor este mes.',
    compra_hora_inusual: 'Activa alertas nocturnas y corta pagos rapidos en horarios donde el gasto se vuelve menos consciente.',
    comision_evitable: 'Elimina retiros fuera de red y evita pagar solo el minimo cuando ya existe saldo para cubrir mas.',
    gasto_hormiga: 'Agrupa cafe y conveniencia en un presupuesto semanal visible para evitar goteos diarios.',
    pago_duplicado: 'Consolida servicios que se empalman para no seguir pagando dos veces por el mismo beneficio.',
    inflacion_personal: 'Reduce una salida de restaurante por semana y sustituyela por una opcion ya presupuestada.',
    riesgo_liquidez: 'Recorta gastos no prioritarios antes del siguiente deposito para evitar tension de flujo.',
  }

  return topTypes.slice(0, 4).map((type) => copy[type]).filter(Boolean)
}

export function getMonthlyReport(): MonthlyReportViewModel {
  const income = userData.transactions
    .filter((transaction) => transaction.type === 'ingreso')
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const expenses = userData.transactions.filter((transaction) => transaction.type !== 'ingreso')
  const totalExpenses = expenses.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0)
  const frictionExpenses = expenses
    .filter((transaction) => transaction.friction)
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0)

  const remaining = income - totalExpenses
  const usedPercent = Math.max(0, Math.min(100, Math.round((totalExpenses / income) * 100)))
  const remainingPercent = Math.max(0, 100 - usedPercent)

  const frictionImpact = userData.friction_summary.frictions
    .map((item) => ({
      ...item,
      impact: Math.abs(item.monthly_impact ?? item.projected_shortfall_amount ?? 0),
    }))
    .sort((left, right) => right.impact - left.impact)

  const maxFrictionImpact = frictionImpact[0]?.impact ?? 1
  const topFricciones = frictionImpact.slice(0, 5).map((item) => ({
    type: item.type,
    label: item.label,
    impactLabel: formatMoney(item.impact),
    shareLabel: `${Math.round((item.impact / Math.max(totalExpenses, 1)) * 100)}% del gasto`,
    severityLabel: getSeverityLabel(item.severity),
    barWidth: Math.max(18, Math.round((item.impact / maxFrictionImpact) * 100)),
    href: `/fricciones/${item.type}`,
  }))

  const categoryTotals = new Map<string, number>()
  for (const transaction of expenses) {
    categoryTotals.set(
      transaction.category,
      (categoryTotals.get(transaction.category) ?? 0) + Math.abs(transaction.amount),
    )
  }

  const categoryBreakdown = [...categoryTotals.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6)
    .map(([label, amount]) => ({
      label,
      amountLabel: formatMoney(amount),
      shareLabel: `${Math.round((amount / Math.max(totalExpenses, 1)) * 100)}% del mes`,
      barWidth: Math.max(14, Math.round((amount / Math.max(totalExpenses, 1)) * 100)),
    }))

  const notableMovements = [...expenses]
    .sort((left, right) => Math.abs(right.amount) - Math.abs(left.amount))
    .slice(0, 8)
    .map((transaction) => ({
      id: transaction.txn_id,
      merchant: transaction.merchant,
      dateLabel: formatDate(transaction.date),
      amountLabel: formatPreciseMoney(Math.abs(transaction.amount)),
      frictionLabel: transaction.friction ? getFrictionLabel(transaction.friction) : 'Gasto regular',
      channel: transaction.channel,
      note: transaction.note ?? transaction.subcategory,
    }))

  const accounts = userData.accounts.map((account) => ({
    id: account.account_id,
    bank: account.bank,
    product: account.product,
    typeLabel: account.type === 'credito' ? 'Credito' : 'Debito',
    balanceLabel:
      account.type === 'credito'
        ? `${formatPreciseMoney(Math.abs(account.balance))} usados`
        : `${formatPreciseMoney(account.balance)} disponibles`,
    secondaryLabel: getCreditSecondary(account),
    accentColor: account.bank_color,
  }))

  const topTypes = frictionImpact.map((item) => item.type)

  return {
    periodLabel: 'Marzo 2025',
    userName: userData.user.name,
    city: userData.user.city,
    headline: 'Reporte mensual de salud financiera',
    summary: `En marzo registraste ${formatMoney(totalExpenses)} de gasto total. ${formatMoney(frictionExpenses)} estan ligados a fricciones detectadas y hay ${formatMoney(userData.friction_summary.potential_savings)} que todavia se pueden recuperar.`,
    metrics: [
      {
        label: 'Ingreso del mes',
        value: formatMoney(income),
        detail: userData.user.income_source,
      },
      {
        label: 'Gasto total del mes',
        value: formatMoney(totalExpenses),
        detail: `${expenses.length} movimientos analizados`,
      },
      {
        label: 'Ahorro potencial',
        value: formatMoney(userData.friction_summary.potential_savings),
        detail: `${Math.round((userData.friction_summary.potential_savings / Math.max(income, 1)) * 100)}% de tu ingreso mensual`,
      },
      {
        label: 'Puntuacion de salud',
        value: `${userData.friction_summary.health_score}/100`,
        detail: `${userData.friction_summary.frictions.length} fricciones activas`,
      },
    ],
    balanceUsedPercent: usedPercent,
    balanceRemainingPercent: remainingPercent,
    usedLabel: formatMoney(totalExpenses),
    remainingLabel: formatMoney(remaining),
    frictionSpendLabel: formatMoney(frictionExpenses),
    savingsLabel: formatMoney(userData.friction_summary.potential_savings),
    healthScore: userData.friction_summary.health_score,
    topFricciones,
    categoryBreakdown,
    notableMovements,
    accounts,
    recommendations: getRecommendations(topTypes),
  }
}
