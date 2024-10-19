import {invariant} from "./invariants"

export function calculatePartValue(percentage: number, totalValue: number): number {
  invariant(
    percentage >= 0 || percentage <= 100,
    "Percentage should be between 0 and 100 inclusive. But got %s %s",
    percentage,
    totalValue,
  )

  const partValue = (percentage / 100) * totalValue

  return parseFloat(partValue.toFixed(2))
}
