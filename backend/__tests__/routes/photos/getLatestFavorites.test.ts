import pool from "../../../db/db-connect";
import request from "supertest";
import app from "../../../setupServer";

describe("getLatestFavorites route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns photos from database when queried", async () => {
    (pool as any).query = jest.fn().mockResolvedValueOnce({
      rows: [{ test: "photo1" }, { test: "photo2" }],
    });

    const response = await request(app).get("/api/photos/latestfavorite");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ test: "photo1" }, { test: "photo2" }]);
  });

  test("database query called with correct sql when no url queries given", async () => {
    (pool as any).query = jest.fn().mockResolvedValueOnce({
      rows: [{ test: "photo1" }, { test: "photo2" }],
    });

    const response = await request(app).get("/api/photos/latestfavorite");

    expect(pool.query).toBeCalledWith(
      "SELECT * FROM images WHERE favorite = TRUE ORDER BY date_added DESC LIMIT 5"
    );
  });

  test("database query called with correct sql when limit given", async () => {
    (pool as any).query = jest.fn().mockResolvedValueOnce({
      rows: [{ test: "photo1" }, { test: "photo2" }],
    });

    const response = await request(app).get(
      "/api/photos/latestfavorite?limit=6"
    );

    expect(pool.query).toBeCalledWith(
      "SELECT * FROM images WHERE favorite = TRUE ORDER BY date_added DESC LIMIT 6"
    );
  });

  test("database error returns 500 server error", async () => {
    (pool as any).query = jest.fn().mockImplementation(() => {
      throw new Error();
    });

    (console as any).error = jest.fn(); // Mock out console.error to stop logging during test

    const response = await request(app).get("/api/photos/latestfavorite");

    expect(response.status).toBe(500);
  });
});
