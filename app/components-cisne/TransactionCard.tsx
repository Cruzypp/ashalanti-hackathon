import type { PurchaseTransactionCard } from "./purchasesData";

interface TransactionCardProps {
  transaction: PurchaseTransactionCard;
}

const toneStyles = {
  danger: {
    avatar: "bg-red-50 text-red-600",
    badge: "border-red-100 bg-red-50 text-red-600",
  },
  warning: {
    avatar: "bg-amber-50 text-amber-700",
    badge: "border-amber-100 bg-amber-50 text-amber-700",
  },
  success: {
    avatar: "bg-emerald-50 text-emerald-700",
    badge: "border-emerald-100 bg-emerald-50 text-emerald-700",
  },
} as const;

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const styles = toneStyles[transaction.tone];

  return (
    <article className="rounded-[2rem] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.35rem] text-lg font-bold ${styles.avatar}`}
          >
            {transaction.initials}
          </div>

          <div className="min-w-0">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                {transaction.merchant}
              </h3>
              <span className="w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                {transaction.subcategory}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500">{transaction.accountLabel}</p>
            <p className="mt-1 text-sm text-slate-400">{transaction.dateLabel}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{transaction.detailLabel}</p>

            <div
              className={`mt-4 inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${styles.badge}`}
            >
              {transaction.statusLabel}
            </div>
          </div>
        </div>

        <div className="flex flex-row items-end justify-between gap-4 xl:min-w-[220px] xl:flex-col xl:items-end">
          <p className="text-3xl font-semibold tracking-tight text-slate-900">
            {transaction.amountLabel}
          </p>
        </div>
      </div>
    </article>
  );
}
