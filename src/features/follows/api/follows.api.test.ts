import { describe, expect, it } from "vitest";
import { buildFollowsQuery } from "@/features/follows/api/follows.api";

describe("follows API query", () => {
  it("uses Swagger's type, page, and limit query parameters", () => {
    expect(buildFollowsQuery({ type: "AUTHOR", page: 2, limit: 10 })).toBe(
      "page=2&limit=10&type=AUTHOR",
    );
  });

  it("supports the existing objectType caller alias", () => {
    expect(buildFollowsQuery({ objectType: "JOURNAL" })).toBe(
      "page=1&limit=20&type=JOURNAL",
    );
  });
});
