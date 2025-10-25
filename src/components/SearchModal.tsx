import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { MockTokenData, getAllTokens } from "../data/mockTokenData";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenSelect: (token: MockTokenData) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onTokenSelect,
}) => {
  const [input, setInput] = useState("");
  const [filteredTokens, setFilteredTokens] = useState<MockTokenData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const allTokens = getAllTokens();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (input.trim()) {
      const filtered = allTokens.filter(
        (token) =>
          token.name.toLowerCase().includes(input.toLowerCase()) ||
          token.symbol.toLowerCase().includes(input.toLowerCase()) ||
          token.address.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredTokens(filtered);
      setSelectedIndex(0);
    } else {
      setFilteredTokens(allTokens);
      setSelectedIndex(0);
    }
  }, [input, allTokens]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredTokens.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredTokens.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredTokens[selectedIndex]) {
          handleTokenSelect(filteredTokens[selectedIndex]);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredTokens, selectedIndex, onClose]);

  const handleTokenSelect = (token: MockTokenData) => {
    onTokenSelect(token);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput(text.trim());
      }
    } catch {
      /* ignore */
    }
  };

  const isValidAddress = (str: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(str);
  };

  const renderTokenResult = (token: MockTokenData, index: number) => {
    const isSelected = index === selectedIndex;
    const isAddressMatch =
      isValidAddress(input) &&
      token.address.toLowerCase() === input.toLowerCase();

    return (
      <motion.div
        key={token.address}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.02 }}
        className={`p-4 border-b border-subtle cursor-pointer transition-all duration-200 ${
          isSelected
            ? "bg-main-accent/10 border-main-accent/30"
            : "hover:bg-main-accent/5"
        }`}
        onClick={() => handleTokenSelect(token)}
      >
        <div className="flex items-center gap-4">
          {/* Token Image */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-main-accent/20 to-main-highlight/20 flex items-center justify-center flex-shrink-0">
            <img
              src={token.image}
              alt={token.name}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.nextElementSibling?.classList.remove("hidden");
              }}
            />
            <Icon
              icon="material-symbols:token"
              className="w-6 h-6 text-main-accent hidden"
            />
          </div>

          {/* Token Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display text-lg font-semibold text-main-text truncate">
                {token.name}
              </h3>
              <span className="font-mono text-sm text-main-light-text/60 bg-surface px-2 py-0.5 rounded">
                {token.symbol}
              </span>
              {isAddressMatch && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                  Found
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-main-light-text/80">
              <span className="font-mono">{token.price}</span>
              <span
                className={`font-mono ${
                  token.priceChange24h >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {token.priceChange24h >= 0 ? "+" : ""}
                {token.priceChange24h}%
              </span>
              <span className="font-mono">{token.marketCap}</span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Icon icon={token.chain.logo} className="w-4 h-4" />
                <span className="text-xs text-main-light-text/60">
                  {token.chain.name}
                </span>
              </div>
              <span className="text-xs text-main-light-text/40">•</span>
              <span className="text-xs text-main-light-text/60 font-mono">
                {token.address.slice(0, 6)}...{token.address.slice(-4)}
              </span>
            </div>
          </div>

          {/* Security Score */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1">
              <Icon
                icon="material-symbols:security"
                className="w-4 h-4 text-main-accent"
              />
              <span className="text-sm font-mono text-main-text">
                {token.security.score}
              </span>
            </div>
            <div className="text-xs text-main-light-text/60">
              Security Score
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl mx-4 bg-surface border border-subtle rounded-lg shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-subtle">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-mono text-xl text-main-text">
                  Search Tokens
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-main-accent/10 rounded-lg transition-colors"
                >
                  <Icon
                    icon="material-symbols:close"
                    className="w-5 h-5 text-main-light-text"
                  />
                </button>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Icon
                  icon="solar:magnifer-linear"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-main-light-text/60 w-5 h-5"
                />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Search by name, symbol, or paste address..."
                  className="w-full pl-10 pr-20 py-3 bg-transparent border border-subtle rounded-lg text-main-text placeholder:text-main-light-text/60 focus:outline-none focus:border-main-accent/60"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                  <button
                    onClick={handlePaste}
                    className="px-3 py-1.5 text-xs bg-main-accent/10 hover:bg-main-accent/20 border border-main-accent/30 text-main-accent rounded transition-colors"
                  >
                    Paste
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {filteredTokens.length > 0 ? (
                <div>
                  {filteredTokens.map((token, index) =>
                    renderTokenResult(token, index)
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-main-light-text/60">
                  <Icon
                    icon="material-symbols:search-off"
                    className="w-8 h-8 mx-auto mb-3 opacity-50"
                  />
                  <p className="font-display">No tokens found</p>
                  <p className="text-sm mt-1">Try a different search term</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-subtle bg-main-bg/50">
              <div className="flex items-center justify-between text-xs text-main-light-text/60">
                <div className="flex items-center gap-4">
                  <span>↑↓ Navigate</span>
                  <span>↵ Select</span>
                  <span>Esc Close</span>
                </div>
                <span>{filteredTokens.length} tokens</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
