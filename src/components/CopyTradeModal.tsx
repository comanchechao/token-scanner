import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "./AuthProvider";
import { useToastContext } from "../contexts/ToastContext";
import { useLoginModalContext } from "../contexts/LoginModalContext";
import TradingService from "../api/tradingService";
import { CopyTradeRequest, BuySettings, SellSettings } from "../types/trading";

interface CopyTradeModalProps {
  open: boolean;
  onClose: () => void;
  walletData: {
    walletAddress: string;
    username: string;
    profileImage?: string;
    portfolio?: {
      winRate: number;
      avgDuration: string;
      topWinSol: number;
      totalVolumeSOL: number;
    };
    holdings?: {
      solanaBalance: number;
      OtherBalances: Array<{
        symbol: string;
        balance: number;
      }>;
    };
  };
}

const CopyTradeModal: React.FC<CopyTradeModalProps> = ({
  open,
  onClose,
  walletData,
}) => {
  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useToastContext();
  const loginModalContext = useLoginModalContext();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [buyMethod, setBuyMethod] = useState("maxBuy");
  const [sellMethod, setSellMethod] = useState("copy");
  const [excludePumpFun, setExcludePumpFun] = useState(true);
  const [onlyRenounced, setOnlyRenounced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    tag: "",
    buyAmount: "",
    minBuyAmount: "",
    maxBuyAmount: "",
    minLiquidity: "",
    minMarketCap: "",
    maxMarketCap: "",
    mintBlackList: [] as string[],
    blacklistInput: "",
    slippage: "5",
    priorityFee: "0.005",
    bribeAmount: "0.005",
    maxFee: "",
    autoFee: true,
    mevMode: "reduced" as "off" | "reduced" | "secure",
    broadcastService: "normal" as
      | "normal"
      | "jito"
      | "nextblock"
      | "bloxroute"
      | "zeroslot",
    serviceConfig: "",
  });

  // Add animation styles
  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes modalSlideIn {
        from { opacity: 0; transform: scale(0.95) translateY(10px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes modalOverlayShow {
        from { opacity: 0; backdrop-filter: blur(0); }
        to { opacity: 1; backdrop-filter: blur(20px); }
      }
      .modal-content-show {
        animation: modalSlideIn 0.3s ease-out forwards;
      }
      .modal-overlay-show {
        animation: modalOverlayShow 0.3s ease-out forwards;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addToBlacklist = () => {
    if (formData.blacklistInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        mintBlackList: [...prev.mintBlackList, prev.blacklistInput.trim()],
        blacklistInput: "",
      }));
    }
  };

  const removeFromBlacklist = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      mintBlackList: prev.mintBlackList.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): string | null => {
    if (!user?.id) {
      return "User not authenticated";
    }

    if (!walletData.walletAddress) {
      return "Target wallet address is required";
    }

    if (!formData.tag.trim()) {
      return "Tag is required";
    }

    if (buyMethod === "maxBuy" && !formData.buyAmount) {
      return "Buy amount is required";
    }

    if (buyMethod === "fixedBuy" && !formData.buyAmount) {
      return "Fixed buy amount is required";
    }

    if (formData.minMarketCap && formData.maxMarketCap) {
      const min = parseFloat(formData.minMarketCap);
      const max = parseFloat(formData.maxMarketCap);
      if (min >= max) {
        return "Max market cap must be greater than min market cap";
      }
    }

    if (formData.minBuyAmount && formData.maxBuyAmount) {
      const min = parseFloat(formData.minBuyAmount);
      const max = parseFloat(formData.maxBuyAmount);
      if (min >= max) {
        return "Max buy amount must be greater than min buy amount";
      }
    }

    if (formData.slippage) {
      const slippage = parseFloat(formData.slippage);
      if (slippage < 0 || slippage > 100) {
        return "Slippage must be between 0 and 100";
      }
    }

    return null;
  };

  const createBuySettings = (): BuySettings => ({
    slippage: parseFloat(formData.slippage) || 5,
    priorityFee: parseFloat(formData.priorityFee) || 0.005,
    bribeAmount: parseFloat(formData.bribeAmount) || 0.005,
    maxFee: formData.maxFee ? parseFloat(formData.maxFee) : null,
    autoFee: formData.autoFee,
    mevMode: formData.mevMode,
    broadcastService: formData.broadcastService,
    serviceConfig: formData.serviceConfig || null,
  });

  const createSellSettings = (): SellSettings => ({
    slippage: parseFloat(formData.slippage) || 5,
    priorityFee: parseFloat(formData.priorityFee) || 0.005,
    bribeAmount: parseFloat(formData.bribeAmount) || 0.005,
    maxFee: formData.maxFee ? parseFloat(formData.maxFee) : null,
    autoFee: formData.autoFee,
    mevMode: formData.mevMode,
    broadcastService: formData.broadcastService,
    serviceConfig: formData.serviceConfig || null,
  });

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      if (validationError === "User not authenticated") {
        loginModalContext.withAuth(() => {
          handleSubmit();
        });
        return;
      }
      showError("Validation Error", validationError);
      return;
    }

    setIsSubmitting(true);
    showInfo("Creating Copy Trade", "Setting up your copy trade rule...");

    try {
      const request: CopyTradeRequest = {
        tag: formData.tag.trim(),
        targetWallet: walletData.walletAddress,
        buyPercentage:
          buyMethod === "maxBuy" ? parseFloat(formData.buyAmount) : null,
        fixedBuyAmount: buyMethod === "fixedBuy" ? formData.buyAmount : null,
        copySells: sellMethod === "copy",
        minBuyAmount: formData.minBuyAmount || null,
        maxBuyAmount: formData.maxBuyAmount || null,
        minLiquidity: formData.minLiquidity || null,
        minMarketCap: formData.minMarketCap || null,
        maxMarketCap: formData.maxMarketCap || null,
        allowDuplicateBuys: sellMethod === "duplicate",
        onlyRenounced,
        excludePumpfunTokens: excludePumpFun,
        mintBlackList: formData.mintBlackList,
        buySettings: createBuySettings(),
        sellSettings: createSellSettings(),
      };

      const response = await TradingService.createCopyTrade(request);

      if (response.success) {
        showSuccess(
          "Copy Trade Created",
          "Your copy trade rule has been successfully created and is now active"
        );
        onClose();
      } else {
        throw new Error(response.message || "Failed to create copy trade");
      }
    } catch (error: any) {
      console.error("Copy trade creation failed:", error);
      showError(
        "Copy Trade Failed",
        error.message || "Failed to create copy trade rule"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const ButtonOption = ({
    active,
    onClick,
    icon,
    label,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    icon: string;
    label: string;
    children?: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`relative overflow-hidden flex-1   border   rounded-sm px-3 py-2 transition-all duration-300 group cursor-pointer ${
        active
          ? "border-[var(--color-main-accent)]/60 bg-white/[0.08]"
          : "border-white/[0.2] bg-[#161616]  hover:bg-white/[0.06] hover:border-[var(--color-main-accent)]/30"
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        <Icon
          icon={icon}
          width={14}
          height={14}
          className={
            active
              ? "text-main-accent"
              : "text-main-light-text group-hover:text-main-accent transition-colors duration-300"
          }
        />
        <span
          className={`font-tiktok text-xs transition-colors duration-300 ${
            active
              ? "text-main-accent"
              : "text-main-light-text group-hover:text-main-accent"
          }`}
        >
          {label}
        </span>
      </div>
      {children}
    </button>
  );

  return (
    <div
      className={`fixed inset-0 z-50   flex items-center justify-center transition-all duration-300 ${
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
        className={`relative w-full max-w-md lg:max-w-4xl backdrop-blur-xl bg-[#161616]  border border-white/[0.1] shadow-2xl rounded-sm flex flex-col transition-all duration-300 transform 
          ${open ? "modal-content-show" : "opacity-0 scale-95 translate-y-8"}
          before:absolute before:inset-0 before:rounded-sm before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:-z-10`}
        style={{ minWidth: 400, maxHeight: "85vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.1]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8   bg-white/[0.08] border border-white/[0.1] rounded-lg flex items-center justify-center">
              <Icon
                icon="mingcute:aiming-2-line"
                width={18}
                height={18}
                className="text-main-accent"
              />
            </div>
            <span className="font-algance text-xl text-main-text">
              Copy Trade
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg   bg-[#161616]  hover:bg-white/[0.08] border border-white/[0.1] hover:border-[var(--color-red-400)]/30 transition-all duration-300 group cursor-pointer"
          >
            <Icon
              icon="mingcute:close-line"
              width={20}
              height={20}
              className="text-main-light-text group-hover:text-red-400 transition-colors duration-300"
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Wallet Select */}
              <div>
                <label className="block font-tiktok text-sm text-main-light-text mb-2">
                  Copy From
                </label>
                <div className="flex items-center gap-3 p-3   bg-[#161616]  border border-white/[0.1] rounded-sm">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-main-accent)]/20 to-[var(--color-main-highlight)]/20 flex-shrink-0 overflow-hidden">
                    <img
                      src={walletData.profileImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-tiktok text-sm text-main-text mb-1">
                      {walletData.username}
                    </div>
                    <input
                      className="w-full bg-transparent border-none outline-none font-tiktok text-xs text-main-light-text/70"
                      value={walletData.walletAddress}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Tag */}
              <div>
                <label className="block font-tiktok text-sm text-main-light-text mb-2">
                  Tag
                </label>
                <input
                  className="w-full   placeholder:text-xs bg-[#161616]  border border-white/[0.1] rounded-sm px-3 py-2.5 text-main-text font-tiktok text-sm placeholder:text-main-light-text/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/50 transition-all duration-300"
                  placeholder="Enter tag (max 50 chars)"
                  value={formData.tag}
                  onChange={(e) => handleInputChange("tag", e.target.value)}
                  maxLength={50}
                  required
                />
              </div>

              {/* Buy Method */}
              <div>
                <label className="block font-tiktok text-sm text-main-light-text mb-3">
                  Buy Method
                </label>
                <div className="flex gap-2 mb-3">
                  <ButtonOption
                    active={buyMethod === "maxBuy"}
                    onClick={() => setBuyMethod("maxBuy")}
                    icon="pepicons-pencil:money-note"
                    label="Max Buy"
                  />
                  <ButtonOption
                    active={buyMethod === "fixedBuy"}
                    onClick={() => setBuyMethod("fixedBuy")}
                    icon="mingcute:lock-line"
                    label="Fixed Buy"
                  />
                  <ButtonOption
                    active={buyMethod === "fixedRatio"}
                    onClick={() => setBuyMethod("fixedRatio")}
                    icon="mynaui:percentage-waves"
                    label="Fixed Ratio"
                  />
                </div>
                <input
                  className="w-full   placeholder:text-xs bg-[#161616]  border border-white/[0.1] rounded-sm px-3 py-2.5 text-main-text font-tiktok text-sm placeholder:text-main-light-text/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/50 transition-all duration-300"
                  placeholder={
                    buyMethod === "maxBuy"
                      ? "Percentage of balance"
                      : buyMethod === "fixedBuy"
                      ? "Fixed SOL amount"
                      : "Ratio"
                  }
                  type="number"
                  value={formData.buyAmount}
                  onChange={(e) =>
                    handleInputChange("buyAmount", e.target.value)
                  }
                />
                <div className="flex justify-between font-tiktok text-xs text-main-light-text/70 mt-2">
                  <span>≈ $0.00 SOL</span>
                  <span>
                    Balance: {walletData.holdings?.solanaBalance || 0} SOL
                  </span>
                </div>
              </div>

              {/* Sell Method */}
              <div>
                <label className="block font-tiktok text-sm text-main-light-text mb-3">
                  Sell Method
                </label>
                <div className="flex gap-2">
                  <ButtonOption
                    active={sellMethod === "copy"}
                    onClick={() => setSellMethod("copy")}
                    icon="mingcute:copy-2-line"
                    label="Copy Sells"
                  />
                  <ButtonOption
                    active={sellMethod === "duplicate"}
                    onClick={() => setSellMethod("duplicate")}
                    icon="mingcute:repeat-line"
                    label="Duplicate Buys"
                  />
                </div>
              </div>

              {/* Platform Options */}
              <div>
                <label className="block font-tiktok text-sm text-main-light-text mb-3">
                  Platform Options
                </label>
                <div className="flex gap-2">
                  <ButtonOption
                    active={excludePumpFun}
                    onClick={() => setExcludePumpFun(!excludePumpFun)}
                    icon="codicon:exclude"
                    label="Exclude Pump.fun"
                  />
                  <ButtonOption
                    active={onlyRenounced}
                    onClick={() => setOnlyRenounced(!onlyRenounced)}
                    icon="solar:shield-up-line-duotone"
                    label="Only Renounced"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Advanced Settings */}
              <div>
                <button
                  className="flex items-center gap-2 w-full font-tiktok text-sm text-main-light-text hover:text-main-accent transition-colors duration-300 mb-3 cursor-pointer"
                  onClick={() => setShowAdvanced((v) => !v)}
                >
                  <Icon
                    icon={
                      showAdvanced
                        ? "mingcute:down-fill"
                        : "mingcute:right-fill"
                    }
                    width={16}
                    height={16}
                  />
                  Advanced Settings
                  <span className="text-xs text-main-light-text/50 ml-1">
                    1
                  </span>
                  <span className="ml-auto text-xs text-main-light-text/60 hover:text-main-accent transition-colors duration-300">
                    Clear
                  </span>
                </button>

                <div
                  className={`grid grid-cols-2 gap-3 overflow-hidden transition-all duration-300 ease-in-out ${
                    showAdvanced
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <input
                    className="col-span-1   !placeholder:text-xs bg-[#161616]  border border-white/[0.1] rounded-lg px-2 py-1.5 text-main-text font-tiktok text-xs placeholder:text-main-light-text/50 focus:outline-none focus:border-[var(--color-main-accent)]/50 transition-all duration-300"
                    placeholder="Market Cap Min"
                    value={formData.minMarketCap}
                    onChange={(e) =>
                      handleInputChange("minMarketCap", e.target.value)
                    }
                  />
                  <input
                    className="col-span-1   !placeholder:text-xs bg-[#161616]  border border-white/[0.1] rounded-lg px-2 py-1.5 text-main-text font-tiktok text-xs placeholder:text-main-light-text/50 focus:outline-none focus:border-[var(--color-main-accent)]/50 transition-all duration-300"
                    placeholder="Market Cap Max"
                    value={formData.maxMarketCap}
                    onChange={(e) =>
                      handleInputChange("maxMarketCap", e.target.value)
                    }
                  />
                  <input
                    className="col-span-1   !placeholder:text-xs bg-[#161616]  border border-white/[0.1] rounded-lg px-2 py-1.5 text-main-text font-tiktok text-xs placeholder:text-main-light-text/50 focus:outline-none focus:border-[var(--color-main-accent)]/50 transition-all duration-300"
                    placeholder="Liq Min"
                    value={formData.minLiquidity}
                    onChange={(e) =>
                      handleInputChange("minLiquidity", e.target.value)
                    }
                  />
                  <input
                    className="col-span-1   !placeholder:text-xs bg-[#161616]  border border-white/[0.1] rounded-lg px-2 py-1.5 text-main-text font-tiktok text-xs placeholder:text-main-light-text/50 focus:outline-none focus:border-[var(--color-main-accent)]/50 transition-all duration-300"
                    placeholder="Copy Buy Min"
                    value={formData.minBuyAmount}
                    onChange={(e) =>
                      handleInputChange("minBuyAmount", e.target.value)
                    }
                  />
                  <input
                    className="col-span-1   bg-[#161616]  border border-white/[0.1] rounded-lg px-2 py-1.5 text-main-text font-tiktok text-xs placeholder:text-main-light-text/50 focus:outline-none focus:border-[var(--color-main-accent)]/50 transition-all duration-300"
                    placeholder="Copy Buy Max"
                    value={formData.maxBuyAmount}
                    onChange={(e) =>
                      handleInputChange("maxBuyAmount", e.target.value)
                    }
                  />

                  {/* Slippage Row */}
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="font-tiktok text-xs text-main-light-text">
                      Slippage
                    </span>
                    <button
                      className="  bg-white/[0.05] border border-dashed border-white/[0.2] rounded-lg px-2 py-1 flex items-center gap-1 hover:border-[var(--color-main-accent)]/30 transition-all duration-300 group cursor-pointer"
                      onClick={() =>
                        handleInputChange("autoFee", !formData.autoFee)
                      }
                    >
                      <Icon
                        icon="mingcute:flash-line"
                        width={12}
                        height={12}
                        className="text-main-accent"
                      />
                      <span className="font-tiktok text-xs text-main-light-text group-hover:text-main-accent transition-colors duration-300">
                        {formData.autoFee ? "Auto" : "Manual"}
                      </span>
                    </button>
                    <input
                      className="flex-1   bg-[#161616]  border border-white/[0.1] rounded-lg px-2 py-1 text-main-text font-tiktok text-xs focus:outline-none focus:border-[var(--color-main-accent)]/50 transition-all duration-300"
                      placeholder="%"
                      value={formData.slippage}
                      onChange={(e) =>
                        handleInputChange("slippage", e.target.value)
                      }
                    />
                  </div>

                  {/* Priority Fee Row */}
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="font-tiktok text-xs text-main-light-text">
                      Priority Fee (SOL)
                    </span>
                    <input
                      className="w-20   bg-[#161616]  border border-white/[0.1] rounded-lg px-2 py-1 text-main-text font-tiktok text-xs focus:outline-none focus:border-[var(--color-main-accent)]/50 transition-all duration-300"
                      placeholder="0.005"
                      value={formData.priorityFee}
                      onChange={(e) =>
                        handleInputChange("priorityFee", e.target.value)
                      }
                    />
                  </div>

                  {/* Tip Row */}
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="font-tiktok text-xs text-main-light-text">
                      Tip (SOL)
                    </span>
                    <input
                      className="w-20   bg-[#161616]  border border-white/[0.1] rounded-lg px-2 py-1 text-main-text font-tiktok text-xs focus:outline-none focus:border-[var(--color-main-accent)]/50 transition-all duration-300"
                      placeholder="0.005"
                      value={formData.bribeAmount}
                      onChange={(e) =>
                        handleInputChange("bribeAmount", e.target.value)
                      }
                    />
                  </div>

                  {/* Max Fee Row */}
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="font-tiktok text-xs text-main-light-text">
                      Max Fee (SOL)
                    </span>
                    <input
                      className="w-20   bg-[#161616]  border border-white/[0.1] rounded-lg px-2 py-1 text-main-text font-tiktok text-xs focus:outline-none focus:border-[var(--color-main-accent)]/50 transition-all duration-300"
                      placeholder="0.01"
                      value={formData.maxFee}
                      onChange={(e) =>
                        handleInputChange("maxFee", e.target.value)
                      }
                    />
                  </div>

                  {/* Anti-MEV RPC Row */}
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-white/[0.2] bg-[#161616]  text-main-accent focus:ring-main-accent focus:ring-2"
                    />
                    <span className="font-tiktok text-xs text-main-light-text">
                      Anti-MEV RPC
                    </span>
                    <input
                      className="flex-1   bg-[#161616]  border border-white/[0.1] rounded-lg px-2 py-1 text-main-text font-tiktok text-xs placeholder:text-main-light-text/50 focus:outline-none focus:border-[var(--color-main-accent)]/50 transition-all duration-300"
                      placeholder="Custom RPC"
                      value={formData.serviceConfig}
                      onChange={(e) =>
                        handleInputChange("serviceConfig", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Token Blacklist */}
              <div>
                <label className="block font-tiktok text-sm text-main-light-text mb-2">
                  Token Blacklist
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1   placeholder:text-xs bg-[#161616]  border border-white/[0.1] rounded-sm px-3 py-2 text-main-text font-tiktok text-sm placeholder:text-main-light-text/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/50 transition-all duration-300"
                    placeholder="Enter Token CA"
                    value={formData.blacklistInput}
                    onChange={(e) =>
                      handleInputChange("blacklistInput", e.target.value)
                    }
                  />
                  <button
                    className="  bg-white/[0.05] border border-[var(--color-main-accent)]/40 rounded-sm px-4 py-1 flex items-center gap-2 hover:bg-white/[0.08] hover:border-[var(--color-main-accent)]/60 transition-all duration-300 group cursor-pointer"
                    onClick={addToBlacklist}
                  >
                    <Icon
                      icon="mingcute:add-line"
                      width={16}
                      height={16}
                      className="text-main-accent group-hover:scale-110 transition-transform duration-300"
                    />
                    <span className="font-tiktok text-sm text-main-accent">
                      Add
                    </span>
                  </button>
                </div>
                {/* Blacklist items */}
                {formData.mintBlackList.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {formData.mintBlackList.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2   bg-[#161616]  border border-white/[0.1] rounded-lg"
                      >
                        <span className="font-tiktok text-xs text-main-light-text flex-1 truncate">
                          {item}
                        </span>
                        <button
                          onClick={() => removeFromBlacklist(index)}
                          className="p-1 hover:bg-white/[0.08] rounded transition-colors duration-300 cursor-pointer"
                        >
                          <Icon
                            icon="mingcute:close-line"
                            width={12}
                            height={12}
                            className="text-red-400"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Confirm Button - spans full width on large screens */}
            <div className="lg:col-span-2">
              <button
                className="w-full   bg-white/[0.05] hover:bg-white/[0.08] border border-[var(--color-main-accent)]/40 hover:border-[var(--color-main-accent)]/60 rounded-sm px-6 py-3 flex items-center justify-center gap-3 transition-all duration-300 group hover:shadow-lg hover:shadow-[var(--color-main-accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Icon
                      icon="eos-icons:loading"
                      width={20}
                      height={20}
                      className="text-main-accent animate-spin"
                    />
                    <span className="font-tiktok text-sm text-main-accent">
                      Creating...
                    </span>
                  </>
                ) : (
                  <>
                    <Icon
                      icon="mingcute:check-fill"
                      width={20}
                      height={20}
                      className="text-main-accent group-hover:scale-110 transition-transform duration-300"
                    />
                    <span className="font-tiktok text-sm text-main-accent group-hover:text-main-accent transition-colors duration-300">
                      Start Copy Trading
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyTradeModal;
