import React from "react";
import { AlertContext } from "../../../context/AlertContext";
import { useAlertContextDefaults } from "../../../hooks/useAlertContext";

// Simple wrapper to easily wrap test components with its context provider
const AlertContextTestProvider = ({ children }) => {
  return (
    <AlertContext.Provider value={useAlertContextDefaults()}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContextTestProvider;
