import React from "react";
import BuySellPanel from "app/token/components/BuySellPanel";

interface TokenBuySellPanelProps {
  tokenMint: string;
  tokenName?: string;
  initialTab?: "buy" | "sell";
  address: string;
}

const TokenBuySellPanel: React.FC<TokenBuySellPanelProps> = ({
  tokenMint,
  tokenName,
  initialTab,
  address,
}) => {
  const handleBuy = (amount: number) => {
    console.log(`Buying ${amount} of token ${tokenName || tokenMint}`);
  };

  const handleSell = (amount: number) => {
    console.log(`Selling ${amount} of token ${tokenName || tokenMint}`);
  };

  return (
    <BuySellPanel
      address={address}
      onBuy={handleBuy}
      onSell={handleSell}
      initialTab={initialTab}
    />
  );
};

export default TokenBuySellPanel;
