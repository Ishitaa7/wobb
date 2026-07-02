export function staggerDelay(index: number, stepMs = 45): string {
  return `${index * stepMs}ms`;
}
