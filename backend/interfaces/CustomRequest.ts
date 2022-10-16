declare namespace Express {
  export interface Request {
    username?: string;
    role?: "admin" | "user";
  }
}
