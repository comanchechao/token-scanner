import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import BackButton from "../../components/BackButton";
import Holdings from "./components/Holdings";
import Navbar from "../../layouts/Navbar";
import { useAuth } from "../../components/AuthProvider";
import TradingService from "../../api/tradingService";
import CopyTradeOrders from "./components/CopyTradeOrders";
import { useToastContext } from "../../contexts/ToastContext";
import CopyTradeModal from "../../components/CopyTradeModal";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { showError, showSuccess } = useToastContext();
  const [isClosingAll, setIsClosingAll] = useState(false);
  const [isPausingAll, setIsPausingAll] = useState(false);
  const [isResumingAll, setIsResumingAll] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [copyTradeModalOpen, setCopyTradeModalOpen] = useState(false);

  useEffect(() => {
    const fetchCopyTradeOrders = async () => {
      if (user?.id) {
        try {
          console.log("Fetching copy trade orders for user:", user.id);
          const response = await TradingService.getCopyTradeOrders(
            user.solanaWalletAddress,
            1,
            10
          );
          console.log("Copy trade orders response:", response);
        } catch (error) {
          console.error("Error fetching copy trade orders:", error);
        }
      }
    };

    fetchCopyTradeOrders();
  }, [user]);

  const handleCloseAllCopyTrades = async () => {
    if (!user?.id) {
      showError("Error", "User not authenticated");
      return;
    }

    try {
      setIsClosingAll(true);

      const response = await TradingService.closeAllCopyTrades({});

      if (response.success) {
        showSuccess(
          "Success",
          response.message || "All copy trades closed successfully"
        );
        // Trigger refresh of the CopyTradeOrders component
        setRefreshTrigger((prev) => prev + 1);
      } else {
        showError(
          "Error",
          response.error?.toString() || "Failed to close all copy trades"
        );
      }
    } catch (error: any) {
      console.error("Error closing all copy trades:", error);
      showError("Error", error.message || "Failed to close all copy trades");
    } finally {
      setIsClosingAll(false);
    }
  };

  const handlePauseAllCopyTrades = async () => {
    if (!user?.id) {
      showError("Error", "User not authenticated");
      return;
    }

    try {
      setIsPausingAll(true);

      const response = await TradingService.pauseAllCopyTrades({});

      if (response.success) {
        showSuccess(
          "Success",
          response.message || "All copy trades paused successfully"
        );
        // Trigger refresh of the CopyTradeOrders component
        setRefreshTrigger((prev) => prev + 1);
      } else {
        showError(
          "Error",
          response.error?.toString() || "Failed to pause all copy trades"
        );
      }
    } catch (error: any) {
      console.error("Error pausing all copy trades:", error);
      showError("Error", error.message || "Failed to pause all copy trades");
    } finally {
      setIsPausingAll(false);
    }
  };

  const handleResumeAllCopyTrades = async () => {
    if (!user?.id) {
      showError("Error", "User not authenticated");
      return;
    }

    try {
      setIsResumingAll(true);

      const response = await TradingService.resumeAllCopyTrades({});

      if (response.success) {
        showSuccess(
          "Success",
          response.message || "All copy trades resumed successfully"
        );
        // Trigger refresh of the CopyTradeOrders component
        setRefreshTrigger((prev) => prev + 1);
      } else {
        showError(
          "Error",
          response.error?.toString() || "Failed to resume all copy trades"
        );
      }
    } catch (error: any) {
      console.error("Error resuming all copy trades:", error);
      showError("Error", error.message || "Failed to resume all copy trades");
    } finally {
      setIsResumingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-main-bg relative overflow-hidden">
      <Navbar />
      {/* Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-main-light-text) 0.5px, transparent 0.5px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-light-bg opacity-20 rounded-full filter blur-2xl"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-main-accent opacity-10 rounded-full filter blur-xl"></div>
      </div>

      <div className="relative z-10 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <BackButton className="mb-6" />
          </div>

          {/* Holdings Section */}
          <div className="mb-8">
            <div className="  bg-[#161616]  border border-white/[0.1] rounded-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-main-accent to-main-highlight rounded-sm flex items-center justify-center">
                  <Icon
                    icon="material-symbols:account-balance-wallet"
                    className="text-main-text"
                    width={55}
                    height={55}
                  />
                </div>
                <div>
                  <h2 className="font-algance text-2xl text-main-text">
                    Holdings
                  </h2>
                  <p className="font-tiktok text-sm text-main-light-text">
                    Your current positions and portfolio overview
                  </p>
                </div>
              </div>
              <Holdings />
            </div>
          </div>

          {/* Copy Trade Orders Section */}
          <div className="mb-8">
            <div className="  bg-[#161616]  border border-white/[0.1] rounded-sm p-6">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-main-accent to-main-highlight rounded-sm flex items-center justify-center">
                    <Icon
                      icon="mingcute:aiming-2-line"
                      className="text-main-text"
                      width={30}
                      height={30}
                    />
                  </div>
                  <div>
                    <h2 className="font-algance text-2xl text-main-text">
                      Copy Trades
                    </h2>
                    <p className="font-tiktok text-sm text-main-light-text">
                      Your active copy trading rules
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Pause All Button */}
                  <button
                    onClick={handlePauseAllCopyTrades}
                    disabled={isPausingAll}
                    className="  bg-white/[0.05] border border-yellow-400/40 hover:border-yellow-400/60 rounded-sm px-4 py-2 flex items-center gap-2 hover:bg-yellow-400/10 transition-all duration-300 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPausingAll ? (
                      <Icon
                        icon="eos-icons:loading"
                        width={18}
                        height={18}
                        className="text-yellow-400 animate-spin"
                      />
                    ) : (
                      <Icon
                        icon="mingcute:pause-line"
                        width={18}
                        height={18}
                        className="text-yellow-400 group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                    <span className="font-tiktok text-sm text-yellow-400">
                      {isPausingAll ? "Pausing All..." : "Pause All"}
                    </span>
                  </button>

                  {/* Resume All Button */}
                  <button
                    onClick={handleResumeAllCopyTrades}
                    disabled={isResumingAll}
                    className="  bg-white/[0.05] border border-green-400/40 hover:border-green-400/60 rounded-sm px-4 py-2 flex items-center gap-2 hover:bg-green-400/10 transition-all duration-300 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResumingAll ? (
                      <Icon
                        icon="eos-icons:loading"
                        width={18}
                        height={18}
                        className="text-green-400 animate-spin"
                      />
                    ) : (
                      <Icon
                        icon="mingcute:play-line"
                        width={18}
                        height={18}
                        className="text-green-400 group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                    <span className="font-tiktok text-sm text-green-400">
                      {isResumingAll ? "Resuming All..." : "Resume All"}
                    </span>
                  </button>

                  {/* Close All Button */}
                  <button
                    onClick={handleCloseAllCopyTrades}
                    disabled={isClosingAll}
                    className="  bg-white/[0.05] border border-red-400/40 hover:border-red-400/60 rounded-sm px-4 py-2 flex items-center gap-2 hover:bg-red-400/10 transition-all duration-300 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isClosingAll ? (
                      <Icon
                        icon="eos-icons:loading"
                        width={18}
                        height={18}
                        className="text-red-400 animate-spin"
                      />
                    ) : (
                      <Icon
                        icon="mingcute:close-line"
                        width={18}
                        height={18}
                        className="text-red-400 group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                    <span className="font-tiktok text-sm text-red-400">
                      {isClosingAll ? "Closing All..." : "Close All"}
                    </span>
                  </button>

                  {/* New Copy Trade Button */}
                  <button
                    onClick={() => setCopyTradeModalOpen(true)}
                    className="  bg-white/[0.05] border border-[var(--color-main-accent)]/40 hover:border-[var(--color-main-accent)]/60 rounded-sm px-4 py-2 flex items-center gap-2 hover:bg-white/[0.08] transition-all duration-300 group cursor-pointer"
                  >
                    <Icon
                      icon="mingcute:add-line"
                      width={18}
                      height={18}
                      className="text-main-accent group-hover:scale-110 transition-transform duration-300"
                    />
                    <span className="font-tiktok text-sm text-main-accent">
                      New Copy Trade
                    </span>
                  </button>
                </div>
              </div>
              <CopyTradeOrders refreshTrigger={refreshTrigger} />

              {/* Copy Trade Modal */}
              <CopyTradeModal
                open={copyTradeModalOpen}
                onClose={() => {
                  setCopyTradeModalOpen(false);
                  setRefreshTrigger((prev) => prev + 1);
                }}
                walletData={{
                  walletAddress: "", // Will be filled by user in the modal
                  username: user?.username || "User",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
