import { UserRole } from "../../../interfaces/UserRole";

export const addUser = (
  id: string,
  username: string,
  password: string,
  role: UserRole
) => {
  return `INSERT INTO users (id, username, password, role) VALUES ('${id}', '${username}', '${password}', '${role}')`;
};
