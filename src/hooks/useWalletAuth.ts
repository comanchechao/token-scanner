import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletConnection } from "./useWalletConnection";
import { useAuth } from "../components/AuthProvider";
import { useToastContext } from "../contexts/ToastContext";
import authService from "../services/authService";
import tradingService from "../api/tradingService";

export const useWalletAuth = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { publicKey, signMessage } = useWallet();
  const { walletInfo, connected } = useWalletConnection();
  const { loginWithWallet, isAuthenticated ,updateWalletAddress } = useAuth();
  const { showError, showSuccess, showInfo } = useToastContext();

  const authenticateWallet = async () => {
    if (!connected || !publicKey || !walletInfo) {
      showError("Wallet Error", "Wallet not connected");
      return false;
    }

    if (isAuthenticated) {
      return true;
    }

    try {
      setIsProcessing(true);
      const walletAddress = walletInfo.address;

      console.log("🔍 [Wallet Auth] Wallet address details:", {
        address: walletAddress,
        length: walletAddress.length,
        isBase58: /^[1-9A-HJ-NP-Za-km-z]+$/.test(walletAddress),
        publicKeyToString: publicKey.toString(),
        publicKeyToBase58: publicKey.toBase58(),
      });

      showInfo("Wallet Authentication", "Generating challenge...");
      const challengeResponse = await authService.generateWalletChallenge(
        walletAddress
      );

      if (!challengeResponse.success) {
        throw new Error("Failed to generate wallet challenge");
      }

      const challenge = challengeResponse.result.payload;

      console.log("🎯 [Wallet Auth] Challenge details:", {
        nonce: challenge.nonce,
        iat: challenge.iat,
        exp: challenge.exp,
        message: challenge.message,
        messageLength: challenge.message.length,
      });

      showInfo(
        "Wallet Authentication",
        "Please sign the message with your wallet"
      );

      const messageToSign = `${challenge.message}\n${challenge.walletAddress}\n${challenge.nonce}\n${challenge.iat}\n${challenge.exp}\n${challenge.domain}\n${challenge.version}`;
      const messageBytes = new TextEncoder().encode(messageToSign);

      console.log("📝 [Wallet Auth] Message being signed:", {
        fullMessage: messageToSign,
        messagePreview: messageToSign.substring(0, 200) + "...",
        messageBytes: Array.from(messageBytes.slice(0, 20))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
        messageBytesLength: messageBytes.length,
      });

      if (!signMessage) {
        throw new Error("Wallet does not support message signing");
      }

      const signature = await signMessage(messageBytes);

      const signatureHex = Array.from(signature)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      console.log("✍️ [Wallet Auth] Signature generated:", {
        signatureHex: signatureHex,
        signatureLength: signatureHex.length,
        signatureBytes: signature.length,
        timestamp: new Date().toISOString(),
      });

      showInfo("Wallet Authentication", "Verifying signature...");

      const tokenResponse = await authService.createTokenByWallet(
        signatureHex,
        challenge
      );

      if (!tokenResponse.success) {
        throw new Error("Failed to create token with wallet signature");
      }

      const { token } = tokenResponse.result;

      const verifyResult = await authService.verifyToken(token);

      if (!verifyResult.success) {
        throw new Error("Failed to verify wallet token");
      }

      const { accessToken, refreshToken, tokenId } = verifyResult.result;

      await loginWithWallet(walletAddress, accessToken, refreshToken, tokenId);

      // Update balance after successful authentication
      try {
        console.log("💰 [Wallet Auth] Updating balance after authentication...");
        const balanceResponse = await tradingService.updateBalance();
        console.log("✅ [Wallet Auth] Balance updated successfully");
        
        // Replace wallet address with the custom address from API response
        if (balanceResponse.success && balanceResponse.result && balanceResponse.result.length > 0) {
          const customAddress = balanceResponse.result[0].address;
          console.log("🔄 [Wallet Auth] Replacing wallet address with custom address:", {
            originalAddress: walletAddress,
            customAddress: customAddress
          });
          
          // Update wallet address with the custom address from balance response
          if (customAddress) {
            updateWalletAddress(customAddress);
            console.log("🔄 [Wallet Auth Hook] Wallet address updated to custom address:", customAddress);
          }
        }
      } catch (balanceError: any) {
        console.error("⚠️ [Wallet Auth] Failed to update balance:", balanceError);
        // Don't fail the authentication process if balance update fails
      }

      showSuccess(
        "Wallet Connected",
        "You have successfully authenticated with your wallet"
      );

      return true;
    } catch (error: any) {
      console.error("❌ [Wallet Auth] Authentication failed:", error);

      if (error.message.includes("User rejected")) {
        showError(
          "Authentication Failed",
          "Message signing was rejected by user"
        );
      } else {
        showError(
          "Authentication Failed",
          error.message || "Failed to authenticate with wallet"
        );
      }

      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const shouldShowAuthButton = connected && publicKey && !isAuthenticated;

  return {
    authenticateWallet,
    isProcessing,
    shouldShowAuthButton,
    walletInfo,
  };
};

export default useWalletAuth;
