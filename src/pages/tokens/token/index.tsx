import React, { useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../../layouts/Navbar";
import Footer from "../../../layouts/Footer";
import TokenInfo from "./components/TokenInfo";
import TokenStats from "./components/TokenStats";
import DataSecurityCard from "./components/DataSecurityCard";
import BuySellPanel from "./components/BuySellPanel";
import { getTokenData } from "../../../data/mockTokenData";
import { Icon } from "@iconify/react";

const TokenDetailPage: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);

  const token = useMemo(
    () => (address ? getTokenData(address) : null),
    [address]
  );

  if (!token) {
    return (
      <div className="min-h-screen bg-main-bg bg-grid flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon
              icon="material-symbols:error-outline"
              className="w-16 h-16 text-red-400 mx-auto mb-4"
            />
            <h2 className="font-mono text-2xl text-main-text mb-2">
              Token Not Found
            </h2>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-main-accent/10 hover:bg-main-accent/20 border border-main-accent/30 rounded-lg text-main-accent transition-all duration-200"
            >
              Go Back Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const tokenInfoData = {
    name: token.name,
    usdBalance: 12.9,
    solBalance: 0.0847,
    supply: 1_000_000_000,
    mint: token.address,
    image: token.image,
    symbol: token.symbol,
  };

  return (
    <div className="min-h-screen bg-main-bg bg-grid flex flex-col">
      <Navbar />

      <div className="flex-1 pt-4 pb-8">
        <div className="mx-auto px-4 max-w-[2000px]">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 text-main-light-text hover:text-main-accent transition-colors duration-200"
          >
            <Icon icon="material-symbols:arrow-back" className="w-5 h-5" />
            <span className="font-display text-sm">Back</span>
          </button>

          {/* Header */}
          <div className="bg-[#0e0f13] border border-subtle rounded-sm mb-4">
            <TokenInfo data={tokenInfoData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-220px)]">
            {/* Left: DexScreener Chart */}
            <div className="lg:col-span-9 bg-surface border border-subtle rounded-sm overflow-hidden">
              <iframe
                src={`https://dexscreener.com/bsc/0xd6b652aecb704b0aebec6317315afb90ba641d57?embed=1&theme=dark&trades=0&info=0`}
                className="w-full h-full"
                style={{ border: 0, minHeight: "640px" }}
                title={`${token.name} Chart`}
              />
            </div>

            {/* Right: Minimal info & analytics */}
            <div className="lg:col-span-3  overflow-y-auto">
              <BuySellPanel address={token.address} />
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

              <DataSecurityCard />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TokenDetailPage;
