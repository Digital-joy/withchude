import React from "react";

const CommentIcon: React.FC<React.ComponentPropsWithoutRef<"svg">> = ({
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
      viewBox="0 0 16 16"
      fill={fill}
      className={`${className}`}
      {...svgProps}
    >
      <path
        d="M3.66797 2.3335H12.3346C13.4392 2.3335 14.3346 3.22893 14.3346 4.3335V10.3335C14.3346 11.4381 13.4392 12.3335 12.3346 12.3335H8.0013L4.66797 14.1668V12.3335H3.66797C2.5634 12.3335 1.66797 11.4381 1.66797 10.3335V4.3335C1.66797 3.22893 2.5634 2.3335 3.66797 2.3335Z"
        stroke="black"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CommentIcon;
