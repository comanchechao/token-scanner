import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ width, height, className }) => {
  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`bg-white/[0.08] animate-pulse rounded-md ${className || ""}`}
      style={style}
    ></div>
  );
};

export default Skeleton;
