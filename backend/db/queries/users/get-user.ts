export const checkIfUserExistsQuery = (username: string) => {
  return `SELECT id FROM users WHERE username = '${username}'`;
};

export const getUserByIdQuery = (id: string) => {
  return `SELECT id, username, role, password FROM users WHERE id = '${id}'`;
};
