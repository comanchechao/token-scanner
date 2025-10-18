import React, { useMemo, useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";
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
        avatar: "/okxlogo.webp",
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
      <section
        className={`relative z-10 flex-1 flex flex-col justify-center transition-all duration-500 ${
          !scanned ? "pt-32 pb-32" : "pt-16 pb-8"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {!scanned ? (
            // Centered search when not scanned
            <div className="flex flex-col items-center justify-center">
              <motion.h1
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="font-mono text-4xl md:text-6xl text-main-text mb-4 leading-tight"
              >
                Token Find
              </motion.h1>
              <p className="font-display text-lg md:text-xl text-main-light-text/70 mb-12 max-w-2xl">
                Analyze any token instantly - get KOL insights, security checks,
                and dev connections
              </p>
            </div>
          ) : (
            // Compact header when scanned
            <>
              <motion.h1
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="font-mono text-3xl md:text-5xl text-main-text mb-3 leading-tight"
              >
                Find everything about a token
                <span className="text-main-accent"> in one place</span>
              </motion.h1>
              <p className="font-display text-base md:text-lg text-main-light-text/80 mb-8">
                Paste a token address to see narrative, KOL traction, Telegram
                calls, security, and dev tokens.
              </p>
            </>
          )}

          {/* Search Input - shown in both states */}
          <div
            className={`${
              !scanned ? "max-w-2xl w-full mx-auto" : "max-w-3xl mx-auto"
            }`}
          >
            <div
              className={`relative bg-[#161616] hover:bg-white/[0.05] border border-white/[0.1] hover:border-main-accent/40 transition-all duration-300 ${
                !scanned ? "rounded-lg" : "rounded-sm"
              }`}
            >
              <Icon
                icon="solar:magnifer-linear"
                className="absolute left-5 top-1/2 -translate-y-1/2 text-main-light-text/60 w-6 h-6"
              />
              <input
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e.target.value)
                }
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onBlur={() => {
                  // Delay hiding to allow clicking on suggestions
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                placeholder={
                  !scanned
                    ? "Search by token name or paste address..."
                    : "Paste token address or search by name..."
                }
                className="w-full pl-14 pr-40 py-4 bg-transparent text-main-text placeholder-main-light-text/60 font-display text-base focus:outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                <button
                  onClick={handlePaste}
                  className="px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-main-light-text text-sm cursor-pointer"
                >
                  Paste
                </button>
                <button
                  onClick={handleScan}
                  className="px-4 py-2 rounded-lg bg-main-accent hover:bg-main-highlight text-main-bg font-display text-sm cursor-pointer transition-colors"
                >
                  {!scanned ? "Analyze" : "Analyze"}
                </button>
              </div>
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#161616] border border-white/[0.1] rounded-lg shadow-2xl z-50 max-h-64 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.address}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-white/[0.05] border-b border-white/[0.05] last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-display text-main-text font-medium">
                          {suggestion.name}
                        </div>
                        <div className="font-display text-sm text-main-light-text/60">
                          {suggestion.symbol}
                        </div>
                      </div>
                      <div className="font-mono text-xs text-main-light-text/40">
                        {suggestion.address.slice(0, 6)}...
                        {suggestion.address.slice(-4)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results - Only show after search */}
      {scanned && (
        <section className="relative z-10 pb-20 flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mobile Navigation Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowMobileNav(!showMobileNav)}
                className="flex items-center gap-2 px-4 py-2 bg-[#161616] border border-white/[0.1] rounded-sm text-main-text hover:border-main-accent/40 transition-colors"
              >
                <Icon icon="material-symbols:menu" className="w-5 h-5" />
                <span className="font-display text-sm">Navigation</span>
                <Icon
                  icon={
                    showMobileNav
                      ? "material-symbols:expand-less"
                      : "material-symbols:expand-more"
                  }
                  className="w-5 h-5"
                />
              </button>

              {showMobileNav && (
                <div className="mt-2 bg-[#161616] border border-white/[0.1] rounded-sm p-4">
                  <nav className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => {
                          scrollToSection(section.id);
                          setShowMobileNav(false);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded text-left transition-all duration-200 ${
                          activeSection === section.id
                            ? "bg-main-accent/20 text-main-accent"
                            : "text-main-light-text hover:bg-white/[0.05] hover:text-main-accent"
                        }`}
                      >
                        <Icon icon={section.icon} className="w-4 h-4" />
                        <span className="font-display text-xs">
                          {section.label}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </div>

            <div className="flex gap-8">
              {/* Left Sidebar Navigation */}
              <div className="hidden lg:block w-64 flex-shrink-0">
                <div
                  ref={navRef}
                  className={`w-64 bg-[#161616] border border-white/[0.1] rounded-sm p-4 transition-all duration-200 ${
                    isNavSticky
                      ? "fixed top-24 z-40 max-h-[calc(100vh-1rem)] overflow-y-auto"
                      : "relative"
                  }`}
                >
                  <h3 className="font-mono text-lg text-main-text mb-4">
                    Navigation
                  </h3>
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-all duration-200 ${
                          activeSection === section.id
                            ? "bg-main-accent/20 text-main-accent border-l-2 border-main-accent"
                            : "text-main-light-text hover:bg-white/[0.05] hover:text-main-accent"
                        }`}
                      >
                        <Icon icon={section.icon} className="w-4 h-4" />
                        <span className="font-display text-sm">
                          {section.label}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Token Overview */}
                <motion.div
                  id="overview"
                  ref={(el) => (sectionRefs.current.overview = el)}
                  custom={0}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="group bg-[#161616] border border-white/[0.1] hover:border-main-accent/30 rounded-sm p-6 md:p-8 mb-8"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h2 className="font-mono text-2xl text-main-text">
                          {data.token.name}
                        </h2>
                        <span className="px-3 py-1 font-bold bg-main-accent/20 text-main-accent font-display text-sm rounded-full">
                          ${data.token.symbol}
                        </span>
                      </div>
                      <p className="font-display text-main-light-text/90 mb-4 leading-relaxed">
                        {data.token.narrative}
                      </p>
                      <div className="font-mono text-xs text-main-light-text/60 bg-[#0a0a0a] p-3 rounded border border-white/[0.05]">
                        {data.token.address}
                      </div>
                    </div>
                    <div className="lg:w-80">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-white/[0.05]">
                          <div className="font-display text-xs text-main-light-text/60 mb-1">
                            Price
                          </div>
                          <div className="font-mono text-lg text-main-text">
                            {data.token.price}
                          </div>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-white/[0.05]">
                          <div className="font-display text-xs text-main-light-text/60 mb-1">
                            Market Cap
                          </div>
                          <div className="font-mono text-lg text-main-text">
                            {data.token.marketCap}
                          </div>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-white/[0.05]">
                          <div className="font-display text-xs text-main-light-text/60 mb-1">
                            24h Volume
                          </div>
                          <div className="font-mono text-lg text-main-text">
                            {data.token.volume24h}
                          </div>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-white/[0.05]">
                          <div className="font-display text-xs text-main-light-text/60 mb-1">
                            Holders
                          </div>
                          <div className="font-mono text-lg text-main-text">
                            {data.token.holders}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* KOLs and Telegram */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <motion.div
                    id="kols"
                    ref={(el) => (sectionRefs.current.kols = el)}
                    custom={1}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-[#161616] border border-white/[0.1] hover:border-main-accent/30 rounded-sm p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-mono text-xl text-main-text">
                        KOL Traction
                      </h3>
                      <div className="text-right">
                        <div className="font-display text-sm text-main-accent">
                          {data.kols.count} KOLs
                        </div>
                        <div className="font-display text-xs text-main-light-text/60">
                          {data.kols.totalInvested} invested
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {data.kols.top.map((kol: KolBuyer) => (
                        <div
                          key={kol.name}
                          className="bg-[#0a0a0a] border border-white/[0.05] rounded p-3 hover:border-main-accent/20 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-main-accent/20 to-main-highlight/20">
                                {kol.avatar ? (
                                  <img
                                    src={kol.avatar}
                                    alt={kol.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Icon
                                      icon="material-symbols:person"
                                      className="w-4 h-4 text-main-accent"
                                    />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-display text-main-light-text font-medium">
                                  {kol.name}
                                </div>
                                <div className="font-display text-xs text-main-light-text/60">
                                  {kol.followers} followers
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono text-main-text">
                                {kol.amount}
                              </div>
                              <div className="font-display text-xs text-main-accent">
                                {kol.invested}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    id="telegram"
                    ref={(el) => (sectionRefs.current.telegram = el)}
                    custom={2}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-[#161616] border border-white/[0.1] hover:border-main-accent/30 rounded-sm p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-mono text-xl text-main-text">
                        Telegram Calls
                      </h3>
                      <div className="text-right">
                        <div className="font-display text-sm text-main-accent">
                          {data.telegram.count} channels
                        </div>
                        <div className="font-display text-xs text-main-light-text/60">
                          {data.telegram.totalMembers} total reach
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {data.telegram.top.map((ch: TelegramChannel) => (
                        <div
                          key={ch.name}
                          className="bg-[#0a0a0a] border border-white/[0.05] rounded p-3 hover:border-main-accent/20 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Icon
                                icon="ic:baseline-telegram"
                                className="w-6 h-6 text-blue-400"
                              />
                              <div>
                                <div className="font-display text-main-light-text font-medium">
                                  {ch.name}
                                </div>
                                <div className="font-display text-xs text-main-light-text/60">
                                  {ch.mentions} mentions
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono text-main-text">
                                {ch.members}
                              </div>
                              <div
                                className={`font-display text-xs px-2 py-1 rounded-full ${
                                  ch.sentiment === "Bullish"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : ch.sentiment === "Bearish"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-amber-500/20 text-amber-400"
                                }`}
                              >
                                {ch.sentiment}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Security Checklist */}
                <motion.div
                  id="security"
                  ref={(el) => (sectionRefs.current.security = el)}
                  custom={3}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-[#161616] border border-white/[0.1] hover:border-main-accent/30 rounded-sm p-6 md:p-8 mb-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-mono text-xl text-main-text">
                      Security Analysis
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                      <span className="font-display text-sm text-main-light-text/70">
                        {
                          data.security.filter((item) => item.status === "pass")
                            .length
                        }
                        /{data.security.length} checks passed
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.security.map(
                      (item: {
                        label: string;
                        status: "pass" | "warn" | "fail";
                        detail: string;
                      }) => {
                        const color =
                          item.status === "pass"
                            ? "text-emerald-400"
                            : item.status === "warn"
                            ? "text-amber-400"
                            : "text-red-400";
                        const bgColor =
                          item.status === "pass"
                            ? "bg-emerald-500/10 border-emerald-500/20"
                            : item.status === "warn"
                            ? "bg-amber-500/10 border-amber-500/20"
                            : "bg-red-500/10 border-red-500/20";
                        const icon =
                          item.status === "pass"
                            ? "solar:check-circle-bold"
                            : item.status === "warn"
                            ? "solar:warning-circle-bold"
                            : "solar:close-circle-bold";
                        return (
                          <div
                            key={item.label}
                            className={`bg-[#0a0a0a] border rounded-lg p-4 hover:border-opacity-40 transition-colors ${bgColor}`}
                          >
                            <div className="flex items-start gap-3">
                              <Icon
                                icon={icon}
                                className={`w-5 h-5 ${color} mt-0.5`}
                              />
                              <div className="flex-1">
                                <div className="font-display text-main-light-text font-medium mb-1">
                                  {item.label}
                                </div>
                                <div className="font-display text-xs text-main-light-text/60">
                                  {item.detail}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </motion.div>

                {/* Dev Tokens */}
                <motion.div
                  id="devtokens"
                  ref={(el) => (sectionRefs.current.devtokens = el)}
                  custom={4}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-[#161616] border border-white/[0.1] hover:border-main-accent/30 rounded-sm p-6 md:p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-mono text-xl text-main-text">
                      Developer Ecosystem
                    </h3>
                    <div className="text-right">
                      <div className="font-display text-sm text-main-accent">
                        {data.devTokens.length} tokens
                      </div>
                      <div className="font-display text-xs text-main-light-text/60">
                        Related projects
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.devTokens.map((t: DevToken) => (
                      <a
                        key={t.address + t.name}
                        href={t.link}
                        target="_blank"
                        rel="noreferrer"
                        className="group bg-[#0a0a0a] border border-white/[0.08] hover:border-main-accent/30 rounded-lg p-4 transition-all duration-200 hover:scale-[1.02]"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-main-accent/20 to-main-highlight/20 flex-shrink-0">
                            {t.avatar ? (
                              <img
                                src={t.avatar}
                                alt={t.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Icon
                                  icon="material-symbols:token"
                                  className="w-5 h-5 text-main-accent"
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-display text-main-text font-medium mb-1 truncate">
                              {t.name}
                            </div>
                            <div className="font-mono text-xs text-main-light-text/60 mb-2">
                              {t.symbol}
                            </div>
                            <div className="font-mono text-xs text-main-light-text/40 truncate">
                              {t.address.slice(0, 6)}...{t.address.slice(-4)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                          <div>
                            <div className="font-display text-xs text-main-light-text/60">
                              Market Cap
                            </div>
                            <div className="font-mono text-sm text-main-text">
                              {t.marketCap}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-display text-xs text-main-light-text/60">
                              Performance
                            </div>
                            <div
                              className={`font-mono text-sm ${
                                t.performance.startsWith("+")
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {t.performance}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="font-display text-xs text-main-accent group-hover:text-main-highlight transition-colors">
                            View on DEX →
                          </div>
                          <Icon
                            icon="solar:external-link-outline"
                            className="w-4 h-4 text-main-light-text/40 group-hover:text-main-accent transition-colors"
                          />
                        </div>
                      </a>
                    ))}
                  </div>
                </motion.div>
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
