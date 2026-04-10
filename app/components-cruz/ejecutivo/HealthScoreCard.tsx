"use client";

import { scoreColor, scoreLabel } from "@/app/utils/healthScore";

interface Props {
  score: number;
  message: string;
  breakdown: {
    incomeStability: number;
    essentialRatio: number;
    creditHealth: number;
    subscriptionHygiene: number;
    discipline: number;
  };
}

const BREAKDOWN_LABELS: Record<keyof Props["breakdown"], string> = {
  incomeStability: "Estabilidad de ingreso",
  essentialRatio: "Gasto esencial",
  creditHealth: "Salud crediticia",
  subscriptionHygiene: "Higiene de suscripciones",
  discipline: "Disciplina de gasto",
};

export default function HealthScoreCard({ score, message, breakdown }: Props) {
  const color = scoreColor(score);
  const label = scoreLabel(score);

  const size = 164;
  const strokeWidth = 12;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-5">
      {/* Ring + Mascot */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 absolute inset-0">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        {/* Mascot + Score */}
        <div className="flex flex-col items-center gap-0.5 z-10">
          {/* Mascot face */}
          <span className="text-4xl select-none" role="img" aria-label="mascot">
            {score >= 80 ? "🦁" : score >= 60 ? "🦊" : score >= 40 ? "🦝" : score >= 20 ? "🐺" : "🐻"}
          </span>
          <span className="text-2xl font-black leading-none" style={{ color }}>
            {score}
          </span>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
            {label}
          </span>
        </div>
      </div>

      {/* Message */}
      <p className="text-sm text-center text-gray-600 leading-relaxed font-medium px-2">
        {message}
      </p>

      {/* Breakdown bars */}
      <div className="w-full flex flex-col gap-2.5">
        {(Object.keys(breakdown) as Array<keyof typeof breakdown>).map((key) => {
          const pts = breakdown[key];
          const pct = (pts / 20) * 100;
          return (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">{BREAKDOWN_LABELS[key]}</span>
                <span className="text-xs font-bold text-gray-700">{pts}/20</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
