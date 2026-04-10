import type { PurchasesOverview } from "./purchasesData";

interface OverviewPanelProps {
  overview: PurchasesOverview;
}

export default function OverviewPanel({ overview }: OverviewPanelProps) {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-500">
            Spending Overview
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 lg:text-4xl">
            Control de cargos recurrentes
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 lg:text-base">
            Este mes llevas {overview.monthlySpendLabel} en compras recurrentes y{" "}
            <span className="font-semibold text-sky-600">
              {overview.savingsOpportunityLabel}
            </span>{" "}
            tienen oportunidad clara de ahorro.
          </p>
        </div>

        <div className="shrink-0 rounded-2xl bg-slate-50 px-4 py-3 text-sm shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Variacion trimestral
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-900">
            {overview.quarterChange}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {overview.metrics.map((metric) => (
          <div
            key={metric.label}
            className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
          >
            <p className="truncate text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {metric.label}
            </p>
            <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-900">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_240px]">
        <div className="min-w-0">
          <div className="flex h-64 items-end gap-3 overflow-hidden rounded-[1.75rem] bg-slate-50 px-4 pb-4 pt-8">
            {overview.topCharges.map((charge) => (
              <div key={charge.label} className="min-w-0 flex flex-1 flex-col items-center gap-3">
                <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-xs font-semibold text-slate-400">
                  {charge.amountLabel}
                </span>
                <div className="flex h-44 items-end">
                  <div
                    className={`w-full min-w-10 rounded-t-[1.5rem] ${
                      charge.highlight ? "bg-sky-500" : "bg-sky-200"
                    }`}
                    style={{ height: `${charge.height}%` }}
                  />
                </div>
                <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-xs font-semibold leading-4 text-slate-500">
                  {charge.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Historial de suscripciones
          </p>
          <div className="mt-4 space-y-4">
            {overview.history.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="min-w-0 truncate font-medium text-slate-500">{item.label}</span>
                  <span className="shrink-0 ml-3 font-semibold text-slate-900">{item.amountLabel}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white">
                  <div
                    className={`h-2 rounded-full ${
                      item.highlight ? "bg-sky-500" : "bg-sky-200"
                    }`}
                    style={{ width: `${item.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
