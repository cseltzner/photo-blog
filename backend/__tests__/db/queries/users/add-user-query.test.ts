import { addUserQuery } from "../../../../db/queries/users/add-user-query";

describe("addUserQuery", () => {
  test("returns correctly", () => {
    const id = "123";
    const username = "test username";
    const password = "test password";
    const role = "admin";

    const expectedQuery =
      "INSERT INTO users (id, username, password, role) VALUES ('123', 'test username', 'test password', 'admin')";
    const resultQuery = addUserQuery(id, username, password, role);

    expect(resultQuery).toBe(expectedQuery);
  });
});
