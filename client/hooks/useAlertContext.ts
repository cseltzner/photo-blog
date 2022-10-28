import { useContext, useState } from "react";
import { AlertContext } from "../context/AlertContext";

/**
 * Returns AlertContext values
 */
export const useAlertContext = () => {
  return useContext(AlertContext);
};

/**
 * Creates initial state values for AlertContext that can be passed
 * into AlertContext.Provider's value
 *
 * @returns AlertContext object with default values
 */
export const useAlertContextDefaults = () => {
  const [alert, setAlert] = useState({});
  const removeAlert = () => setAlert(null);
  return {
    alert,
    setAlert,
    removeAlert,
  } as AlertContext;
};
