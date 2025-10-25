import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

interface TokenInfoProps {
  data: {
    name: string;
    usdBalance: number;
    solBalance: number;
    supply: number;
    mint: string;
    image: string;
    symbol: string;
  };
}

const TokenMetricsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
        when: "afterChildren",
      },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const metricsData = {
    mint: { status: "Disabled", color: "text-green-500" },
    freeze: { status: "Disabled", color: "text-green-500" },
    lp: { status: "100%", color: "text-green-500" },
    pooledCMX: { status: "189M $2.19", color: "text-white" },
    pooledSOL: { status: "0.0₃ $0.15", color: "text-white" },
    topHolders: { status: "17.52%", color: "text-red-500" },
    deployer: { status: "9Yx..59p", color: "text-primary" },
    openTrading: { status: "-", color: "text-white" },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          onClick={onClose}
        >
          <motion.div
            className="bg-card-foreground w-full max-w-md rounded-lg overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h2 className="text-lg font-medium">Token Metrics</h2>
              <button
                onClick={onClose}
                className="text-gray-400 cursor-pointer hover:text-white"
              >
                <Icon icon="mdi:close" width="24" height="24" />
              </button>
            </div>

            <div className="divide-y divide-gray-800">
              <div className="flex justify-between items-center p-4">
                <span className="text-gray-300">Mint Authority</span>
                <span className={metricsData.mint.color}>
                  {metricsData.mint.status}
                </span>
              </div>

              <div className="flex justify-between items-center p-4">
                <span className="text-gray-300">Freeze Authority</span>
                <span className={metricsData.freeze.color}>
                  {metricsData.freeze.status}
                </span>
              </div>

              <div className="flex justify-between items-center p-4">
                <span className="text-gray-300">LP Burned</span>
                <span className={metricsData.lp.color}>
                  {metricsData.lp.status}
                </span>
              </div>

              <div className="flex justify-between items-center p-4">
                <span className="text-gray-300">Pooled CMX</span>
                <span className={metricsData.pooledCMX.color}>
                  {metricsData.pooledCMX.status}
                </span>
              </div>

              <div className="flex justify-between items-center p-4">
                <span className="text-gray-300">Pooled SOL</span>
                <span className={metricsData.pooledSOL.color}>
                  {metricsData.pooledSOL.status}
                </span>
              </div>

              <div className="flex justify-between items-center p-4">
                <span className="text-gray-300">Top 10 Holders</span>
                <span className={metricsData.topHolders.color}>
                  {metricsData.topHolders.status}
                </span>
              </div>

              <div className="flex justify-between items-center p-4">
                <span className="text-gray-300">Deployer</span>
                <div className="flex items-center gap-2">
                  <Icon
                    icon="material-symbols:filter-alt"
                    width="20"
                    height="20"
                    className="text-gray-500"
                  />
                  <span className={metricsData.deployer.color}>
                    {metricsData.deployer.status}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center p-4">
                <span className="text-gray-300">Open Trading</span>
                <span className={metricsData.openTrading.color}>
                  {metricsData.openTrading.status}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TokenInfo: React.FC<TokenInfoProps> = ({ data }) => {
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const openMetricsModal = () => {
    setIsMetricsModalOpen(true);
  };

  const closeMetricsModal = () => {
    setIsMetricsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-fit bg-[#0e0f13] border-x border-subtle text-white">
      <TokenMetricsModal
        isOpen={isMetricsModalOpen}
        onClose={closeMetricsModal}
      />

      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-subtle cursor-pointer hover:bg-white/5 transition-colors"
        onClick={toggleCollapse}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center overflow-hidden">
            <img
              src={data?.image || ""}
              alt={data?.name || "Token"}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-medium text-white">{data?.name}</h2>
            <div className="text-xs text-white/50">${data?.symbol}</div>
          </div>
          <Icon
            icon="lucide:chevron-down"
            width={16}
            height={16}
            className={`text-white/50 transition-transform duration-200 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-1 hover:bg-white/10 rounded-sm cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Copy functionality
            }}
          >
            <Icon
              icon="lucide:copy"
              width={14}
              height={14}
              className="text-white/50"
            />
          </button>
          <button
            className="p-1 hover:bg-white/10 rounded-sm cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Share functionality
            }}
          >
            <Icon
              icon="lucide:share"
              width={14}
              height={14}
              className="text-white/50"
            />
          </button>
          <button
            className="p-1 hover:bg-white/10 rounded-sm cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              openMetricsModal();
            }}
          >
            <Icon
              icon="lucide:shield-check"
              width={14}
              height={14}
              className="text-white/50"
            />
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <>
          {/* Token Metrics */}
          <div className="p-4 border-b border-subtle">
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
              {/* Price */}
              <div className="bg-white/5 rounded-sm p-3 flex items-center gap-2">
                <Icon
                  icon="lucide:dollar-sign"
                  width={16}
                  height={16}
                  className="text-white/50"
                />
                <div className="flex flex-col">
                  <div className="text-xs text-white/50">Price</div>
                  <div className="text-sm font-medium text-white">
                    {data.solBalance.toFixed(5)}
                  </div>
                </div>
              </div>

              {/* Liquidity */}
              <div className="bg-white/5 rounded-sm p-3 flex items-center gap-2">
                <Icon
                  icon="lucide:droplets"
                  width={16}
                  height={16}
                  className="text-white/50"
                />
                <div className="flex flex-col">
                  <div className="text-xs text-white/50">Liquidity</div>
                  <div className="text-sm font-medium text-white">
                    ${data.usdBalance.toFixed(1)}K
                  </div>
                </div>
              </div>

              {/* Supply */}
              <div className="bg-white/5 rounded-sm p-3 flex items-center gap-2">
                <Icon
                  icon="lucide:circle"
                  width={16}
                  height={16}
                  className="text-white/50"
                />
                <div className="flex flex-col">
                  <div className="text-xs text-white/50">Supply</div>
                  <div className="text-sm font-medium text-white">
                    {`${(data.supply / 1_000_000_000).toFixed(0)}B`}
                  </div>
                </div>
              </div>

              {/* Tax */}
              <div className="bg-white/5 rounded-sm p-3 flex items-center gap-2">
                <Icon
                  icon="lucide:percent"
                  width={16}
                  height={16}
                  className="text-white/50"
                />
                <div className="flex flex-col">
                  <div className="text-xs text-white/50">Tax</div>
                  <div className="text-sm font-medium text-white">1.5%+</div>
                </div>
              </div>

              {/* Global Fees Paid */}
              <div className="bg-white/5 rounded-sm p-3 flex items-center gap-2">
                <Icon
                  icon="lucide:menu"
                  width={16}
                  height={16}
                  className="text-white/50"
                />
                <div className="flex flex-col">
                  <div className="text-xs text-white/50">Global Fees Paid</div>
                  <div className="text-sm font-medium text-white">0.621</div>
                </div>
              </div>

              {/* B.Curve */}
              <div className="bg-white/5 rounded-sm p-3 flex items-center gap-2">
                <Icon
                  icon="lucide:trending-up"
                  width={16}
                  height={16}
                  className="text-red-400"
                />
                <div className="flex flex-col">
                  <div className="text-xs text-white/50">B.Curve</div>
                  <div className="text-sm font-medium text-red-400">0%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Address */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon
                  icon="lucide:file-text"
                  width={16}
                  height={16}
                  className="text-white/50"
                />
                <span className="text-sm text-gray-300">
                  CA: {data.mint.slice(0, 6)}...{data.mint.slice(-4)}
                </span>
              </div>
              <Icon
                icon="lucide:external-link"
                width={14}
                height={14}
                className="text-white/50 cursor-pointer hover:text-white transition-colors"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TokenInfo;
