export const checkIfUserExistsQuery = (username: string) => {
  return `SELECT id FROM users WHERE username = '${username}'`;
};

export const getUserByIdQuery = (id: string) => {
  return `SELECT id, username, role FROM users WHERE id = '${id}'`;
};
