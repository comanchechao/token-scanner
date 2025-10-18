import React, { useEffect } from "react";
import { Icon } from "@iconify/react";

export interface ToastProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
  txSignature?: string;
}

const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  visible,
  onClose,
  duration = 3000,
  txSignature,
}) => {
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          iconBg: "from-green-500/20 to-green-600/20",
          borderColor: "border-green-500/30",
          iconColor: "text-green-400",
          titleColor: "text-main-text",
          messageColor: "text-main-light-text",
          icon: "mingcute:check-circle-fill",
          accentColor: "shadow-green-500/10",
          buttonBg: "bg-green-500/10",
          buttonHoverBg: "hover:bg-green-500/20",
          buttonBorder: "border-green-500/30",
          buttonText: "text-green-400",
        };
      case "error":
        return {
          iconBg: "from-red-500/20 to-red-600/20",
          borderColor: "border-red-500/30",
          iconColor: "text-red-400",
          titleColor: "text-main-text",
          messageColor: "text-main-light-text",
          icon: "material-symbols:error-rounded",
          accentColor: "shadow-red-500/10",
          buttonBg: "bg-red-500/10",
          buttonHoverBg: "hover:bg-red-500/20",
          buttonBorder: "border-red-500/30",
          buttonText: "text-red-400",
        };
      case "warning":
        return {
          iconBg: "from-orange-500/20 to-orange-600/20",
          borderColor: "border-orange-500/30",
          iconColor: "text-orange-400",
          titleColor: "text-main-text",
          messageColor: "text-main-light-text",
          icon: "material-symbols:warning-rounded",
          accentColor: "shadow-orange-500/10",
          buttonBg: "bg-orange-500/10",
          buttonHoverBg: "hover:bg-orange-500/20",
          buttonBorder: "border-orange-500/30",
          buttonText: "text-orange-400",
        };
      case "info":
        return {
          iconBg: "from-blue-500/20 to-blue-600/20",
          borderColor: "border-blue-500/30",
          iconColor: "text-blue-400",
          titleColor: "text-main-text",
          messageColor: "text-main-light-text",
          icon: "mingcute:information-fill",
          accentColor: "shadow-blue-500/10",
          buttonBg: "bg-blue-500/10",
          buttonHoverBg: "hover:bg-blue-500/20",
          buttonBorder: "border-blue-500/30",
          buttonText: "text-blue-400",
        };
      default:
        return {
          iconBg: "from-main-accent/20 to-main-highlight/20",
          borderColor: "border-main-accent/30",
          iconColor: "text-main-accent",
          titleColor: "text-main-text",
          messageColor: "text-main-light-text",
          icon: "mingcute:information-fill",
          accentColor: "shadow-main-accent/10",
          buttonBg: "bg-main-accent/10",
          buttonHoverBg: "hover:bg-main-accent/20",
          buttonBorder: "border-main-accent/30",
          buttonText: "text-main-accent",
        };
    }
  };

  const styles = getToastStyles();

  const handleViewTransaction = () => {
    if (txSignature) {
      window.open(`https://solscan.io/tx/${txSignature}`, "_blank");
    }
  };

  if (!visible) return null;

  return (
    <div
      className={`relative backdrop-blur-xl bg-[#161616]  border ${
        styles.borderColor
      } shadow-2xl ${
        styles.accentColor
      } rounded-sm lg:rounded-sm flex items-center gap-3 lg:gap-4 p-3 lg:p-4 transition-all duration-500 transform w-full
        ${
          visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-10 scale-95 pointer-events-none"
        }
        before:absolute before:inset-0 before:rounded-sm lg:before:rounded-sm before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:-z-10`}
    >
      {/* Icon Container */}
      <div
        className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br ${styles.iconBg} border border-white/[0.1] flex items-center justify-center flex-shrink-0`}
      >
        <Icon
          icon={styles.icon}
          className={styles.iconColor}
          width={16}
          height={16}
          style={{ width: 16, height: 16 }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div
          className={`font-tiktok text-xs lg:text-sm font-medium ${styles.titleColor} mb-0.5 lg:mb-1`}
        >
          {title}
        </div>
        <div
          className={`font-tiktok text-xs ${styles.messageColor} opacity-80 leading-relaxed`}
        >
          {message}
        </div>

        {/* Transaction Button - Only show if txSignature exists */}
        {txSignature && (
          <button
            onClick={handleViewTransaction}
            className={`mt-2 px-3 py-1 rounded-md text-xs font-tiktok ${styles.buttonText} ${styles.buttonBg} ${styles.buttonHoverBg} border ${styles.buttonBorder} transition-all duration-300 flex items-center gap-1 cursor-pointer`}
          >
            <Icon icon="ph:arrow-square-out" className="w-3 h-3" />
            View on Solscan
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="p-1.5 lg:p-2 rounded-lg   bg-[#161616]  hover:bg-white/[0.08] border border-white/[0.1] hover:border-red-400/30 transition-all duration-300 group flex-shrink-0 cursor-pointer"
      >
        <Icon
          icon="mingcute:close-line"
          width={14}
          height={14}
          style={{ width: 14, height: 14 }}
          className="text-main-light-text group-hover:text-red-400 transition-colors duration-300 lg:w-4 lg:h-4"
        />
      </button>
    </div>
  );
};

export default Toast;
