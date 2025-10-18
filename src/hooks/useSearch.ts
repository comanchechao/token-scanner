import { useState, useEffect, useCallback } from "react";
import { SearchConfig, SearchState, SearchResult } from "../types/search";

export function useSearch<T>(config: SearchConfig<T>) {
  const [state, setState] = useState<SearchState<T>>({
    query: "",
    results: [],
    isLoading: false,
    isOpen: false,
    selectedIndex: -1,
    hasSearched: false,
  });

  const debouncedSearch = useCallback(
    (query: string) => {
      const timer = setTimeout(async () => {
        if (query.length >= (config.minQueryLength || 1)) {
          setState((prev) => ({ ...prev, isLoading: true }));

          try {
            const results = await config.searchFunction(query);
            const limitedResults = config.maxResults
              ? results.slice(0, config.maxResults)
              : results;

            setState((prev) => ({
              ...prev,
              results: limitedResults,
              isLoading: false,
              isOpen: true,
              hasSearched: true,
            }));

            if (config.onSearch) {
              config.onSearch(query, limitedResults);
            }
          } catch (error) {
            console.error("Search error:", error);
            setState((prev) => ({
              ...prev,
              results: [],
              isLoading: false,
              isOpen: true,
              hasSearched: true,
            }));
          }
        } else {
          setState((prev) => ({
            ...prev,
            results: [],
            isLoading: false,
            isOpen: false,
            hasSearched: false,
          }));
        }
      }, config.debounceMs || 150);

      return () => clearTimeout(timer);
    },
    [
      config.searchFunction,
      config.data,
      config.minQueryLength,
      config.maxResults,
      config.debounceMs,
      config.onSearch,
    ]
  );

  const handleInputChange = useCallback(
    (query: string) => {
      setState((prev) => ({ ...prev, query, selectedIndex: -1 }));
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  const handleResultClick = useCallback(
    (result: SearchResult<T>) => {
      setState((prev) => ({ ...prev, isOpen: false, selectedIndex: -1 }));
      if (config.onResultClick) {
        config.onResultClick(result);
      }
    },
    [config.onResultClick]
  );

  const handleClear = useCallback(() => {
    setState({
      query: "",
      results: [],
      isLoading: false,
      isOpen: false,
      selectedIndex: -1,
      hasSearched: false,
    });
    if (config.onClear) {
      config.onClear();
    }
  }, [config.onClear]);

  // Handle focus
  const handleFocus = useCallback(() => {
    if (config.showResultsOnFocus && state.hasSearched) {
      setState((prev) => ({ ...prev, isOpen: true }));
    }
  }, [config.showResultsOnFocus, state.hasSearched]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setState((prev) => ({ ...prev, isOpen: false }));
    }, 200);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!state.isOpen || state.results.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setState((prev) => ({
            ...prev,
            selectedIndex: Math.min(
              prev.selectedIndex + 1,
              state.results.length - 1
            ),
          }));
          break;
        case "ArrowUp":
          e.preventDefault();
          setState((prev) => ({
            ...prev,
            selectedIndex: Math.max(prev.selectedIndex - 1, -1),
          }));
          break;
        case "Enter":
          e.preventDefault();
          if (state.selectedIndex >= 0) {
            handleResultClick(state.results[state.selectedIndex]);
          }
          break;
        case "Escape":
          setState((prev) => ({ ...prev, isOpen: false, selectedIndex: -1 }));
          break;
      }
    },
    [state.isOpen, state.results, state.selectedIndex, handleResultClick]
  );

  useEffect(() => {
    if (state.query && state.query.length >= (config.minQueryLength || 1)) {
      debouncedSearch(state.query);
    }
  }, [config.data, debouncedSearch, state.query, config.minQueryLength]);

  return {
    state,
    handleInputChange,
    handleResultClick,
    handleClear,
    handleFocus,
    handleBlur,
    handleKeyDown,
    hasResults: state.results.length > 0,
    shouldShowResults:
      state.isOpen && (state.hasSearched || config.showResultsOnFocus),
    isSearching: state.isLoading,
  };
}

export function createSearchFunction<T>(
  searchFields: Array<{
    field: string;
    weight?: number;
    exact?: boolean;
    fuzzy?: boolean;
  }>,
  items: T[]
) {
  return (query: string): SearchResult<T>[] => {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase();
    const queryWords = normalizedQuery
      .split(/\s+/)
      .filter((word) => word.length > 0);

    const results: SearchResult<T>[] = [];

    items.forEach((item, index) => {
      let totalScore = 0;
      const matchedFields: string[] = [];

      searchFields.forEach(
        ({ field, weight = 1, exact = false, fuzzy = false }) => {
          const fieldValue = (item as any)[field];
          if (fieldValue === undefined || fieldValue === null) return;

          const normalizedValue = String(fieldValue).toLowerCase();
          let fieldScore = 0;

          if (exact) {
            if (normalizedValue === normalizedQuery) {
              fieldScore = 100 * weight;
              matchedFields.push(field);
            }
          } else if (fuzzy) {
            const distance = levenshteinDistance(
              normalizedValue,
              normalizedQuery
            );
            const similarity =
              1 -
              distance /
                Math.max(normalizedValue.length, normalizedQuery.length);
            if (similarity > 0.6) {
              fieldScore = similarity * 50 * weight;
              matchedFields.push(field);
            }
          } else {
            queryWords.forEach((word) => {
              if (normalizedValue.includes(word)) {
                const startsWithWord = normalizedValue.startsWith(word);
                const containsWord = normalizedValue.includes(word);

                if (startsWithWord) {
                  fieldScore += 30 * weight;
                } else if (containsWord) {
                  fieldScore += 15 * weight;
                }

                matchedFields.push(field);
              }
            });
          }

          totalScore += fieldScore;
        }
      );

      if (totalScore > 0) {
        results.push({
          id: `${index}`,
          item,
          matchedFields: [...new Set(matchedFields)],
          score: totalScore,
        });
      }
    });

    return results.sort((a, b) => b.score - a.score);
  };
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}
