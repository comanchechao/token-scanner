import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useWalletConnection } from "../hooks/useWalletConnection";

const TelegramAuth: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, isLoading, user, error, logout, clearError } =
    useAuth();
  const { connected, walletInfo } = useWalletConnection();

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

  const handleLogout = async () => {
    console.log("🚪 [Telegram Auth] Logging out...");
    setIsDropdownOpen(false);
    await logout();
  };

  const handleTelegramLogin = () => {
    window.open("https://t.me/cherrysniperbot?start=login_cherry", "_blank");
  };

  if (isLoading) {
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
          className="w-5 h-5 text-blue-400 animate-spin"
        />
        <span className="font-tiktok text-sm text-main-text">Checking...</span>
      </button>
    );
  }

  // If not authenticated, show login button
  if (!isAuthenticated || !user || user.authMethod !== "telegram") {
    return (
      <button
        onClick={handleTelegramLogin}
        className="flex items-center cursor-pointer space-x-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-blue-400/30 px-4 py-2.5 rounded-xl transition-all duration-300 group"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
        aria-label="Login with Telegram"
      >
        <Icon
          icon="logos:telegram"
          className="w-5 h-5 text-blue-500 group-hover:text-blue-400 transition-all duration-300"
        />
        <span className="font-tiktok text-sm text-main-text group-hover:text-blue-400 transition-colors duration-300">
          Login with Telegram
        </span>
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Logged In Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center cursor-pointer space-x-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-blue-400/30 px-4 py-2.5 rounded-xl transition-all duration-300 group"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
        aria-label="Telegram Auth"
      >
        <Icon
          icon="logos:telegram"
          className="w-5 h-5 text-blue-500 group-hover:text-blue-400 transition-all duration-300"
        />
        <div className="flex items-center justify-center gap-2">
          <span className="font-tiktok text-sm text-main-text group-hover:text-blue-400 transition-colors duration-300">
            {user.first_name || user.username || "Telegram User"}
          </span>
          <span className="ml-1 text-xs text-blue-400">TG</span>
        </div>
        <Icon
          icon={isDropdownOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
          className={`w-4 h-4 text-main-light-text group-hover:text-blue-400 transition-all duration-300 ${
            isDropdownOpen ? "rotate-180 text-blue-400" : ""
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
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="font-tiktok text-sm text-red-400 mb-2">{error}</p>
                <button
                  onClick={clearError}
                  className="font-tiktok text-xs text-red-300 hover:text-red-200 underline transition-colors duration-300"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* User Info */}
            <div className="p-3 bg-white/[0.03] border border-white/[0.1] rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                {user.photo_url ? (
                  <img
                    src={user.photo_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Icon
                      icon="logos:telegram"
                      className="w-5 h-5 text-blue-400"
                    />
                  </div>
                )}
                <div>
                  <p className="font-tiktok text-sm text-main-text font-medium">
                    {user.first_name} {user.last_name || ""}
                  </p>
                  <p className="font-tiktok text-xs text-main-light-text">
                    Telegram ID: {user.telegramId}
                  </p>
                </div>
              </div>
            </div>

            {/* Wallet Connection Status */}
            <div className="p-3 bg-white/[0.03] border border-white/[0.1] rounded-xl">
              <div className="flex items-center gap-2">
                <Icon
                  icon={
                    connected
                      ? "mingcute:check-circle-fill"
                      : "mingcute:information-fill"
                  }
                  className={`w-5 h-5 ${
                    connected ? "text-green-600" : "text-blue-500"
                  }`}
                />
                <span className="font-tiktok text-sm text-main-light-text">
                  {connected
                    ? `Wallet connected: ${walletInfo?.formattedAddress}`
                    : "No wallet connected"}
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2">
              <Link
                to="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-blue-400/30 rounded-xl transition-all duration-300 group"
              >
                <Icon
                  icon="material-symbols:person"
                  className="w-5 h-5 text-main-light-text group-hover:text-blue-400 transition-colors duration-300"
                />
                <span className="font-tiktok text-sm text-main-light-text group-hover:text-blue-400 transition-colors duration-300">
                  Profile & Settings
                </span>
                <Icon
                  icon="material-symbols:arrow-forward-ios"
                  className="w-4 h-4 text-main-light-text group-hover:text-blue-400 transition-colors duration-300 ml-auto"
                />
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleLogout}
                className="flex items-center w-full cursor-pointer gap-3 px-4 py-3 bg-red-400/[0.1] hover:bg-red-600/[0.06] border border-red-600/[0.3] hover:border-red-400/30 rounded-xl transition-all duration-300 group"
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
};

export default TelegramAuth;
