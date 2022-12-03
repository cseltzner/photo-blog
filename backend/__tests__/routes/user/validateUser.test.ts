import jwt from "jsonwebtoken";
import pool from "../../../db/db-connect";
import supertest from "supertest";
import app from "../../../setupServer";

describe("validate user route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns 200 response if user token is successfully validated", async () => {
    // Mock out jwt authorization
    (jwt as any).verify = jest.fn().mockImplementationOnce(() => {
      return {
        username: "test user",
        role: "admin",
      };
    });

    // mock database response
    (pool as any).query = jest.fn().mockResolvedValue({
      rows: [
        {
          id: "I exist!",
          username: "test username",
          password: "test password",
        },
      ], // User exists
    });

    const response = await supertest(app)
      .get("/api/user")
      .set("Authorization", "Please authorize me!");

    expect(response.status).toBe(200);
  });

  test("returns 401 response if username is not included in the authorization token", async () => {
    // Mock out jwt authorization
    (jwt as any).verify = jest.fn().mockImplementationOnce(() => {
      return {
        // Username is MISSING
        role: "admin",
      };
    });

    const response = await supertest(app)
      .get("/api/user")
      .set("Authorization", "Please authorize me!");

    expect(response.status).toBe(401);
  });

  test("returns 401 response if user is not found in the database", async () => {
    // Mock out jwt authorization
    (jwt as any).verify = jest.fn().mockImplementationOnce(() => {
      return {
        username: "test user",
        role: "admin",
      };
    });

    // mock database response
    (pool as any).query = jest.fn().mockResolvedValue({
      rows: [], // User does not exist
    });

    const response = await supertest(app)
      .get("/api/user")
      .set("Authorization", "Please authorize me!");

    expect(response.status).toBe(401);
  });

  test("returns 500 response if database throws error", async () => {
    // Mock out jwt authorization
    (jwt as any).verify = jest.fn().mockImplementationOnce(() => {
      return {
        username: "test user",
        role: "admin",
      };
    });

    // mock database response
    (pool as any).query = jest.fn().mockImplementation(() => {
      throw new Error();
    });

    // mock console.error to avoid logging during test
    (console as any).error = jest.fn();

    const response = await supertest(app)
      .get("/api/user")
      .set("Authorization", "Please authorize me!");

    expect(response.status).toBe(500);
  });
});
