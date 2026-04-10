import rawData from "@/app/data/user.json";

type Tone = "danger" | "warning" | "success";

export interface PurchaseTransactionCard {
  id: string;
  merchant: string;
  initials: string;
  subcategory: string;
  amountLabel: string;
  statusLabel: string;
  accountLabel: string;
  dateLabel: string;
  detailLabel: string;
  tone: Tone;
}

interface MetricCard {
  label: string;
  value: string;
}

interface ChargeBar {
  label: string;
  amountLabel: string;
  height: number;
  highlight: boolean;
}

interface HistoryBar {
  label: string;
  amountLabel: string;
  width: number;
  highlight: boolean;
}

export interface PurchasesOverview {
  monthlySpendLabel: string;
  savingsOpportunityLabel: string;
  quarterChange: string;
  metrics: MetricCard[];
  topCharges: ChargeBar[];
  history: HistoryBar[];
}

interface PurchasesAlert {
  title: string;
  description: string;
  services: string[];
  savingsLabel: string;
}

interface FilterChip {
  label: string;
  value: string;
}

export interface PurchasesViewModel {
  header: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  overview: PurchasesOverview;
  alert: PurchasesAlert;
  filters: FilterChip[];
  transactions: PurchaseTransactionCard[];
}

const accountsById = new Map(
  rawData.accounts.map((account) => [account.account_id, account]),
);

const moneyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const shortMoneyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatMoney(value: number) {
  return moneyFormatter.format(value);
}

