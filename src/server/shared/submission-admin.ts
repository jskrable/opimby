import { type Admin, requireAdmin } from "./access";
import { type Page, toPage } from "./pagination";

// What the admin lists and detail pages need from a submission feature's repository.
export type SubmissionStore<T> = {
  count(open?: boolean): Promise<number>;
  list(limit: number, offset: number, open?: boolean): Promise<T[]>;
  findById(id: number): Promise<T | null>;
};

export function createSubmissionAdmin<T>(repo: SubmissionStore<T>, admin: Admin) {
  requireAdmin(admin);
  return {
    async listPage(pageParam: string | null, open = false): Promise<Page<T>> {
      const total = await repo.count(open);
      const { page, totalPages, offset, limit } = toPage(pageParam, total);
      return { items: await repo.list(limit, offset, open), page, totalPages, total };
    },

    get: (id: number) => (Number.isSafeInteger(id) && id > 0 ? repo.findById(id) : Promise.resolve(null)),

    count: () => repo.count(),

    countOpen: () => repo.count(true),
  };
}
