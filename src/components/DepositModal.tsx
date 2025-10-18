import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "./AuthProvider";
import { useToastContext } from "../contexts/ToastContext";
import { QRCodeSVG } from "qrcode.react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { showSuccess } = useToastContext();
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadingQR, setDownloadingQR] = useState(false);

  if (!isOpen) return null;

  const handleCopyAddress = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      setCopySuccess(true);
      showSuccess("Address Copied", "Wallet address copied to clipboard");

      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    }
  };

  const handleDownloadQR = () => {
    if (!user?.walletAddress) return;

    setDownloadingQR(true);

    try {
      const el = document.getElementById("wallet-qr-code");
      if (!el) {
        showSuccess("Error", "Could not generate QR code image");
        setDownloadingQR(false);
        return;
      }

      if (el instanceof SVGElement) {
        const svgData = new XMLSerializer().serializeToString(el);
        const img = new Image();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 200;
        canvas.height = 200;
        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);
        img.onload = () => {
          if (ctx) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 20, 20, 160, 160);
            const dataUrl = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = `solana-${user.walletAddress.substring(0, 8)}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setDownloadingQR(false);
            showSuccess("Downloaded", "QR code saved as image");
          }
        };
        img.onerror = () => {
          showSuccess("Error", "Failed to generate QR code image");
          setDownloadingQR(false);
          URL.revokeObjectURL(url);
        };
        img.src = url;
        return;
      }

      // If it's a canvas element, draw it into a padded canvas and download
      if (el instanceof HTMLCanvasElement) {
        const sourceCanvas = el as HTMLCanvasElement;
        const paddedCanvas = document.createElement("canvas");
        const ctx = paddedCanvas.getContext("2d");
        const padding = 20;
        paddedCanvas.width = sourceCanvas.width + padding * 2;
        paddedCanvas.height = sourceCanvas.height + padding * 2;
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
          ctx.drawImage(sourceCanvas, padding, padding);
          const dataUrl = paddedCanvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = `solana-${user.walletAddress.substring(0, 8)}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setDownloadingQR(false);
          showSuccess("Downloaded", "QR code saved as image");
        } else {
          showSuccess("Error", "Failed to generate QR code image");
          setDownloadingQR(false);
        }
        return;
      }

      showSuccess("Error", "Unsupported QR element type");
      setDownloadingQR(false);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      showSuccess("Error", "Could not download QR code");
      setDownloadingQR(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        style={{
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      ></div>

      {/* Modal Content */}
      <div
        className="relative w-full max-w-md bg-[var(--color-main-bg)]/95 border border-white/[0.15] rounded-2xl shadow-2xl shadow-[var(--color-main-accent)]/10 p-4 z-50"
        style={{
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          background: "rgba(0, 8, 20, 0.99)",
        }}
      >
        {/* Overlay for additional blur effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent opacity-100 transition-opacity duration-500 -z-10"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-main-light-text hover:text-main-accent transition-colors duration-300"
        >
          <Icon icon="mdi:close" className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 bg-main-accent/15 rounded-full flex items-center justify-center">
              <Icon
                icon="material-symbols:account-balance-wallet"
                className="w-5 h-5 text-main-accent"
              />
            </div>
          </div>
          <h2 className="text-xl font-tiktok text-main-text mb-1">
            Deposit Funds
          </h2>
          <p className="text-sm text-main-light-text">
            Send funds to your wallet address below
          </p>
        </div>

        {/* Wallet Address Section */}
        {user?.walletAddress ? (
          <div className="mb-4">
            <div className="p-3 bg-white/[0.03] border border-white/[0.1] rounded-xl">
              <p className="text-xs text-main-light-text mb-1">
                Your Wallet Address:
              </p>
              <div className="font-mono text-sm text-main-text bg-white/[0.05] p-2 rounded-lg break-all">
                {user.walletAddress}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <p className="text-sm text-yellow-400">
              Please connect your wallet to view deposit address
            </p>
          </div>
        )}

        {/* QR Code for Solana Wallet Address */}
        <div className="mb-4 flex justify-center">
          <div className="p-3 bg-white/[0.05] border border-white/[0.1] rounded-xl flex flex-col items-center justify-center">
            {user?.walletAddress ? (
              <>
                <p className="text-xs text-main-light-text mb-2">
                  Scan to send funds
                </p>
                <div className="bg-white p-2 rounded-lg">
                  <QRCodeSVG
                    id="wallet-qr-code"
                    value={`solana:${user.walletAddress}`}
                    size={140}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                    includeMargin={false}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-xs text-main-light-text">
                    Solana Blockchain
                  </p>
                  <button
                    onClick={handleDownloadQR}
                    disabled={downloadingQR}
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      downloadingQR
                        ? "bg-gray-500/20 text-gray-400 cursor-not-allowed"
                        : "bg-main-accent/15 text-main-accent hover:bg-main-accent/25"
                    }`}
                    title="Download QR Code"
                  >
                    <Icon
                      icon={
                        downloadingQR ? "eos-icons:loading" : "mdi:download"
                      }
                      className={`w-4 h-4 ${
                        downloadingQR ? "animate-spin" : ""
                      }`}
                    />
                  </button>
                </div>
              </>
            ) : (
              <div className="w-40 h-40 flex items-center justify-center">
                <p className="text-xs text-main-light-text/50">
                  Connect wallet to view QR code
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Warning Note */}
        <div className="mb-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-center justify-center gap-2">
              <Icon
                icon="mdi:alert-circle"
                className="w-4 h-4 text-amber-400"
              />
              <p className="text-xs font-medium text-amber-400">
                Only send SOL or any SPL tokens to this address
              </p>
            </div>
          </div>
        </div>

        {/* Copy Address Button */}
        <button
          onClick={handleCopyAddress}
          className={`w-full py-3 px-4 ${
            copySuccess
              ? "bg-green-500/20 border-green-500/30 text-green-400"
              : "bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] hover:border-main-accent/30 text-main-text hover:text-main-accent"
          } rounded-xl transition-all duration-300 font-tiktok text-sm flex items-center justify-center gap-2`}
        >
          <Icon
            icon={copySuccess ? "mdi:check" : "mdi:content-copy"}
            className="w-5 h-5"
          />
          {copySuccess ? "Address Copied" : "Copy Address"}
        </button>
      </div>
    </div>
  );
};

export default DepositModal;
