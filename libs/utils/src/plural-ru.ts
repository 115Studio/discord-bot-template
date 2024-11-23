export interface RuPluralOptions {
  zero: string
  one: string
  two: string
}

export const pluralRu = (count: number, plurals: RuPluralOptions): string => {
  const text = [ plurals.one, plurals.two, plurals.zero ], n = count

  return text[
    n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2
  ]
}
