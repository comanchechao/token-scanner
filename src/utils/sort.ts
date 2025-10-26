export type SortDirection = "asc" | "desc";

export function toggleDirection(direction: SortDirection): SortDirection {
  return direction === "asc" ? "desc" : "asc";
}

type Comparable = string | number | boolean | Date | null | undefined;

function normalize(value: Comparable): number | string {
  if (value instanceof Date) return value.getTime();
  if (value === null || value === undefined) return Number.NEGATIVE_INFINITY;
  if (typeof value === "string") return value.toLowerCase();
  if (typeof value === "boolean") return value ? 1 : 0;
  return value;
}

function compareValues(a: Comparable, b: Comparable): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (na < nb) return -1;
  if (na > nb) return 1;
  return 0;
}

/**
 * Stable sort by a projection accessor.
 * Returns a new array; does not mutate the input.
 */
export function sortBy<T>(
  items: readonly T[],
  accessor: (item: T) => Comparable,
  direction: SortDirection = "asc"
): T[] {
  const withIndex = items.map((item, index) => ({ item, index }));
  withIndex.sort((a, b) => {
    const cmp = compareValues(accessor(a.item), accessor(b.item));
    if (cmp !== 0) return direction === "asc" ? cmp : -cmp;
    // stable
    return a.index - b.index;
  });
  return withIndex.map((w) => w.item);
}
