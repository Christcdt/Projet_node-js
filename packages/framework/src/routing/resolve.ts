import { RouteError } from "./pattern.ts";
import type { RouteDefinition, RouteMethod, RouteNode } from "./tree.ts";

export type Resolution<T = unknown> =
  | Readonly<{
      kind: "found";
      route: RouteDefinition<T>;
      params: Readonly<Record<string, string>>;
    }>
  | Readonly<{ kind: "method-not-allowed"; allow: readonly RouteMethod[] }>
  | Readonly<{ kind: "not-found" }>
  | Readonly<{ kind: "bad-request"; message: string }>;

export function splitPath(path: string): readonly string[] {
  return path.split("/").filter((segment) => segment !== "");
}

export function resolve<T>(
  tree: RouteNode<T>,
  method: RouteMethod,
  path: string,
): Resolution<T> {
  try {
    const match = matchNode(tree, splitPath(path), 0, {}, path);
    if (!match) return { kind: "not-found" };

    const route =
      match.node.routes.get(method) ??
      (method === "HEAD" ? match.node.routes.get("GET") : undefined);

    if (!route) {
      const allow = new Set<RouteMethod>(match.node.routes.keys());
      if (allow.has("GET")) allow.add("HEAD");
      return { kind: "method-not-allowed", allow: [...allow].sort() };
    }

    return { kind: "found", route, params: match.params };
  } catch (error: unknown) {
    if (error instanceof RouteError) {
      return { kind: "bad-request", message: error.message };
    }
    throw error;
  }
}

function matchNode<T>(
  node: RouteNode<T>,
  segments: readonly string[],
  index: number,
  params: Record<string, string>,
  path: string,
): Readonly<{ node: RouteNode<T>; params: Record<string, string> }> | undefined {
  if (index === segments.length) {
    return node.routes.size > 0 ? { node, params } : undefined;
  }

  const segment = segments[index] ?? "";

  const staticChild = node.statics.get(segment);
  const staticMatch =
    staticChild && matchNode(staticChild, segments, index + 1, params, path);
  if (staticMatch) return staticMatch;

  for (const candidate of node.params) {
    if (!segment.endsWith(candidate.suffix)) continue;

    const rawValue = segment.slice(
      0,
      segment.length - candidate.suffix.length,
    );
    if (rawValue === "") continue;

    const nextParams = {
      ...params,
      [candidate.name]: decodeValue(rawValue, path),
    };
    const match = matchNode(
      candidate.node,
      segments,
      index + 1,
      nextParams,
      path,
    );
    if (match) return match;
  }

  if (!node.rest) return undefined;

  const restParams = {
    ...params,
    [node.rest.name]: segments
      .slice(index)
      .map((part) => decodeValue(part, path))
      .join("/"),
  };
  return matchNode(
    node.rest.node,
    segments,
    segments.length,
    restParams,
    path,
  );
}

function decodeValue(value: string, path: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    throw new RouteError(path, `Paramètre mal encodé « ${value} »`);
  }
}
