import pool from "../../../db/db-connect";
import jwt from "jsonwebtoken";
import supertest from "supertest";
import app from "../../../setupServer";

describe("register user route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns token when user successfully registered", async () => {
    // Mock out jwt authorization
    (jwt as any).verify = jest.fn().mockImplementationOnce(() => {
      return {
        username: "test user",
        role: "admin",
      };
    });

    (jwt as any).sign = jest.fn().mockImplementationOnce(() => {
      return "test token"; // jwt.sign returns test token
    });

    (pool as any).query = jest.fn().mockResolvedValueOnce({
      rows: [], // User does not exist
    });

    const body = {
      username: "test username",
      password: "test password",
      role: "admin",
    };
    const response = await supertest(app)
      .post("/api/user")
      .set("Authorization", "please authorize me")
      .send(body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: "test token" });
  });

  test("returns 400 when missing request body parameters", async () => {
    // Mock out jwt authorization
    (jwt as any).verify = jest.fn().mockImplementationOnce(() => {
      return {
        username: "test user",
        role: "admin",
      };
    });

    (pool as any).query = jest.fn().mockResolvedValueOnce({
      rows: [], // User does not exist
    });

    const body = {
      username: "", // Missing parameter
      password: "test password",
      role: "admin",
    };
    const response = await supertest(app)
      .post("/api/user")
      .set("Authorization", "please authorize me")
      .send(body);

    expect(response.status).toBe(400);
  });

  test("returns 409 when user already exists", async () => {
    // Mock out jwt authorization
    (jwt as any).verify = jest.fn().mockImplementationOnce(() => {
      return {
        username: "test user",
        role: "admin",
      };
    });

    (pool as any).query = jest.fn().mockResolvedValueOnce({
      rows: [{ id: "I already exist!!!" }], // User already exists
    });

    const body = {
      username: "test username",
      password: "test password",
      role: "admin",
    };
    const response = await supertest(app)
      .post("/api/user")
      .set("Authorization", "please authorize me")
      .send(body);

    expect(response.status).toBe(409);
  });

  test("returns 500 when database throws error", async () => {
    // Mock out jwt authorization
    (jwt as any).verify = jest.fn().mockImplementationOnce(() => {
      return {
        username: "test user",
        role: "admin",
      };
    });

    (pool as any).query = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });

    // Mock out console.error to avoid logging to console
    (console as any).error = jest.fn();

    const body = {
      username: "test username",
      password: "test password",
      role: "admin",
    };
    const response = await supertest(app)
      .post("/api/user")
      .set("Authorization", "please authorize me")
      .send(body);

    expect(response.status).toBe(500);
  });
});
