import data from "../data/user.json";
import DashboardHeader from '../components-cruz/dashboard/DashboardHeader';
import StatCard from '../components-cruz/dashboard/StatCard';
import PurchaseHistory from '../components-cruz/dashboard/PurchaseHistory';
import TopFricciones from '../components-cruz/dashboard/TopFricciones';
import type { Account, Transaction } from '../components-cruz/dashboard/PurchaseHistory';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <DashboardHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard variant="frictions" value={4} />
        <StatCard variant="loss" value="-$184.50" />
        <StatCard variant="savings" value="+$240.00" />
        <StatCard variant="health" value={75} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PurchaseHistory
          accounts={data.accounts as Account[]}
          transactions={data.transactions as Transaction[]}
        />
        <TopFricciones />
      </div>
    </div>
  );
}
