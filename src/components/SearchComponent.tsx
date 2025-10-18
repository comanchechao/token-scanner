import { Icon } from "@iconify/react";
import { SearchConfig, SearchResult } from "../types/search";
import { useSearch } from "../hooks/useSearch";

interface SearchComponentProps<T> extends SearchConfig<T> {
  // Additional props specific to the component
  size?: "small" | "medium" | "large";
  variant?: "default" | "navbar" | "hero" | "sidebar";
  showClearButton?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function SearchComponent<T>({
  size = "medium",
  variant = "default",
  showClearButton = true,
  autoFocus = false,
  disabled = false,
  ...config
}: SearchComponentProps<T>) {
  const {
    state,
    handleInputChange,
    handleResultClick,
    handleClear,
    handleFocus,
    handleBlur,
    handleKeyDown,
    hasResults,
    shouldShowResults,
    isSearching,
  } = useSearch(config);

  const sizeClasses = {
    small: "pl-8 pr-4 py-2 text-sm",
    medium: "pl-10 pr-4 py-3 text-sm",
    large: "pl-14 pr-32 py-4 text-lg",
  };

  const iconSizeClasses = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
  };

  const iconPositionClasses = {
    small: "left-2",
    medium: "left-3",
    large: "left-6",
  };

  const variantClasses = {
    default:
      "  placeholder:text-xs bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-main-accent/50 rounded-xl",
    navbar:
      "  bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-main-accent/50 rounded-xl",
    hero: "  bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-main-accent/50 rounded-2xl",
    sidebar: "bg-white/[0.05] border border-white/[0.1] rounded-lg",
  };

  const resultsContainerClasses = {
    default:
      "  bg-white/[0.15] backdrop-blur-md border border-white/[0.2] rounded-xl shadow-2xl shadow-black/40",
    navbar:
      "  bg-white/[0.15] backdrop-blur-md border border-white/[0.2] rounded-xl shadow-2xl shadow-black/40",
    hero: "  bg-white/[0.15] backdrop-blur-md border border-white/[0.2] rounded-2xl shadow-2xl shadow-black/40",
    sidebar:
      "bg-white/[0.15] backdrop-blur-md border border-white/[0.2] rounded-lg shadow-2xl shadow-black/40",
  };

  const defaultRenderResult = (result: SearchResult<T>, index: number) => (
    <div
      key={result.id}
      className={`px-4 py-3 hover:bg-white/[0.05] transition-colors duration-200 cursor-pointer ${
        state.selectedIndex === index
          ? "bg-white/[0.08] border-l-2 border-main-accent"
          : ""
      }`}
      onClick={() => handleResultClick(result)}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-main-accent/20 rounded-lg flex items-center justify-center">
          <Icon
            icon={config.icon || "material-symbols:search"}
            className="w-4 h-4 text-main-accent"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-tiktok text-sm text-main-text truncate">
            {String(
              (result.item as any).name ||
                (result.item as any).username ||
                result.id
            )}
          </div>
          {result.matchedFields.length > 0 && (
            <div className="font-tiktok text-xs text-main-light-text/60 mt-1">
              Matched: {result.matchedFields.join(", ")}
            </div>
          )}
        </div>
        <div className="text-xs text-main-light-text/50 font-mono">
          {result.score.toFixed(0)}
        </div>
      </div>
    </div>
  );

  const defaultRenderNoResults = (query: string) => (
    <div className="px-4 py-8 text-center">
      <Icon
        icon="material-symbols:search-off-outline"
        className="w-12 h-12 text-main-light-text/20 mx-auto mb-3"
      />
      <div className="font-tiktok text-sm text-main-light-text/60">
        No results found for "{query}"
      </div>
    </div>
  );

  const defaultRenderLoading = () => (
    <div className="px-4 py-8 text-center">
      <div className="animate-spin w-6 h-6 border-2 border-main-accent/20 border-t-main-accent rounded-full mx-auto mb-3"></div>
      <div className="font-tiktok text-sm text-main-light-text/60">
        Searching...
      </div>
    </div>
  );

  return (
    <div className={`relative  ${config.containerClassName || ""}`}>
      <div
        className={`relative ${variantClasses[variant]} transition-all duration-300 `}
      >
        {/* Search Icon */}
        <Icon
          icon={config.icon || "icon-park-twotone:search"}
          className={`absolute ${iconPositionClasses[size]} top-1/2 transform -translate-y-1/2 text-main-light-text/60 z-20 ${iconSizeClasses[size]}`}
        />

        {/* Input */}
        <input
          type="text"
          placeholder={config.placeholder || "Search..."}
          value={state.query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          disabled={disabled}
          className={`w-full ${
            sizeClasses[size]
          } bg-transparent text-main-text placeholder-[var(--color-main-light-text)]/60 placeholder:text-sm font-tiktok focus:outline-none focus:ring-2 focus:ring-main-accent focus:border-main-accent transition-all duration-300 ${
            config.className || ""
          }`}
        />

        {/* Clear Button */}
        {showClearButton && state.query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-main-light-text/60 hover:text-main-light-text transition-colors duration-200 z-20"
          >
            <Icon icon="material-symbols:close" className="w-4 h-4" />
          </button>
        )}

        {/* Loading indicator */}
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20">
            <div className="animate-spin w-4 h-4 border-2 border-main-accent/20 border-t-main-accent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Results */}
      {shouldShowResults && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-[9999] ${
            resultsContainerClasses[variant]
          } ${config.resultsClassName || ""}`}
        >
          {isSearching
            ? config.renderLoading
              ? config.renderLoading()
              : defaultRenderLoading()
            : hasResults
            ? state.results.map((result, index) =>
                config.renderResult
                  ? config.renderResult(result, index)
                  : defaultRenderResult(result, index)
              )
            : state.hasSearched
            ? config.renderNoResults
              ? config.renderNoResults(state.query)
              : defaultRenderNoResults(state.query)
            : null}
        </div>
      )}
    </div>
  );
}

export function HighlightedText({
  text,
  query,
  className = "",
}: {
  text: string;
  query: string;
  className?: string;
}) {
  if (!query) return <span className={className}>{text}</span>;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span
            key={index}
            className="bg-main-accent/20 text-main-accent font-semibold"
          >
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}

export default SearchComponent;
