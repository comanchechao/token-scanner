"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/widgets/Header/Header";
import Skeleton from "@/components/ui/Skeleton";
import TokenInfo from "../components/TokenInfo";
import TokenStats from "../components/TokenStats";
import TokenDetailTabs from "../components/TokenDetailTabs";
import TokenBuySellPanel from "../components/TokenBuySellPanel";
import TokenChart from "../components/TokenChart";
import MobileTokenLayout from "app/components/MobileTokenLayout";
import MobileNavigation from "app/components/MobileNavigation";
import BondingCurveCard from "../components/BondingCurveCard";
import DataSecurityCard from "../components/DataSecurityCard";

interface TokenData {
  name: string;
  symbol: string;
  mint: string;
  decimals: number;
  image: string;
  uri?: string;
  solBalance: number;
  usdBalance: number;
  solChanges: number;
  tokenBalanceChanges: number;
  transactionsCount: number;
  supply: number;
  holdersCount: number;
  createdAt: string;
  buyPrice?: string;
  sellPrice?: string;
  confidenceLevel?: string;
}

interface TokenDetailPageProps {
  params: { mint: string };
  searchParams?: Record<string, string | string[]>;
}

export default function TokenDetailPage({ params, searchParams }: any) {
  const unwrappedParams = React.use(params as any as Promise<{ mint: string }>);
  const mintAddress = unwrappedParams.mint;
  const urlSearchParams = useSearchParams();

  const router = useRouter();
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("trade");
  const [type, setType] = useState<"buy" | "sell">("buy");
  useEffect(() => {
    const name = urlSearchParams.get("name") || "Unknown Token";
    const symbol = urlSearchParams.get("symbol") || "";
    const image = urlSearchParams.get("image") || "";
    const typeFromUrl = urlSearchParams.get("type");
    const initialType: "buy" | "sell" =
      typeFromUrl === "buy" || typeFromUrl === "sell" ? typeFromUrl : "buy";
    setType(initialType);
    const tokenDataFromParams: TokenData = {
      name: name,
      symbol: symbol,
      mint: mintAddress,
      decimals: 9,
      image: image,
      solBalance: Math.random() * 0.1 + 0.01,
      usdBalance: Math.random() * 10 + 1,
      solChanges: (Math.random() - 0.5) * 10,
      tokenBalanceChanges: Math.floor(Math.random() * 1000000) + 100000,
      transactionsCount: Math.floor(Math.random() * 100000) + 1000,
      supply: Math.floor(Math.random() * 900000000) + 100000000,
      holdersCount: Math.floor(Math.random() * 50000) + 1000,
      createdAt: new Date().toISOString(),
      buyPrice: (Math.random() * 0.1 + 0.01).toFixed(6),
      sellPrice: (Math.random() * 0.1 + 0.01).toFixed(6),
      confidenceLevel: "medium",
    };

    setTokenData(tokenDataFromParams);
    setLoading(false);
  }, [mintAddress, urlSearchParams]);

  if (loading) {
    return (
      <div className="min-h-screen   bg-black text-white">
        <Header />
        <div className="container pt-20 mx-auto px-4 mt-5 py-4">
          {/* Token Header Skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Skeleton width={40} height={40} className="rounded-full" />
              <div>
                <Skeleton width={120} height={24} className="mb-2" />
                <Skeleton width={80} height={16} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton width={32} height={32} className="rounded" />
              <Skeleton width={32} height={32} className="rounded" />
              <Skeleton width={32} height={32} className="rounded" />
            </div>
          </div>

          {/* Price Stats Skeleton */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-[#111111] rounded p-3">
                <Skeleton width={60} height={16} className="mb-2" />
                <Skeleton width={80} height={20} />
              </div>
            ))}
          </div>

          {/* Chart section skeleton */}
          <div className="bg-[#111111] rounded-lg h-64 mb-6">
            <Skeleton width="100%" height="100%" />
          </div>
        </div>
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="min-h-screen pt-20 bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Token not found</div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-screen  bg-[#0b0b0c] text-white">
      <Header />
      {/* Desktop Layout */}
      <div className="hidden  md:flex md:items-start md:justify-center   w-full   h-fit">
        <div className="w-full h-full rounded-sm">
          <TokenInfo data={tokenData} />
          <TokenChart tokenMint={mintAddress} />
          <TokenDetailTabs mint={mintAddress} />
        </div>
        <div className="   w-[30rem]    space-y-0 bg-[#0e0f13] border-x border-border  ">
          <TokenBuySellPanel
            tokenMint={mintAddress}
            tokenName={tokenData.name}
            address={mintAddress}
            initialTab="sell"
          />

          <TokenStats
            timeframes={{
              "5M": { percentage: 10 },
              "1H": { percentage: "N/A" },
              "6H": { percentage: -20 },
              "24h": { percentage: "N/A" },
            }}
            transactions={{
              total: 100,
              buys: 50,
              sells: 50,
              buyVolume: 1000,
              sellVolume: 1000,
              buyers: 100,
              sellers: 100,
            }}
          />
          <BondingCurveCard />
          <DataSecurityCard />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden pt-20">
        <MobileTokenLayout
          activeTab={activeTab}
          tokenData={tokenData}
          mintAddress={mintAddress}
        />
        <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
