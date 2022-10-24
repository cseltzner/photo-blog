import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Returns AuthContext values
 */
export const useAuthContext = () => {
  return useContext(AuthContext);
};

/**
 * Creates initial state values for AuthContext that can be passed
 * into AuthContext.Provider's value
 *
 * @returns AuthContext object with default valuse
 */
export const useAuthContextDefaults = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  return {
    isLoggedIn,
    setIsLoggedIn,
    loading,
    setLoading,
  } as AuthContext;
};
