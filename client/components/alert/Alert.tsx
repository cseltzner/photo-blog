import React from "react";
import AlertSuccess from "./AlertSuccess";
import AlertError from "./AlertError";

interface Props {
  type?: "success" | "error";
  title?: string;
  messages?: string[];
}

const Alert = ({ type, title, messages }: Props) => {
  return (
    <>
      <div
        className={
          "fixed top-24 left-1/2 -translate-x-1/2 w-10/12 max-w-[900px] z-50"
        }
      >
        {type === "success" && (
          <AlertSuccess title={title} messages={messages} />
        )}
        {type === "error" && <AlertError messages={messages} />}
      </div>
    </>
  );
};

export default Alert;
