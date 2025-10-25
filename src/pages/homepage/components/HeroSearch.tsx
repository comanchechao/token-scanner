import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface Suggestion {
  name: string;
  symbol: string;
  address: string;
}

interface HeroSearchProps {
  scanned: boolean;
  input: string;
  showSuggestions: boolean;
  suggestions: Suggestion[];
  onInputChange: (value: string) => void;
  onSuggestionClick: (suggestion: Suggestion) => void;
  onFocus: () => void;
  onBlur: () => void;
  onCloseSuggestions?: () => void;
  onOpenSearchModal: () => void;
  searchRef?: React.RefObject<HTMLDivElement>;
}

const HeroSearch: React.FC<HeroSearchProps> = ({
  scanned,
  input,
  showSuggestions,
  suggestions,
  onInputChange,
  onSuggestionClick,
  onFocus,
  onBlur,
  onCloseSuggestions: _onCloseSuggestions,
  onOpenSearchModal,
  searchRef,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeElement = document.activeElement;
        if (
          activeElement?.tagName !== "INPUT" &&
          activeElement?.tagName !== "TEXTAREA"
        ) {
          e.preventDefault();
          onOpenSearchModal();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenSearchModal]);
  return (
    <section
      className={`relative z-10 flex-1 flex flex-col justify-center transition-all duration-500 ${
        !scanned ? "pt-16 pb-10" : "pt-16 pb-8"
      }`}
    >
      <div className="max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-center">
        {!scanned ? (
          // Centered search when not scanned
          <div className="flex flex-col items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="font-mono text-4xl md:text-6xl xl:text-7xl text-main-text mb-4 leading-tight"
            >
              Token Find
            </motion.h1>
            <p className="font-display text-lg md:text-xl xl:text-2xl text-main-light-text/70 mb-12 max-w-2xl xl:max-w-3xl">
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
              className="font-mono text-3xl md:text-5xl xl:text-6xl text-main-text mb-3 leading-tight"
            >
              Find everything about a token
              <span className="text-main-accent"> in one place</span>
            </motion.h1>
            <p className="font-display text-base md:text-lg xl:text-xl text-main-light-text/80 mb-8">
              Paste a token address to see narrative, KOL traction, Telegram
              calls, security, and dev tokens.
            </p>
          </>
        )}

        {/* Search Input - shown in both states */}
        <div
          ref={searchRef}
          className={`relative z ${
            !scanned
              ? "max-w-4xl xl:max-w-5xl w-full mx-auto"
              : "max-w-3xl xl:max-w-4xl mx-auto"
          }`}
        >
          <div
            className={`relative bg-surface hover:bg-main-accent/5 border border-subtle transition-all duration-300 ${
              isFocused
                ? "border-main-accent/60 shadow-lg shadow-main-accent/10"
                : "hover:border-main-accent/40"
            } ${!scanned ? "rounded-sm" : "rounded-sm"}`}
          >
            <Icon
              icon="solar:magnifer-linear"
              className="absolute left-5 top-1/2 -translate-y-1/2 text-main-light-text/60 w-5 h-5"
            />
            <input
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onInputChange(e.target.value)
              }
              onClick={onOpenSearchModal}
              onFocus={() => {
                setIsFocused(true);
                onFocus();
              }}
              onBlur={() => {
                setIsFocused(false);
                onBlur();
              }}
              placeholder={
                !scanned
                  ? "Click to search tokens or press / to open search..."
                  : "Click to search tokens or press / to open search..."
              }
              className="w-full pl-14 pr-20 py-4 xl:py-5 bg-transparent text-main-text placeholder:text-base xl:placeholder:text-lg placeholder-main-light-text/60 font-display text-base xl:text-lg focus:outline-none cursor-pointer"
              readOnly
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-surface border border-subtle rounded text-xs text-main-light-text/60">
                <Icon icon="material-symbols:keyboard" className="w-3 h-3" />
                <span>/</span>
              </div>
            </div>
          </div>

          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-1 bg-surface border border-subtle rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto backdrop-blur-sm"
            >
              {suggestions.length > 0 ? (
                <div className="py-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion.address}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.15 }}
                      onClick={() => onSuggestionClick(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-main-accent/10 hover:border-l-2 hover:border-main-accent transition-all duration-150 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-main-accent/20 to-main-highlight/20 flex items-center justify-center flex-shrink-0">
                            <Icon
                              icon="material-symbols:token"
                              className="w-3.5 h-3.5 text-main-accent"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-display text-sm font-medium text-main-text group-hover:text-main-accent transition-colors truncate">
                              {suggestion.name}
                            </div>
                            <div className="font-display text-xs text-main-light-text/60 truncate">
                              {suggestion.symbol}
                            </div>
                          </div>
                        </div>
                        <div className="font-mono text-xs text-main-light-text/40 group-hover:text-main-light-text/60 transition-colors flex-shrink-0 ml-2">
                          {suggestion.address.slice(0, 6)}...
                          {suggestion.address.slice(-4)}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-main-light-text/60">
                  <Icon
                    icon="material-symbols:search-off"
                    className="w-6 h-6 mx-auto mb-2 opacity-50"
                  />
                  <p className="font-display text-sm">No tokens found</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
