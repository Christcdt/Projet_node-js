import { compilePattern, RouteError } from "./pattern.ts";
import type { Segment } from "./pattern.ts";

export type RouteMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS";

export type RouteDefinition<T = unknown> = Readonly<{
  method: RouteMethod;
  path: string;
  handler: T;
}>;

export type RouteNode<T = unknown> = {
  statics: Map<string, RouteNode<T>>;
  params: Array<{
    name: string;
    suffix: string;
    node: RouteNode<T>;
  }>;
  rest: {
    name: string;
    node: RouteNode<T>;
  } | undefined;
  routes: Map<RouteMethod, RouteDefinition<T>>;
};

const createNode = <T>(): RouteNode<T> => ({
  statics: new Map(),
  params: [],
  rest: undefined,
  routes: new Map(),
});

export function createRouteTree<T>(
  routes: readonly RouteDefinition<T>[] = [],
): RouteNode<T> {
  const root = createNode<T>();
  routes.forEach((route) => insertRoute(root, route));
  return root;
}

export function insertRoute<T>(
  root: RouteNode<T>,
  route: RouteDefinition<T>,
): void {
  let node = root;

  for (const segment of compilePattern(route.path)) {
    node = nextNode(node, route.path, segment);
  }

  if (node.routes.has(route.method)) {
    throw new RouteError(
      route.path,
      `Route ${route.method} déjà déclarée pour ce chemin`,
    );
  }
  node.routes.set(route.method, route);
}

function nextNode<T>(
  node: RouteNode<T>,
  path: string,
  segment: Segment,
): RouteNode<T> {
  if (segment.kind === "static") {
    const existing = node.statics.get(segment.value);
    if (existing) return existing;
    const child = createNode<T>();
    node.statics.set(segment.value, child);
    return child;
  }

  if (segment.kind === "param") {
    const existing = node.params.find(
      (candidate) => candidate.suffix === segment.suffix,
    );
    if (existing) {
      if (existing.name !== segment.name) {
        throw new RouteError(
          path,
          `Paramètres incompatibles {${existing.name}} et {${segment.name}}`,
        );
      }
      return existing.node;
    }

    const child = createNode<T>();
    const position = node.params.findIndex(
      (candidate) => candidate.suffix.length < segment.suffix.length,
    );
    const candidate = { name: segment.name, suffix: segment.suffix, node: child };
    if (position === -1) node.params.push(candidate);
    else node.params.splice(position, 0, candidate);
    return child;
  }

  if (node.rest) {
    if (node.rest.name !== segment.name) {
      throw new RouteError(
        path,
        `Fins de chemin incompatibles {${node.rest.name}*} et {${segment.name}*}`,
      );
    }
    return node.rest.node;
  }

  const child = createNode<T>();
  node.rest = { name: segment.name, node: child };
  return child;
}
