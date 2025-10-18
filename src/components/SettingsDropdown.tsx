import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useSettings } from "../contexts/SettingsContext";

const SettingsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [tempBuyAmount, setTempBuyAmount] = useState("");
  const [tempSellPercentage, setTempSellPercentage] = useState("");
  const {
    quickBuyAmount,
    quickSellPercentage,
    setQuickBuyAmount,
    setQuickSellPercentage,
  } = useSettings();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempBuyAmount(quickBuyAmount.toString());
    setTempSellPercentage(quickSellPercentage.toString());
  }, [quickBuyAmount, quickSellPercentage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setTempBuyAmount(quickBuyAmount.toString());
        setTempSellPercentage(quickSellPercentage.toString());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [quickBuyAmount, quickSellPercentage]);

  const handleSave = () => {
    if (activeTab === "buy") {
      const amount = parseFloat(tempBuyAmount);
      if (!isNaN(amount) && amount > 0 && amount <= 100) {
        setQuickBuyAmount(amount);
        setIsOpen(false);
      }
    } else {
      const percentage = parseInt(tempSellPercentage, 10);
      if (percentage >= 10 && percentage <= 100) {
        setQuickSellPercentage(percentage);
        setIsOpen(false);
      }
    }
  };

  const handleBuyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (
      value === "" ||
      (/^\d*\.?\d*$/.test(value) && (value === "." || parseFloat(value) <= 100))
    ) {
      setTempBuyAmount(value);
    }
  };

  const handleSellInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) <= 100)) {
      setTempSellPercentage(value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setTempBuyAmount(quickBuyAmount.toString());
      setTempSellPercentage(quickSellPercentage.toString());
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center cursor-pointer space-x-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-main-accent/30 px-4 py-2.5 rounded-xl transition-all duration-300 group"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
        aria-label="Settings"
      >
        <Icon
          icon="material-symbols:settings"
          className={`w-5 h-5 text-main-light-text group-hover:text-main-accent transition-all duration-300 ${
            isOpen ? "rotate-45 text-main-accent" : ""
          }`}
        />
        <span className="font-tiktok text-sm text-main-text group-hover:text-main-accent transition-colors duration-300">
          Buy: {quickBuyAmount} SOL | Sell: {quickSellPercentage}%
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-80 bg-[var(--color-main-bg)]/95 border border-white/[0.15] rounded-2xl shadow-2xl shadow-[var(--color-main-accent)]/10 p-6 z-[100]"
          style={{
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            background: "rgba(0, 8, 20, 0.99)",
          }}
        >
          {/* Overlay for additional blur effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent opacity-100 transition-opacity duration-500 -z-10"></div>

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon
                icon="material-symbols:settings"
                className="w-5 h-5 text-main-accent"
              />
              <h3 className="font-algance text-lg text-main-text">
                Quick Trade Settings
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg cursor-pointer bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] hover:border-red-400/30 transition-all duration-300"
            >
              <Icon
                icon="material-symbols:close"
                className="w-4 h-4 text-main-light-text hover:text-red-400 transition-colors duration-300"
              />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex bg-white/[0.03] rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveTab("buy")}
              className={`flex-1 cursor-pointer px-3 py-2 rounded-l-md font-tiktok text-sm transition-all duration-300 ${
                activeTab === "buy"
                  ? "bg-green-400/20 text-green-400 border border-green-400/30"
                  : "text-main-light-text hover:text-main-text"
              }`}
            >
              <Icon
                icon="material-symbols:trending-up"
                className="w-4 h-4 inline mr-1"
              />
              Buy (SOL)
            </button>
            <button
              onClick={() => setActiveTab("sell")}
              className={`flex-1 cursor-pointer px-3 py-2 rounded-r-md font-tiktok text-sm transition-all duration-300 ${
                activeTab === "sell"
                  ? "bg-red-400/20 text-red-400 border border-red-400/30"
                  : "text-main-light-text hover:text-main-text"
              }`}
            >
              <Icon
                icon="material-symbols:trending-down"
                className="w-4 h-4 inline mr-1"
              />
              Sell (%)
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-1">
            {activeTab === "buy" ? (
              <>
                {/* Buy Tab Content */}
                <div>
                  <label className="block font-tiktok text-sm text-main-light-text/70 mb-2">
                    Quick Buy Amount (SOL)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tempBuyAmount}
                      onChange={handleBuyInputChange}
                      onKeyDown={handleKeyPress}
                      placeholder="Enter amount (0.0001-100)"
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] focus:border-green-400/50 rounded-xl font-tiktok text-sm text-main-text placeholder-main-light-text/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400/20"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Icon
                        icon="token-branded:solana"
                        className="w-5 h-5 text-green-400"
                      />
                    </div>
                  </div>
                  {tempBuyAmount &&
                    !isNaN(parseFloat(tempBuyAmount)) &&
                    parseFloat(tempBuyAmount) > 100 && (
                      <p className="font-tiktok text-xs text-red-400 mt-1">
                        Maximum amount is 100 SOL
                      </p>
                    )}
                </div>

                {/* Quick Select for Buy */}
                <div>
                  <label className="block font-tiktok text-sm text-main-light-text/70 mb-2">
                    Quick Select
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[0.1, 0.5, 1, 5].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setTempBuyAmount(amount.toString())}
                        className={`px-3 py-2 rounded-lg font-tiktok text-xs transition-all duration-300 ${
                          tempBuyAmount === amount.toString()
                            ? "bg-green-400/20 border border-green-400/50 text-green-400"
                            : "bg-white/[0.05] border border-white/[0.1] text-main-light-text hover:bg-white/[0.08] hover:border-green-400/30 hover:text-green-400"
                        }`}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Sell Tab Content */}
                <div>
                  <label className="block font-tiktok text-sm text-main-light-text/70 mb-2">
                    Quick Sell Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tempSellPercentage}
                      onChange={handleSellInputChange}
                      onKeyDown={handleKeyPress}
                      placeholder="Enter percentage (10-100)"
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] focus:border-red-400/50 rounded-xl font-tiktok text-sm text-main-text placeholder-main-light-text/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400/20"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="font-tiktok text-sm text-red-400">
                        %
                      </span>
                    </div>
                  </div>
                  {tempSellPercentage && parseInt(tempSellPercentage) > 100 && (
                    <p className="font-tiktok text-xs text-red-400 mt-1">
                      Maximum percentage is 100%
                    </p>
                  )}
                  {tempSellPercentage &&
                    parseInt(tempSellPercentage) < 10 &&
                    parseInt(tempSellPercentage) > 0 && (
                      <p className="font-tiktok text-xs text-red-400 mt-1">
                        Minimum percentage is 10%
                      </p>
                    )}
                </div>

                {/* Quick Select for Sell */}
                <div>
                  <label className="block font-tiktok text-sm text-main-light-text/70 mb-2">
                    Quick Select
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 20, 50, 100].map((percentage) => (
                      <button
                        key={percentage}
                        onClick={() =>
                          setTempSellPercentage(percentage.toString())
                        }
                        className={`px-3 py-2 rounded-lg font-tiktok text-xs transition-all duration-300 ${
                          tempSellPercentage === percentage.toString()
                            ? "bg-red-400/20 border border-red-400/50 text-red-400"
                            : "bg-white/[0.05] border border-white/[0.1] text-main-light-text hover:bg-white/[0.08] hover:border-red-400/30 hover:text-red-400"
                        }`}
                      >
                        {percentage}%
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setTempBuyAmount(quickBuyAmount.toString());
                  setTempSellPercentage(quickSellPercentage.toString());
                }}
                className="flex-1 px-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] rounded-xl font-tiktok text-sm text-main-light-text hover:text-main-text transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={
                  activeTab === "buy"
                    ? !tempBuyAmount ||
                      isNaN(parseFloat(tempBuyAmount)) ||
                      parseFloat(tempBuyAmount) <= 0 ||
                      parseFloat(tempBuyAmount) > 100
                    : !tempSellPercentage ||
                      parseInt(tempSellPercentage) < 10 ||
                      parseInt(tempSellPercentage) > 100
                }
                className="flex-1 relative overflow-hidden cursor-pointer bg-white/[0.05] hover:from-main-accent/90 hover:to-main-highlight/90 px-4 py-2.5 rounded-xl font-tiktok text-sm text-main-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/[0.1] before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
              >
                <span className="relative z-10">
                  Set {activeTab === "buy" ? "Amount" : ""}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;
