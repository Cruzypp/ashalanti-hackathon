"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  AlertTriangle,
  ShoppingCart,
  BarChart2,
  Wallet,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import NavItem from "./NavItem";
import NavAction from "./NavAction";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Fricciones", href: "/fricciones", icon: AlertTriangle },
  { label: "Compras", href: "/compras", icon: ShoppingCart },
  { label: "Cuentas", href: "/cuentas", icon: Wallet },
  { label: "Ejecutivos", href: "/ejecutivos", icon: BarChart2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  function toggle() {
    if (!collapsed) {
      // Colapsar: ocultar textos de inmediato, luego animar el ancho
      setShowLabels(false);
      setCollapsed(true);
    } else {
      // Expandir: animar el ancho primero, mostrar textos al final
      setCollapsed(false);
      setTimeout(() => setShowLabels(true), 280);
    }
  }

  function expandAndNavigate(href: string) {
    setCollapsed(false);
    setTimeout(() => {
      setShowLabels(true);
      router.push(href);
    }, 280);
  }

  return (
    <aside
      className={`sticky top-0 flex h-screen self-start flex-col overflow-hidden bg-gray-50 px-3 py-6 shrink-0 transition-all duration-300 ${
        collapsed ? "w-18" : "w-64"
      }`}
    >
      {/* Toggle button outside overflow-hidden container */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-7 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm text-gray-400 hover:text-gray-600 transition-colors"
        aria-label={collapsed ? "Expandir sidebar" : "Contraer sidebar"}
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>

      {/* Inner container keeps label animation clipped */}
      <div className="flex flex-col flex-1 overflow-hidden px-3 py-6">
        {/* Logo */}
        <div className="flex items-center mb-8 px-1 gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 shrink-0">
            <LayoutDashboard size={22} className="text-primary" />
          </div>
          <div className={`transition-opacity duration-200 ${showLabels ? "opacity-100" : "opacity-0"}`}>
            <p className="text-base font-bold text-primary leading-tight whitespace-nowrap">Ashalanti</p>
            <p className="text-xs text-gray-400 whitespace-nowrap">Stay Smooth</p>
          </div>
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
              showLabels={showLabels}
              onCollapsedClick={() => expandAndNavigate(item.href)}
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
            showLabels={showLabels}
            variant="action"
            onCollapsedClick={() => expandAndNavigate("/report")}
          />
          <NavAction href="/settings" label="Settings" icon={Settings} collapsed={collapsed} showLabels={showLabels} onCollapsedClick={() => expandAndNavigate("/settings")} />
          <NavAction href="/help"     label="Help"     icon={HelpCircle} collapsed={collapsed} showLabels={showLabels} onCollapsedClick={() => expandAndNavigate("/help")} />
        </div>
      </div>
    </aside>
  );
}
