import app from "../../../setupServer";
import request from "supertest";
import pool from "../../../db/db-connect";

describe("getAllPhotos route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns photos from database when queried", async () => {
    (pool as any).query = jest.fn().mockResolvedValueOnce({
      rows: [{ test: "photo1" }, { test: "photo2" }],
    });

    const response = await request(app).get("/api/photos");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ test: "photo1" }, { test: "photo2" }]);
  });

  test("database query called with correct sql when no url queries are given", async () => {
    (pool as any).query = jest.fn().mockResolvedValueOnce({
      rows: [{ test: "photo1" }, { test: "photo2" }],
    });

    const response = await request(app).get("/api/photos");

    expect(response.status).toBe(200);
    expect(pool.query).toBeCalledWith("SELECT * FROM images");
  });

  test("database query called with correct sql when category url query is given", async () => {
    (pool as any).query = jest.fn().mockResolvedValueOnce({
      rows: [{ test: "photo1" }, { test: "photo2" }],
    });

    const response = await request(app).get("/api/photos?category=plants");

    expect(response.status).toBe(200);
    expect((pool.query as jest.Mock).mock.calls[0][0]).toMatch(
      /^SELECT \* FROM images WHERE 'plants' = ANY \(categories\)/
    );
  });

  test("database query called with correct sql when non-category queries given", async () => {
    (pool as any).query = jest.fn().mockResolvedValueOnce({
      rows: [{ test: "photo1" }, { test: "photo2" }],
    });

    const response = await request(app).get(
      "/api/photos?favorite=true&front_page=false"
    );

    expect((pool.query as jest.Mock).mock.calls[0][0]).toMatch(
      /favorite = true/
    );
    expect((pool.query as jest.Mock).mock.calls[0][0]).toMatch(
      /front_page = false/
    );
  });

  test("database error returns 500 server error", async () => {
    (pool as any).query = jest.fn().mockImplementation(() => {
      throw new Error();
    });

    (console as any).error = jest.fn(); // Mock out console.error to stop logging during test

    const response = await request(app).get("/api/photos");

    expect(response.status).toBe(500);
  });
});
