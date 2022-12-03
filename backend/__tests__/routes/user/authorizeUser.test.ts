import jwt from "jsonwebtoken";
import pool from "../../../db/db-connect";
import bcrypt from "bcryptjs";
import supertest from "supertest";
import app from "../../../setupServer";

describe("authorize user route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns token when user is authorized", async () => {
    (jwt as any).sign = jest.fn().mockImplementationOnce(() => {
      return "test token"; // jwt.sign returns test token
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

    // mock bcrypt compare function
    (bcrypt as any).compare = jest.fn().mockReturnValueOnce(true); // passwords do match

    const body = {
      username: "test username",
      password: "test password",
    };
    const response = await supertest(app).post("/api/user/auth").send(body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: "test token" });
  });

  test("returns 400 response if missing request body parameters", async () => {
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

    // mock bcrypt compare function
    (bcrypt as any).compare = jest.fn().mockReturnValueOnce(true); // passwords do match

    const body = {
      username: "", // Missing parameter
      password: "test password",
    };
    const response = await supertest(app).post("/api/user/auth").send(body);

    expect(response.status).toBe(400);
  });

  test("returns 401 response if password is invalid", async () => {
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

    // mock bcrypt compare function
    (bcrypt as any).compare = jest.fn().mockReturnValueOnce(false); // * passwords DO NOT match *

    const body = {
      username: "test username",
      password: "test password",
    };
    const response = await supertest(app).post("/api/user/auth").send(body);

    expect(response.status).toBe(401);
  });

  test("returns 404 response if user is not found", async () => {
    // mock database response
    (pool as any).query = jest.fn().mockResolvedValue({
      rows: [], // User does not exist
    });

    // mock bcrypt compare function
    (bcrypt as any).compare = jest.fn().mockReturnValueOnce(true); // passwords do match

    const body = {
      username: "test username",
      password: "test password",
    };
    const response = await supertest(app).post("/api/user/auth").send(body);

    expect(response.status).toBe(404);
  });

  test("returns 500 response when database throws error", async () => {
    // mock database response
    (pool as any).query = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });

    // Mock out console.error to avoid log messages
    (console as any).error = jest.fn();

    const body = {
      username: "test username",
      password: "test password",
    };
    const response = await supertest(app).post("/api/user/auth").send(body);

    expect(response.status).toBe(500);
  });
});
