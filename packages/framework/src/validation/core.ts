export type Issue = Readonly<{ path: string; code: string; message: string }>; 
export type Result<T> = { ok: true; value: T } | { ok: false; issues: readonly Issue[] };

export type Schema<T> = Readonly<{
  run: (input: unknown, path: string) => Result<T>;
  safeParse: (input: unknown) => Result<T>;
  parse: (input: unknown) => T; 
}>;

export type Infer<S> = S extends Schema<infer T> ? T : never;

export const fail = (path: string, code: string, message: string): Result<never> =>
  ({ ok: false, issues: [{ path, code, message }] });

export function schema<T>(runFn: (input: unknown, path: string) => Result<T>): Schema<T> {
    return {
        run: runFn,
        safeParse: (input: unknown) => runFn(input, ""),
        parse: (input: unknown) => {
        const result = runFn(input, "");
            if (!result.ok) {
                throw new Error(`Validation failed: ${JSON.stringify(result.issues)}`);
        }
      return result.value;
    }
  };
}
