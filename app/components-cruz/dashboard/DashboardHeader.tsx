import { Bell } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Resumen general de operaciones y eficiencia</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-500 hover:text-gray-700 transition-colors">
          <Bell size={18} />
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-semibold">
          N
        </div>
      </div>
    </div>
  );
}
