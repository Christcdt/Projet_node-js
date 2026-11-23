import type { HttpResponse, Serializer } from "./types.ts";

export const jsonSerializer: Serializer = {
  contentType: "application/json; charset=utf-8",
  serialize: (data) => JSON.stringify(data),
};

export const json = (data: unknown, status = 200): HttpResponse => ({
  status,
  headers: {},
  body: {
    kind: "data",
    data,
    serializer: jsonSerializer,
  },
});

export const created = (data: unknown, location: string): HttpResponse => ({
  ...json(data, 201),
  headers: {
    location,
  },
});

export const noContent = (): HttpResponse => ({
  status: 204,
  headers: {},
  body: {
    kind: "empty",
  },
});
