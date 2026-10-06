export const PAGE_SIZE = 25;

export type Page<T> = { items: T[]; page: number; totalPages: number; total: number };

export function toPage(param: string | null, total: number) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const requested = Number.parseInt(param ?? "1", 10);
  const page = Math.min(Math.max(Number.isFinite(requested) ? requested : 1, 1), totalPages);
  return { page, totalPages, offset: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE };
}
