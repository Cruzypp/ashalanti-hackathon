import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  collapsed: boolean;
}

export default function NavItem({ href, label, icon: Icon, isActive, collapsed }: NavItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`flex items-center py-2.5 rounded-full text-sm font-medium transition-colors ${
        collapsed ? "justify-center px-2" : "gap-3 px-4"
      } ${
        isActive
          ? "bg-primary/10 text-primary"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      }`}
    >
      <Icon
        size={20}
        className={`shrink-0 ${isActive ? "text-primary" : "text-gray-400"}`}
      />
      {!collapsed && label}
    </Link>
  );
}
