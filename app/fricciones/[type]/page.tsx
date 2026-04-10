import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BadgeDollarSign, Bot, CircleHelp, Sparkles } from 'lucide-react'
import { getFrictionDetail } from '../../lib/getFrictionDetail'

interface FrictionDetailPageProps {
  params: Promise<{
    type: string
  }>
}

export default async function FrictionDetailPage({ params }: FrictionDetailPageProps) {
  const { type } = await params
  const detail = getFrictionDetail(type)

  if (!detail) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#f4f5f7] p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
          {detail.breadcrumb.map((item, index) => (
            <span key={item} className="flex items-center gap-2">
              {index === 0 ? <Link href="/fricciones" className="hover:text-slate-600">{item}</Link> : item}
              {index < detail.breadcrumb.length - 1 ? <span className="text-slate-300">›</span> : null}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <h1 className="text-4xl font-black tracking-[-0.05em] text-slate-900 lg:text-6xl">
            {detail.title}
          </h1>
          <div className={`rounded-full px-5 py-3 text-sm font-black tracking-[0.08em] ${detail.severityTone}`}>
            ! {detail.severityLabel}
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-[2rem] border border-sky-200 bg-sky-50 p-6 shadow-sm lg:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-500 shadow-sm">
              <Sparkles size={28} />
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-sky-900">
              {detail.messageTitle}
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-9 text-sky-800">
              {detail.messageBody}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                <BadgeDollarSign size={16} className="text-sky-500" />
                Ahorro estimado: {detail.savingsLabel}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                <Bot size={16} className="text-sky-500" />
                Confianza de IA: {detail.confidenceLabel}
              </div>
            </div>
          </section>

          <div className="space-y-5">
            <section className="rounded-[2rem] bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                Estado actual
              </p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-2xl font-black text-sky-700">
                  S
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{detail.currentState}</p>
                  <p className="text-sm text-slate-500">{detail.currentStateSince}</p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                Puntuacion de salud
              </p>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-6xl font-black tracking-tight text-[#b53f19]">
                  {detail.healthScore}
                </span>
                <span className="mb-2 text-2xl font-bold text-slate-400">/ 100</span>
              </div>
              <div className="mt-4 h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-[#b53f19]"
                  style={{ width: `${detail.healthScore}%` }}
                />
              </div>
            </section>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Historial Reciente
            </h2>
            <div className="mt-4 space-y-4">
              {detail.recentHistory.length ? (
                detail.recentHistory.map((item) => (
                  <article
                    key={item.id}
                    className="flex items-center justify-between rounded-[1.8rem] bg-white px-5 py-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-lg font-bold text-slate-400">
                        {item.initials}
                      </div>
                      <div>
                        <p className="text-xl font-bold tracking-tight text-slate-900">
                          {item.merchant}
                        </p>
                        <p className="text-sm text-slate-500">{item.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-slate-900">
                      {item.amountLabel}
                    </span>
                  </article>
                ))
              ) : (
                <div className="rounded-[1.8rem] bg-white px-6 py-8 text-slate-500 shadow-sm">
                  No hay compras recientes etiquetadas directamente bajo este concepto.
                </div>
              )}
            </div>
          </section>

          <aside className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                Resolver Ahora
              </h2>
              <CircleHelp size={18} className="text-slate-300" />
            </div>

            <div className="mt-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                Origen del banco
              </p>
              <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-4 text-base font-semibold text-slate-700">
                {detail.bankOriginLabel}
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                {detail.recommendationTitle}
              </p>
              <div className="mt-3 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-5 text-lg font-semibold leading-8 text-sky-700">
                {detail.recommendationBody}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
