import { currentUploadDir } from "./context.js";

export type DeepPartial<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export type FrameworkTestConfig = {
  uploads: { dir: string };
  [section: string]: unknown;
};

const merge = <T extends Record<string, unknown>>(base: T, patch: DeepPartial<T>): T => {
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    const original = result[key];
    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      original !== null &&
      typeof original === "object" &&
      !Array.isArray(original)
    ) {
      result[key] = merge(
        original as Record<string, unknown>,
        value as DeepPartial<Record<string, unknown>>,
      );
    } else {
      result[key] = value;
    }
  }
  return result as T;
};

export const testConfig = (
  patch: DeepPartial<FrameworkTestConfig> = {},
): FrameworkTestConfig =>
  merge<FrameworkTestConfig>({ uploads: { dir: currentUploadDir() } }, patch);
