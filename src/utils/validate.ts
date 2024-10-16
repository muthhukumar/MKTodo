export function isValidNumber(input: string): boolean {
  return /^-?\d+$/.test(input)
}
