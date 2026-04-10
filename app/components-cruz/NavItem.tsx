import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  collapsed: boolean;
  showLabels: boolean;
  onCollapsedClick?: () => void;
}

export default function NavItem({ href, label, icon: Icon, isActive, collapsed, showLabels, onCollapsedClick }: NavItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      onClick={collapsed && onCollapsedClick ? (e) => { e.preventDefault(); onCollapsedClick(); } : undefined}
      className={`flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
        isActive
          ? "bg-primary/10 text-primary"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      }`}
    >
      <Icon
        size={20}
        className={`shrink-0 ${isActive ? "text-primary" : "text-gray-400"}`}
      />
      <span className={`whitespace-nowrap transition-opacity duration-200 ${showLabels ? "opacity-100" : "opacity-0"}`}>
        {label}
      </span>
    </Link>
  );
}
