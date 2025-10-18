import React from "react";
import { Icon } from "@iconify/react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWalletConnection } from "../hooks/useWalletConnection";
import { useAuthenticationModal } from "../contexts/AuthenticationModalContext";
import { useAuth } from "./AuthProvider";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  hasPendingAction?: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onClose,
  hasPendingAction = false,
}) => {
  const { connected, connecting } = useWalletConnection();
  const { setVisible } = useWalletModal();
  const { openModal } = useAuthenticationModal();
  const { isAuthenticated } = useAuth();

  const handleLoginWithWallet = () => {
    if (!connected) {
      // Close the login prompt to avoid stacking over the wallet selector
      onClose();
      setVisible(true);
      return;
    }

    if (!isAuthenticated) {
      // Close the login prompt before opening auth modal to prevent overlap
      onClose();
      openModal();
    }
  };
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
        className={`relative w-full max-w-md backdrop-blur-xl bg-[#161616]  border border-white/[0.1] shadow-2xl rounded-sm flex flex-col transition-all duration-300 transform 
          ${open ? "modal-content-show" : "opacity-0 scale-95 translate-y-8"}
          before:absolute before:inset-0 before:rounded-sm before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:-z-10`}
        style={{ minWidth: 400, maxHeight: "85vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.1]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8   bg-white/[0.08] border border-white/[0.1] rounded-lg flex items-center justify-center">
              <Icon
                icon="solar:user-broken"
                width={18}
                height={18}
                className="text-main-accent"
              />
            </div>
            <span className="font-algance text-xl text-main-text">
              Authentication Required
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg   bg-[#161616]  hover:bg-white/[0.08] border border-white/[0.1] hover:border-[var(--color-red-400)]/30 transition-all duration-300 group cursor-pointer"
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
              <div className="w-16 h-16 rounded-full bg-[#161616]  border border-white/[0.1] flex items-center justify-center">
                <Icon
                  icon="mdi:wallet"
                  width={32}
                  height={32}
                  className="text-yellow-600"
                />
              </div>
            </div>

            <h3 className="font-algance text-xl text-main-text">
              Login Required
            </h3>

            <p className="font-tiktok text-sm text-main-light-text/70">
              {hasPendingAction
                ? "You need to be authenticated to complete your action. Please login with Wallet to continue."
                : "You need to be authenticated to perform this action. Please login with Wallet to continue."}
            </p>

            {hasPendingAction && (
              <div className="mt-2 px-4 py-2 rounded-lg bg-main-accent/10 border border-main-accent/20">
                <p className="font-tiktok text-xs text-main-accent/90">
                  Your action will continue automatically after login.
                </p>
              </div>
            )}
          </div>

          {/* Login with Wallet Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleLoginWithWallet}
              disabled={connecting}
              className={`flex items-center gap-2 px-5 py-3 rounded-sm transition-all duration-300 border cursor-pointer
                ${
                  connecting
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-white/[0.06] hover:border-yellow-400/30"
                }
                bg-[#161616]  border-white/[0.1]`}
            >
              {connecting ? (
                <>
                  <Icon
                    icon="eos-icons:loading"
                    className="w-5 h-5 text-main-accent animate-spin"
                  />
                  <span className="font-tiktok text-sm text-main-text">
                    Connecting...
                  </span>
                </>
              ) : (
                <>
                  <Icon
                    icon="ph:wallet-fill"
                    className="w-5 h-5 text-yellow-400"
                  />
                  <span className="font-tiktok text-sm text-main-text">
                    Login with Wallet
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Note */}
          <div className="text-center pt-4">
            <p className="font-tiktok text-xs text-main-light-text/50">
              You will be redirected to Solana for secure authentication.
              <br />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
