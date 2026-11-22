import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, vi } from "vitest";
import * as framework from "../src/index.js";
import { currentUploadDir, setCurrentUploadDir } from "./helpers/context.js";
import { fakeExecutor, type FakeExecutor } from "./helpers/executor.js";
import { testConfig, type FrameworkTestConfig } from "./helpers/config.js";

type TestLifecycleExports = {
  Route?: { clear?: () => void };
  disposeRateLimiters?: () => void | Promise<void>;
};

const frameworkLifecycle = framework as unknown as TestLifecycleExports;
const state: {
  uploadDir: string;
  config: FrameworkTestConfig | undefined;
  executor: FakeExecutor;
  disposers: Array<() => void | Promise<void>>;
} = {
  uploadDir: "",
  config: undefined,
  executor: fakeExecutor(),
  disposers: [],
};

export { currentUploadDir };

export const currentTestConfig = (): FrameworkTestConfig => {
  if (!state.config) {
    throw new Error("Test configuration is unavailable outside a test.");
  }
  return state.config;
};

export const currentExecutor = (): FakeExecutor => state.executor;

export const registerTestDisposer = (dispose: () => void | Promise<void>): void => {
  state.disposers.push(dispose);
};

beforeEach(async () => {
  frameworkLifecycle.Route?.clear?.();
  state.uploadDir = await mkdtemp(join(tmpdir(), "carnet-test-"));
  setCurrentUploadDir(state.uploadDir);
  state.config = testConfig();
  state.executor = fakeExecutor();
  state.disposers = [];
});

afterEach(async () => {
  const cleanupErrors: unknown[] = [];
  try {
    for (const dispose of state.disposers.splice(0).reverse()) {
      try {
        await dispose();
      } catch (error) {
        cleanupErrors.push(error);
      }
    }
    try {
      await frameworkLifecycle.disposeRateLimiters?.();
    } catch (error) {
      cleanupErrors.push(error);
    }
  } finally {
    vi.useRealTimers();
    state.config = undefined;
    state.executor = fakeExecutor();
    const uploadDir = state.uploadDir;
    state.uploadDir = "";
    setCurrentUploadDir("");
    if (uploadDir) {
      await rm(uploadDir, { recursive: true, force: true });
    }
  }
  if (cleanupErrors.length === 1) throw cleanupErrors[0];
  if (cleanupErrors.length > 1) {
    throw new AggregateError(cleanupErrors, "One or more test resources failed to dispose.");
  }
});
