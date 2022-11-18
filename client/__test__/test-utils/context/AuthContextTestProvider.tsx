import React from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useAuthContextDefaults } from "../../../hooks/useAuthContext";

// Simple wrapper to easily wrap test components with its context provider
const AuthContextTestProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={useAuthContextDefaults()}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextTestProvider;
