import React from 'react';

const ChevronLeftIcon: React.FC<React.ComponentPropsWithoutRef<'svg'>> = ({
  width = '24',
  height = '24',
  fill = 'none',
  className,
  ...svgProps
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={Number(width)}
      height={Number(height)}
      viewBox="0 0 24 24"
      fill={fill}
      className={`${className}`}
      {...svgProps}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.0018 2.93933L5.94118 12L15.0018 21.0606L16.0625 20L8.0625 12L16.0625 3.99999L15.0018 2.93933Z"
        fill="black"
      />
    </svg>
  );
};

export default ChevronLeftIcon;
