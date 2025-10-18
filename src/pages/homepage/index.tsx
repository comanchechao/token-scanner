import React, { useMemo, useState, useEffect, useRef } from "react";
import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";
import ActivityFeed from "./components/ActivityFeed";
import HeroSearch from "./components/HeroSearch";
import TokenOverview from "./components/TokenOverview";
import KOLTraction from "./components/KOLTraction";
import TelegramCalls from "./components/TelegramCalls";
import SecurityAnalysis from "./components/SecurityAnalysis";
import DeveloperEcosystem from "./components/DeveloperEcosystem";
import NavigationSidebar from "./components/NavigationSidebar";
import "../../css/index.css";

type KolBuyer = {
  name: string;
  avatar?: string;
  amount: string;
  invested: string;
  followers: string;
};
type TelegramChannel = {
  name: string;
  members: string;
  mentions: number;
  sentiment: string;
};
type DevToken = {
  avatar?: string;
  name: string;
  symbol: string;
  address: string;
  link: string;
  marketCap: string;
  performance: string;
};

const MOCK_DATA = {
  token: {
    name: "Neural Protocol",
    symbol: "NEURAL",
    address: "0x742d35Cc6634C0532925a3b8D4C2C4e0a5c2F8B1",
    price: "$0.0847",
    marketCap: "$84.7M",
    volume24h: "$12.3M",
    holders: "47,832",
    narrative:
      "Revolutionary AI-native infrastructure token powering secure, low-latency inference across decentralized on-chain agents. Built for developers who demand speed, security, and scalability. Neural Protocol enables seamless integration of AI models with blockchain applications, featuring gas-optimized smart contracts and real-time data processing capabilities.",
  },
  kols: {
    count: 127,
    totalInvested: "$2.8M",
    top: [
      {
        name: "AlphaWhale",
        avatar: "/dogLogo.webp",
        amount: "47.2K",
        invested: "$3.2K",
        followers: "284K",
      },
      {
        name: "CryptoSensei",
        avatar: "/dogLogo.webp",
        amount: "31.8K",
        invested: "$2.7K",
        followers: "156K",
      },
      {
        name: "DeFiNinja",
        avatar: "/goldenCoinLogo.webp",
        amount: "28.4K",
        invested: "$2.4K",
        followers: "198K",
      },
      {
        name: "MoonChaser",
        avatar: "/HosicoLogo.webp",
        amount: "24.1K",
        invested: "$2.0K",
        followers: "89K",
      },
      {
        name: "SignalMaster",
        avatar: "/uselessLogo.webp",
        amount: "19.7K",
        invested: "$1.7K",
        followers: "112K",
      },
    ] as KolBuyer[],
  },
  telegram: {
    count: 34,
    totalMembers: "847K",
    top: [
      {
        name: "Alpha Calls Premium",
        members: "184K",
        mentions: 47,
        sentiment: "Bullish",
      },
      {
        name: "Whale Radar Signals",
        members: "156K",
        mentions: 32,
        sentiment: "Bullish",
      },
      {
        name: "AI Agent Alerts",
        members: "98K",
        mentions: 28,
        sentiment: "Neutral",
      },
    ] as TelegramChannel[],
  },
  security: [
    {
      label: "Liquidity Locked",
      status: "pass" as const,
      detail: "95% locked for 2 years",
    },
    {
      label: "Contract Verified",
      status: "pass" as const,
      detail: "Audited by CertiK",
    },
    {
      label: "Mint Authority",
      status: "pass" as const,
      detail: "Fully revoked",
    },
    {
      label: "Ownership",
      status: "pass" as const,
      detail: "Renounced to multisig",
    },
    {
      label: "Honeypot Check",
      status: "pass" as const,
      detail: "No malicious code",
    },
    {
      label: "Tax Analysis",
      status: "warn" as const,
      detail: "2% buy/sell tax",
    },
    {
      label: "Rug Pull Risk",
      status: "pass" as const,
      detail: "Very low risk",
    },
    {
      label: "Team Tokens",
      status: "warn" as const,
      detail: "8% team allocation",
    },
  ],
  devTokens: [
    {
      avatar: "/bonkKOLsLogo.webp",
      name: "Neural Builder",
      symbol: "NBUILD",
      address: "0x1a2B3c4D5e6F7890AbCdEf1234567890aBcDeF12",
      link: "https://dexscreener.com/ethereum/0x1a2B3c4D5e6F7890AbCdEf1234567890aBcDeF12",
      marketCap: "$1.2M",
      performance: "+127%",
    },
    {
      avatar: "/logoKOL.png",
      name: "Agent Hub",
      symbol: "AGENT",
      address: "0x9f8e7d6c5b4a39281f0e1d2c3b4a5968778899aa",
      link: "https://dexscreener.com/ethereum/0x9f8e7d6c5b4a39281f0e1d2c3b4a5968778899aa",
      marketCap: "$890K",
      performance: "+89%",
    },
    {
      avatar: "/cherryLogo.png",
      name: "SignalsX Pro",
      symbol: "SIGX",
      address: "0x5a4b3c2d1e0f9876543210fedcba0987654321ab",
      link: "https://dexscreener.com/ethereum/0x5a4b3c2d1e0f9876543210fedcba0987654321ab",
      marketCap: "$2.1M",
      performance: "+203%",
    },
    {
      avatar: "/okxlogo.webp",
      name: "LatencyNet",
      symbol: "LNET",
      address: "0x7c8d9e0f1a2b3c4d5e6f7890abcdef1234567890",
      link: "https://dexscreener.com/ethereum/0x7c8d9e0f1a2b3c4d5e6f7890abcdef1234567890",
      marketCap: "$650K",
      performance: "+45%",
    },
    {
      name: "DeepMind Token",
      symbol: "DEEP",
      address: "0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7890abcdef12",
      link: "https://dexscreener.com/ethereum/0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7890abcdef12",
      marketCap: "$3.4M",
      performance: "+156%",
    },
    {
      name: "Quantum AI",
      symbol: "QNTM",
      address: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
      link: "https://dexscreener.com/ethereum/0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
      marketCap: "$780K",
      performance: "+67%",
    },
  ] as DevToken[],
};

