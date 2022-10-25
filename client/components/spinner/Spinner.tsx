import React from "react";

interface Props {
  size?: number;
  color?: string;
  animDurationMs?: number;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  transform?: string;
  position?: "fixed" | "absolute";
}

const Spinner = ({
  size,
  color,
  animDurationMs,
  left,
  right,
  top,
  bottom,
  transform,
  position,
}: Props) => {
  const animationDurationMs = animDurationMs || 2000;
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: `${position || "absolute"}`,
          left: `${left || 0}`,
          right: `${right || 0}`,
          top: `${top || 0}`,
          bottom: `${bottom || 0}`,
          transform: `${transform || null}`,
        }}
      >
        <div
          style={{
            padding: `${size || "12"}px`,
            marginLeft: `${size / 3 || 4}px`,
            marginRight: `${size / 3 || 4}px`,
            backgroundColor: color || "#000",
            animation: `cs-custom-spinner-pop-in ${
              animationDurationMs || 750
            }ms ease-in-out infinite`,
            animationDelay: `${animationDurationMs * 0}ms`,
          }}
          className={"inline-block mx-4 rounded-full"}
        ></div>
        <div
          style={{
            padding: `${size || "12"}px`,
            marginLeft: `${size / 3 || 4}px`,
            marginRight: `${size / 3 || 4}px`,
            backgroundColor: color || "#000",
            animation: `cs-custom-spinner-pop-in ${
              animationDurationMs || 750
            }ms ease-in-out infinite`,
            animationDelay: `${animationDurationMs * 0.1}ms`,
          }}
          className={"inline-block mx-4 rounded-full"}
        ></div>
        <div
          style={{
            padding: `${size || "12"}px`,
            marginLeft: `${size / 3 || 4}px`,
            marginRight: `${size / 3 || 4}px`,
            backgroundColor: color || "#000",
            animation: `cs-custom-spinner-pop-in ${
              animationDurationMs || 750
            }ms ease-in-out infinite`,
            animationDelay: `${animationDurationMs * 0.2}ms`,
          }}
          className={"inline-block mx-4 rounded-full"}
        ></div>
      </div>
    </>
  );
};

export default Spinner;
