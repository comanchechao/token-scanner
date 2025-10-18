import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../../components/AuthProvider";
import TradingService from "../../../api/tradingService";
import { CopyTradeOrder } from "../../../types/trading";
import { useToastContext } from "../../../contexts/ToastContext";
import { useConfirmationModal } from "../../../contexts/ConfirmationModalContext";

interface CopyTradeOrdersProps {
  refreshTrigger?: number;
}

const CopyTradeOrders: React.FC<CopyTradeOrdersProps> = ({
  refreshTrigger,
}) => {
  const { user } = useAuth();
  const { showError, showSuccess } = useToastContext();
  const { showConfirmation, setLoading, hideConfirmation } =
    useConfirmationModal();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<CopyTradeOrder[]>([]);
  const [closingOrderId, setClosingOrderId] = useState<number | null>(null);
  const [pausingOrderId, setPausingOrderId] = useState<number | null>(null);
  const [resumingOrderId, setResumingOrderId] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
    isLastPage: true,
  });

  useEffect(() => {
    const fetchCopyTradeOrders = async () => {
      if (user?.id) {
        try {
          setIsLoading(true);
          const response = await TradingService.getCopyTradeOrders(
            user.solanaWalletAddress,
            pagination.pageNumber,
            pagination.pageSize
          );

          if (response.success && response.result) {
            const copyTradeOrders = response.result.copyTradeOrders || [];
            setOrders(copyTradeOrders);
            setPagination({
              pageNumber: response.result.pageNumber || 1,
              pageSize: response.result.pageSize || 10,
              totalPages: response.result.totalPages || 1,
              totalCount: response.result.totalCount || 0,
              isLastPage: response.result.isLastPage || true,
            });
          } else {
            setOrders([]);
          }
        } catch (error: any) {
          console.error("Error fetching copy trade orders:", error);
          showError(
            "Error",
            error.message || "Failed to fetch copy trade orders"
          );
          // Set empty orders on error
          setOrders([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCopyTradeOrders();
  }, [
    user,
    pagination.pageNumber,
    pagination.pageSize,
    showError,
    refreshTrigger,
  ]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, pageNumber: newPage }));
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getBuyMethodLabel = (order: CopyTradeOrder) => {
    if (!order) return "Unknown";

    if (order.buyPercentage !== null && order.buyPercentage !== undefined) {
      return `${order.buyPercentage}% of balance`;
    } else if (
      order.fixedBuyAmount !== null &&
      order.fixedBuyAmount !== undefined
    ) {
      return `${order.fixedBuyAmount} SOL`;
    } else {
      return "Fixed ratio";
    }
  };

  const handleCloseCopyTrade = async (copyTradeId: number) => {
    if (!user?.id) return;

    showConfirmation({
      title: "Close Copy Trade",
      message:
        "Are you sure you want to close this copy trade? This action cannot be undone.",
      actionType: "close",
      confirmText: "Close Trade",
      onConfirm: async () => {
        try {
          setLoading(true, "Closing copy trade...");
          setClosingOrderId(copyTradeId);

          const response = await TradingService.closeCopyTrade({
            copyTradeId: copyTradeId.toString(),
          });

          if (response.success) {
            showSuccess(
              "Success",
              response.message || "Copy trade closed successfully"
            );
            // Refresh the orders list
            const updatedResponse = await TradingService.getCopyTradeOrders(
              user.solanaWalletAddress,
              pagination.pageNumber,
              pagination.pageSize
            );

            if (updatedResponse.success && updatedResponse.result) {
              const copyTradeOrders =
                updatedResponse.result.copyTradeOrders || [];
              setOrders(copyTradeOrders);
              setPagination({
                pageNumber: updatedResponse.result.pageNumber || 1,
                pageSize: updatedResponse.result.pageSize || 10,
                totalPages: updatedResponse.result.totalPages || 1,
                totalCount: updatedResponse.result.totalCount || 0,
                isLastPage: updatedResponse.result.isLastPage || true,
              });
            }
            // Auto-close modal on success
            hideConfirmation();
          } else {
            showError(
              "Error",
              response.error?.toString() || "Failed to close copy trade"
            );
          }
        } catch (error: any) {
          console.error("Error closing copy trade:", error);
          showError("Error", error.message || "Failed to close copy trade");
        } finally {
          setClosingOrderId(null);
          setLoading(false);
        }
      },
    });
  };

  const handlePauseCopyTrade = async (copyTradeId: number) => {
    if (!user?.id) return;

    showConfirmation({
      title: "Pause Copy Trade",
      message:
        "Are you sure you want to pause this copy trade? You can resume it later.",
      actionType: "pause",
      confirmText: "Pause Trade",
      onConfirm: async () => {
        try {
          setLoading(true, "Pausing copy trade...");
          setPausingOrderId(copyTradeId);

          const response = await TradingService.pauseCopyTrade({
            copyTradeId: copyTradeId.toString(),
          });

          if (response.success) {
            showSuccess(
              "Success",
              response.message || "Copy trade paused successfully"
            );
            // Refresh the orders list
            const updatedResponse = await TradingService.getCopyTradeOrders(
              user.solanaWalletAddress,
              pagination.pageNumber,
              pagination.pageSize
            );

            if (updatedResponse.success && updatedResponse.result) {
              const copyTradeOrders =
                updatedResponse.result.copyTradeOrders || [];
              setOrders(copyTradeOrders);
              setPagination({
                pageNumber: updatedResponse.result.pageNumber || 1,
                pageSize: updatedResponse.result.pageSize || 10,
                totalPages: updatedResponse.result.totalPages || 1,
                totalCount: updatedResponse.result.totalCount || 0,
                isLastPage: updatedResponse.result.isLastPage || true,
              });
            }
            // Auto-close modal on success
            hideConfirmation();
          } else {
            showError(
              "Error",
              response.error?.toString() || "Failed to pause copy trade"
            );
          }
        } catch (error: any) {
          console.error("Error pausing copy trade:", error);
          showError("Error", error.message || "Failed to pause copy trade");
        } finally {
          setPausingOrderId(null);
          setLoading(false);
        }
      },
    });
  };

  const handleResumeCopyTrade = async (copyTradeId: number) => {
    if (!user?.id) return;

    showConfirmation({
      title: "Resume Copy Trade",
      message:
        "Are you sure you want to resume this copy trade? It will start copying trades again.",
      actionType: "resume",
      confirmText: "Resume Trade",
      onConfirm: async () => {
        try {
          setLoading(true, "Resuming");
          setResumingOrderId(copyTradeId);

          const response = await TradingService.resumeCopyTrade({
            copyTradeId: copyTradeId.toString(),
          });

          if (response.success) {
            showSuccess(
              "Success",
              response.message || "Copy trade resumed successfully"
            );
            // Refresh the orders list
            const updatedResponse = await TradingService.getCopyTradeOrders(
              user.solanaWalletAddress,
              pagination.pageNumber,
              pagination.pageSize
            );

            if (updatedResponse.success && updatedResponse.result) {
              const copyTradeOrders =
                updatedResponse.result.copyTradeOrders || [];
              setOrders(copyTradeOrders);
              setPagination({
                pageNumber: updatedResponse.result.pageNumber || 1,
                pageSize: updatedResponse.result.pageSize || 10,
                totalPages: updatedResponse.result.totalPages || 1,
                totalCount: updatedResponse.result.totalCount || 0,
                isLastPage: updatedResponse.result.isLastPage || true,
              });
            }
            // Auto-close modal on success
            hideConfirmation();
          } else {
            showError(
              "Error",
              response.error?.toString() || "Failed to resume copy trade"
            );
          }
        } catch (error: any) {
          console.error("Error resuming copy trade:", error);
          showError("Error", error.message || "Failed to resume copy trade");
        } finally {
          setResumingOrderId(null);
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Icon
            icon="eos-icons:loading"
            width={32}
            height={32}
            className="text-main-accent animate-spin"
          />
        </div>
      ) : orders.length === 0 ? (
        <div className="  bg-[#161616]  border border-white/[0.1] rounded-sm p-8 text-center">
          <Icon
            icon="mingcute:aiming-2-line"
            width={48}
            height={48}
            className="text-main-light-text/50 mx-auto mb-4"
          />
          <h3 className="font-tiktok text-xl text-main-text mb-2">
            No Copy Trades Yet
          </h3>
          <p className="font-tiktok text-sm text-main-light-text/70 max-w-md mx-auto">
            You haven't set up any copy trading rules yet. Create your first
            copy trade to automatically follow successful traders.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {Array.isArray(orders) &&
              orders.map((order) => (
                <div
                  key={order?.id || Math.random()}
                  className="  bg-[#161616]  border border-white/[0.1] hover:border-white/[0.2] rounded-sm p-4 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8   bg-white/[0.08] border border-white/[0.1] rounded-lg flex items-center justify-center">
                        <Icon
                          icon="mingcute:aiming-2-line"
                          width={18}
                          height={18}
                          className="text-main-accent"
                        />
                      </div>
                      <div>
                        <h3 className="font-tiktok text-sm text-main-text">
                          {order.tag || "Unnamed Copy Trade"}
                        </h3>
                        <p className="font-tiktok text-xs text-main-light-text/70">
                          Created {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="  bg-[#161616]  border border-white/[0.1] rounded-lg p-3">
                      <p className="font-tiktok text-xs text-main-light-text/70 mb-1">
                        Target Wallet
                      </p>
                      <div className="font-tiktok text-xs text-main-text truncate">
                        {order.targetWallet}
                      </div>
                    </div>
                    <div className="  bg-[#161616]  border border-white/[0.1] rounded-lg p-3">
                      <p className="font-tiktok text-xs text-main-light-text/70 mb-1">
                        Buy Method
                      </p>
                      <div className="font-tiktok text-xs text-main-text">
                        {getBuyMethodLabel(order)}
                      </div>
                    </div>
                    <div className="  bg-[#161616]  border border-white/[0.1] rounded-lg p-3">
                      <p className="font-tiktok text-xs text-main-light-text/70 mb-1">
                        Sell Method
                      </p>
                      <div className="font-tiktok text-xs text-main-text">
                        {order.copySells ? "Copy Sells" : "Duplicate Buys"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    {/* Pause/Resume Button - conditional based on active/status */}
                    {order.active === true ||
                    order.status?.toLowerCase() === "active" ? (
                      <button
                        onClick={() => handlePauseCopyTrade(order.id)}
                        disabled={pausingOrderId === order.id}
                        className="  cursor-pointer bg-[#161616]  border border-yellow-400/20 hover:bg-yellow-400/10 hover:border-yellow-400/30 rounded-lg p-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {pausingOrderId === order.id ? (
                          <Icon
                            icon="eos-icons:loading"
                            width={16}
                            height={16}
                            className="text-yellow-400 animate-spin"
                          />
                        ) : (
                          <Icon
                            icon="mingcute:pause-line"
                            width={16}
                            height={16}
                            className="text-yellow-400"
                          />
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleResumeCopyTrade(order.id)}
                        disabled={resumingOrderId === order.id}
                        className="  cursor-pointer bg-[#161616]  border border-green-400/20 hover:bg-green-400/10 hover:border-green-400/30 rounded-lg p-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resumingOrderId === order.id ? (
                          <Icon
                            icon="eos-icons:loading"
                            width={16}
                            height={16}
                            className="text-green-400 animate-spin"
                          />
                        ) : (
                          <Icon
                            icon="mingcute:play-line"
                            width={16}
                            height={16}
                            className="text-green-400"
                          />
                        )}
                      </button>
                    )}

                    {/* Close Button */}
                    <button
                      onClick={() => handleCloseCopyTrade(order.id)}
                      disabled={closingOrderId === order.id}
                      className="  cursor-pointer bg-[#161616]  border border-red-400/20 hover:bg-red-400/10 hover:border-red-400/30 rounded-lg p-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {closingOrderId === order.id ? (
                        <Icon
                          icon="eos-icons:loading"
                          width={16}
                          height={16}
                          className="text-red-400 animate-spin"
                        />
                      ) : (
                        <Icon
                          icon="mingcute:close-line"
                          width={16}
                          height={16}
                          className="text-red-400"
                        />
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(pagination.pageNumber - 1)}
                disabled={pagination.pageNumber === 1}
                className="  bg-[#161616]  border border-white/[0.1] hover:bg-white/[0.08] hover:border-white/[0.2] rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <Icon
                  icon="mingcute:left-line"
                  width={16}
                  height={16}
                  className="text-main-light-text"
                />
              </button>
              <div className="font-tiktok text-sm text-main-light-text">
                Page {pagination.pageNumber} of {pagination.totalPages}
              </div>
              <button
                onClick={() => handlePageChange(pagination.pageNumber + 1)}
                disabled={pagination.isLastPage}
                className="  bg-[#161616]  border border-white/[0.1] hover:bg-white/[0.08] hover:border-white/[0.2] rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <Icon
                  icon="mingcute:right-line"
                  width={16}
                  height={16}
                  className="text-main-light-text"
                />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CopyTradeOrders;
