import React, { useState, useEffect } from "react";
import Selector from "../../../src/components/ui/Selector";
import ToggleSwitch from "../../../src/components/ui/ToggleSwitch";
import SortIcon from "../../../src/components/ui/Icons/Custom/Sort/SortIcon";

export default function TokenOrdersV2() {
  const [selectedTab, setSelectedTab] = useState("Limit Orders");
  const [selectedWallet, setSelectedWallet] = useState("All Wallets");
  const [swapOnly, setSwapOnly] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const tabs = ["Limit Orders", "DCA"];

  const filterOptions = [
    { value: "active", label: "Active" },
    { value: "success", label: "Success" },
    { value: "failed", label: "Failed" },
    { value: "buy_dip", label: "Buy Dip" },
    { value: "stop_loss", label: "Stop Loss" },
    { value: "take_profit", label: "Take Profit" },
  ];

  const handleFilterChange = (values: string | string[]) => {
    if (Array.isArray(values)) {
      setSelectedFilters(values);
    }
  };

  const handleReset = () => {
    setSelectedFilters([]);
    setAppliedFilters([]);
  };

  const handleApply = () => {
    setAppliedFilters(selectedFilters);
    setIsFilterOpen(false);
    console.log("Applied filters:", selectedFilters);
  };

  const renderEmptyState = () => {
    const isLimitOrders = selectedTab === "Limit Orders";
    return (
      <div className="flex flex-col items-center justify-center py-4 px-4 text-center">
        <div className="w-12 h-12 mb-4 rounded-full bg-[#1c1c1c] flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-500"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-2h2V7h-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No Date</h3>
        <p className="text-gray-400 text-sm max-w-[300px]">
          {isLimitOrders
            ? "There are currently no limit orders. Create one to get started."
            : "There are currently no DCA orders. Create one to get started."}
        </p>
        <button className="mt-6 px-6 py-2 cursor-pointer bg-primary text-white rounded-full hover:bg-hover-primary transition-colors text-sm font-medium">
          Create {isLimitOrders ? "Order" : "DCA"}
        </button>
      </div>
    );
  };

  // Mobile Tabs
  const renderMobileTabs = () => (
    <div className="flex border-b border-gray-800 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          className={`px-4 py-2 text-sm font-medium relative whitespace-nowrap ${
            selectedTab === tab
              ? "text-white"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          {tab}
          <div
            className={`absolute bottom-0 left-0 w-full h-[2px] transition-all duration-200 ease-in-out ${
              selectedTab === tab
                ? "bg-[#9945FF] opacity-100"
                : "bg-transparent opacity-0"
            }`}
          />
        </button>
      ))}
    </div>
  );

  // Mobile Controls
  const renderMobileControls = () => (
    <div className="flex flex-col gap-3 p-2">
      <div className="flex justify-between items-center">
        <Selector
          className="flex-1 flex items-center gap-2 border border-gray-800 rounded-full px-3 py-1.5 text-xs"
          label="Select Wallet"
          options={[
            { value: "all", label: "All Wallets" },
            { value: "wallet1", label: "Wallet 1" },
            { value: "wallet2", label: "Wallet 2" },
          ]}
          defaultValue="all"
          onSelect={(value) => console.log("Selected wallet:", value)}
        />

        <div className="ml-2">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex cursor-pointer items-center gap-1 border border-gray-800 rounded-full px-3 py-1.5 text-xs text-gray-400 hover:text-white"
          >
            <SortIcon width={14} height={14} />
            <span>
              Filter{" "}
              {selectedFilters.length > 0 && `(${selectedFilters.length})`}
            </span>
          </button>
        </div>
      </div>

      <div className="flex justify-end items-center">
        <div className="flex items-center gap-2">
          <ToggleSwitch
            label="SWAP Only"
            onChange={(checked) => setSwapOnly(checked)}
            checked={swapOnly}
          />
        </div>
      </div>
    </div>
  );

  // Mobile Filter Modal
  const renderMobileFilterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col">
      <div className="bg-color-main-dark flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-white text-lg font-medium">Filter</h2>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Filter Options */}
        <div className="flex-1 p-4">
          {filterOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center py-3"
              onClick={() => {
                const newFilters = selectedFilters.includes(option.value)
                  ? selectedFilters.filter((f) => f !== option.value)
                  : [...selectedFilters, option.value];
                setSelectedFilters(newFilters);
              }}
            >
              <div
                className={`w-5 h-5 rounded border ${
                  selectedFilters.includes(option.value)
                    ? "bg-[#9945FF] border-[#9945FF]"
                    : "border-gray-600 bg-transparent"
                } mr-3 flex items-center justify-center`}
              >
                {selectedFilters.includes(option.value) && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-white">{option.label}</span>
            </div>
          ))}
        </div>

        {/* Footer buttons */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex justify-between gap-3">
            <button
              onClick={handleReset}
              className="w-full py-3 flex-1 text-[#9945FF] hover:text-[#8935FF] bg-transparent rounded cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="w-full py-3 flex-1 bg-[#9945FF] text-white rounded cursor-pointer hover:bg-[#8935FF]"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full  bg-[#0e0f13] border-t border-x border-border rounded-md">
      {/* Mobile Filter Modal */}
      {isMobile && isFilterOpen && renderMobileFilterModal()}

      {/* Top Controls */}
      <div className="flex flex-col gap-4">
        {/* Tabs - responsive */}
        {isMobile ? (
          renderMobileTabs()
        ) : (
          <div className="flex border-b border-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-6 py-2.5 text-sm cursor-pointer font-medium relative ${
                  selectedTab === tab
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab}
                <div
                  className={`absolute bottom-0 left-0 w-full h-[2px] transition-all duration-200 ease-in-out ${
                    selectedTab === tab
                      ? "bg-primary opacity-100"
                      : "bg-transparent opacity-0"
                  }`}
                />
              </button>
            ))}
          </div>
        )}

        {/* Controls Row - responsive */}
        {isMobile ? (
          renderMobileControls()
        ) : (
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <Selector
                className="flex items-center gap-2 border border-gray-800 rounded-full px-3 py-1.5 min-w-[140px] text-sm"
                label="Select Wallet"
                options={[
                  { value: "all", label: "All Wallets" },
                  { value: "wallet1", label: "Wallet 1" },
                  { value: "wallet2", label: "Wallet 2" },
                ]}
                defaultValue="all"
                onSelect={(value) => console.log("Selected wallet:", value)}
              />
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 cursor-pointer border border-gray-800 rounded-full px-3 py-1.5 text-sm text-gray-400 hover:text-white"
                >
                  <SortIcon width={18} height={18} />
                  <span>
                    Filter{" "}
                    {selectedFilters.length > 0 &&
                      `(${selectedFilters.length})`}
                  </span>
                </button>
                {/* Filter Dropdown */}
                {isFilterOpen && (
                  <div className="absolute left-0 mt-2 bg-card-foreground rounded-md shadow-lg border border-gray-800 min-w-[200px] z-10">
                    <div className="py-2">
                      {filterOptions.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center px-4 py-2 hover:bg-[#2D2A33] cursor-pointer"
                          onClick={() => {
                            const newFilters = selectedFilters.includes(
                              option.value
                            )
                              ? selectedFilters.filter(
                                  (f) => f !== option.value
                                )
                              : [...selectedFilters, option.value];
                            setSelectedFilters(newFilters);
                          }}
                        >
                          <div className="flex items-center justify-center w-5 h-5 border border-gray-600 rounded mr-3">
                            {selectedFilters.includes(option.value) && (
                              <svg
                                className="w-3 h-3 text-primary"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="text-white text-sm">
                            {option.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Action Buttons */}
                    <div className="border-t border-gray-800 p-3">
                      <div className="flex justify-between gap-2">
                        <button
                          onClick={handleReset}
                          className="px-4 cursor-pointer py-1.5 text-sm text-gray-400 hover:text-white rounded-full w-full transition-colors"
                        >
                          Reset
                        </button>
                        <button
                          onClick={handleApply}
                          className="px-4 cursor-pointer py-1.5 text-sm bg-primary text-white rounded-full w-full hover:bg-hover-primary transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ToggleSwitch
                label="SWAP Only"
                onChange={(checked) => setSwapOnly(checked)}
                checked={swapOnly}
              />
            </div>
          </div>
        )}

        {/* Content Area */}
        {renderEmptyState()}
      </div>
    </div>
  );
}