// Mock activity data for the activity feed
const MOCK_ACTIVITIES = [
  {
    id: "1",
    name: "AlphaWhale",
    avatar: "/dogLogo.webp",
    action: "bought",
    amount: "47.2K",
    token: "NEURAL",
    price: "$0.0847",
    timestamp: "2m ago",
    type: "buy" as const,
    walletAddress: "0x742d35Cc6634C0532925a3b8D4C2C4e0a5c2F8B1",
    tokenAddress: "0x742d35Cc6634C0532925a3b8D4C2C4e0a5c2F8B1",
    transactionHash: "0x1234567890abcdef1234567890abcdef12345678",
    solSpent: "3.2 SOL",
  },
  {
    id: "2",
    name: "CryptoSensei",
    avatar: "/dogLogo.webp",
    action: "sold",
    amount: "12.8K",
    token: "AGENT",
    price: "$0.0234",
    timestamp: "5m ago",
    type: "sell" as const,
    walletAddress: "0x9f8e7d6c5b4a39281f0e1d2c3b4a5968778899aa",
    tokenAddress: "0x9f8e7d6c5b4a39281f0e1d2c3b4a5968778899aa",
    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef12",
    solSpent: "1.8 SOL",
  },
  {
    id: "3",
    name: "DeFiNinja",
    avatar: "/goldenCoinLogo.webp",
    action: "bought",
    amount: "28.4K",
    token: "SIGX",
    price: "$0.0156",
    timestamp: "8m ago",
    type: "buy" as const,
    walletAddress: "0x5a4b3c2d1e0f9876543210fedcba0987654321ab",
    tokenAddress: "0x5a4b3c2d1e0f9876543210fedcba0987654321ab",
    transactionHash: "0x567890abcdef1234567890abcdef1234567890ab",
    solSpent: "2.4 SOL",
  },
  {
    id: "4",
    name: "MoonChaser",
    avatar: "/HosicoLogo.webp",
    action: "bought",
    amount: "19.7K",
    token: "LNET",
    price: "$0.0089",
    timestamp: "12m ago",
    type: "buy" as const,
    walletAddress: "0x7c8d9e0f1a2b3c4d5e6f7890abcdef1234567890",
    tokenAddress: "0x7c8d9e0f1a2b3c4d5e6f7890abcdef1234567890",
    transactionHash: "0xcdef1234567890abcdef1234567890abcdef1234",
    solSpent: "1.7 SOL",
  },
  {
    id: "5",
    name: "SignalMaster",
    avatar: "/uselessLogo.webp",
    action: "sold",
    amount: "35.1K",
    token: "DEEP",
    price: "$0.0312",
    timestamp: "15m ago",
    type: "sell" as const,
    walletAddress: "0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7890abcdef12",
    tokenAddress: "0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7890abcdef12",
    transactionHash: "0xef1234567890abcdef1234567890abcdef123456",
    solSpent: "2.9 SOL",
  },
  {
    id: "6",
    name: "WhaleTracker",
    avatar: "/bonkKOLsLogo.webp",
    action: "bought",
    amount: "52.3K",
    token: "QNTM",
    price: "$0.0445",
    timestamp: "18m ago",
    type: "buy" as const,
    walletAddress: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
    tokenAddress: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
    transactionHash: "0x234567890abcdef1234567890abcdef1234567890",
    solSpent: "4.1 SOL",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
};

// Mock search suggestions for non-address searches
const MOCK_SUGGESTIONS = [
  {
    name: "Ethereum",
    symbol: "ETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    address: "0xA0b86a33E6441c8C06DD2b7c94b7E6E8b8B8B8B8",
  },
  {
    name: "Chainlink",
    symbol: "LINK",
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  },
  {
    name: "Uniswap",
    symbol: "UNI",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  },
  {
    name: "Polygon",
    symbol: "MATIC",
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  },
];

const HomePage: React.FC = () => {
  const [input, setInput] = useState("");
  const [scanned, setScanned] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof MOCK_SUGGESTIONS>([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isNavSticky, setIsNavSticky] = useState(false);

  const data = useMemo(() => MOCK_DATA, []);
  const activities = useMemo(() => MOCK_ACTIVITIES, []);
  const activityFeedRef = useRef<HTMLDivElement>(null);

  const sections = [
    {
      id: "overview",
      label: "Token Overview",
      icon: "material-symbols:info-outline",
    },
    { id: "kols", label: "KOL Traction", icon: "material-symbols:group" },
    { id: "telegram", label: "Telegram Calls", icon: "ic:baseline-telegram" },
    {
      id: "security",
      label: "Security Analysis",
      icon: "material-symbols:security",
    },
    { id: "devtokens", label: "Dev Ecosystem", icon: "material-symbols:token" },
  ];

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const navRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    if (!scanned) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: [0.1, 0.5, 0.9],
        rootMargin: "-100px 0px -100px 0px",
      }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [scanned]);

  useEffect(() => {
    if (!scanned || !navRef.current) return;

    const originalNavTop = navRef.current.offsetTop;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsNavSticky(scrollTop > originalNavTop);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [scanned]);

  const isValidAddress = (str: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(str);
  };

  const handleInputChange = (value: string) => {
    setInput(value);

    if (value.trim().length > 1 && !isValidAddress(value.trim())) {
      const filtered = MOCK_SUGGESTIONS.filter(
        (token) =>
          token.name.toLowerCase().includes(value.toLowerCase()) ||
          token.symbol.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: (typeof MOCK_SUGGESTIONS)[0]) => {
    setInput(suggestion.address);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleScan = () => {
    if (input.trim()) {
      setScanned(true);
      setShowSuggestions(false);
    }
  };

  const handleBackToList = () => {
    setScanned(false);
    setInput("");
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleInputChange(text.trim());
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen bg-main-bg !overflow-x-hidden bg-grid flex flex-col">
      <Navbar />

      {/* Hero + Search */}
      <HeroSearch
        scanned={scanned}
        input={input}
        showSuggestions={showSuggestions}
        suggestions={suggestions}
        onInputChange={handleInputChange}
        onSuggestionClick={handleSuggestionClick}
        onScan={handleScan}
        onPaste={handlePaste}
        onFocus={() => {
          if (suggestions.length > 0) setShowSuggestions(true);
        }}
        onBlur={() => {
          setTimeout(() => setShowSuggestions(false), 200);
        }}
        onCloseSuggestions={() => setShowSuggestions(false)}
      />

      {/* Activity Feed - Show when not scanned */}
      {!scanned && (
        <section className="relative z-10 pb-20 flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ActivityFeed activities={activities} feedRef={activityFeedRef} />
          </div>
        </section>
      )}

      {/* Results - Only show after search */}
      {scanned && (
        <section className="relative z-10 pb-20 flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              {/* Navigation Sidebar */}
              <NavigationSidebar
                sections={sections}
                activeSection={activeSection}
                isNavSticky={isNavSticky}
                showMobileNav={showMobileNav}
                onScrollToSection={scrollToSection}
                onBackToList={handleBackToList}
                onToggleMobileNav={() => setShowMobileNav(!showMobileNav)}
                navRef={navRef}
              />

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Token Overview */}
                <TokenOverview
                  token={data.token}
                  custom={0}
                  variants={cardVariants}
                  sectionRef={(el) => (sectionRefs.current.overview = el)}
                />

                {/* KOLs and Telegram */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <KOLTraction
                    kolData={data.kols}
                    custom={1}
                    variants={cardVariants}
                    sectionRef={(el) => (sectionRefs.current.kols = el)}
                  />

                  <TelegramCalls
                    telegramData={data.telegram}
                    custom={2}
                    variants={cardVariants}
                    sectionRef={(el) => (sectionRefs.current.telegram = el)}
                  />
                </div>

                {/* Security Analysis */}
                <SecurityAnalysis
                  securityData={data.security}
                  custom={3}
                  variants={cardVariants}
                  sectionRef={(el) => (sectionRefs.current.security = el)}
                />

                {/* Developer Ecosystem */}
                <DeveloperEcosystem
                  devTokens={data.devTokens}
                  custom={4}
                  variants={cardVariants}
                  sectionRef={(el) => (sectionRefs.current.devtokens = el)}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default HomePage;
