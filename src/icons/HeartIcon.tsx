import React from "react";

const HeartIcon: React.FC<React.ComponentPropsWithoutRef<"svg">> = ({
  width = "24",
  height = "24",
  fill = "none",
  className,
  ...svgProps
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 470 497"
      fill={fill}
      className={`${className}`}
      {...svgProps}
    >
      <path
        d="M140 20C73 20 20 74 20 140c0 135 136 170 228 303 88-132 229-173 229-303 0-66-54-120-120-120-48 0-90 28-109 69-19-41-60-69-108-69z"
        stroke="#f8a519"
        stroke-width="20"
      />
    </svg>
  );
};

export default HeartIcon;
