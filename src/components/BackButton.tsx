import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

interface BackButtonProps {
  className?: string;
  onClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ className = "", onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative flex items-center gap-2 px-4 py-2   bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-main-accent/30 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-main-accent/10 cursor-pointer before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:-z-10 ${className}`}
    >
      <Icon
        icon="material-symbols:arrow-back-ios"
        className="w-4 h-4 text-main-light-text group-hover:text-main-accent transition-colors duration-300 relative z-10"
      />
      <span className="font-tiktok text-sm text-main-light-text group-hover:text-main-accent transition-colors duration-300 relative z-10">
        Back
      </span>
    </button>
  );
};

export default BackButton;
