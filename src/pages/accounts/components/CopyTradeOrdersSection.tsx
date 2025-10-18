import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../../components/AuthProvider";
import TradingService from "../../../api/tradingService";
import { CopyTradeOrder } from "../../../types/trading";
import { useToastContext } from "../../../contexts/ToastContext";
import { useConfirmationModal } from "../../../contexts/ConfirmationModalContext";

interface CopyTradeOrdersSectionProps {
  refreshTrigger?: number;
}

const CopyTradeOrdersSection: React.FC<CopyTradeOrdersSectionProps> = ({
  refreshTrigger,
}) => {
  const { user } = useAuth();
  const { showError, showSuccess } = useToastContext();
  const { showConfirmation, setLoading } = useConfirmationModal();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<CopyTradeOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [closingOrderId, setClosingOrderId] = useState<number | null>(null);
  const [pausingOrderId, setPausingOrderId] = useState<number | null>(null);
  const [resumingOrderId, setResumingOrderId] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 5,
    totalPages: 1,
    totalCount: 0,
    isLastPage: true,
  });

  useEffect(() => {
    const fetchCopyTradeOrders = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        setError(null);

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
            pageSize: response.result.pageSize || 5,
            totalPages: response.result.totalPages || 1,
            totalCount: response.result.totalCount || 0,
            isLastPage: response.result.isLastPage || true,
          });
        } else {
          setOrders([]);
          setError("Failed to fetch copy trade orders");
        }
      } catch (error: any) {
        console.error("Error fetching copy trade orders:", error);
        setError(error.message || "Failed to fetch copy trade orders");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCopyTradeOrders();
  }, [user?.id, pagination.pageNumber, pagination.pageSize, refreshTrigger]);

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

  const getStatusColor = (status: string) => {
    if (!status) return "text-main-light-text";

    switch (status.toLowerCase()) {
      case "active":
        return "text-green-400";
      case "paused":
        return "text-yellow-400";
      case "stopped":
        return "text-red-400";
      default:
        return "text-main-light-text";
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
    if (!user?.id) {
      showError("Error", "User not authenticated");
      return;
    }

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
            // Close the confirmation modal
            setLoading(false);

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
                pageSize: updatedResponse.result.pageSize || 5,
                totalPages: updatedResponse.result.totalPages || 1,
                totalCount: updatedResponse.result.totalCount || 0,
                isLastPage: updatedResponse.result.isLastPage || true,
              });
            }
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
    if (!user?.id) {
      showError("Error", "User not authenticated");
      return;
    }

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
            // Close the confirmation modal
            setLoading(false);

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
                pageSize: updatedResponse.result.pageSize || 5,
                totalPages: updatedResponse.result.totalPages || 1,
                totalCount: updatedResponse.result.totalCount || 0,
                isLastPage: updatedResponse.result.isLastPage || true,
              });
            }
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
    if (!user?.id) {
      showError("Error", "User not authenticated");
      return;
    }

    showConfirmation({
      title: "Resume Copy Trade",
      message:
        "Are you sure you want to resume this copy trade? It will start copying trades again.",
      actionType: "resume",
      confirmText: "Resume Trade",
      onConfirm: async () => {
        try {
          setLoading(true, "Resuming...");
          setResumingOrderId(copyTradeId);

          const response = await TradingService.resumeCopyTrade({
            copyTradeId: copyTradeId.toString(),
          });

          if (response.success) {
            showSuccess(
              "Success",
              response.message || "Copy trade resumed successfully"
            );
            // Close the confirmation modal
            setLoading(false);

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
                pageSize: updatedResponse.result.pageSize || 5,
                totalPages: updatedResponse.result.totalPages || 1,
                totalCount: updatedResponse.result.totalCount || 0,
                isLastPage: updatedResponse.result.isLastPage || true,
              });
            }
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
    <div className="  bg-[#161616]  hover:bg-white/[0.06] border border-white/[0.08] hover:border-main-accent/30 rounded-sm p-4 lg:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-main-accent/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="font-algance text-xl text-main-text">Copy Trades</h2>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Icon
            icon="eos-icons:loading"
            width={32}
            height={32}
            className="text-main-accent animate-spin"
          />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <Icon
            icon="material-symbols:error"
            width={32}
            height={32}
            className="text-red-400 mx-auto mb-2"
          />
          <p className="text-main-light-text font-tiktok">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <Icon
            icon="mingcute:aiming-2-line"
            width={32}
            height={32}
            className="text-main-light-text/50 mx-auto mb-2"
          />
          <p className="text-main-light-text font-tiktok">
            No copy trades found
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order?.id || Math.random()}
              className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-main-accent/20 rounded-sm p-3 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8   bg-white/[0.08] border border-white/[0.1] rounded-lg flex items-center justify-center">
                    <Icon
                      icon={
                        order.status?.toLowerCase() === "active"
                          ? "mingcute:aiming-2-fill"
                          : order.status?.toLowerCase() === "paused"
                          ? "mingcute:pause-fill"
                          : "mingcute:close-fill"
                      }
                      width={16}
                      height={16}
                      className={
                        order.status?.toLowerCase() === "active"
                          ? "text-green-400"
                          : order.status?.toLowerCase() === "paused"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }
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
                <span
                  className={`font-tiktok text-xs px-2 py-1 rounded-full border border-white/10 ${getStatusColor(
                    order.status || ""
                  )}`}
                >
                  {order.status || "Unknown"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs mb-3">
                <div className="bg-white/[0.01] p-2 rounded-lg">
                  <div className="font-tiktok text-main-light-text/60 mb-1">
                    Target Wallet
                  </div>
                  <div className="font-tiktok text-main-text truncate">
                    {order.targetWallet}
                  </div>
                </div>
                <div className="bg-white/[0.01] p-2 rounded-lg">
                  <div className="font-tiktok text-main-light-text/60 mb-1">
                    Buy Method
                  </div>
                  <div className="font-tiktok text-main-text">
                    {getBuyMethodLabel(order)}
                  </div>
                </div>
                <div className="bg-white/[0.01] p-2 rounded-lg">
                  <div className="font-tiktok text-main-light-text/60 mb-1">
                    Sell Method
                  </div>
                  <div className="font-tiktok text-main-text">
                    {order.copySells ? "Copy Sells" : "Duplicate Buys"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                {/* Pause/Resume Button - conditional based on status */}
                {order.status?.toLowerCase() === "active" ? (
                  <button
                    onClick={() => handlePauseCopyTrade(order.id)}
                    disabled={pausingOrderId === order.id}
                    className="  cursor-pointer bg-[#161616]  border border-yellow-400/20 hover:bg-yellow-400/10 hover:border-yellow-400/30 rounded-lg px-3 py-1.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {pausingOrderId === order.id ? (
                      <Icon
                        icon="eos-icons:loading"
                        width={14}
                        height={14}
                        className="text-yellow-400 animate-spin"
                      />
                    ) : (
                      <Icon
                        icon="mingcute:pause-line"
                        width={14}
                        height={14}
                        className="text-yellow-400"
                      />
                    )}
                    <span className="font-tiktok text-xs text-yellow-400">
                      {pausingOrderId === order.id ? "Pausing..." : "Pause"}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleResumeCopyTrade(order.id)}
                    disabled={resumingOrderId === order.id}
                    className="  cursor-pointer bg-[#161616]  border border-green-400/20 hover:bg-green-400/10 hover:border-green-400/30 rounded-lg px-3 py-1.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {resumingOrderId === order.id ? (
                      <Icon
                        icon="eos-icons:loading"
                        width={14}
                        height={14}
                        className="text-green-400 animate-spin"
                      />
                    ) : (
                      <Icon
                        icon="mingcute:play-line"
                        width={14}
                        height={14}
                        className="text-green-400"
                      />
                    )}
                    <span className="font-tiktok text-xs text-green-400">
                      {resumingOrderId === order.id ? "Resuming..." : "Resume"}
                    </span>
                  </button>
                )}

                {/* Close Button */}
                <button
                  onClick={() => handleCloseCopyTrade(order.id)}
                  disabled={closingOrderId === order.id}
                  className="  cursor-pointer bg-[#161616]  border border-red-400/20 hover:bg-red-400/10 hover:border-red-400/30 rounded-lg px-3 py-1.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {closingOrderId === order.id ? (
                    <Icon
                      icon="eos-icons:loading"
                      width={14}
                      height={14}
                      className="text-red-400 animate-spin"
                    />
                  ) : (
                    <Icon
                      icon="mingcute:close-line"
                      width={14}
                      height={14}
                      className="text-red-400"
                    />
                  )}
                  <span className="font-tiktok text-xs text-red-400">
                    {closingOrderId === order.id ? "Closing..." : "Close"}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading &&
        !error &&
        orders.length > 0 &&
        pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(pagination.pageNumber - 1)}
              disabled={pagination.pageNumber <= 1}
              className={`
              flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200
              ${
                pagination.pageNumber <= 1
                  ? "border-white/[0.05] bg-white/[0.02] text-main-light-text/30 cursor-not-allowed"
                  : "border-white/[0.1] bg-white/[0.05] text-main-light-text/70 hover:border-main-accent/40 hover:bg-main-accent/10 hover:text-main-accent cursor-pointer"
              }
            `}
            >
              <Icon icon="mdi:chevron-left" className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 px-3">
              <span className="font-tiktok text-sm text-main-text font-medium bg-main-accent/10 border border-main-accent/20 px-2 py-1 rounded">
                {pagination.pageNumber}
              </span>
              <span className="font-tiktok text-sm text-main-light-text/40">
                /
              </span>
              <span className="font-tiktok text-sm text-main-light-text/70">
                {pagination.totalPages || 1}
              </span>
            </div>

            <button
              onClick={() => handlePageChange(pagination.pageNumber + 1)}
              disabled={pagination.isLastPage}
              className={`
              flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200
              ${
                pagination.isLastPage
                  ? "border-white/[0.05] bg-white/[0.02] text-main-light-text/30 cursor-not-allowed"
                  : "border-white/[0.1] bg-white/[0.05] text-main-light-text/70 hover:border-main-accent/40 hover:bg-main-accent/10 hover:text-main-accent cursor-pointer"
              }
            `}
            >
              <Icon icon="mdi:chevron-right" className="w-4 h-4" />
            </button>
          </div>
        )}
    </div>
  );
};

export default CopyTradeOrdersSection;
