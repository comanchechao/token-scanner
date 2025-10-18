import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useWalletConnection } from "../hooks/useWalletConnection";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

interface WalletButtonProps {
  variant?: "navbar" | "standalone";
}

const WalletButton: React.FC<WalletButtonProps> = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { connected, connecting, walletInfo, disconnectWallet } =
    useWalletConnection();
  const { setVisible } = useWalletModal();

  const handleConnect = () => {
    setVisible(true);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsDropdownOpen(false);
  };

  const baseButtonClasses = `
    relative overflow-hidden   border rounded-sm px-4 py-2.5 
    flex items-center justify-center gap-2 transition-all duration-300 
    font-tiktok text-sm hover:shadow-lg hover:shadow-main-accent/20
    before:absolute before:inset-0 before:bg-gradient-to-r 
    before:from-main-accent/0 before:via-main-accent/5 before:to-main-accent/0 
    before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
  `;

  if (connecting) {
    return (
      <div
        className={`${baseButtonClasses} bg-white/[0.05] border-white/[0.1] cursor-not-allowed`}
      >
        <Icon
          icon="eos-icons:loading"
          className="w-4 h-4 text-main-accent animate-spin"
        />
        <span className="text-main-light-text relative z-10">
          Connecting...
        </span>
      </div>
    );
  }

  if (connected && walletInfo) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`${baseButtonClasses} bg-main-accent/15 hover:bg-main-accent/20 border-[var(--color-main-accent)]/30 hover:border-main-accent/50 cursor-pointer`}
        >
          <Icon
            icon="material-symbols:account-balance-wallet"
            className="w-4 h-4 text-main-accent"
          />
          <span className="text-main-accent font-medium relative z-10">
            {walletInfo.formattedAddress}
          </span>
          <Icon
            icon={isDropdownOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
            className="w-4 h-4 text-main-accent relative z-10"
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-64   bg-white/[0.05] border border-white/[0.1] rounded-sm p-4 shadow-2xl shadow-main-accent/10 z-50">
            <div className="space-y-3">
              {/* Wallet Info */}
              <div className="flex items-center gap-3 p-3 bg-[#161616]  rounded-lg border border-white/[0.05]">
                <div className="w-8 h-8 rounded-full bg-main-accent/20 flex items-center justify-center">
                  <Icon
                    icon="material-symbols:account-balance-wallet"
                    className="w-4 h-4 text-main-accent"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-tiktok text-sm font-medium text-main-text">
                    Connected Wallet
                  </p>
                </div>
              </div>

              {/* Copy Address */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(walletInfo.address);
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 p-2 text-left hover:bg-[#161616]  rounded-lg transition-all duration-200 cursor-pointer"
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
                onClick={handleDisconnect}
                className="w-full flex items-center gap-2 p-2 text-left hover:bg-red-500/10 rounded-lg transition-all duration-200 text-red-400 cursor-pointer"
              >
                <Icon icon="mdi:logout" className="w-4 h-4" />
                <span className="font-tiktok text-sm">Disconnect</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className={`${baseButtonClasses} bg-white/[0.05] hover:bg-white/[0.08] border-white/[0.1] hover:border-main-accent/30 cursor-pointer`}
    >
      <Icon
        icon="material-symbols:account-balance-wallet"
        className="w-4 h-4 relative z-10"
      />
      <span className="text-main-text hover:text-main-accent transition-colors duration-300 relative z-10">
        Connect Wallet
      </span>
    </button>
  );
};

export default WalletButton;
