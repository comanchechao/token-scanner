import React from "react";
import { Icon } from "@iconify/react";

interface TokenFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const TokenFilters: React.FC<TokenFiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
}) => {
  const categories = [
    {
      id: "all",
      name: "All Tokens",
      icon: "material-symbols:grid-view",
      count: "∞",
    },
    {
      id: "layer1",
      name: "Layer 1",
      icon: "material-symbols:layers",
      count: "12",
    },
    { id: "meme", name: "Meme", icon: "material-symbols:pets", count: "45" },
    {
      id: "defi",
      name: "DeFi",
      icon: "material-symbols:currency-exchange",
      count: "28",
    },
    {
      id: "utility",
      name: "Utility",
      icon: "material-symbols:build",
      count: "19",
    },
    {
      id: "wrapped",
      name: "Wrapped",
      icon: "material-symbols:wrap-text",
      count: "8",
    },
  ];

  const sortOptions = [
    { id: "marketCap", name: "Market Cap", icon: "material-symbols:bar-chart" },
    { id: "volume", name: "24h Volume", icon: "material-symbols:trending-up" },
    {
      id: "priceChange",
      name: "Price Change",
      icon: "material-symbols:percent",
    },
    { id: "price", name: "Price", icon: "material-symbols:attach-money" },
  ];

  return (
    <div className="mb-8 space-y-6">
      {/* Category Filters */}
      <div>
        <h3 className="font-algance text-lg text-main-text mb-4 flex items-center gap-2">
          <Icon
            icon="material-symbols:filter-list"
            className="w-5 h-5 text-main-accent"
          />
          Categories
        </h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`group relative   border rounded-xl px-4 py-3 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                selectedCategory === category.id
                  ? "bg-main-accent/15 border-main-accent/50 text-main-accent shadow-main-accent/20"
                  : "bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.1] hover:border-main-accent/30 text-main-light-text hover:text-main-accent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  icon={category.icon}
                  className={`w-5 h-5 transition-colors duration-300 ${
                    selectedCategory === category.id
                      ? "text-main-accent"
                      : "text-main-light-text/70 group-hover:text-main-accent"
                  }`}
                />
                <div className="text-left">
                  <div className="font-tiktok text-sm font-medium">
                    {category.name}
                  </div>
                  <div className="font-tiktok text-xs opacity-70">
                    {category.count} tokens
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-algance text-lg text-main-text mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:sort"
              className="w-5 h-5 text-main-accent"
            />
            Sort By
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSortBy(option.id)}
              className={`group relative   border rounded-xl px-4 py-2.5 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                sortBy === option.id
                  ? "bg-main-highlight/15 border-main-highlight/50 text-main-highlight shadow-main-highlight/20"
                  : "bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.1] hover:border-main-highlight/30 text-main-light-text hover:text-main-highlight"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  icon={option.icon}
                  className={`w-4 h-4 transition-colors duration-300 ${
                    sortBy === option.id
                      ? "text-main-highlight"
                      : "text-main-light-text/70 group-hover:text-main-highlight"
                  }`}
                />
                <span className="font-tiktok text-sm">{option.name}</span>
                {sortBy === option.id && (
                  <Icon
                    icon="material-symbols:keyboard-arrow-down"
                    className="w-4 h-4 text-main-highlight"
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Market Cap Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Icon
            icon="material-symbols:info"
            className="w-4 h-4 text-main-light-text/60"
          />
          <span className="font-tiktok text-sm text-main-light-text/70">
            Market Cap:
          </span>
        </div>

        {[
          { label: "Low Cap", range: "<$100k", active: true },
          { label: "Mid Cap", range: "$100k-$1M", active: false },
          { label: "High Cap", range: ">$1M", active: false },
        ].map((cap, index) => (
          <button
            key={index}
            className={`group relative   border rounded-lg px-3 py-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
              cap.active
                ? "bg-main-accent/10 border-main-accent/30 text-main-accent"
                : "bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.1] hover:border-main-accent/30 text-main-light-text hover:text-main-accent"
            }`}
          >
            <div className="text-center">
              <div className="font-tiktok text-xs font-medium">{cap.label}</div>
              <div className="font-tiktok text-xs opacity-70">{cap.range}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TokenFilters;
