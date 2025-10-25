import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import tradingService from "../../../api/tradingService";
import { CopyTradeRequest, ExecutionSettings } from "../../../types/trading";
import ButtonOption from "./ButtonOption";
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

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      console.error("Validation Error:", validationError);
      // TODO: Show toast notification with error
      return;
    }

    setIsSubmitting(true);

    // const telegramUserStr = localStorage.getItem("telegram_auth_user");
    // if (!telegramUserStr) {
    //   console.error("User not authenticated");
    //   setIsSubmitting(false);
    //   // TODO: Show toast notification
    //   return;
    // }
    // const telegramUser = JSON.parse(telegramUserStr);
    // const telegramId = telegramUser?.id;

    // if (!telegramId) {
    //   console.error("Telegram ID not found");
    //   setIsSubmitting(false);
    //   // TODO: Show toast notification
    //   return;
    // }

    const settings: ExecutionSettings = {
      slippage: parseFloat(formData.slippage),
      priorityFee: parseFloat(formData.priorityFee),
      bribeAmount: parseFloat(formData.bribeAmount),
      maxFee:
        formData.autoFee && formData.maxFee
          ? parseFloat(formData.maxFee)
          : null,
      autoFee: formData.autoFee,
      mevMode: formData.mevMode,
      broadcastService: formData.broadcastService,
      serviceConfig:
        formData.broadcastService === "normal" && formData.serviceConfig
          ? formData.serviceConfig
          : null,
    };

    const request: CopyTradeRequest = {
      telegramId: null,
      tag: formData.tag || null,
      targetWallet: walletData.walletAddress,
      buyPercentage:
        buyMethod === "maxBuy" || buyMethod === "fixedRatio"
          ? parseFloat(formData.buyAmount)
          : null,
      fixedBuyAmount: buyMethod === "fixedBuy" ? formData.buyAmount : null,
      copySells: sellMethod === "copy",
      minBuyAmount: formData.minBuyAmount ? formData.minBuyAmount : null,
      maxBuyAmount: formData.maxBuyAmount
        ? parseFloat(formData.maxBuyAmount)
        : null,
      minLiquidity: formData.minLiquidity
        ? parseFloat(formData.minLiquidity)
        : null,
      minMarketCap: formData.minMarketCap
        ? parseFloat(formData.minMarketCap)
        : null,
      maxMarketCap: formData.maxMarketCap
        ? parseFloat(formData.maxMarketCap)
        : null,
      allowDuplicateBuys: sellMethod === "duplicate",
      onlyRenounced: onlyRenounced,
      excludePumpfunTokens: excludePumpFun,
      mintBlackList: formData.mintBlackList,
      buySettings: settings,
      sellSettings: settings, // Assuming same settings for buy and sell
    };

    try {
      console.log("Creating copy trade with payload:", request);
      await tradingService.createCopyTrade(request);
      // TODO: Show success toast
      onClose();
    } catch (error) {
      console.error("Failed to create copy trade:", error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md lg:max-w-4xl bg-surface backdrop-blur-xl rounded-sm overflow-hidden border border-subtle shadow-2xl flex flex-col"
            style={{ minWidth: 400, maxHeight: "85vh" }}
          >
            {/* Horizon Light SVG */}
            <svg
              className="absolute top-0 left-0 w-full h-[0.9px] rounded-t-2xl"
              viewBox="0 0 400 4"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="modalHorizonGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#0A0A12" stopOpacity="1" />
                  <stop offset="50%" stopColor="#00ccff" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0A0A12" stopOpacity="1" />
                </linearGradient>
              </defs>
              <rect width="400" height="4" fill="url(#modalHorizonGradient)" />
            </svg>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-subtle bg-surface">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-main-accent/10 rounded-full flex items-center justify-center">
                  <Icon
                    icon="mingcute:aiming-2-line"
                    width={18}
                    height={18}
                    className="text-main-accent"
                  />
                </div>
                <span className="font-mono text-xl text-main-text">
                  Copy Trade
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-main-accent/10 hover:bg-main-accent/20 rounded-full flex items-center justify-center transition-all duration-300 group cursor-pointer"
              >
                <Icon
                  icon="mingcute:close-line"
                  width={20}
                  height={20}
                  className="text-main-light-text group-hover:text-main-text transition-colors duration-300"
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
                    <label className="block text-sm text-main-light-text mb-2">
                      Copy From
                    </label>
                    <div className="flex items-center gap-3 p-2 bg-surface border border-subtle rounded-sm">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-main-accent/20 to-main-accent/40 flex-shrink-0 overflow-hidden">
                        {walletData.profileImage ? (
                          <img
                            src={walletData.profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-main-accent/20 to-main-accent/40 flex items-center justify-center">
                            <Icon
                              icon="mdi:account"
                              className="text-main-accent"
                              width={20}
                              height={20}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-main-text mb-1">
                          {walletData.username}
                        </div>
                        <input
                          className="w-full bg-transparent border-none outline-none text-xs text-main-light-text"
                          value={walletData.walletAddress}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tag */}
                  <div>
                    <label className="block text-sm text-main-light-text mb-2">
                      Tag
                    </label>
                    <input
                      className="w-full placeholder:text-xs bg-surface border border-subtle rounded-sm px-3 py-2.5 text-main-text text-sm placeholder:text-main-light-text focus:outline-none focus:ring-2 focus:ring-main-accent/50 focus:border-main-accent/50 transition-all duration-300"
                      placeholder="Enter tag (max 50 chars)"
                      value={formData.tag}
                      onChange={(e) => handleInputChange("tag", e.target.value)}
                      maxLength={50}
                      required
                    />
                  </div>

                  {/* Buy Method */}
                  <div>
                    <label className="block text-sm text-main-light-text mb-3">
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
                      className="w-full placeholder:text-xs bg-surface border border-subtle rounded-sm px-3 py-2.5 text-main-text text-sm placeholder:text-main-light-text focus:outline-none focus:ring-2 focus:ring-main-accent/50 focus:border-main-accent/50 transition-all duration-300"
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
                    <div className="flex justify-between text-xs text-main-light-text mt-2">
                      <span>≈ $0.00 SOL</span>
                      <span>
                        Balance: {walletData.holdings?.solanaBalance || 0} SOL
                      </span>
                    </div>
                  </div>

                  {/* Sell Method */}
                  <div>
                    <label className="block text-sm text-main-light-text mb-3">
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
                    <label className="block text-sm text-main-light-text mb-3">
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
                      className="flex items-center gap-2 w-full text-sm text-main-light-text hover:text-main-accent transition-colors duration-300 mb-3 cursor-pointer"
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
                      <span className="text-xs text-main-light-text ml-1">
                        1
                      </span>
                      <span className="ml-auto text-xs text-main-light-text hover:text-main-accent transition-colors duration-300">
                        Clear
                      </span>
                    </button>

                    <motion.div
                      initial={false}
                      animate={{
                        height: showAdvanced ? "auto" : 0,
                        opacity: showAdvanced ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-3 pb-4">
                        <input
                          className="col-span-1 placeholder:text-xs bg-white/[0.03] border border-white/[0.1] rounded-full px-2 py-1.5 text-white text-xs placeholder:text-gray-400/50 focus:outline-none focus:border-primary/50 transition-all duration-300"
                          placeholder="Market Cap Min"
                          type="number"
                          value={formData.minMarketCap}
                          onChange={(e) =>
                            handleInputChange("minMarketCap", e.target.value)
                          }
                        />
                        <input
                          className="col-span-1 placeholder:text-xs bg-white/[0.03] border border-white/[0.1] rounded-full px-2 py-1.5 text-white text-xs placeholder:text-gray-400/50 focus:outline-none focus:border-primary/50 transition-all duration-300"
                          placeholder="Market Cap Max"
                          type="number"
                          value={formData.maxMarketCap}
                          onChange={(e) =>
                            handleInputChange("maxMarketCap", e.target.value)
                          }
                        />
                        <input
                          className="col-span-1 placeholder:text-xs bg-white/[0.03] border border-white/[0.1] rounded-full px-2 py-1.5 text-white text-xs placeholder:text-gray-400/50 focus:outline-none focus:border-primary/50 transition-all duration-300"
                          placeholder="Liq Min"
                          type="number"
                          value={formData.minLiquidity}
                          onChange={(e) =>
                            handleInputChange("minLiquidity", e.target.value)
                          }
                        />
                        <input
                          className="col-span-1 placeholder:text-xs bg-white/[0.03] border border-white/[0.1] rounded-full px-2 py-1.5 text-white text-xs placeholder:text-gray-400/50 focus:outline-none focus:border-primary/50 transition-all duration-300"
                          placeholder="Copy Buy Min"
                          type="number"
                          value={formData.minBuyAmount}
                          onChange={(e) =>
                            handleInputChange("minBuyAmount", e.target.value)
                          }
                        />
                        <input
                          className="col-span-1 bg-white/[0.03] border border-white/[0.1] rounded-full px-2 py-1.5 text-white text-xs placeholder:text-gray-400/50 focus:outline-none focus:border-primary/50 transition-all duration-300"
                          placeholder="Copy Buy Max"
                          type="number"
                          value={formData.maxBuyAmount}
                          onChange={(e) =>
                            handleInputChange("maxBuyAmount", e.target.value)
                          }
                        />

                        {/* Slippage Row */}
                        <div className="col-span-2 flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            Slippage
                          </span>
                          <button
                            className="bg-white/[0.05] border border-dashed border-white/[0.2] rounded-full px-2 py-1 flex items-center gap-1 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
                            onClick={() =>
                              handleInputChange("autoFee", !formData.autoFee)
                            }
                          >
                            <Icon
                              icon="mingcute:flash-line"
                              width={12}
                              height={12}
                              className="text-primary"
                            />
                            <span className="text-xs text-gray-400 group-hover:text-primary transition-colors duration-300">
                              {formData.autoFee ? "Auto" : "Manual"}
                            </span>
                          </button>
                          <input
                            className="flex-1 bg-white/[0.03] border border-white/[0.1] rounded-full px-2 py-1 text-white text-xs focus:outline-none focus:border-primary/50 transition-all duration-300"
                            placeholder="%"
                            value={formData.slippage}
                            onChange={(e) =>
                              handleInputChange("slippage", e.target.value)
                            }
                          />
                        </div>

                        {/* Priority Fee Row */}
                        <div className="col-span-2 flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            Priority Fee (SOL)
                          </span>
                          <input
                            className="w-20 bg-white/[0.03] border border-white/[0.1] rounded-full px-2 py-1 text-white text-xs focus:outline-none focus:border-primary/50 transition-all duration-300"
                            placeholder="0.005"
                            value={formData.priorityFee}
                            onChange={(e) =>
                              handleInputChange("priorityFee", e.target.value)
                            }
                          />
                        </div>

                        {/* Tip Row */}
                        <div className="col-span-2 flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            Tip (SOL)
                          </span>
                          <input
                            className="w-20 bg-white/[0.03] border border-white/[0.1] rounded-full px-2 py-1 text-white text-xs focus:outline-none focus:border-primary/50 transition-all duration-300"
                            placeholder="0.005"
                            value={formData.bribeAmount}
                            onChange={(e) =>
                              handleInputChange("bribeAmount", e.target.value)
                            }
                          />
                        </div>

                        {/* Max Fee Row */}
                        <div className="col-span-2 flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            Max Fee (SOL)
                          </span>
                          <input
                            className="w-20 bg-white/[0.03] border border-white/[0.1] rounded-full px-2 py-1 text-white text-xs focus:outline-none focus:border-primary/50 transition-all duration-300"
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
                            className="w-4 h-4 rounded border-white/[0.2] bg-white/[0.03] text-primary focus:ring-primary focus:ring-2"
                          />
                          <span className="text-xs text-gray-400">
                            Anti-MEV RPC
                          </span>
                          <input
                            className="flex-1 bg-white/[0.03] border border-white/[0.1] rounded-full px-2 py-1 text-white text-xs placeholder:text-gray-400/50 focus:outline-none focus:border-primary/50 transition-all duration-300"
                            placeholder="Custom RPC"
                            value={formData.serviceConfig}
                            onChange={(e) =>
                              handleInputChange("serviceConfig", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Token Blacklist */}
                  <div>
                    <label className="block text-sm text-main-light-text mb-2">
                      Token Blacklist
                    </label>
                    <div className="flex gap-2">
                      <input
                        className="flex-1 placeholder:text-xs bg-surface border border-subtle rounded-sm px-3 py-2 text-main-text text-sm placeholder:text-main-light-text focus:outline-none focus:ring-2 focus:ring-main-accent/50 focus:border-main-accent/50 transition-all duration-300"
                        placeholder="Enter Token CA"
                        value={formData.blacklistInput}
                        onChange={(e) =>
                          handleInputChange("blacklistInput", e.target.value)
                        }
                      />
                      <button
                        className="bg-surface border border-main-accent/40 rounded-sm px-4 py-1 flex items-center gap-2 hover:bg-main-accent/10 hover:border-main-accent/60 transition-all duration-300 group cursor-pointer"
                        onClick={addToBlacklist}
                      >
                        <Icon
                          icon="mingcute:add-line"
                          width={16}
                          height={16}
                          className="text-main-accent group-hover:scale-110 transition-transform duration-300"
                        />
                        <span className="text-sm text-main-accent">Add</span>
                      </button>
                    </div>
                    {/* Blacklist items */}
                    {formData.mintBlackList.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {formData.mintBlackList.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-white/[0.03] border border-white/[0.1] rounded-full"
                          >
                            <span className="text-xs text-gray-400 flex-1 truncate">
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
                    className="w-full bg-surface hover:bg-main-accent/10 border border-main-accent/40 hover:border-main-accent/60 rounded-sm px-6 py-3 flex items-center justify-center gap-3 transition-all duration-300 group hover:shadow-lg hover:shadow-main-accent/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                        <span className="text-sm text-main-accent">
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
                        <span className="text-sm text-main-accent group-hover:text-main-highlight transition-colors duration-300">
                          Start Copy Trading
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CopyTradeModal;
