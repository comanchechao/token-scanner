import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

import MobileFilterMenu from "./MobileFilterMenu";
import FilterModal from "@/components/ui/modals/FilterModal";
export interface Transaction {
  id: string;
  transactionId?: string;
  date: string;
  type: "Add" | "Buy" | "Sell" | "Swap";
  priceUSD?: number | null;
  totalUSD: number | null;
  priceSOL?: number | null;
  amount?: string | null;
  totalSOL?: number | null;
  maker?: string;
  tokenName?: string;
  tokenSymbol?: string;
  tokenDecimals?: number;
}

interface TransactionsTableProps {
  transactions?: Transaction[];
  isLoading?: boolean;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions = [],
  isLoading = false,
}) => {
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isApplied, setIsApplied] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // New state for Amount and Total SOL filters
  const [showAmountFilter, setShowAmountFilter] = useState(false);
  const [showTotalSolFilter, setShowTotalSolFilter] = useState(false);
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });
  const [totalSolRange, setTotalSolRange] = useState({ min: "", max: "" });
  const [isAmountFilterApplied, setIsAmountFilterApplied] = useState(false);
  const [isTotalSolFilterApplied, setIsTotalSolFilterApplied] = useState(false);

  const [showMakersFilter, setShowMakersFilter] = useState(false);
  const [selectedMakersTab, setSelectedMakersTab] = useState<
    "markers" | "wallets"
  >("markers");
  const [walletAddress, setWalletAddress] = useState("");
  const [isMakersFilterApplied, setIsMakersFilterApplied] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowTypeFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <div className="p-4">Loading transactions...</div>;
  }

  if (transactions.length === 0) {
    return <div className="p-4 bg-transparent">No transactions found</div>;
  }

  const handleTypeSelect = (type: string) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      }
      return [...prev, type];
    });
  };

  const handleApplyFilter = () => {
    setIsApplied(true);
    setShowTypeFilter(false);
  };

  const handleResetFilter = () => {
    setSelectedTypes([]);
    setIsApplied(false);
    setShowTypeFilter(false);
  };

  const handleAmountFilterReset = () => {
    setAmountRange({ min: "", max: "" });
    setIsAmountFilterApplied(false);
    setShowAmountFilter(false);
  };

  const handleAmountFilterApply = () => {
    setIsAmountFilterApplied(true);
    setShowAmountFilter(false);
  };

  const handleTotalSolFilterReset = () => {
    setTotalSolRange({ min: "", max: "" });
    setIsTotalSolFilterApplied(false);
    setShowTotalSolFilter(false);
  };

  const handleTotalSolFilterApply = () => {
    setIsTotalSolFilterApplied(true);
    setShowTotalSolFilter(false);
  };

  const handleMakersFilterReset = () => {
    setWalletAddress("");
    setIsMakersFilterApplied(false);
    setShowMakersFilter(false);
  };

  const handleMakersFilterApply = () => {
    setIsMakersFilterApplied(true);
    setShowMakersFilter(false);
  };

  const filteredTransactions = transactions
    .filter((tx) => {
      if (isApplied && selectedTypes.length > 0) {
        return selectedTypes.includes(tx.type);
      }
      return true;
    })
    .filter((tx: any) => {
      if (isAmountFilterApplied && (amountRange.min || amountRange.max)) {
        const amount = parseFloat(tx.amount.replace(/[^0-9.]/g, ""));
        if (amountRange.min && amount < parseFloat(amountRange.min))
          return false;
        if (amountRange.max && amount > parseFloat(amountRange.max))
          return false;
      }
      return true;
    })
    .filter((tx) => {
      if (isTotalSolFilterApplied && (totalSolRange.min || totalSolRange.max)) {
        if (!tx.totalSOL) return false;
        if (totalSolRange.min && tx.totalSOL < parseFloat(totalSolRange.min))
          return false;
        if (totalSolRange.max && tx.totalSOL > parseFloat(totalSolRange.max))
          return false;
      }
      return true;
    })
    .filter((tx: any) => {
      if (isMakersFilterApplied && walletAddress) {
        return tx.maker.toLowerCase().includes(walletAddress.toLowerCase());
      }
      return true;
    });

  // Mobile Card Vieco
  console.log("filter", filteredTransactions, transactions);
  const renderMobileCards = () => {
    return (
      <div className="space-y-4 mt-4">
        {filteredTransactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-[#1e1e1e] rounded-lg p-4 border border-gray-800"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-primary  ">{tx.date}</span>
              <span className="bg-border text-primary px-3 py-1 rounded-full text-xs">
                {tx.type}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Price USD</p>
                <p className="text-white">
                  {tx.priceUSD ? `$${tx.priceUSD}` : "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">Total USD</p>
                <p className="text-white">
                  {tx.totalUSD ? `$${tx.totalUSD}` : "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">Price SOL</p>
                {tx.priceSOL ? (
                  <div className="flex items-center space-x-1">
                    <Icon icon="token-branded:solana" width="16" height="16" />
                    <span>{tx.priceSOL}</span>
                  </div>
                ) : (
                  <p className="text-white">-</p>
                )}
              </div>

              <div>
                <p className="text-gray-400 text-xs">Amount</p>
                <p className="text-white">{tx.amount}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">Total SOL</p>
                {tx.totalSOL ? (
                  <div className="flex items-center space-x-1">
                    <Icon icon="token-branded:solana" width="16" height="16" />
                    <span>{tx.totalSOL}</span>
                  </div>
                ) : (
                  <p className="text-white">-</p>
                )}
              </div>

              <div>
                <p className="text-gray-400 text-xs">Maker</p>
                <div className="flex items-center space-x-1">
                  <Icon
                    icon="icon-park-twotone:blockchain"
                    width="16"
                    height="16"
                  />
                  <span className="text-white">{tx.maker}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Main render
  return (
    <div className="w-full">
      <FilterModal
        isOpen={showAmountFilter}
        onClose={() => setShowAmountFilter(false)}
        onReset={handleAmountFilterReset}
        onApply={handleAmountFilterApply}
        title="Filter USD Amount"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button className="px-4 cursor-pointer py-2 text-xs text-center border border-border rounded-full text-gray-300 hover:bg-[#000000] transition-all duration-200 ease-in">
              $100
            </button>
            <button className="px-4 cursor-pointer py-2 text-xs text-center border border-border rounded-full text-gray-300 hover:bg-[#000000] transition-all duration-200 ease-in">
              $500
            </button>
            <button className="px-4 cursor-pointer py-2 text-xs text-center border border-border rounded-full text-gray-300 hover:bg-[#000000] transition-all duration-200 ease-in">
              $1,000
            </button>
            <button className="px-4 cursor-pointer py-2 text-xs text-center border border-border rounded-full text-gray-300 hover:bg-[#000000] transition-all duration-200 ease-in">
              $2,500
            </button>
            <button className="px-4 cursor-pointer py-2 text-xs text-center border border-border rounded-full text-gray-300 hover:bg-[#000000] transition-all duration-200 ease-in">
              $5,000
            </button>
            <button className="px-4 cursor-pointer py-2 text-xs text-center border border-border rounded-full text-gray-300 hover:bg-[#000000] transition-all duration-200 ease-in">
              $10,000
            </button>
          </div>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="min"
              value={amountRange.min}
              onChange={(e) =>
                setAmountRange((prev) => ({ ...prev, min: e.target.value }))
              }
              className="w-full file:text-foreground text-[#B5AFB6] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border flex h-12 w-full min-w-0 rounded-full bg-transparent  text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm px-4 py-3 rounded-full border border-border focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <input
              type="number"
              placeholder="max"
              value={amountRange.max}
              onChange={(e) =>
                setAmountRange((prev) => ({ ...prev, max: e.target.value }))
              }
              className="w-full file:text-foreground text-[#B5AFB6] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border flex h-12 w-full min-w-0 rounded-full bg-transparent  text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm px-4 py-3 rounded-full border border-border focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </FilterModal>

      <FilterModal
        isOpen={showTotalSolFilter}
        onClose={() => setShowTotalSolFilter(false)}
        onReset={handleTotalSolFilterReset}
        onApply={handleTotalSolFilterApply}
        title="Filter SOL amount"
      >
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Icon
                  icon="token-branded:solana"
                  className="w-5 h-5 text-primary"
                />
              </div>
              <input
                type="number"
                placeholder="min"
                value={totalSolRange.min}
                onChange={(e) =>
                  setTotalSolRange((prev) => ({ ...prev, min: e.target.value }))
                }
                className="w-full pl-12 pr-4 py-3 w-full file:text-foreground text-[#B5AFB6] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border flex h-12 w-full min-w-0 rounded-full bg-transparent  text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm  rounded-full border border-border focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Icon
                  icon="token-branded:solana"
                  className="w-5 h-5 text-primary"
                />
              </div>
              <input
                type="number"
                placeholder="max"
                value={totalSolRange.max}
                onChange={(e) =>
                  setTotalSolRange((prev) => ({ ...prev, max: e.target.value }))
                }
                className="w-full pl-12 pr-4 py-3 w-full file:text-foreground text-[#B5AFB6] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border flex h-12 w-full min-w-0 rounded-full bg-transparent  text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm  rounded-full border border-border focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>
      </FilterModal>

      <FilterModal
        isOpen={showMakersFilter}
        onClose={() => setShowMakersFilter(false)}
        onReset={handleMakersFilterReset}
        onApply={handleMakersFilterApply}
        title={
          selectedMakersTab === "markers"
            ? "Filter By Makers"
            : "Filter By My Wallets"
        }
      >
        <div className="space-y-4">
          <div className="flex border-b border-border">
            <button
              onClick={() => setSelectedMakersTab("markers")}
              className={`px-4 cursor-pointer py-2 text-sm relative ${
                selectedMakersTab === "markers" ? "text-white" : "text-gray-400"
              }`}
            >
              By Markers
              {selectedMakersTab === "markers" && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />
              )}
            </button>
            <button
              onClick={() => setSelectedMakersTab("wallets")}
              className={`px-4 cursor-pointer py-2 text-sm relative ${
                selectedMakersTab === "wallets" ? "text-white" : "text-gray-400"
              }`}
            >
              My Wallets
              {selectedMakersTab === "wallets" && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />
              )}
            </button>
          </div>

          {selectedMakersTab === "markers" ? (
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Wallet Address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full bg-hover-primary     w-full px-4 py-3 w-full file:text-foreground text-[#B5AFB6] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border flex h-12 w-full min-w-0 rounded-full bg-transparent  text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm  rounded-full border border-border focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border border-gray-600 bg-transparent cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-white text-sm">Wallet 1</span>
                      <span className="text-gray-500 text-xs">
                        gtvss....fede
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-5 h-5 rounded flex items-center justify-center">
                      <Icon
                        icon="fluent:live-24-filled"
                        className="text-[#00C2FF] w-4 h-4"
                      />
                    </div>
                    <span className="text-white">0</span>
                    <span className="text-gray-500 text-xs">$0</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border border-gray-600 bg-transparent cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-white text-sm">Wallet 2</span>
                      <span className="text-gray-500 text-xs">
                        utvss....fede
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-5 h-5 rounded flex items-center justify-center">
                      <Icon
                        icon="ph:diamond-fill"
                        className="text-[#C4B5FD] w-4 h-4"
                      />
                    </div>
                    <span className="text-white">0</span>
                    <span className="text-gray-500 text-xs">$0</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border border-gray-600 bg-transparent cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-white text-sm">Wallet 3</span>
                      <span className="text-gray-500 text-xs">
                        utvss....fpde
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-5 h-5 rounded-full bg-[#007AFF] flex items-center justify-center"></div>
                    <span className="text-white">0</span>
                    <span className="text-gray-500 text-xs">$0</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border border-gray-600 bg-transparent cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-white text-sm">Wallet 4</span>
                      <span className="text-gray-500 text-xs">
                        mtvss....fede
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"></div>
                    <span className="text-white">0</span>
                    <span className="text-gray-500 text-xs">$0</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border border-gray-600 bg-transparent cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-white text-sm">Wallet 5</span>
                      <span className="text-gray-500 text-xs">
                        sdvss....oide
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"></div>
                    <span className="text-white">0</span>
                    <span className="text-gray-500 text-xs">$0</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </FilterModal>

      {/* Mobile or desktop view based on screen size */}
      {isMobile ? (
        <div className="md:hidden">
          <div className="flex justify-between items-center p-3 bg-card-foreground rounded-t-lg border-b border-gray-800">
            <h3 className="text-white  ">Filters</h3>
            <div className="flex cursor-pointer space-x-2">
              <button
                onClick={() => setShowTypeFilter(!showTypeFilter)}
                className={`p-2 rounded-full ${
                  isApplied ? "bg-primary/20" : "bg-[#232323]"
                }`}
              >
                <Icon
                  icon="fluent:filter-24-regular"
                  width="18"
                  height="18"
                  className={isApplied ? "text-primary" : "text-gray-400"}
                />
              </button>
            </div>
          </div>

          <MobileFilterMenu
            isOpen={showTypeFilter}
            onClose={() => setShowTypeFilter(false)}
            selectedTypes={selectedTypes}
            onTypeSelect={handleTypeSelect}
            amountRange={amountRange}
            onAmountChange={(min, max) => setAmountRange({ min, max })}
            onReset={handleResetFilter}
            onApply={handleApplyFilter}
          />

          {renderMobileCards()}
        </div>
      ) : (
        <table className="w-full text-sm text-left bg-[#0e0f13] hidden md:table">
          <thead className="w-full">
            <tr className="border-b w-full border-gray-800">
              <th className="p-4 align-bottom">
                <div className="flex items-center  text-gray-400 cursor-pointer duration-300 transition-all hover:text-white ease-in-out space-x-1">
                  <span>Date</span>
                  <Icon
                    icon="fluent:filter-24-regular"
                    width="20"
                    height="20"
                    style={{ color: "#99a1af " }}
                  />{" "}
                </div>
              </th>
              <th className="p-4 align-bottom relative">
                <div
                  className="flex items-center text-gray-400 cursor-pointer duration-300 transition-all hover:text-white ease-in-out space-x-1"
                  onClick={() => setShowTypeFilter(!showTypeFilter)}
                >
                  <span className="">Type</span>
                  <Icon
                    icon="fluent:filter-24-regular"
                    width="20"
                    height="20"
                    className={isApplied ? "text-primary" : ""}
                  />{" "}
                </div>
                {showTypeFilter && (
                  <div
                    ref={filterRef}
                    className="absolute z-10 mt-2 w-48 rounded-lg bg-card   shadow-lg border border-gray-800"
                  >
                    <div className="p-2 space-y-2">
                      {["Buy", "Sell", "Add", "Remove"].map((type) => (
                        <label
                          key={type}
                          className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-800 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => handleTypeSelect(type)}
                            className="appearance-none w-4 h-4 rounded border border-gray-600 checked:bg-primary checked:border-primary bg-transparent cursor-pointer relative
                            after:content-[''] after:w-full after:h-full after:absolute after:left-0 after:top-0 after:bg-no-repeat after:bg-center
                            checked:after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDNMNC41IDguNUwyIDYiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')])"
                          />
                          <span className="text-gray-300">{type}</span>
                        </label>
                      ))}
                    </div>
                    <div className="border-t border-gray-800 p-2 flex justify-between">
                      <button
                        onClick={handleResetFilter}
                        className="text-gray-400 hover:text-white text-xs px-3 py-2 rounded-full cursor-pointer"
                      >
                        Reset
                      </button>
                      <button
                        onClick={handleApplyFilter}
                        className="bg-primary text-white text-xs cursor-pointer px-3 py-2 rounded-full hover:bg-hover-primary"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </th>
              <th className="p-4 align-bottom">
                <div className="flex items-center text-gray-400 cursor-pointer duration-300 transition-all hover:text-white ease-in-out space-x-1">
                  <span className="">Price USD</span>
                  <Icon
                    icon="fluent:filter-24-regular"
                    width="20"
                    height="20"
                  />{" "}
                </div>
              </th>
              <th className="p-4 align-bottom">
                <div className="flex items-center text-gray-400 cursor-pointer duration-300 transition-all hover:text-white ease-in-out space-x-1">
                  <span className="">Total USD</span>
                  <Icon
                    icon="fluent:filter-24-regular"
                    width="20"
                    height="20"
                    style={{ color: "#99a1af " }}
                  />{" "}
                </div>
              </th>
              <th className="p-4 align-bottom">
                <div className="flex items-center text-gray-400 cursor-pointer duration-300 transition-all hover:text-white ease-in-out space-x-1">
                  <span className="">Price SOL</span>
                  <Icon
                    icon="fluent:filter-24-regular"
                    width="20"
                    height="20"
                  />{" "}
                </div>
              </th>
              <th className="p-4 align-bottom">
                <div
                  className="flex items-center text-gray-400 cursor-pointer duration-300 transition-all hover:text-white ease-in-out space-x-1"
                  onClick={() => setShowAmountFilter(true)}
                >
                  <span className="">Amount</span>
                  <Icon
                    icon="fluent:filter-24-regular"
                    width="20"
                    height="20"
                    className={isAmountFilterApplied ? "text-primary" : ""}
                  />
                </div>
              </th>
              <th className="p-4 align-bottom">
                <div
                  className="flex items-center text-gray-400 cursor-pointer duration-300 transition-all hover:text-white ease-in-out space-x-1"
                  onClick={() => setShowTotalSolFilter(true)}
                >
                  <span className="">Total SOL</span>
                  <Icon
                    icon="fluent:filter-24-regular"
                    width="20"
                    height="20"
                    className={isTotalSolFilterApplied ? "text-primary" : ""}
                  />
                </div>
              </th>
              <th className="p-4 align-bottom">
                <div
                  className="flex items-center text-gray-400 cursor-pointer duration-300 transition-all hover:text-white ease-in-out space-x-1"
                  onClick={() => setShowMakersFilter(true)}
                >
                  <span className="">Makers</span>
                  <Icon
                    icon="fluent:filter-24-regular"
                    width="20"
                    height="20"
                    className={isMakersFilterApplied ? "text-primary" : ""}
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-800">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-primary">{tx.date}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-primary">{tx.type}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-primary">
                      {tx.priceUSD
                        ? `$${
                            tx.amount && tx.totalUSD
                              ? Number(tx?.totalUSD) / Number(tx?.amount)
                              : "-"
                          }`
                        : "-"}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-primary">
                      {tx.totalUSD ? `$${tx.totalUSD}` : "-"}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-primary">
                      {tx.priceSOL ? (
                        <div className="flex items-center space-x-1">
                          <Icon
                            icon="token-branded:solana"
                            width="24"
                            height="24"
                          />
                          <span className="text-primary">
                            {" "}
                            {tx.priceUSD
                              ? `$${
                                  tx.amount && tx.totalSOL
                                    ? Number(tx?.amount) / Number(tx?.totalSOL)
                                    : "-"
                                }`
                              : "-"}
                          </span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-primary">{tx.amount}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    {tx.totalSOL ? (
                      <div className="flex items-center space-x-1">
                        <Icon
                          icon="token-branded:solana"
                          width="24"
                          height="24"
                        />
                        <span className="text-primary">{tx.totalSOL}</span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon
                      icon="icon-park-twotone:blockchain"
                      width="24"
                      height="24"
                    />
                    <span className="text-primary">{tx.maker}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionsTable;
