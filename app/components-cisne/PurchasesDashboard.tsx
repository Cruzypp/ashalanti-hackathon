import OverviewPanel from "./OverviewPanel";
import TransactionCard from "./TransactionCard";
import type { PurchasesViewModel } from "./purchasesData";

interface PurchasesDashboardProps {
  data: PurchasesViewModel;
}

export default function PurchasesDashboard({
  data,
}: PurchasesDashboardProps) {
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <header className="border-b border-slate-200 bg-white px-6 py-5 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-500">
              {data.header.eyebrow}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {data.header.title}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{data.header.subtitle}</p>
          </div>

          <div className="rounded-[1.75rem] bg-slate-50 px-5 py-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">{data.header.monthLabel}</p>
            <p className="mt-1 text-sm text-slate-500">{data.header.context}</p>
          </div>
        </div>
      </header>

      <section className="px-6 py-6 lg:px-10 lg:py-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <OverviewPanel overview={data.overview} />

          <aside className="rounded-[2rem] bg-[#ffc83d] p-6 text-[#4a3a00] shadow-[0_18px_45px_rgba(245,158,11,0.22)] lg:p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#7c5e00] text-3xl font-semibold text-[#ffe7a0]">
              !
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight">
              {data.alert.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#6d5500]">
              {data.alert.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {data.alert.services.map((service) => (
                <span
                  key={service}
                  className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-[#6d5500]"
                >
                  {service}
                </span>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-white/75 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8d6c00]">
                Ahorro potencial
              </p>
              <p className="mt-2 text-2xl font-semibold">{data.alert.savingsLabel}</p>
            </div>
          </aside>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {data.filters.map((filter) => (
            <div
              key={filter.label}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm"
            >
              <span className="font-semibold text-slate-700">{filter.label}</span>
              <span className="ml-2 text-slate-500">{filter.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Cargos recurrentes detectados
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            La lista se ordena por friccion y monto para revisar primero lo que
            mas impacto tiene.
          </p>

          <div className="mt-5 space-y-4">
            {data.transactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
