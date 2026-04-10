import DashboardHeader from '../components-cruz/dashboard/DashboardHeader'
import StatCard from '../components-cruz/dashboard/StatCard'
import PurchaseHistory from '../components-cruz/dashboard/PurchaseHistory'
import TopFricciones from '../components-cruz/dashboard/TopFricciones'
import userData from '../data/user.json'

export default function DashboardPage() {
  const { frictions, total_monthly_loss, potential_savings, health_score } = userData.friction_summary

  const currency = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    signDisplay: 'always',
  })

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <DashboardHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard variant="frictions" value={frictions.length} />
        <StatCard variant="loss" value={currency.format(-Math.abs(total_monthly_loss))} />
        <StatCard variant="savings" value={currency.format(potential_savings)} />
        <StatCard variant="health" value={health_score} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PurchaseHistory />
        <TopFricciones />
      </div>
    </div>
  )
}
