import type { Buffer } from "node:buffer";
import type { Readable } from "node:stream";

export type HttpMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS";

export type QueryParams = Readonly<{
  get(key: string): string | undefined;
  getAll(key: string): readonly string[];
  has(key: string): boolean;
  int(key: string, fallback: number): number;
  toObject(): Readonly<Record<string, string>>;
}>;

export type StoredFile = Readonly<{
  name: string;
  type: string;
  size: number;
}>;

export type AuthUser = Readonly<{
  id: number;
  role: "user" | "admin";
}>;

export type FrameworkConfig = Readonly<{
  env: "development" | "production" | "test";
  server: Readonly<{
    host: string;
    port: number;
  }>;
  database: Readonly<{
    url: string;
  }>;
  auth: Readonly<{
    jwtSecret: string;
    tokenTtlSeconds: number;
    bcryptCost: number;
  }>;
  cors: Readonly<{
    enabled: boolean;
    origins: readonly string[];
  }>;
  uploads: Readonly<{
    dir: string;
    maxBytes: number;
    allowedTypes: readonly string[];
  }>;
  securityHeaders: Readonly<Record<string, string>>;
  rateLimit: Readonly<{
    max: number;
    windowMs: number;
  }>;
  body: Readonly<{
    maxBytes: number;
  }>;
  api: Readonly<{
    defaultVersion: number;
  }>;
}>;

export type RouteInfo = Readonly<{
  name: string | undefined;
  version: number | false;
  pattern: string;
}>;

export type Serializer = Readonly<{
  contentType: string;
  serialize(data: unknown): string | Buffer;
}>;

export type ResponseBody =
  | Readonly<{ kind: "empty" }>
  | Readonly<{ kind: "data"; data: unknown; serializer: Serializer }>
  | Readonly<{ kind: "stream"; stream: Readable; contentType: string }>;

export type Context<
  P = Readonly<Record<string, string>>,
  B = unknown,
> = Readonly<{
  method: HttpMethod;
  path: string;
  headers: Readonly<Record<string, string | undefined>>;
  ip: string;
  params: P;
  query: QueryParams;
  body: B;
  files: Readonly<Record<string, StoredFile>>;
  route: RouteInfo;
  allowedMethods: readonly HttpMethod[];
  user: AuthUser | undefined;
  config: FrameworkConfig;
  url(name: string, params?: Readonly<Record<string, string | number>>): string;
  raw: Readonly<{
    body: AsyncIterable<Buffer>;
  }>;
}>;

export type HttpResponse = Readonly<{
  status: number;
  headers: Readonly<Record<string, string>>;
  body: ResponseBody;
}>;

export type Controller<
  P = Readonly<Record<string, string>>,
  B = unknown,
> = (ctx: Context<P, B>) => HttpResponse | Promise<HttpResponse>;
