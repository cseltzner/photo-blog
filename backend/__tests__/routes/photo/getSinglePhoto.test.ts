import pool from "../../../db/db-connect";
import request from "supertest";
import app from "../../../setupServer";

describe("getSinglePhoto route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns photo from database", async () => {
    // mock database response
    (pool as any).query = jest.fn().mockResolvedValue({
      rows: [
        {
          photo: "test photo",
        },
      ],
    });

    const response = await request(app).get("/api/photo/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ photo: "test photo" });
  });

  test("database query is passed the correct parameters", async () => {
    // mock database response
    (pool as any).query = jest.fn().mockResolvedValue({
      rows: [
        {
          photo: "test photo",
        },
      ],
    });

    const response = await request(app).get("/api/photo/testId");

    expect((pool.query as jest.Mock).mock.calls[0][0]).toMatch(/testId/); // database sql query is called with a string containing 'testId'
  });

  test("returns 404 response if no image is found in database", async () => {
    // mock database response
    (pool as any).query = jest.fn().mockResolvedValue({
      rows: [], // No image found
    });

    const response = await request(app).get("/api/photo/testId");
    expect(response.status).toBe(404);
  });

  test("returns 500 response if database throws error", async () => {
    // mock database response
    (pool as any).query = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });

    (console as any).error = jest.fn(); // Mock console.error to avoid logging during tests

    const response = await request(app).get("/api/photo/testId");
    expect(response.status).toBe(500);
  });
});
