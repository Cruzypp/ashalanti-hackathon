import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface NavActionProps {
  href: string;
  label: string;
  icon: LucideIcon;
  collapsed: boolean;
  showLabels: boolean;
  /** "action" = botón primario relleno (CTA), "ghost" = enlace sutil */
  variant?: "action" | "ghost";
  onCollapsedClick?: () => void;
}

export default function NavAction({
  href,
  label,
  icon: Icon,
  collapsed,
  showLabels,
  variant = "ghost",
  onCollapsedClick,
}: NavActionProps) {
  const handleClick = collapsed && onCollapsedClick
    ? (e: React.MouseEvent) => { e.preventDefault(); onCollapsedClick(); }
    : undefined;

  if (variant === "action") {
    return (
      <Link
        href={href}
        title={collapsed ? label : undefined}
        onClick={handleClick}
        className="flex items-center justify-center gap-3 py-3 mb-3 px-6 rounded-xl bg-action text-white text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        <Icon size={20} className="shrink-0" />
        <span className={`whitespace-nowrap transition-opacity duration-200 ${showLabels ? "opacity-100" : "opacity-0"}`}>
          {label}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      onClick={handleClick}
      className="flex items-center gap-3 py-2.5 px-4 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
    >
      <Icon size={20} className="text-gray-400 shrink-0" />
      <span className={`whitespace-nowrap transition-opacity duration-200 ${showLabels ? "opacity-100" : "opacity-0"}`}>
        {label}
      </span>
    </Link>
  );
}
