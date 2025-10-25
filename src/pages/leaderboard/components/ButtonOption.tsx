import React, { memo, useMemo } from "react";
import { Icon } from "@iconify/react";

type ButtonOptionProps = {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  children?: React.ReactNode;
};

const ButtonOption: React.FC<ButtonOptionProps> = memo(
  ({ active, onClick, icon, label, children }) => {
    const buttonClasses = useMemo(
      () =>
        `relative overflow-hidden flex-1 border rounded-sm px-3 py-2 transition-all duration-300 group cursor-pointer ${
          active
            ? "border-main-accent/60 bg-main-accent/10"
            : "border-subtle bg-surface hover:bg-main-accent/5 hover:border-main-accent/30"
        }`,
      [active]
    );

    const iconClasses = useMemo(
      () =>
        active
          ? "text-main-accent"
          : "text-main-light-text group-hover:text-main-accent transition-colors",
      [active]
    );

    const labelClasses = useMemo(
      () =>
        `text-xs transition-colors duration-300 ${
          active
            ? "text-main-accent"
            : "text-main-light-text group-hover:text-main-accent"
        }`,
      [active]
    );

    return (
      <button onClick={onClick} className={buttonClasses}>
        <div className="flex items-center justify-center gap-2">
          <Icon icon={icon} width={14} height={14} className={iconClasses} />
          <span className={labelClasses}>{label}</span>
        </div>
        {children}
      </button>
    );
  }
);

// ✅ Fix ESLint warning
ButtonOption.displayName = "ButtonOption";

export default ButtonOption;
