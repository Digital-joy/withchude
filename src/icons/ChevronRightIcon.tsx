import React from 'react';

const ChevronRightIcon: React.FC<React.ComponentPropsWithoutRef<'svg'>> = ({
  width = '15',
  height = '15',
  fill = 'none',
  className,
  ...svgProps
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={Number(width)}
      height={Number(height)}
      viewBox="0 0 15 15"
      fill={fill}
      className={`${className}`}
      {...svgProps}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.89739 2.65978C6.06786 2.48931 6.34425 2.48931 6.51473 2.65978L11.171 7.31604C11.2529 7.3979 11.2988 7.50893 11.2988 7.62471C11.2988 7.74048 11.2529 7.85151 11.171 7.93338L6.51473 12.5897C6.34425 12.7601 6.06786 12.7601 5.89739 12.5897C5.72691 12.4192 5.72691 12.1428 5.89739 11.9723L10.245 7.62471L5.89739 3.27712C5.72691 3.10665 5.72691 2.83026 5.89739 2.65978Z"
        fill="black"
      />
    </svg>
  );
};

export default ChevronRightIcon;
