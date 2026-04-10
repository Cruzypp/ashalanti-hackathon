export type Severity = 'critical' | 'medium' | 'attention'

export interface Friction {
  type: string
  label: string
  severity: Severity
  monthlyImpact: number
  count?: number
  description: string
  meta?: string[]
  detectedAt: string
}