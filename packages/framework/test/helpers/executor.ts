import { vi } from "vitest";

export type FakeExecutor = {
  execute: (sql: string, parameters?: readonly unknown[]) => Promise<unknown[]>;
  query: (sql: string, parameters?: readonly unknown[]) => Promise<unknown[]>;
};

export const fakeExecutor = <T = unknown>(rows: T[] = []): FakeExecutor => {
  const run = vi.fn(async (_sql: string, _parameters: readonly unknown[] = []) => [...rows]);
  return { execute: run, query: run };
};
