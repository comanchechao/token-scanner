import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAuth } from "./AuthProvider";
import { User } from "../types/auth";
import { useWalletConnection } from "../hooks/useWalletConnection";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useAuthenticationModal } from "../contexts/AuthenticationModalContext";
import { useToastContext } from "../contexts/ToastContext";
import TradingService from "../api/tradingService";

const WalletAuth: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sniperAddress, setSniperAddress] = useState<string | null>(null);
  const [solBalance, setSolBalance] = useState<string | null>(null);
  const [isLoadingSniperAddress, setIsLoadingSniperAddress] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { publicKey } = useWallet();
  const {
    isAuthenticated,
    isLoading: authLoading,
    user,
    error: authError,
    logout,
    clearError,
  } = useAuth();

  const { connecting, connected, disconnectWallet } = useWalletConnection();
  const { setVisible } = useWalletModal();
  const { openModal } = useAuthenticationModal();
  const { showWarning } = useToastContext();

  useEffect(() => {
    const fetchSniperAddress = async () => {
      if (!isAuthenticated || !user || user.authMethod !== "wallet") {
        setSniperAddress(null);
        setSolBalance(null);
        return;
      }

      try {
        setIsLoadingSniperAddress(true);
        const balanceResponse = await TradingService.updateBalance();

        if (
          balanceResponse.success &&
          balanceResponse.result &&
          balanceResponse.result.length > 0
        ) {
          // Find the SOL token (SNIPER address)
          const solBalance = balanceResponse.result.find(
            (balance: any) => balance.token.symbol === "SOL"
          );

          if (solBalance) {
            console.log(
              "🎯 [Wallet Auth] Found SNIPER address:",
              solBalance.address
            );
            setSniperAddress(solBalance.address);
            setSolBalance(solBalance.confirmedBalance);
          } else {
            console.warn("⚠️ [Wallet Auth] No SOL balance found in response");
            setSniperAddress(null);
            setSolBalance(null);
          }
        }
      } catch (error) {
        console.error(
          "❌ [Wallet Auth] Failed to fetch SNIPER address:",
          error
        );
        setSniperAddress(null);
        setSolBalance(null);
      } finally {
        setIsLoadingSniperAddress(false);
      }
    };

    fetchSniperAddress();
  }, [isAuthenticated, user]);

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

  const handleDisconnectWallet = async () => {
    console.log("🔌 [Wallet Auth] Disconnecting wallet...");
    setIsDropdownOpen(false);
    try {
      await disconnectWallet();
      await logout(); // Also logout from auth
      setSniperAddress(null); // Clear SNIPER address on disconnect
      setSolBalance(null); // Clear SOL balance on disconnect
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  const handleConnectWallet = async () => {
    // If user is authenticated with Telegram, they need to sign out first
    if (isAuthenticated && user?.authMethod === "telegram") {
      showWarning(
        "Telegram Authentication Active",
        "Please sign out from Telegram authentication first, then you can authenticate with your wallet."
      );
      return;
    }

    console.log("🔍 [Wallet Auth] handleConnectWallet called:", {
      connected,
      isAuthenticated,
      hasPublicKey: !!publicKey,
    });

    if (!connected) {
      setVisible(true);
      return;
    }

    if (!isAuthenticated) {
      openModal();
    }
  };

  // Only show wallet auth if user is not authenticated via Telegram
  if (isAuthenticated && user && user.authMethod === "telegram") {
    return null;
  }

  // Component is always visible for wallet-only authentication

  if (authLoading) {
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
          className="w-5 h-5 text-yellow-400 animate-spin"
        />
        <span className="font-tiktok text-sm text-main-text">Checking...</span>
      </button>
    );
  }

  // If wallet is connected but not authenticated, don't show "Authenticate Wallet" button
  // The WalletConnectionManager will handle the connection display
  if (connected && !isAuthenticated) {
    return null;
  }

  if (isAuthenticated && user && user.authMethod === "wallet") {
    const walletUser = user as User;
    const displayAddress = sniperAddress || walletUser.walletAddress;

    return (
      <div className="relative" ref={dropdownRef}>
        {/* Logged In Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center cursor-pointer space-x-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-main-accent/30 px-4 py-2.5 rounded-xl transition-all duration-300 group"
          style={{
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
          aria-label="Wallet Auth"
        >
          <Icon
            icon="ph:wallet-fill"
            className="w-5 h-5 text-main-accent group-hover:text-main-accent transition-all duration-300"
          />
          <div className="flex   items-center justify-center gap-2">
            <span className="font-tiktok text-sm text-main-text group-hover:text-main-accent transition-colors duration-300">
              {isLoadingSniperAddress ? (
                "Loading..."
              ) : (
                <>
                  {displayAddress.substring(0, 4)}...
                  {displayAddress.substring(displayAddress.length - 4)}
                  {sniperAddress && (
                    <span className="ml-1 text-xs text-yellow-400"></span>
                  )}
                </>
              )}
            </span>
            {solBalance && (
              <span className="font-tiktok text-xs flex gap-1 text-main-accent">
                <Icon
                  icon="token-branded:solana"
                  className="  text-main-accent group-hover:text-main-accent transition-all duration-300"
                  width={16}
                  height={16}
                />
                {parseFloat(solBalance).toFixed(3)} SOL
              </span>
            )}
          </div>
          <Icon
            icon={isDropdownOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
            className={`w-4 h-4 text-main-light-text group-hover:text-main-accent transition-all duration-300 ${
              isDropdownOpen ? "rotate-180 text-main-accent" : ""
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
              {/* Error Display */}
              {authError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="font-tiktok text-sm text-red-400 mb-2">
                    {authError}
                  </p>
                  <button
                    onClick={clearError}
                    className="font-tiktok text-xs text-red-300 hover:text-red-200 underline transition-colors duration-300"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-main-accent/30 rounded-xl transition-all duration-300 group"
                >
                  <Icon
                    icon="material-symbols:person"
                    className="w-5 h-5 text-main-light-text group-hover:text-main-accent transition-colors duration-300"
                  />
                  <span className="font-tiktok text-sm text-main-light-text group-hover:text-main-accent transition-colors duration-300">
                    Profile & Holdings
                  </span>
                  <Icon
                    icon="material-symbols:arrow-forward-ios"
                    className="w-4 h-4 text-main-light-text group-hover:text-main-accent transition-colors duration-300 ml-auto"
                  />
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleDisconnectWallet}
                  className="flex items-center w-full cursor-pointer gap-3 px-4 py-3 bg-red-400/[0.1] hover:bg-red-600/[0.06] border border-red-600/[0.3] hover:border-main-accent/30 rounded-xl transition-all duration-300 group"
                >
                  <Icon
                    icon="material-symbols:logout"
                    className="w-5 h-5 text-main-light-text group-hover:text-red-400 transition-colors duration-300"
                  />
                  <span className="font-tiktok text-sm text-main-light-text group-hover:text-red-400 transition-colors duration-300">
                    Sign Out
                  </span>
                  <Icon
                    icon="material-symbols:arrow-forward-ios"
                    className="w-4 h-4 text-main-light-text group-hover:text-red-400 transition-colors duration-300 ml-auto"
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Unauthenticated state - only show if wallet is not connected
  if (!connected) {
    return (
      <button
        onClick={handleConnectWallet}
        className="flex items-center cursor-pointer space-x-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-yellow-400/30 px-4 py-2.5 rounded-xl transition-all duration-300 group"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <Icon
          icon="ph:wallet-fill"
          className="w-5 h-5 text-main-accent group-hover:text-main-accent transition-all duration-300"
        />
        <span className="font-tiktok text-sm text-main-text group-hover:text-main-accent transition-colors duration-300">
          {connecting ? "Connecting..." : "Connect Wallet"}
        </span>
      </button>
    );
  }

  // If wallet is connected but not authenticated, don't show anything
  return null;
};

export default WalletAuth;
