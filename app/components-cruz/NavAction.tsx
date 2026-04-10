import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface NavActionProps {
  href: string;
  label: string;
  icon: LucideIcon;
  collapsed: boolean;
  /** "action" = botón primario relleno (CTA), "ghost" = enlace sutil */
  variant?: "action" | "ghost";
}

export default function NavAction({
  href,
  label,
  icon: Icon,
  collapsed,
  variant = "ghost",
}: NavActionProps) {
  if (variant === "action") {
    return (
      <Link
        href={href}
        title={collapsed ? label : undefined}
        className={`flex items-center justify-center py-3 mb-3 rounded-full bg-action text-white text-sm font-semibold hover:opacity-90 transition-opacity ${
          collapsed ? "px-2" : "px-6"
        }`}
      >
        {collapsed ? <Icon size={20} /> : label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`flex items-center py-2.5 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors ${
        collapsed ? "justify-center px-2" : "gap-3 px-4"
      }`}
    >
      <Icon size={20} className="text-gray-400 shrink-0" />
      {!collapsed && label}
    </Link>
  );
}
