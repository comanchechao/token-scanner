import React, { createContext, useContext, useState, useEffect } from "react";

interface SettingsContextType {
  quickBuyAmount: number;
  quickSellPercentage: number;
  setQuickBuyAmount: (amount: number) => void;
  setQuickSellPercentage: (percentage: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const [quickBuyAmount, setQuickBuyAmountState] = useState<number>(1);
  const [quickSellPercentage, setQuickSellPercentageState] =
    useState<number>(10);

  useEffect(() => {
    const savedBuyAmount = localStorage.getItem("quickBuyAmount");
    if (savedBuyAmount) {
      const amount = parseFloat(savedBuyAmount);
      if (amount > 0) {
        setQuickBuyAmountState(amount);
      }
    }

    const savedSellPercentage = localStorage.getItem("quickSellPercentage");
    if (savedSellPercentage) {
      const percentage = parseInt(savedSellPercentage, 10);
      if (percentage >= 10) {
        setQuickSellPercentageState(percentage);
      }
    }
  }, []);

  const setQuickBuyAmount = (amount: number) => {
    if (amount > 0) {
      setQuickBuyAmountState(amount);
      localStorage.setItem("quickBuyAmount", amount.toString());
    }
  };

  const setQuickSellPercentage = (percentage: number) => {
    if (percentage >= 10) {
      setQuickSellPercentageState(percentage);
      localStorage.setItem("quickSellPercentage", percentage.toString());
    }
  };

  const value = {
    quickBuyAmount,
    quickSellPercentage,
    setQuickBuyAmount,
    setQuickSellPercentage,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
