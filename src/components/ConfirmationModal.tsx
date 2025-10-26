import React from "react";
import { Icon } from "@iconify/react";

export type ConfirmationActionType =
  | "close"
  | "pause"
  | "resume"
  | "delete"
  | "custom";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  actionType?: ConfirmationActionType;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  loadingText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  actionType = "custom",
  confirmText,
  cancelText = "Cancel",
  isLoading = false,
  loadingText = "Processing...",
}) => {
  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes modalSlideIn {
        from { opacity: 0; transform: scale(0.95) translateY(10px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes modalOverlayShow {
        from { opacity: 0; backdrop-filter: blur(0); }
        to { opacity: 1; backdrop-filter: blur(20px); }
      }
      .modal-content-show {
        animation: modalSlideIn 0.3s ease-out forwards;
      }
      .modal-overlay-show {
        animation: modalOverlayShow 0.3s ease-out forwards;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const getActionConfig = () => {
    switch (actionType) {
      case "close":
        return {
          icon: "mingcute:close-line",
          iconColor: "text-red-400",
          bgColor: "bg-red-400/10",
          borderColor: "border-red-400/20",
          confirmText: confirmText || "Close",
          confirmBgColor: "bg-red-400/10",
          confirmBorderColor: "border-red-400/20",
          confirmHoverBgColor: "hover:bg-red-400/20",
          confirmHoverBorderColor: "hover:border-red-400/40",
          confirmTextColor: "text-red-400",
        };
      case "pause":
        return {
          icon: "mingcute:pause-line",
          iconColor: "text-yellow-400",
          bgColor: "bg-yellow-400/10",
          borderColor: "border-yellow-400/20",
          confirmText: confirmText || "Pause",
          confirmBgColor: "bg-yellow-400/10",
          confirmBorderColor: "border-yellow-400/20",
          confirmHoverBgColor: "hover:bg-yellow-400/20",
          confirmHoverBorderColor: "hover:border-yellow-400/40",
          confirmTextColor: "text-yellow-400",
        };
      case "resume":
        return {
          icon: "mingcute:play-line",
          iconColor: "text-green-400",
          bgColor: "bg-green-400/10",
          borderColor: "border-green-400/20",
          confirmText: confirmText || "Resume",
          confirmBgColor: "bg-green-400/10",
          confirmBorderColor: "border-green-400/20",
          confirmHoverBgColor: "hover:bg-green-400/20",
          confirmHoverBorderColor: "hover:border-green-400/40",
          confirmTextColor: "text-green-400",
        };
      case "delete":
        return {
          icon: "mingcute:delete-line",
          iconColor: "text-red-400",
          bgColor: "bg-red-400/10",
          borderColor: "border-red-400/20",
          confirmText: confirmText || "Delete",
          confirmBgColor: "bg-red-400/10",
          confirmBorderColor: "border-red-400/20",
          confirmHoverBgColor: "hover:bg-red-400/20",
          confirmHoverBorderColor: "hover:border-red-400/40",
          confirmTextColor: "text-red-400",
        };
      default:
        return {
          icon: "mingcute:warning-line",
          iconColor: "text-main-accent",
          bgColor: "bg-main-accent/10",
          borderColor: "border-main-accent/20",
          confirmText: confirmText || "Confirm",
          confirmBgColor: "bg-main-accent/10",
          confirmBorderColor: "border-main-accent/20",
          confirmHoverBgColor: "hover:bg-main-accent/20",
          confirmHoverBorderColor: "hover:border-main-accent/40",
          confirmTextColor: "text-main-accent",
        };
    }
  };

  const actionConfig = getActionConfig();

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/30 transition-all duration-300 ${
          open ? "modal-overlay-show" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md backdrop-blur-xl bg-surface  border border-subtle shadow-2xl rounded-sm flex flex-col transition-all duration-300 transform 
          ${open ? "modal-content-show" : "opacity-0 scale-95 translate-y-8"}
          before:absolute before:inset-0 before:rounded-sm before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:-z-10`}
        style={{ minWidth: 400, maxHeight: "85vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-subtle">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8   ${actionConfig.bgColor} ${actionConfig.borderColor} rounded-lg flex items-center justify-center`}
            >
              <Icon
                icon={actionConfig.icon}
                width={18}
                height={18}
                className={actionConfig.iconColor}
              />
            </div>
            <span className="font-algance text-xl text-main-text">{title}</span>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-lg   bg-surface  hover:bg-main-accent/5 border border-subtle hover:border-[var(--color-red-400)]/30 transition-all duration-300 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon
              icon="iconamoon:close-fill"
              width={20}
              height={20}
              className="text-main-light-text group-hover:text-red-400 transition-colors duration-300"
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div
                className={`w-16 h-16 rounded-full ${actionConfig.bgColor} ${actionConfig.borderColor} flex items-center justify-center`}
              >
                <Icon
                  icon={actionConfig.icon}
                  width={32}
                  height={32}
                  className={actionConfig.iconColor}
                />
              </div>
            </div>

            <h3 className="font-algance text-lg text-main-text">{title}</h3>

            <p className="font-tiktok text-sm text-main-light-text/70">
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 cursor-pointer   bg-surface  hover:bg-main-accent/5 border border-subtle hover:border-subtle px-4 py-3 rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="font-tiktok text-sm text-main-light-text group-hover:text-main-text transition-colors duration-300">
                {cancelText}
              </span>
            </button>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 cursor-pointer   ${actionConfig.confirmBgColor} ${actionConfig.confirmBorderColor} ${actionConfig.confirmHoverBgColor} ${actionConfig.confirmHoverBorderColor} px-4 py-3 rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <Icon
                    icon="eos-icons:loading"
                    width={16}
                    height={16}
                    className={`${actionConfig.confirmTextColor} animate-spin`}
                  />
                  <span
                    className={`font-tiktok text-sm ${actionConfig.confirmTextColor}`}
                  >
                    {loadingText}
                  </span>
                </>
              ) : (
                <span
                  className={`font-tiktok text-sm ${actionConfig.confirmTextColor}`}
                >
                  {actionConfig.confirmText}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
