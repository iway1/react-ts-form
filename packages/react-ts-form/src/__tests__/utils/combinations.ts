export function combinations<T>(arr: T[]) {
  return arr.flatMap((v, i) => arr.slice(i + 1).map((w) => [v, w] as const));
}
