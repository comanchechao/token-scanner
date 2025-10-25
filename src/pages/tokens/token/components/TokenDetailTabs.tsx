import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import TransactionsTable, { Transaction } from "./TransactionsTable";
import TokenHoldings from "./TokenHoldings";
import TokenTopTraders from "./TokenTopTraders";
import TokenHolders from "./TokenHolders";
import TokenOrders from "./TokenOrders";
import tradingService from "@/api/tradingService";
import { ApiTransaction } from "@/api/types/trading";
import { errorToast } from "@/utils/toast";
import DraggableModal from "./DraggableModal";
import { ArrowLeftRight } from "lucide-react";

interface TokenDetailTabsProps {
  mint: string;
}

export default function TokenDetailTabs({ mint }: TokenDetailTabsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Transactions");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  // Check for mobile viewport on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (activeTab !== "Transactions") return;
      setTransactionsLoading(true);
      try {
        const response = await tradingService.getTransactions(localStorage.getItem("solAddress")??'',1, 20); // Fetch first 20 transactions
        if (response.success && response.result) {
          const maker = response.result?.user.authorizedWallet;
          const mappedData: Transaction[] = response.result.transactions.map(
            (tx: ApiTransaction) => ({
              id: tx.id,
              transactionId: tx.transactionId,
              date: new Date(tx.createdAt)
                .toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })
                .replace(/,/g, ""),
              type: tx.orderDirection === "buy" ? "Buy" : "Sell",
              priceUSD: 0, // Not available in new response
              totalUSD: null, // Not available in new response
              priceSOL: null, // Not available in new response
              amount: tx.inAmount,
              totalSOL: null, // Not available in new response
              maker: maker,
            })
          );
          setTransactions(mappedData);
        } else {
          errorToast(response.message || "Failed to fetch transactions.");
          setTransactions([]);
        }
      } catch (err: any) {
        errorToast(
          err.message || "An error occurred while fetching transactions."
        );
        setTransactions([]);
      } finally {
        setTransactionsLoading(false);
      }
    };

    fetchTransactions();
  }, [activeTab]);

  const tabs = [
    "Transactions",
    "My Holdings",
    "Top Traders",
    "Holders",
    "Bubblemaps",
    "Orders",
    "modal",
  ];

  const handleTabChange = (tab: string) => {
    if (tab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 150);
  };

  // Mobile Tabs UI
  const renderMobileTabs = () => {
    return (
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex border-b border-border min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-xs font-medium relative transition-colors duration-200 ease-in-out whitespace-nowrap ${
                activeTab === tab
                  ? "text-white border-b-2 border-white"
                  : "text-white/50 hover:text-white"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Mobile Dropdown Alternative
  const renderMobileDropdown = () => {
    return (
      <div className="px-4 py-2">
        <select
          value={activeTab}
          onChange={(e) => handleTabChange(e.target.value)}
          className="w-full bg-[#0e0f13] text-white rounded-sm px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {tabs.map((tab) => (
            <option key={tab} value={tab}>
              {tab}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Tab Content with Responsive Adaptations
  const renderTabContent = () => {
    return (
      <div
        className={`transition-opacity duration-150 ease-in-out ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {activeTab === "Transactions" && (
          <div className="p-4">
            <TransactionsTable
              transactions={transactions}
              isLoading={transactionsLoading}
            />
          </div>
        )}
        {activeTab === "My Holdings" && (
          <div className="p-4">
            <TokenHoldings />
          </div>
        )}
        {activeTab === "Top Traders" && (
          <div className="p-4">
            <TokenTopTraders />
          </div>
        )}
        {activeTab === "Holders" && (
          <div className="p-4">
            <TokenHolders />
          </div>
        )}
        {activeTab === "Bubblemaps" && (
          <div className="p-4">Bubblemaps content will go here</div>
        )}
        {activeTab === "Orders" && (
          <div className="p-4">
            <TokenOrders />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-[#0e0f13] border border-border text-white">
      {isMobile ? (
        <>
          {/* Mobile Layout */}
          {window.innerWidth < 480
            ? renderMobileDropdown()
            : renderMobileTabs()}
          <div className="relative">{renderTabContent()}</div>
        </>
      ) : (
        <>
          {/* Desktop Layout - Clean Minimalistic Design */}
          <div className="flex border-b border-border">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`relative px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "text-white border-b-2 border-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
                onClick={
                  tab !== "modal" ? () => handleTabChange(tab) : undefined
                }
              >
                <span className="flex items-center gap-2">
                  {tab === "Transactions" && (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {tab === "My Holdings" && (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                    </svg>
                  )}
                  {tab === "Top Traders" && (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {tab === "Holders" && (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  )}
                  {tab === "Bubblemaps" && (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {tab === "Orders" && (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {tab === "modal" && (
                    <div
                      onClick={() => setIsModalOpen(true)}
                      className="flex gap-1 items-center cursor-pointer bg-primary text-black rounded-sm hover:bg-hover-primary transition-colors text-sm font-medium px-3 py-1"
                    >
                      <ArrowLeftRight size={12} strokeWidth={2} />
                      Quick Swap
                    </div>
                  )}
                  {tab !== "modal" && tab}
                </span>
              </button>
            ))}
          </div>
          <div className="relative">{renderTabContent()}</div>
          {isModalOpen && (
            <DraggableModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
