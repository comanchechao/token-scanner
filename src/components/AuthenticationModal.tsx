import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletConnection } from "../hooks/useWalletConnection";
import { useAuth } from "./AuthProvider";
import { useToastContext } from "../contexts/ToastContext";
import authService from "../services/authService";
import tradingService from "../api/tradingService";

interface AuthenticationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthenticationModal: React.FC<AuthenticationModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const { publicKey, signMessage } = useWallet();
  const { walletInfo, connected } = useWalletConnection();
  const { loginWithWallet, isAuthenticated, updateWalletAddress } = useAuth();
  const { showError, showInfo } = useToastContext();

  useEffect(() => {
    if (open && isAuthenticated) {
      onClose();
    }
  }, [open, isAuthenticated, onClose]);

  useEffect(() => {
    if (open) {
      setCurrentStep(1);
      setError(null);
      setIsProcessing(false);
    }
  }, [open]);

  const handleAuthenticate = async () => {
    if (!connected || !publicKey || !walletInfo) {
      setError("Wallet not connected");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      const walletAddress = walletInfo.address;

      console.log("🔍 [Auth Modal] Starting authentication for:", {
        address: walletAddress,
        length: walletAddress.length,
      });

      setCurrentStep(2);
      showInfo("Wallet Authentication", "Generating challenge...");

      const challengeResponse = await authService.generateWalletChallenge(
        walletAddress
      );

      if (!challengeResponse.success) {
        throw new Error("Failed to generate wallet challenge");
      }

      const challenge = challengeResponse.result.payload;

      console.log("🎯 [Auth Modal] Challenge details:", {
        nonce: challenge.nonce,
        iat: challenge.iat,
        exp: challenge.exp,
        message: challenge.message,
        messageLength: challenge.message.length,
      });

      setCurrentStep(3);
      showInfo(
        "Wallet Authentication",
        "Please sign the message with your wallet"
      );

      const messageToSign = `${challenge.message}\n${challenge.walletAddress}\n${challenge.nonce}\n${challenge.iat}\n${challenge.exp}\n${challenge.domain}\n${challenge.version}`;
      const messageBytes = new TextEncoder().encode(messageToSign);

      console.log("📝 [Auth Modal] Message being signed:", {
        fullMessage: messageToSign,
        messagePreview: messageToSign.substring(0, 200) + "...",
        messageBytesLength: messageBytes.length,
      });

      if (!signMessage) {
        throw new Error("Wallet does not support message signing");
      }

      const signature = await signMessage(messageBytes);

      const signatureHex = Array.from(signature)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      console.log("✍️ [Auth Modal] Signature generated:", {
        signatureHex: signatureHex,
        signatureLength: signatureHex.length,
        signatureBytes: signature.length,
        timestamp: new Date().toISOString(),
      });

      setCurrentStep(4);
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
        console.log("💰 [Auth Modal] Updating balance after authentication...");
        const balanceResponse = await tradingService.updateBalance();
        console.log("✅ [Auth Modal] Balance updated successfully");

        // Replace wallet address with the custom address from API response
        if (
          balanceResponse.success &&
          balanceResponse.result &&
          balanceResponse.result.length > 0
        ) {
          const customAddress = balanceResponse.result[0].address;
          console.log(
            "🔄 [Auth Modal] Replacing wallet address with custom address:",
            {
              originalAddress: walletAddress,
              customAddress: customAddress,
            }
          );

          // Update the user object with the custom address
          updateWalletAddress(customAddress);
          console.log(
            "🔄 [Auth Modal] Wallet address updated to custom address:",
            customAddress
          );
        }
      } catch (balanceError: any) {
        console.error(
          "⚠️ [Auth Modal] Failed to update balance:",
          balanceError
        );
        // Don't fail the authentication process if balance update fails
      }

      setCurrentStep(5);

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error("❌ [Auth Modal] Authentication failed:", error);

      let errorMessage = "Failed to authenticate with wallet";

      if (error.message.includes("User rejected")) {
        errorMessage = "Message signing was rejected by user";
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = error.message || "Failed to authenticate with wallet";
      }

      setError(errorMessage);
      showError("Authentication Failed", errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepConfig = () => {
    switch (currentStep) {
      case 1:
        return {
          icon: "ph:wallet-fill",
          iconColor: "text-blue-400",
          bgColor: "bg-blue-400/10",
          borderColor: "border-blue-400/20",
          title: "Wallet Authentication Required",
          message:
            "To access your copy trading features, we need to authenticate your wallet by signing a message. This ensures you have full control over your wallet.",
          buttonText: "Authenticate Wallet",
          buttonColor:
            "bg-blue-400/10 border-blue-400/20 hover:bg-blue-400/20 hover:border-blue-400/40 text-blue-400",
        };
      case 2:
        return {
          icon: "eos-icons:loading",
          iconColor: "text-yellow-400",
          bgColor: "bg-yellow-400/10",
          borderColor: "border-yellow-400/20",
          title: "Generating Challenge",
          message: "Creating a secure challenge for your wallet to sign...",
          buttonText: "Processing...",
          buttonColor: "bg-yellow-400/10 border-yellow-400/20 text-yellow-400",
        };
      case 3:
        return {
          icon: "mingcute:signature-line",
          iconColor: "text-purple-400",
          bgColor: "bg-purple-400/10",
          borderColor: "border-purple-400/20",
          title: "Sign Message",
          message:
            "Please sign the message in your wallet popup. This proves you own the wallet and allows secure access to your account.",
          buttonText: "Signature...",
          buttonColor: "bg-purple-400/10 border-purple-400/20 text-purple-400",
        };
      case 4:
        return {
          icon: "eos-icons:loading",
          iconColor: "text-green-400",
          bgColor: "bg-green-400/10",
          borderColor: "border-green-400/20",
          title: "Verifying Signature",
          message:
            "Verifying your signature and creating your secure session...",
          buttonText: "Verifying...",
          buttonColor: "bg-green-400/10 border-green-400/20 text-green-400",
        };
      case 5:
        return {
          icon: "mingcute:check-line",
          iconColor: "text-green-400",
          bgColor: "bg-green-400/10",
          borderColor: "border-green-400/20",
          title: "Authentication Successful",
          message:
            "Your wallet has been successfully authenticated! You can now access all copy trading features.",
          buttonText: "Success!",
          buttonColor: "bg-green-400/10 border-green-400/20 text-green-400",
        };
      default:
        return {
          icon: "ph:wallet-fill",
          iconColor: "text-blue-400",
          bgColor: "bg-blue-400/10",
          borderColor: "border-blue-400/20",
          title: "Wallet Authentication",
          message: "Please authenticate your wallet to continue.",
          buttonText: "Authenticate",
          buttonColor:
            "bg-blue-400/10 border-blue-400/20 hover:bg-blue-400/20 hover:border-blue-400/40 text-blue-400",
        };
    }
  };

  const stepConfig = getStepConfig();

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center transition-all duration-300 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/30 transition-all duration-300 ${
          open ? "modal-overlay-show" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-xs lg:max-w-md backdrop-blur-xl bg-white/[0.03] border border-white/[0.1] shadow-2xl rounded-2xl flex flex-col transition-all duration-300 transform 
          ${open ? "modal-content-show" : "opacity-0 scale-95 translate-y-8"}
          before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:-z-10`}
        style={{ minWidth: 280, maxHeight: "85vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.1]">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 ${stepConfig.bgColor} ${stepConfig.borderColor} rounded-lg flex items-center justify-center`}
            >
              <Icon
                icon={stepConfig.icon}
                width={18}
                height={18}
                className={`${stepConfig.iconColor} ${
                  currentStep === 2 || currentStep === 4 ? "animate-spin" : ""
                }`}
              />
            </div>
            <span className="font-algance text-lg lg:text-xl text-main-text">
              {stepConfig.title}
            </span>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] hover:border-red-400/30 transition-all duration-300 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon
              icon="iconamoon:close-fill"
              width={20}
              height={20}
              className="text-main-light-text group-hover:text-red-400 transition-colors duration-300"
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div
                className={`w-16 h-16 rounded-full ${stepConfig.bgColor} ${stepConfig.borderColor} flex items-center justify-center`}
              >
                <Icon
                  icon={stepConfig.icon}
                  width={32}
                  height={32}
                  className={`${stepConfig.iconColor} ${
                    currentStep === 2 || currentStep === 4 ? "animate-spin" : ""
                  }`}
                />
              </div>
            </div>

            <h3 className="font-algance text-lg lg:text-xl text-main-text">
              {stepConfig.title}
            </h3>

            <p className="font-tiktok text-sm lg:text-base text-main-light-text/70">
              {stepConfig.message}
            </p>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="font-tiktok text-sm lg:text-base text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Wallet Info */}
            {walletInfo && (
              <div className="p-3 bg-white/[0.03] border border-white/[0.1] rounded-xl">
                <p className="font-tiktok text-xs lg:text-sm text-main-light-text/70 mb-1">
                  Wallet Address
                </p>
                <p className="font-tiktok text-sm lg:text-base text-main-text font-mono">
                  {walletInfo.formattedAddress}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 cursor-pointer bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] px-4 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="font-tiktok text-sm lg:text-base text-main-light-text group-hover:text-main-text transition-colors duration-300">
                Cancel
              </span>
            </button>

            <button
              onClick={handleAuthenticate}
              disabled={isProcessing || currentStep > 1}
              className={`flex-1 cursor-pointer ${stepConfig.buttonColor} px-4 py-3 lg:px-6 lg:py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2`}
            >
              {isProcessing || currentStep > 1 ? (
                <>
                  <Icon
                    icon="eos-icons:loading"
                    width={16}
                    height={16}
                    className={`${stepConfig.iconColor} animate-spin`}
                  />
                  <span
                    className={`font-tiktok text-sm lg:text-base ${stepConfig.iconColor}`}
                  >
                    {stepConfig.buttonText}
                  </span>
                </>
              ) : (
                <span
                  className={`font-tiktok text-sm lg:text-base ${stepConfig.iconColor}`}
                >
                  {stepConfig.buttonText}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationModal;
