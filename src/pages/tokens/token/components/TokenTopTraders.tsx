import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

// Mock data structure
interface TraderData {
  rank: number;
  maker: string;
  invested: {
    amount: string;
    quantity: string;
    txn: number;
  };
  sold: {
    amount: string;
    quantity: string;
    txn: number;
  };
  pnl: string;
  remaining: string;
  balance: {
    current: string;
    total: string;
    percentage: number;
  };
}

export default function TokenTopTradersV2() {
  const [isMobile, setIsMobile] = useState(false);
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

  // Mock data
  const traders: TraderData[] = [
    {
      rank: 1,
      maker: "3Qh...zDJ",
      invested: {
        amount: "$0.93",
        quantity: "283K",
        txn: 1,
      },
      sold: {
        amount: "$0",
        quantity: "0",
        txn: 0,
      },
      pnl: "-$0.93",
      remaining: "$0.93",
      balance: {
        current: "283K",
        total: "283K",
        percentage: 100,
      },
    },
    {
      rank: 2,
      maker: "UFT...4fc",
      invested: {
        amount: "$2.35",
        quantity: "715K",
        txn: 1,
      },
      sold: {
        amount: "$0",
        quantity: "0",
        txn: 0,
      },
      pnl: "-$2.35",
      remaining: "$2.37",
      balance: {
        current: "715K",
        total: "715K",
        percentage: 100,
      },
    },
  ];

  const renderMobileCards = () => {
    return (
      <div className="space-y-4">
        {traders.map((trader, index) => (
          <div
            key={index}
            className="bg-[#1e1e1e] rounded-md p-4 border border-gray-800"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">#{trader.rank}</span>
                <div className="flex items-center gap-1">
                  <Icon
                    icon="icon-park-twotone:blockchain"
                    width="18"
                    height="18"
                  />
                  <span className="text-primary text-sm">{trader.maker}</span>
                </div>
              </div>
              <div className="text-red-500 font-medium">{trader.pnl}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-gray-400 text-xs mb-1">Invested</p>
                <p className="text-red-500">{trader.invested.amount}</p>
                <p className="text-gray-500 text-xs">
                  {trader.invested.quantity} / {trader.invested.txn} txn
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-1">Sold</p>
                <p className="text-green-500">{trader.sold.amount}</p>
                <p className="text-gray-500 text-xs">
                  {trader.sold.quantity} / {trader.sold.txn} txns
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-1">Remaining</p>
                <p className="text-white">{trader.remaining}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-1">Balance</p>
                <p className="text-white text-sm">
                  {trader.balance.current} of {trader.balance.total}
                </p>
              </div>
            </div>

            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mb-3">
              <div
                className="bg-primary h-full"
                style={{ width: `${trader.balance.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full  bg-[#0e0f13] border-t border-x border-border rounded-lg overflow-hidden">
      {isMobile ? (
        renderMobileCards()
      ) : (
        <>
          {/* Table Header */}
          <div className="grid grid-cols-8 border-b border-gray-800 py-3 px-6 text-sm font-medium">
            <div className="flex items-center gap-1 text-gray-500 cursor-pointer duration-200 transition-all ease-in hover:text-white">
              Rank
            </div>
            <div className="flex items-center gap-1 text-gray-500 cursor-pointer duration-200 transition-all ease-in hover:text-white">
              Maker
            </div>
            <div className="flex items-center gap-1 text-gray-500 cursor-pointer duration-200 transition-all ease-in hover:text-white">
              Invested
            </div>
            <div className="flex items-center gap-1 text-gray-500 cursor-pointer duration-200 transition-all ease-in hover:text-white">
              Sold
            </div>
            <div className="flex items-center gap-1 text-gray-500 cursor-pointer duration-200 transition-all ease-in hover:text-white">
              P&L
            </div>
            <div className="flex items-center gap-1 text-gray-500 cursor-pointer duration-200 transition-all ease-in hover:text-white">
              Remaining
            </div>
            <div className="flex items-center gap-1 text-gray-500 cursor-pointer duration-200 transition-all ease-in hover:text-white">
              Balance
            </div>
            <div className="flex items-center gap-1 text-gray-500 cursor-pointer duration-200 transition-all ease-in hover:text-white">
              TXNS
            </div>
          </div>

          {/* Table Rows */}
          {traders.map((trader, index) => (
            <div
              key={index}
              className="grid grid-cols-8 py-4 px-6 border-b border-gray-800 text-sm items-center hover:bg-gray-900 transition-colors"
            >
              <div className="text-gray-400">#{trader.rank}</div>
              <div className="flex items-center gap-2">
                <Icon
                  icon="icon-park-twotone:blockchain"
                  width="24"
                  height="24"
                />
                <span className="text-primary">{trader.maker}</span>
              </div>
              <div className="flex flex-col text-red-500">
                <div>{trader.invested.amount}</div>
                <div className="text-gray-500 text-xs">
                  {trader.invested.quantity} / {trader.invested.txn} txn
                </div>
              </div>
              <div className="flex flex-col text-green-500">
                <div>{trader.sold.amount}</div>
                <div className="text-gray-500 text-xs">
                  {trader.sold.quantity} / {trader.sold.txn} txns
                </div>
              </div>
              <div className="text-red-500">{trader.pnl}</div>
              <div className="text-white">{trader.remaining}</div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col mr-2">
                  <div className="text-white">
                    {trader.balance.current} of {trader.balance.total}
                  </div>
                  <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full"
                      style={{ width: `${trader.balance.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="text-gray-400 hover:text-white border border-gray-800 rounded-full p-1">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
