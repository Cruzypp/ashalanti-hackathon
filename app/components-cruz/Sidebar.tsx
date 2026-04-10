"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  AlertTriangle,
  ShoppingCart,
  BarChart2,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import NavItem from "./NavItem";
import NavAction from "./NavAction";

const navItems = [
  { label: "Dashboard",  href: "/",           icon: LayoutDashboard },
  { label: "Fricciones", href: "/fricciones",  icon: AlertTriangle },
  { label: "Compras",    href: "/compras",     icon: ShoppingCart },
  { label: "Ejecutivo",  href: "/ejecutivo",   icon: BarChart2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex flex-col min-h-screen bg-gray-50 px-3 py-6 shrink-0 transition-all duration-300 ${
        collapsed ? "w-18" : "w-64"
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-7 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm text-gray-400 hover:text-gray-600 transition-colors"
        aria-label={collapsed ? "Expandir sidebar" : "Contraer sidebar"}
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>

      {/* Logo */}
      <div className={`flex items-center mb-8 px-1 ${collapsed ? "justify-center" : "gap-3"}`}>
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 shrink-0">
          <LayoutDashboard size={22} className="text-primary" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-base font-bold text-primary leading-tight">Friction Map</p>
            <p className="text-xs text-gray-400">Stay Smooth</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={pathname === item.href}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col gap-1">
        <NavAction
          href="/report"
          label="Report Friction"
          icon={AlertTriangle}
          collapsed={collapsed}
          variant="action"
        />
        <NavAction href="/settings" label="Settings" icon={Settings} collapsed={collapsed} />
        <NavAction href="/help"     label="Help"     icon={HelpCircle} collapsed={collapsed} />
      </div>
    </aside>
  );
}
