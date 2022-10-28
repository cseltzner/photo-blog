import React, { Dispatch, SetStateAction } from "react";

export interface AlertContext {
  alert: {
    type: "success" | "error";
    title: string;
    messages: string[];
  } | null;
  setAlert: Dispatch<
    SetStateAction<
      | {
          type: "success" | "error";
          title: string;
          messages: string[];
        }
      | {}
    >
  >;
  removeAlert: () => void;
}

export const AlertContext = React.createContext<AlertContext>({
  alert: null,
  setAlert: () => {},
  removeAlert: () => {},
});
