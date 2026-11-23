import { schema, fail, type Schema } from "./core.ts"; 

const coerceNumericInput = (input: unknown, coerce: boolean): unknown => {
  if (!coerce || typeof input !== "string" || input.trim() === "") return input;
  return Number(input);
};

export const string = (rules: { min?: number; max?: number; pattern?: RegExp } = {}): Schema<string> => {
  if (rules.pattern?.global) {
    throw new TypeError("Le drapeau g n'est pas autorisé pour pattern");
  }

  return schema((input, path) => {
    if (typeof input !== "string") return fail(path, "type", "doit être une chaîne");
    if (rules.min !== undefined && input.length < rules.min) return fail(path, "min", `au moins ${rules.min} caractères`);
    if (rules.max !== undefined && input.length > rules.max) return fail(path, "max", `au plus ${rules.max} caractères`);
    if (rules.pattern && !rules.pattern.test(input)) return fail(path, "pattern", "format invalide");
    return { ok: true, value: input };
  });
};

export const number = (rules: { min?: number; max?: number; positive?: boolean; coerce?: boolean } = {}): Schema<number> =>
  schema((input, path) => {
    const n = coerceNumericInput(input, rules.coerce === true);
    if (typeof n !== "number" || !Number.isFinite(n)) return fail(path, "type", "doit être un nombre fini");
    if (rules.positive && n <= 0) return fail(path, "positive", "doit être positif");
    if (rules.min !== undefined && n < rules.min) return fail(path, "min", `au moins ${rules.min}`);
    if (rules.max !== undefined && n > rules.max) return fail(path, "max", `au plus ${rules.max}`);
    return { ok: true, value: n };
  });

export const int = (rules: { min?: number; max?: number; positive?: boolean; coerce?: boolean } = {}): Schema<number> =>
  schema((input, path) => {
    const n = coerceNumericInput(input, rules.coerce === true);
    if (typeof n !== "number" || !Number.isSafeInteger(n)) return fail(path, "type", "doit être un entier");
    if (rules.positive && n <= 0) return fail(path, "positive", "doit être positif");
    if (rules.min !== undefined && n < rules.min) return fail(path, "min", `au moins ${rules.min}`);
    if (rules.max !== undefined && n > rules.max) return fail(path, "max", `au plus ${rules.max}`);
    return { ok: true, value: n };
  });

export const boolean = (rules: { coerce?: boolean } = {}): Schema<boolean> =>
  schema((input, path) => {
    const value = rules.coerce && typeof input === "string"
      ? input.trim() === "true" ? true : input.trim() === "false" ? false : input
      : input;
    if (typeof value !== "boolean") return fail(path, "type", "doit être un booléen");
    return { ok: true, value };
  });

export const date = (rules: { coerce?: boolean } = {}): Schema<Date> =>
  schema((input, path) => {
    const value = rules.coerce && typeof input === "string" && input.trim() !== ""
      ? new Date(input)
      : input;
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      return fail(path, "type", "doit être une date valide");
    }
    return { ok: true, value };
  });


