import {
  checkIfUserExistsQuery,
  getUserByIdQuery,
} from "../../../../db/queries/users/get-user";

describe("Get user query", () => {
  describe("checkIfUserExistsQuery", () => {
    test("returns correctly", () => {
      const username = "test username";

      const expectedQuery =
        "SELECT id FROM users WHERE username = 'test username'";
      const resultQuery = checkIfUserExistsQuery(username);

      expect(resultQuery).toBe(expectedQuery);
    });
  });

  describe("getUserByIdQuery", () => {
    test("returns correctly", () => {
      const username = "test username";

      const expectedQuery =
        "SELECT id, username, role, password FROM users WHERE id = 'test username'";
      const resultQuery = getUserByIdQuery(username);

      expect(resultQuery).toBe(expectedQuery);
    });
  });
});
