import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  CreditCard,
  ShieldAlert,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { getMonthlyReport } from '../lib/getMonthlyReport'

const iconByMetric = [Wallet, ArrowRight, BadgeDollarSign, ShieldAlert]

export default function ReporteMensualPage() {
  const report = getMonthlyReport()

  return (
    <main className="min-h-screen bg-[#eef4fb] px-6 py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/fricciones"
              className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm"
            >
              <ArrowLeft size={16} />
              Volver a fricciones
            </Link>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-sky-600">
              {report.periodLabel}
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-slate-900 lg:text-6xl">
              {report.headline}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600 lg:text-lg">
              {report.userName} · {report.city}
            </p>
          </div>

          <div className="rounded-[2rem] bg-white px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Salud del mes
            </p>
            <div className="mt-2 flex items-end gap-3">
              <span className="text-5xl font-black tracking-tight text-slate-900">
                {report.healthScore}
              </span>
              <span className="mb-2 text-lg font-semibold text-slate-400">/100</span>
            </div>
            <div className="mt-4 h-3 w-52 rounded-full bg-slate-100">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-[#f97316] to-[#fb923c]"
                style={{ width: `${report.healthScore}%` }}
              />
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-[2.25rem] bg-gradient-to-br from-[#123a63] via-[#0f4f84] to-[#2c9edb] p-8 text-white shadow-[0_26px_60px_rgba(18,58,99,0.28)] lg:p-10">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white/90">
                <Sparkles size={16} />
                Resumen ejecutivo
              </div>
              <p className="mt-5 max-w-3xl text-lg leading-9 text-white/90 lg:text-xl">
                {report.summary}
              </p>

              <div className="mt-7">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/70">
                  Balance del mes
                </p>
                <div className="mt-3 overflow-hidden rounded-full bg-white/15">
                  <div className="flex h-5">
                    <div
                      className="bg-[#ffd166]"
                      style={{ width: `${report.balanceUsedPercent}%` }}
                    />
                    <div
                      className="bg-[#86efac]"
                      style={{ width: `${report.balanceRemainingPercent}%` }}
                    />
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-5 text-sm text-white/85">
                  <span>Usado: {report.usedLabel}</span>
                  <span>Remanente: {report.remainingLabel}</span>
                  <span>Con friccion: {report.frictionSpendLabel}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/75">
                Prioridad inmediata
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                {report.topFricciones[0]?.label}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/80">
                Este es el frente con mayor impacto economico del mes y el mejor punto de partida para recuperar margen rapido.
              </p>
              <div className="mt-5 rounded-2xl bg-white/12 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                  Ahorro recuperable
                </p>
                <p className="mt-2 text-3xl font-black">{report.savingsLabel}</p>
              </div>
              {report.topFricciones[0] ? (
                <Link
                  href={report.topFricciones[0].href}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-sky-800 transition-transform hover:-translate-y-0.5"
                >
                  Ver detalle prioritario
                  <ArrowRight size={16} />
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {report.metrics.map((metric, index) => {
            const Icon = iconByMetric[index] ?? BarChart3

            return (
              <article
                key={metric.label}
                className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <Icon size={22} />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {metric.label}
                </p>
                <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{metric.detail}</p>
              </article>
            )
          })}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_0.85fr]">
          <article className="rounded-[2rem] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] lg:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Fricciones prioritarias
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                  Donde se esta yendo mas dinero
                </h2>
              </div>
              <Link href="/fricciones" className="text-sm font-semibold text-sky-600 hover:underline">
                Ver tablero completo
              </Link>
            </div>

            <div className="mt-6 space-y-5">
              {report.topFricciones.map((item) => (
                <Link
                  key={item.type}
                  href={item.href}
                  className="block rounded-[1.4rem] border border-slate-100 px-4 py-4 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-bold tracking-tight text-slate-900">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.severityLabel} · {item.shareLabel}
                      </p>
                    </div>
                    <span className="text-lg font-black text-slate-900">
                      {item.impactLabel}
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#fb923c] to-[#f97316]"
                      style={{ width: `${item.barWidth}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] lg:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Gasto por categoria
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
              Lectura rapida del mes
            </h2>

            <div className="mt-6 space-y-4">
              {report.categoryBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.shareLabel}</p>
                    </div>
                    <span className="font-bold text-slate-900">{item.amountLabel}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-sky-400 to-sky-600"
                      style={{ width: `${item.barWidth}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_0.9fr]">
          <article className="rounded-[2rem] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] lg:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Movimientos clave
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
              Compras y cargos que mas explican marzo
            </h2>

            <div className="mt-6 space-y-4">
              {report.notableMovements.map((movement) => (
                <article
                  key={movement.id}
                  className="rounded-[1.5rem] border border-slate-100 px-4 py-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-bold tracking-tight text-slate-900">
                          {movement.merchant}
                        </p>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {movement.frictionLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {movement.dateLabel} · {movement.channel}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {movement.note}
                      </p>
                    </div>
                    <span className="text-xl font-black text-slate-900">
                      {movement.amountLabel}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <div className="space-y-6">
            <article className="rounded-[2rem] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] lg:p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                Siguientes acciones
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                Lo mas util para abril
              </h2>

              <div className="mt-5 space-y-3">
                {report.recommendations.map((recommendation) => (
                  <div
                    key={recommendation}
                    className="rounded-[1.4rem] border border-sky-100 bg-sky-50 px-4 py-4 text-sm leading-7 text-sky-900"
                  >
                    {recommendation}
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[2rem] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] lg:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <CreditCard size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Estado por cuenta
                  </p>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">
                    Vista bancaria
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {report.accounts.map((account) => (
                  <div
                    key={account.id}
                    className="rounded-[1.4rem] border border-slate-100 px-4 py-4"
                    style={{ boxShadow: `inset 4px 0 0 ${account.accentColor}` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-900">
                          {account.bank} · {account.product}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{account.typeLabel}</p>
                      </div>
                      <span className="text-sm font-black text-slate-900">
                        {account.balanceLabel}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {account.secondaryLabel}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  )
}
