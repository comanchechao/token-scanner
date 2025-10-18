import React from "react";
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
  onScan: () => void;
  onPaste: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onCloseSuggestions?: () => void;
}

const HeroSearch: React.FC<HeroSearchProps> = ({
  scanned,
  input,
  showSuggestions,
  suggestions,
  onInputChange,
  onSuggestionClick,
  onScan,
  onPaste,
  onFocus,
  onBlur,
  onCloseSuggestions,
}) => {
  return (
    <section
      className={`relative z-10 flex-1 flex flex-col justify-center transition-all duration-500 ${
        !scanned ? "pt-32 pb-10" : "pt-16 pb-8"
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
            !scanned ? "max-w-4xl w-full mx-auto" : "max-w-3xl mx-auto"
          }`}
        >
          <div
            className={`relative bg-[#161616] hover:bg-white/[0.05] border border-white/[0.1] hover:border-main-accent/40 transition-all duration-300 ${
              !scanned ? "rounded-sm" : "rounded-sm"
            }`}
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
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder={
                !scanned
                  ? "Search by token name or paste address..."
                  : "Paste token address or search by name..."
              }
              className="w-full pl-14 pr-40 py-4 bg-transparent text-main-text placeholder:text-base placeholder-main-light-text/60 font-display text-base focus:outline-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <button
                onClick={onPaste}
                className="px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-main-light-text text-sm cursor-pointer"
              >
                Paste
              </button>
              <button
                onClick={onScan}
                className="px-4 py-2 rounded-lg bg-main-accent hover:bg-main-highlight text-main-bg font-display text-sm cursor-pointer transition-colors"
              >
                {!scanned ? "Analyze" : "Analyze"}
              </button>
            </div>
          </div>

          {showSuggestions && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                onClick={onCloseSuggestions}
              />

              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#161616]/95 backdrop-blur-md border border-white/[0.15] rounded-lg shadow-2xl z-50 max-h-64 overflow-y-auto"
              >
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion.address}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      onClick={() => onSuggestionClick(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-white/[0.08] border-b border-white/[0.08] last:border-b-0 transition-all duration-200 hover:backdrop-blur-lg group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-main-accent/20 to-main-highlight/20 flex items-center justify-center">
                            <Icon
                              icon="material-symbols:token"
                              className="w-4 h-4 text-main-accent"
                            />
                          </div>
                          <div>
                            <div className="font-display text-main-text font-medium group-hover:text-main-accent transition-colors">
                              {suggestion.name}
                            </div>
                            <div className="font-display text-sm text-main-light-text/60">
                              {suggestion.symbol}
                            </div>
                          </div>
                        </div>
                        <div className="font-mono text-xs text-main-light-text/40 group-hover:text-main-light-text/60 transition-colors">
                          {suggestion.address.slice(0, 6)}...
                          {suggestion.address.slice(-4)}
                        </div>
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-main-light-text/60">
                    <Icon
                      icon="material-symbols:search-off"
                      className="w-8 h-8 mx-auto mb-2 opacity-50"
                    />
                    <p className="font-display text-sm">No tokens found</p>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
