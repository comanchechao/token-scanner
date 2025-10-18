import React from "react";
import WalletAuth from "./WalletAuth";
import TelegramAuth from "./TelegramAuth";
import TelegramLoginButton from "./TelegramLoginButton";
import WalletConnectionManager from "./WalletConnectionManager";
import { useAuth } from "./AuthProvider";

const UnifiedAuth: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex items-center gap-3">
      {isAuthenticated ? (
        user?.authMethod === "telegram" ? (
          <WalletConnectionManager />
        ) : (
          <WalletAuth />
        )
      ) : (
        <WalletAuth />
      )}

      {(!isAuthenticated || user?.authMethod === "telegram") &&
        (isAuthenticated ? <TelegramAuth /> : <TelegramLoginButton />)}
    </div>
  );
};

export default UnifiedAuth;
