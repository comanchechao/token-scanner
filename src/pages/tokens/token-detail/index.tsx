import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../../layouts/Navbar";
import Footer from "../../../layouts/Footer";
import TokenInfo from "./components/TokenInfo";
import TokenStats from "./components/TokenStats";
import TokenNarrative from "./components/TokenNarrative";
import Transactions from "./components/Transactions";
import MobileBottomNav from "./components/MobileBottomNav";
import DataSecurityCard from "./components/DataSecurityCard";
import KOLTraction from "./components/KOLTraction";
import TelegramCalls from "./components/TelegramCalls";
import SecurityAnalysis from "./components/SecurityAnalysis";
import DeveloperEcosystem from "./components/DeveloperEcosystem";
import { getTokenData } from "../../../data/mockTokenData";
import { Icon } from "@iconify/react";

const TokenDetailPage: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const [activeMobileTab, setActiveMobileTab] = useState<
    "info" | "chart+txns" | "chart" | "txns"
  >("chart+txns");
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

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

      <div className="flex-1 pt-4 pb-20 lg:pb-8">
        <div className="mx-auto px-4 max-w-[2000px]">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 text-main-light-text hover:text-main-accent transition-colors duration-200"
          >
            <Icon icon="material-symbols:arrow-back" className="w-5 h-5" />
            <span className="font-display text-sm">Back</span>
          </button>

          {/* Header */}

          {/* Desktop Layout */}
          {isDesktop ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {" "}
              <div className="lg:col-span-12 bg-[#0e0f13] border border-subtle rounded-sm mb-4">
                <TokenInfo data={tokenInfoData} />
              </div>
              {/* Left: DexScreener Chart and Transactions */}
              <div className="lg:col-span-9 space-y-4">
                <div className="bg-surface border border-subtle rounded-sm overflow-hidden">
                  <iframe
                    src={`https://dexscreener.com/bsc/0xd6b652aecb704b0aebec6317315afb90ba641d57?embed=1&theme=dark&trades=0&info=0`}
                    className="w-full h-full"
                    style={{ border: 0, minHeight: "640px" }}
                    title={`${token.name} Chart`}
                  />
                </div>

                {token.transactions && (
                  <Transactions transactions={token.transactions} />
                )}
              </div>
              {/* Right: Token information & analytics */}
              <div className="lg:col-span-3 overflow-y-auto max-h-[calc(100vh-200px)]">
                <TokenNarrative narrative={token.description} />
                <TokenStats />
                <KOLTraction
                  kolData={{
                    count: token.kolActivity.totalKOLs,
                    totalInvested: token.kolActivity.totalInvested,
                    top: token.kolActivity.topKOLs.map((kol) => ({
                      name: kol.name,
                      avatar: kol.avatar,
                      amount: kol.balance,
                      invested: kol.invested,
                      followers: "12.5K",
                    })),
                  }}
                />
                <TelegramCalls
                  telegramData={{
                    count: 8,
                    totalMembers: "2.4M",
                    top: [
                      {
                        name: "Crypto Signals Pro",
                        members: "450K",
                        mentions: 23,
                        sentiment: "Bullish",
                      },
                      {
                        name: "DeFi Alpha",
                        members: "320K",
                        mentions: 18,
                        sentiment: "Bullish",
                      },
                      {
                        name: "Token Tracker",
                        members: "280K",
                        mentions: 15,
                        sentiment: "Neutral",
                      },
                    ],
                  }}
                />
                <SecurityAnalysis securityData={token.security.checks} />
                <DeveloperEcosystem
                  devTokens={[
                    {
                      name: "Neural SDK",
                      symbol: "NSDK",
                      address: "0x123...abc",
                      link: "#",
                      marketCap: "$5.2M",
                      performance: "+12.5%",
                    },
                    {
                      name: "AI Protocol",
                      symbol: "AIP",
                      address: "0x456...def",
                      link: "#",
                      marketCap: "$3.8M",
                      performance: "+8.2%",
                    },
                    {
                      name: "Smart Contracts",
                      symbol: "SC",
                      address: "0x789...ghi",
                      link: "#",
                      marketCap: "$2.1M",
                      performance: "-3.1%",
                    },
                  ]}
                />
                <DataSecurityCard />
              </div>
            </div>
          ) : (
            /* Mobile Layout - Show only selected content */
            <div className="space-y-4">
              {activeMobileTab === "info" && (
                <div className="space-y-4">
                  <TokenNarrative narrative={token.description} />
                  <TokenStats />
                  <KOLTraction
                    kolData={{
                      count: token.kolActivity.totalKOLs,
                      totalInvested: token.kolActivity.totalInvested,
                      top: token.kolActivity.topKOLs.map((kol) => ({
                        name: kol.name,
                        avatar: kol.avatar,
                        amount: kol.balance,
                        invested: kol.invested,
                        followers: "12.5K",
                      })),
                    }}
                  />
                  <TelegramCalls
                    telegramData={{
                      count: 8,
                      totalMembers: "2.4M",
                      top: [
                        {
                          name: "Crypto Signals Pro",
                          members: "450K",
                          mentions: 23,
                          sentiment: "Bullish",
                        },
                        {
                          name: "DeFi Alpha",
                          members: "320K",
                          mentions: 18,
                          sentiment: "Bullish",
                        },
                        {
                          name: "Token Tracker",
                          members: "280K",
                          mentions: 15,
                          sentiment: "Neutral",
                        },
                      ],
                    }}
                  />
                  <SecurityAnalysis securityData={token.security.checks} />
                  <DeveloperEcosystem
                    devTokens={[
                      {
                        name: "Neural SDK",
                        symbol: "NSDK",
                        address: "0x123...abc",
                        link: "#",
                        marketCap: "$5.2M",
                        performance: "+12.5%",
                      },
                      {
                        name: "AI Protocol",
                        symbol: "AIP",
                        address: "0x456...def",
                        link: "#",
                        marketCap: "$3.8M",
                        performance: "+8.2%",
                      },
                      {
                        name: "Smart Contracts",
                        symbol: "SC",
                        address: "0x789...ghi",
                        link: "#",
                        marketCap: "$2.1M",
                        performance: "-3.1%",
                      },
                    ]}
                  />
                  <DataSecurityCard />
                </div>
              )}

              {activeMobileTab === "chart" && (
                <div className="bg-surface border border-subtle rounded-sm overflow-hidden">
                  <iframe
                    src={`https://dexscreener.com/bsc/0xd6b652aecb704b0aebec6317315afb90ba641d57?embed=1&theme=dark&trades=0&info=0`}
                    className="w-full h-full"
                    style={{ border: 0, minHeight: "640px" }}
                    title={`${token.name} Chart`}
                  />
                </div>
              )}

              {activeMobileTab === "txns" && token.transactions && (
                <Transactions transactions={token.transactions} />
              )}

              {activeMobileTab === "chart+txns" && (
                <div className="space-y-4">
                  <div className="bg-surface border border-subtle rounded-sm overflow-hidden">
                    <iframe
                      src={`https://dexscreener.com/bsc/0xd6b652aecb704b0aebec6317315afb90ba641d57?embed=1&theme=dark&trades=0&info=0`}
                      className="w-full h-full"
                      style={{ border: 0, minHeight: "640px" }}
                      title={`${token.name} Chart`}
                    />
                  </div>
                  {token.transactions && (
                    <Transactions transactions={token.transactions} />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeMobileTab}
        onTabChange={setActiveMobileTab}
      />

      <Footer />
    </div>
  );
};

export default TokenDetailPage;
