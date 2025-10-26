import React, { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import {
  sortBy,
  toggleDirection,
  type SortDirection,
} from "../../../../utils/sort";

interface Transaction {
  id: string;
  type: "buy" | "sell";
  timestamp: number;
  amount: number;
  price: number;
  maker: string;
  txHash: string;
}

interface TransactionsProps {
  transactions: Transaction[];
}

const Transactions: React.FC<TransactionsProps> = ({ transactions }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  type SortKey =
    | "timestamp"
    | "type"
    | "amount"
    | "give"
    | "weth"
    | "price"
    | "maker";
  const [sortKey, setSortKey] = useState<SortKey>("timestamp");
  const [direction, setDirection] = useState<SortDirection>("desc");

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) {
      return `${seconds}s ago`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m ago`;
    } else {
      const hours = Math.floor(seconds / 3600);
      return `${hours}h ago`;
    }
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(4)}`;
  };

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setDirection((d) => toggleDirection(d));
    } else {
      setSortKey(key);
      // default to desc when switching keys
      setDirection("desc");
    }
  };

  const sortedTransactions = useMemo(() => {
    const accessor = (tx: Transaction) => {
      switch (sortKey) {
        case "timestamp":
          return tx.timestamp;
        case "type":
          return tx.type;
        case "amount":
          return tx.amount;
        case "give":
          return tx.amount / tx.price;
        case "weth":
          return (tx.amount / tx.price) * 0.1;
        case "price":
          return tx.price;
        case "maker":
          return tx.maker;
        default:
          return tx.timestamp;
      }
    };
    return sortBy(transactions, accessor, direction);
  }, [transactions, sortKey, direction]);

  return (
    <div className="flex flex-col h-fit bg-surface border-x border-t border-subtle text-main-text">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-subtle cursor-pointer hover:bg-main-accent/5 transition-colors"
        onClick={toggleCollapse}
      >
        <div className="flex items-center gap-2">
          <Icon
            icon="material-symbols:menu"
            className="w-4 h-4 text-main-light-text"
          />
          <h2 className="text-sm font-medium text-main-text">Transactions</h2>
        </div>
        <Icon
          icon="lucide:chevron-down"
          width={16}
          height={16}
          className={`text-main-light-text transition-transform duration-200 ${
            isCollapsed ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="border-b border-subtle">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-main-accent/5">
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-main-light-text uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort("timestamp")}
                    >
                      <div className="flex items-center gap-1">
                        DATE
                        {sortKey === "timestamp" ? (
                          <Icon
                            icon={
                              direction === "asc"
                                ? "lucide:arrow-up"
                                : "lucide:arrow-down"
                            }
                            className="w-3 h-3"
                          />
                        ) : (
                          <Icon
                            icon="material-symbols:filter-list"
                            className="w-3 h-3"
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-main-light-text uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center gap-1">
                        TYPE
                        {sortKey === "type" ? (
                          <Icon
                            icon={
                              direction === "asc"
                                ? "lucide:arrow-up"
                                : "lucide:arrow-down"
                            }
                            className="w-3 h-3"
                          />
                        ) : (
                          <Icon
                            icon="material-symbols:filter-list"
                            className="w-3 h-3"
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-right text-xs font-medium text-main-light-text uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center gap-1 justify-end">
                        USD
                        {sortKey === "amount" ? (
                          <Icon
                            icon={
                              direction === "asc"
                                ? "lucide:arrow-up"
                                : "lucide:arrow-down"
                            }
                            className="w-3 h-3"
                          />
                        ) : (
                          <Icon
                            icon="material-symbols:filter-list"
                            className="w-3 h-3"
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-right text-xs font-medium text-main-light-text uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort("give")}
                    >
                      <div className="flex items-center gap-1 justify-end">
                        GIVE
                        {sortKey === "give" ? (
                          <Icon
                            icon={
                              direction === "asc"
                                ? "lucide:arrow-up"
                                : "lucide:arrow-down"
                            }
                            className="w-3 h-3"
                          />
                        ) : (
                          <Icon
                            icon="material-symbols:filter-list"
                            className="w-3 h-3"
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-right text-xs font-medium text-main-light-text uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort("weth")}
                    >
                      <div className="flex items-center gap-1 justify-end">
                        WETH
                        {sortKey === "weth" ? (
                          <Icon
                            icon={
                              direction === "asc"
                                ? "lucide:arrow-up"
                                : "lucide:arrow-down"
                            }
                            className="w-3 h-3"
                          />
                        ) : (
                          <Icon
                            icon="material-symbols:filter-list"
                            className="w-3 h-3"
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-right text-xs font-medium text-main-light-text uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center gap-1 justify-end">
                        PRICE
                        {sortKey === "price" ? (
                          <Icon
                            icon={
                              direction === "asc"
                                ? "lucide:arrow-up"
                                : "lucide:arrow-down"
                            }
                            className="w-3 h-3"
                          />
                        ) : (
                          <Icon
                            icon="material-symbols:info-outline"
                            className="w-3 h-3"
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-main-light-text uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort("maker")}
                    >
                      <div className="flex items-center gap-1">
                        MAKER
                        {sortKey === "maker" ? (
                          <Icon
                            icon={
                              direction === "asc"
                                ? "lucide:arrow-up"
                                : "lucide:arrow-down"
                            }
                            className="w-3 h-3"
                          />
                        ) : (
                          <Icon
                            icon="material-symbols:filter-list"
                            className="w-3 h-3"
                          />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-main-light-text uppercase tracking-wider">
                      TXN
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subtle">
                  {sortedTransactions.slice(0, 10).map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-main-accent/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-main-text">
                        {formatTimeAgo(tx.timestamp)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            tx.type === "buy"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {tx.type === "buy" ? "Buy" : "Sell"}
                        </span>
                      </td>
                      <td
                        className={`px-4 py-3 text-sm text-right font-mono ${
                          tx.type === "buy" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {formatAmount(tx.amount)}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm text-right font-mono ${
                          tx.type === "buy" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {(tx.amount / tx.price).toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm text-right font-mono ${
                          tx.type === "buy" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {((tx.amount / tx.price) * 0.1).toFixed(5)}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm text-right font-mono ${
                          tx.type === "buy" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {formatPrice(tx.price)}
                      </td>
                      <td className="px-4 py-3 text-sm text-main-text font-mono">
                        {tx.maker}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="text-main-light-text hover:text-main-accent transition-colors">
                          <Icon
                            icon="material-symbols:open-in-new"
                            className="w-4 h-4"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Table */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between px-2 py-2 border-b border-subtle">
              <div className="flex items-center gap-2 overflow-x-auto">
                {[
                  { label: "Date", key: "timestamp" as SortKey },
                  { label: "USD", key: "amount" as SortKey },
                  { label: "Price", key: "price" as SortKey },
                  { label: "Maker", key: "maker" as SortKey },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    className={`text-xs px-2 py-1 rounded border ${
                      sortKey === opt.key
                        ? "border-main-accent text-main-accent bg-main-accent/10"
                        : "border-subtle text-main-light-text"
                    }`}
                    onClick={() => handleSort(opt.key)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <button
                className="ml-2 p-1 rounded hover:bg-main-accent/10"
                onClick={() => setDirection((d) => toggleDirection(d))}
                aria-label="Toggle sort direction"
              >
                <Icon
                  icon={
                    direction === "asc"
                      ? "lucide:arrow-up"
                      : "lucide:arrow-down"
                  }
                  className="w-4 h-4 text-main-light-text"
                />
              </button>
            </div>
            <div className="space-y-1 p-2">
              {sortedTransactions.slice(0, 19).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-2 px-3 hover:bg-main-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Type indicator */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        tx.type === "buy"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {tx.type === "buy" ? "B" : "S"}
                    </div>

                    {/* Time */}
                    <div className="text-xs text-main-light-text">
                      {formatTimeAgo(tx.timestamp)}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Amount */}
                    <div
                      className={`text-sm font-mono ${
                        tx.type === "buy" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {formatAmount(tx.amount)}
                    </div>

                    {/* Price */}
                    <div
                      className={`text-sm font-mono ${
                        tx.type === "buy" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {formatPrice(tx.price)}
                    </div>

                    {/* Maker */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-main-light-text font-mono">
                        {tx.maker}
                      </span>
                      <Icon
                        icon="material-symbols:filter-list"
                        className="w-3 h-3 text-main-light-text"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
