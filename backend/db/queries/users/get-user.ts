export const checkIfUserExists = (username: string) => {
  return `SELECT id FROM users WHERE username = '${username}'`;
};

export const getUserById = (id: string) => {
  return `SELECT id, username, role FROM users WHERE id = '${id}'`;
};
