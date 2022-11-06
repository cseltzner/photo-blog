import React, { CSSProperties } from "react";

interface Props {
  imageUrl: string;
  show: boolean;
  animateForward: boolean | null;
  animationDurationMs?: number;
}

const CarouselItem = ({
  imageUrl,
  show,
  animateForward,
  animationDurationMs,
}: Props) => {
  const forwardAnimation: CSSProperties = {
    animation: `cs-custom-carousel-animate-forward ${
      animationDurationMs || 750
    }ms ease-out`,
  };

  const backwardAnimation: CSSProperties = {
    animation: `cs-custom-carousel-animate-backward ${
      animationDurationMs || 750
    }ms ease-out`,
  };

  return (
    <div
      className={` height-auto max-w-full ${
        show ? "relative" : "absolute hidden"
      } shrink-0 transition-all`}
      style={
        (animateForward === true && forwardAnimation) ||
        (animateForward === false && backwardAnimation) ||
        undefined
      }
    >
      <img src={imageUrl} alt="Photograph" loading={"lazy"} />
    </div>
  );
};

export default CarouselItem;
