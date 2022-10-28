import React, { useEffect } from "react";
import AlertSuccess from "./AlertSuccess";
import AlertError from "./AlertError";
import { useAlertContext } from "../../hooks/useAlertContext";

interface Props {
  type?: "success" | "error";
  title?: string;
  messages?: string[];
  durationMs?: number;
}

const Alert = ({ type, title, messages, durationMs }: Props) => {
  const { removeAlert, alert } = useAlertContext();

  const duration = durationMs || 10000;
  const animation = "cs-custom-alert-drop-down 0.5s ease-in-out";

  // Alert timer
  useEffect(() => {
    const timeout = setTimeout(() => {
      removeAlert();
    }, duration);
    return () => {
      clearTimeout(timeout);
    };
  }, [alert]);

  return (
    <>
      <div
        style={{ animation: type && animation, transformOrigin: "top" }}
        className={
          "fixed top-24 left-1/2 -translate-x-1/2 w-10/12 max-w-[900px] z-50"
        }
      >
        {type === "success" && (
          <AlertSuccess
            title={title}
            messages={messages}
            onClose={() => removeAlert()}
          />
        )}
        {type === "error" && (
          <AlertError messages={messages} onClose={() => removeAlert()} />
        )}
      </div>
    </>
  );
};

export default Alert;
