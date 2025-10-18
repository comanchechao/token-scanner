import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useWalletConnection } from "../hooks/useWalletConnection";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useAuth } from "./AuthProvider";

const WalletConnectionManager: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { connected, connecting, disconnectWallet, walletInfo } =
    useWalletConnection();
  const { setVisible } = useWalletModal();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleConnectWallet = () => {
    setVisible(true);
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  // Show connection status when wallet is connected
  if (connected && walletInfo) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center cursor-pointer space-x-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-green-400/30 px-4 py-2.5 rounded-xl transition-all duration-300 group"
          style={{
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
          aria-label="Wallet Connection"
        >
          <Icon
            icon="ph:wallet-fill"
            className="w-5 h-5 text-main-accent group-hover:text-main-accent transition-all duration-300"
          />
          <div className="flex items-center justify-center gap-2">
            <span className="font-tiktok text-sm text-main-text group-hover:text-green-400 transition-colors duration-300">
              {walletInfo.formattedAddress}
            </span>
            {isAuthenticated && user?.authMethod === "wallet" && (
              <span className="ml-1 text-xs text-yellow-400">AUTH</span>
            )}
          </div>
          <Icon
            icon={isDropdownOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
            className={`w-4 h-4 text-main-light-text group-hover:text-green-400 transition-all duration-300 ${
              isDropdownOpen ? "rotate-180 text-green-400" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            className="absolute top-full right-0 mt-2 w-64 bg-[var(--color-main-bg)]/95 border border-white/[0.15] rounded-2xl shadow-2xl shadow-[var(--color-main-accent)]/10 p-2 z-50"
            style={{
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              background: "rgba(0, 8, 20, 0.99)",
            }}
          >
            {/* Overlay for additional blur effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent opacity-100 transition-opacity duration-500 -z-10"></div>

            {/* Content Section */}
            <div className="space-y-1">
              {/* Copy Address */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(walletInfo.address);
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 p-2 text-left hover:bg-white/[0.03] rounded-lg transition-all duration-200 cursor-pointer"
              >
                <Icon
                  icon="mdi:content-copy"
                  className="w-4 h-4 text-main-light-text/60"
                />
                <span className="font-tiktok text-sm text-main-light-text">
                  Copy Address
                </span>
              </button>

              {/* Divider */}
              <div className="border-t border-white/[0.08]"></div>

              {/* Disconnect */}
              <button
                onClick={handleDisconnectWallet}
                className="w-full flex items-center gap-2 p-2 text-left hover:bg-red-500/10 rounded-lg transition-all duration-200 text-red-400 cursor-pointer"
              >
                <Icon icon="mdi:logout" className="w-4 h-4" />
                <span className="font-tiktok text-sm">Disconnect Wallet</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show connect button only when wallet is not connected AND user is not authenticated with wallet
  if (!connected && !(isAuthenticated && user?.authMethod === "wallet")) {
    // Show connecting state
    if (connecting) {
      return (
        <button
          disabled
          className="flex items-center cursor-not-allowed space-x-2 bg-white/[0.03] border border-white/[0.1] px-4 py-2.5 rounded-xl transition-all duration-300 opacity-50"
          style={{
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <Icon
            icon="eos-icons:loading"
            className="w-5 h-5 text-green-400 animate-spin"
          />
          <span className="font-tiktok text-sm text-main-text">
            Connecting...
          </span>
        </button>
      );
    }

    // Show connect button
    return (
      <button
        onClick={handleConnectWallet}
        className="flex items-center cursor-pointer space-x-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-green-400/30 px-4 py-2.5 rounded-xl transition-all duration-300 group"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <Icon
          icon="ph:wallet-fill"
          className="w-5 h-5 text-green-400 group-hover:text-main-accent transition-all duration-300"
        />
        <span className="font-tiktok text-sm text-main-text group-hover:text-main-accent transition-colors duration-300">
          Connect Wallet
        </span>
      </button>
    );
  }

  // If wallet is authenticated, don't show anything (WalletAuth component will handle the display)
  return null;
};

export default WalletConnectionManager;
