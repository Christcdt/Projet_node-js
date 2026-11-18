// test.ts
import { string, int } from "./scalars.ts";

const s = string({ min: 2, max: 5 });

console.log(s.safeParse("abc"));      // { ok: true, value: 'abc' }
console.log(s.safeParse("a"));        // { ok: false, issues: [{ path: '', code: 'min', ... }] }
console.log(s.safeParse(42));         // { ok: false, issues: [{ path: '', code: 'type', ... }] }

const age = int({ min: 0, max: 120, coerce: true });
console.log(age.parse("25"));         // 25
console.log(age.safeParse("abc"));    // ok: false

// parse() lance une exception en cas d'échec
try {
  s.parse(123);
} catch (e) {
  console.error((e as Error).message);
}