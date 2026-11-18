// scalars.ts
import { schema, fail, type Schema } from "./core.ts"; 

export const string = (rules: { min?: number; max?: number; pattern?: RegExp } = {}): Schema<string> =>
  schema((input, path) => {
    if (typeof input !== "string") return fail(path, "type", "doit être une chaîne");
    if (rules.min !== undefined && input.length < rules.min) return fail(path, "min", `au moins ${rules.min} caractères`);
    if (rules.max !== undefined && input.length > rules.max) return fail(path, "max", `au plus ${rules.max} caractères`);
    if (rules.pattern && !rules.pattern.test(input)) return fail(path, "pattern", "format invalide");
    return { ok: true, value: input };
  });

export const int = (rules: { min?: number; max?: number; coerce?: boolean } = {}): Schema<number> =>
  schema((input, path) => {
    const n = rules.coerce && typeof input === "string" && input.trim() !== "" ? Number(input) : input;
    if (typeof n !== "number" || !Number.isSafeInteger(n)) return fail(path, "type", "doit être un entier");
    if (rules.min !== undefined && n < rules.min) return fail(path, "min", `au moins ${rules.min}`);
    if (rules.max !== undefined && n > rules.max) return fail(path, "max", `au plus ${rules.max}`);
    return { ok: true, value: n };
  });

export const boolean = (): Schema<boolean> => schema((input, path) => {
    if (typeof input !== "boolean") return fail(path, "type", "doit être un booléen");
    return { ok: true, value: input };
});
