import React from "react";

const ArrowLeftIcon: React.FC<React.ComponentPropsWithoutRef<"svg">> = ({
  width = "24",
  height = "24",
  fill = "#000000",
  className,
  ...svgProps
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 476.213 476.213"
      fill={fill}
      className={`${className}`}
      {...svgProps}
    >
      <polygon
        points="476.213,223.107 57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5 
	57.427,253.107 476.213,253.107 "
      />
    </svg>
  );
};

export default ArrowLeftIcon;
