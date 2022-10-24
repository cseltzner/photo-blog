import React, { Dispatch, SetStateAction } from "react";

export interface AuthContext {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export const AuthContext = React.createContext<AuthContext>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  loading: false,
  setLoading: () => {},
});
