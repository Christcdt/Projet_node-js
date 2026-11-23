import { describe, expect, it } from "vitest";
import { created, json, jsonSerializer, noContent } from "../../src/index.js";

describe("jsonSerializer", () => {
  it("annonce du JSON en UTF-8", () => {
    expect(jsonSerializer.contentType).toBe("application/json; charset=utf-8");
  });

  it("sérialise les données en JSON", () => {
    expect(jsonSerializer.serialize({ id: 1, tags: ["a"] })).toBe('{"id":1,"tags":["a"]}');
  });
});

describe("json", () => {
  it("répond 200 par défaut avec les données et le sérialiseur JSON", () => {
    const data = { message: "ok" };

    expect(json(data)).toEqual({
      status: 200,
      headers: {},
      body: { kind: "data", data, serializer: jsonSerializer },
    });
  });

  it("utilise le statut fourni", () => {
    expect(json({ error: "introuvable" }, 404).status).toBe(404);
  });
});

describe("created", () => {
  it("répond 201 avec l'en-tête location et les données", () => {
    const data = { id: 42 };

    expect(created(data, "/notes/42")).toEqual({
      status: 201,
      headers: { location: "/notes/42" },
      body: { kind: "data", data, serializer: jsonSerializer },
    });
  });
});

describe("noContent", () => {
  it("répond 204 sans corps", () => {
    expect(noContent()).toEqual({
      status: 204,
      headers: {},
      body: { kind: "empty" },
    });
  });
});
