import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

interface CryptoPrices {
  bitcoin: { usd: number };
  ethereum: { usd: number };
  solana: { usd: number };
  binancecoin: { usd: number };
}

const Footer: React.FC = React.memo(() => {
  const [prices, setPrices] = useState<CryptoPrices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchFromCoinGecko = async (): Promise<CryptoPrices> => {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin&vs_currencies=usd"
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API failed: ${response.status}`);
    }

    return await response.json();
  };

  const fetchFromCoinCap = async (): Promise<CryptoPrices> => {
    const ids = ["bitcoin", "ethereum", "solana", "binance-coin"];
    const responses = await Promise.all(
      ids.map((id) => fetch(`https://api.coincap.io/v2/assets/${id}`))
    );

    const data = await Promise.all(
      responses.map(async (response, index) => {
        if (!response.ok) {
          throw new Error(
            `CoinCap API failed for ${ids[index]}: ${response.status}`
          );
        }
        const result = await response.json();
        return { id: ids[index], price: parseFloat(result.data.priceUsd) };
      })
    );

    // Convert CoinCap format to CoinGecko format
    return {
      bitcoin: { usd: data.find((d) => d.id === "bitcoin")?.price || 0 },
      ethereum: { usd: data.find((d) => d.id === "ethereum")?.price || 0 },
      solana: { usd: data.find((d) => d.id === "solana")?.price || 0 },
      binancecoin: {
        usd: data.find((d) => d.id === "binance-coin")?.price || 0,
      },
    };
  };

  const fetchCryptoPrices = async () => {
    try {
      setError(false);

      // Try CoinGecko first
      try {
        const data = await fetchFromCoinGecko();
        setPrices(data);
        setLoading(false);
        return;
      } catch (coinGeckoError) {
        console.warn("CoinGecko failed, trying CoinCap:", coinGeckoError);

        // Fallback to CoinCap
        const data = await fetchFromCoinCap();
        setPrices(data);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("All crypto price APIs failed:", err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch prices immediately
    fetchCryptoPrices();

    // Set up interval to fetch every 10 minutes (600,000 ms) to avoid rate limits
    const interval = setInterval(fetchCryptoPrices, 600000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 4 : 2,
    }).format(price);
  };

  return (
    <footer className="border-t border-white/[0.08] bg-main-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Crypto Prices Bar */}

        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {" "}
          <div className="p-4">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {loading ? (
                <div className="flex items-center gap-2 text-main-light-text/60">
                  <Icon
                    icon="eos-icons:loading"
                    className="w-4 h-4 animate-spin"
                  />
                  <span className="font-display text-sm">
                    Loading prices...
                  </span>
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 text-red-400">
                  <Icon
                    icon="material-symbols:error-outline"
                    className="w-4 h-4"
                  />
                  <span className="font-display text-sm">
                    Failed to load prices - trying again in 10min
                  </span>
                </div>
              ) : prices ? (
                <>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="cryptocurrency:btc"
                      className="w-5 h-5 text-orange-400"
                    />
                    <span className="font-display font-bold text-sm text-main-light-text">
                      BTC:{" "}
                      <span className="font-display text-main-text">
                        {formatPrice(prices.bitcoin.usd)}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="cryptocurrency:eth"
                      className="w-5 h-5 text-blue-400"
                    />
                    <span className="font-display font-bold text-sm text-main-light-text">
                      ETH:{" "}
                      <span className="font-display text-main-text">
                        {formatPrice(prices.ethereum.usd)}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="cryptocurrency:sol"
                      className="w-5 h-5 text-purple-400"
                    />
                    <span className="font-display font-bold text-sm text-main-light-text">
                      SOL:{" "}
                      <span className="font-display text-main-text">
                        {formatPrice(prices.solana.usd)}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="cryptocurrency:bnb"
                      className="w-5 h-5 text-yellow-400"
                    />
                    <span className="font-display font-bold text-sm text-main-light-text">
                      BNB:{" "}
                      <span className="font-display text-main-text">
                        {formatPrice(prices.binancecoin.usd)}
                      </span>
                    </span>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          {/* Navigation Links */}
          <div className="flex flex-wrap gap-6 md:gap-8">
            <Link
              to="/kols"
              className="font-display text-sm text-main-light-text hover:text-main-accent transition-colors duration-200"
            >
              KOLs
            </Link>
            <Link
              to="/devs"
              className="font-display text-sm text-main-light-text hover:text-main-accent transition-colors duration-200"
            >
              Devs
            </Link>
            <Link
              to="/tokens"
              className="font-display text-sm text-main-light-text hover:text-main-accent transition-colors duration-200"
            >
              Tokens
            </Link>
            <a
              href="/docs"
              className="font-display text-sm text-main-light-text hover:text-main-accent transition-colors duration-200"
            >
              Docs
            </a>
            <a
              href="/api"
              className="font-display text-sm text-main-light-text hover:text-main-accent transition-colors duration-200"
            >
              API
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className=" pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-display text-xs text-main-light-text/70">
            © 2025 Token Find. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              className="font-display text-xs text-main-light-text/70 hover:text-main-accent transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="font-display text-xs text-main-light-text/70 hover:text-main-accent transition-colors duration-200"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
