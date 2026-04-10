import type userData from "@/app/data/user.json";

type UserData = typeof userData;

export interface HealthScoreBreakdown {
  total: number;
  incomeStability: number;   // /20
  essentialRatio: number;    // /20
  creditHealth: number;      // /20
  subscriptionHygiene: number; // /20
  discipline: number;        // /20
}

export function computeHealthScore(data: UserData): HealthScoreBreakdown {
  const { transactions, accounts, user, friction_summary } = data;

  // 1. Income Stability (20 pts) — regular salary deposits detected
  const incomeCount = transactions.filter((t) => t.type === "ingreso").length;
  const incomeStability = incomeCount >= 2 ? 20 : incomeCount === 1 ? 12 : 0;

  // 2. Essential Spending Ratio (20 pts) — essentials vs monthly income
  const essential = ["Supermercado", "Servicios", "Hogar", "Seguros", "Salud", "Transporte"];
  const essentialTotal = transactions
    .filter((t) => (t.type === "gasto") && essential.includes(t.category ?? ""))
    .reduce((s, t) => s + Math.abs(t.amount), 0);
  const ratio = essentialTotal / user.monthly_income;
  const essentialRatio =
    ratio < 0.40 ? 20 : ratio < 0.55 ? 15 : ratio < 0.70 ? 10 : ratio < 0.85 ? 5 : 2;

  // 3. Credit Health (20 pts) — average credit utilization across all credit cards
  const creditAccounts = accounts.filter(
    (a): a is typeof a & { credit_limit: number } =>
      a.credit_limit != null && a.credit_limit > 0
  );
  const avgUtil =
    creditAccounts.length > 0
      ? creditAccounts.reduce(
          (s, a) => s + Math.abs(a.balance) / a.credit_limit,
          0
        ) / creditAccounts.length
      : 0;
  const creditHealth =
    avgUtil < 0.20 ? 20 : avgUtil < 0.35 ? 16 : avgUtil < 0.50 ? 11 : avgUtil < 0.70 ? 6 : 2;

  // 4. Subscription Hygiene (20 pts) — zombie subscription impact vs income
  const zombie = friction_summary.frictions.find((f) => f.type === "suscripcion_zombie");
  const zombieImpact = zombie?.monthly_impact ?? 0;
  const zombieRatio = zombieImpact / user.monthly_income;
  const subscriptionHygiene =
    zombieRatio < 0.01 ? 20 : zombieRatio < 0.04 ? 14 : zombieRatio < 0.08 ? 8 : 3;

  // 5. Spending Discipline (20 pts) — impulse + unusual hours + ants
  const impulsiveTypes = ["compra_impulsiva", "compra_hora_inusual", "gasto_hormiga"];
  const impulseImpact = friction_summary.frictions
    .filter((f) => impulsiveTypes.includes(f.type))
    .reduce((s, f) => s + (f.monthly_impact ?? 0), 0);
  const impulseRatio = impulseImpact / user.monthly_income;
  const discipline =
    impulseRatio < 0.05 ? 20 : impulseRatio < 0.10 ? 14 : impulseRatio < 0.20 ? 8 : impulseRatio < 0.40 ? 4 : 1;

  const total = Math.round(incomeStability + essentialRatio + creditHealth + subscriptionHygiene + discipline);

  return { total, incomeStability, essentialRatio, creditHealth, subscriptionHygiene, discipline };
}

export function scoreColor(score: number): string {
  if (score >= 80) return "#10B981"; // green
  if (score >= 60) return "#0EA5E9"; // sky
  if (score >= 40) return "#F59E0B"; // amber
  if (score >= 20) return "#F97316"; // orange
  return "#EF4444";                   // red
}

export function scoreLabel(score: number): string {
  if (score >= 80) return "Excelente";
  if (score >= 60) return "Bueno";
  if (score >= 40) return "En desarrollo";
  if (score >= 20) return "En alerta";
  return "Crítico";
}

export function scoreMessage(score: number, name: string): string {
  const first = name.split(" ")[0];
  if (score >= 80) return `${first}, tu salud financiera es excelente. Estás en camino al 1%.`;
  if (score >= 60) return `Vas bien, ${first}. Con ajustes menores llegarás al siguiente nivel.`;
  if (score >= 40) return `${first}, tu dinero está trabajando contra ti. Hay fricciones importantes por resolver.`;
  if (score >= 20) return `Situación de alerta, ${first}. Estás perdiendo dinero que podrías recuperar hoy.`;
  return `${first}, tu situación financiera es crítica. Es urgente actuar ahora.`;
}
