import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMock = vi.hoisted(() => ({
  select: vi.fn(),
}));

const userQuery = {
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  limit: vi
    .fn()
    .mockResolvedValue([{ id: "11111111-1111-4111-8111-111111111111" }]),
};

const chirpQuery = {
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockResolvedValue([{ id: "chirp-1" }]),
};

vi.mock("../src/db/index.js", () => ({
  db: dbMock,
}));

import { getAuthorChirps } from "../src/db/queries/chirps.js";

describe("getAuthorChirps sorting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMock.select
      .mockImplementationOnce(() => userQuery)
      .mockImplementationOnce(() => chirpQuery);
  });

  it("orders the author's chirps by createdAt, not by the user record", async () => {
    const result = await getAuthorChirps(
      "11111111-1111-4111-8111-111111111111",
      "desc",
    );

    expect(result).toEqual([{ id: "chirp-1" }]);
    expect(chirpQuery.orderBy).toHaveBeenCalledTimes(1);
    expect(chirpQuery.where).toHaveBeenCalled();
    expect(dbMock.select).toHaveBeenCalledTimes(2);
  });
});