function formatShortMoney(value: number) {
  return shortMoneyFormatter.format(value);
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T12:00:00`));
}

function getInitials(merchant: string) {
  const compact = merchant.replace(".com", "").replace(/[^A-Za-z0-9+ ]/g, " ");
  const words = compact.split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "??";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

function getDisplayLabel(merchant: string) {
  return merchant
    .replace(".com", "")
    .replace(" Cumbres", "")
    .replace(" Premium", "");
}

function getRecurringTransactions() {
  return rawData.transactions
    .filter((transaction) => transaction.type === "gasto" && transaction.recurrent)
    .map((transaction) => {
      const account = accountsById.get(transaction.account_id);
      const amount = Math.abs(transaction.amount);
      const frictionKey = transaction.friction ?? "sin_friccion";

      let statusLabel = "Sin friccion detectada";
      let detailLabel = "Cargo automatico activo y sin alerta actual.";
      let tone: Tone = "success";

      if (frictionKey === "suscripcion_zombie") {
        statusLabel = "Suscripcion zombie";
        detailLabel = "Cargo recurrente con bajo valor percibido frente a su costo mensual.";
        tone = "danger";
      } else if (frictionKey === "pago_duplicado") {
        statusLabel = "Pago duplicado";
        detailLabel =
          transaction.note ?? "Se detecta traslape con otro servicio similar.";
        tone = "warning";
      }

      return {
        id: transaction.txn_id,
        merchant: transaction.merchant,
        merchantLabel: getDisplayLabel(transaction.merchant),
        initials: getInitials(transaction.merchant),
        subcategory: transaction.subcategory,
        amount,
        amountLabel: formatMoney(amount),
        statusLabel,
        accountLabel: `${transaction.bank} • ${account?.product ?? "Cuenta"} • ****${transaction.card_last4}`,
        dateLabel: `Cargo automatico • ${formatDate(transaction.date)}`,
        detailLabel,
        tone,
        frictionKey,
      };
    })
    .sort((left, right) => {
      const priority = {
        suscripcion_zombie: 0,
        pago_duplicado: 1,
        sin_friccion: 2,
      } as const;

      const rankDiff =
        priority[left.frictionKey as keyof typeof priority] -
        priority[right.frictionKey as keyof typeof priority];

      if (rankDiff !== 0) {
        return rankDiff;
      }

      return right.amount - left.amount;
    });
}

export function getPurchasesViewModel(): PurchasesViewModel {
  const recurringTransactions = getRecurringTransactions();

  const recurringTotal = recurringTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );

  const riskyTransactions = recurringTransactions.filter(
    (transaction) => transaction.frictionKey !== "sin_friccion",
  );

  const riskyTotal = riskyTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );

  const healthyCount =
    recurringTransactions.length - riskyTransactions.length;

  const topChargesSource = [...recurringTransactions]
    .sort((left, right) => right.amount - left.amount)
    .slice(0, 6);

  const highestCharge = topChargesSource[0]?.amount ?? 1;

  const topCharges = topChargesSource.map((transaction, index) => ({
    label: transaction.merchantLabel,
    amountLabel: formatShortMoney(transaction.amount),
    height: Math.max(24, Math.round((transaction.amount / highestCharge) * 100)),
    highlight: index === 0 || transaction.frictionKey === "suscripcion_zombie",
  }));

  const categoryTotals = recurringTransactions.reduce<Record<string, number>>(
    (collection, transaction) => {
      collection[transaction.subcategory] =
        (collection[transaction.subcategory] ?? 0) + transaction.amount;
      return collection;
    },
    {},
  );

  const filters = Object.entries(categoryTotals)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)
    .map(([label, amount]) => ({
      label,
      value: formatShortMoney(amount),
    }));

  const historySource = rawData.historical_comparison.subscriptions;
  const historyBase = [
    { label: "Ene 2025", amount: historySource.jan_2025 },
    { label: "Feb 2025", amount: historySource.feb_2025 },
    { label: "Mar 2025", amount: historySource.mar_2025 },
  ];
  const highestHistory = Math.max(...historyBase.map((item) => item.amount), 1);

  const history = historyBase.map((item, index) => ({
    label: item.label,
    amountLabel: formatMoney(item.amount),
    width: Math.max(28, Math.round((item.amount / highestHistory) * 100)),
    highlight: index === historyBase.length - 1,
  }));

  const zombieSummary = rawData.friction_summary.frictions.find(
    (item) => item.type === "suscripcion_zombie",
  );
  const duplicateSummary = rawData.friction_summary.frictions.find(
    (item) => item.type === "pago_duplicado",
  );

  const services = Array.from(
    new Set([
      ...(zombieSummary?.services ?? []),
      ...(duplicateSummary?.services ?? []),
    ]),
  ).slice(0, 5);

  return {
    header: {
      eyebrow: "Compras",
      title: "Suscripciones y cargos recurrentes",
      subtitle: `${rawData.user.name} • ${rawData.user.city}`,
    },
    overview: {
      monthlySpendLabel: formatMoney(recurringTotal),
      savingsOpportunityLabel: formatMoney(riskyTotal),
      quarterChange: rawData.historical_comparison.subscriptions.pct_change_vs_q_prev,
      metrics: [
        {
          label: "Gasto recurrente mensual",
          value: formatMoney(recurringTotal),
        },
        {
          label: "Monto en riesgo",
          value: formatMoney(riskyTotal),
        },
        {
          label: "Cargos sin friccion",
          value: `${healthyCount} de ${recurringTransactions.length}`,
        },
      ],
      topCharges,
      history,
    },
    alert: {
      title: `${riskyTransactions.length} fricciones detectadas`,
      description: `${zombieSummary?.count ?? 0} suscripciones zombie y ${duplicateSummary?.count ?? 0} pagos duplicados estan consumiendo el presupuesto mensual.`,
      services,
      savingsLabel: formatMoney(riskyTotal),
    },
    filters,
    transactions: recurringTransactions.map((transaction) => ({
      id: transaction.id,
      merchant: transaction.merchant,
      initials: transaction.initials,
      subcategory: transaction.subcategory,
      amountLabel: transaction.amountLabel,
      statusLabel: transaction.statusLabel,
      accountLabel: transaction.accountLabel,
      dateLabel: transaction.dateLabel,
      detailLabel: transaction.detailLabel,
      tone: transaction.tone,
    })),
  };
}
