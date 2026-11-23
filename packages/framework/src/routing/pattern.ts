export class RouteError extends Error {
  readonly path: string;

  constructor(path: string, message: string) {
    super(`${message} dans ${path}`);
    this.name = "RouteError";
    this.path = path;
  }
}

export type Segment =
  | Readonly<{ kind: "static"; value: string }>
  | Readonly<{ kind: "param"; name: string; suffix: string }>
  | Readonly<{ kind: "rest"; name: string }>;

const PARAM = /^\{([A-Za-z_][A-Za-z0-9_]*)(\*)?\}([^{}]*)$/;
const EMPTY_PARAM = /^\{\*?\}$/;

export function compilePattern(path: string): readonly Segment[] {
  if (path === "") {
    throw new RouteError(path, "Chemin vide");
  }

  const parts = path.split("/").filter((part) => part !== "");
  const seen = new Set<string>();

  return Object.freeze(
    parts.map((part, index): Segment => {
      if (!part.includes("{") && !part.includes("}")) {
        return { kind: "static", value: part };
      }

      if (EMPTY_PARAM.test(part)) {
        throw new RouteError(path, "Nom de paramètre vide");
      }

      const match = PARAM.exec(part);
      if (!match) {
        const opening = part.includes("{");
        const closing = part.includes("}");
        throw new RouteError(
          path,
          opening !== closing ? "Accolade non fermée" : `Motif invalide « ${part} »`,
        );
      }

      const name = match[1] ?? "";
      const star = match[2] === "*";
      const suffix = match[3] ?? "";

      if (seen.has(name)) {
        throw new RouteError(path, `Paramètre {${name}} dupliqué`);
      }
      seen.add(name);

      if (star) {
        if (index !== parts.length - 1 || suffix !== "") {
          throw new RouteError(path, `{${name}*} doit terminer le chemin`);
        }
        return { kind: "rest", name };
      }

      return { kind: "param", name, suffix };
    }),
  );
}
