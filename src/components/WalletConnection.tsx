import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import "../css/cherry.css";

interface WalletConnectionProps {
  onWalletConnected: () => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({
  onWalletConnected,
}) => {
  const { wallet, connect, disconnect, connected, connecting, publicKey } =
    useWallet();
  const { setVisible } = useWalletModal();

  React.useEffect(() => {
    if (connected && publicKey) {
      onWalletConnected();
    }
  }, [connected, publicKey, onWalletConnected]);

  const handleConnect = () => {
    if (wallet) {
      connect();
    } else {
      setVisible(true);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (connected && publicKey) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-cherry-cream to-cherry-cream/50 relative overflow-hidden flex items-center justify-center"
      >
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-cherry-red opacity-10 rounded-full animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-16 h-16 bg-cherry-red opacity-10 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            {/* Success Card */}
            <div className="bg-cherry-cream rounded-2xl border-4 border-cherry-burgundy shadow-[8px_8px_0px_#5d4037] p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-20"></div>

              <div className="relative z-10">
                {/* Success Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Icon
                      icon="mdi:check-circle"
                      className="text-white"
                      width={48}
                      height={48}
                    />
                  </div>
                </div>

                <h1 className="maladroit-font text-2xl md:text-3xl text-cherry-burgundy mb-4">
                  Wallet Connected Successfully!
                </h1>

                {/* Wallet Info */}
                <div className="bg-cherry-burgundy rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    {wallet?.adapter.icon && (
                      <img
                        src={wallet.adapter.icon}
                        alt={wallet.adapter.name}
                        className="w-8 h-8 rounded"
                      />
                    )}
                    <span className="winky-sans-font text-lg   text-cherry-cream">
                      {wallet?.adapter.name}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="winky-sans-font text-sm text-cherry-cream opacity-80 mb-2">
                      Connected Address:
                    </p>
                    <p className="winky-sans-font text-lg font-mono text-yellow-400">
                      {formatAddress(publicKey.toString())}
                    </p>
                  </div>
                </div>

                <p className="winky-sans-font text-lg text-cherry-burgundy mb-6">
                  Your wallet is now connected to the Solana blockchain. You can
                  proceed to create and manage your projects.
                </p>

                {/* Disconnect Option */}
                <motion.button
                  onClick={handleDisconnect}
                  className="bg-cherry-burgundy text-cherry-cream py-2 px-4 rounded-lg border border-b-2 border-r-2 border-cherry-red hover:border-b-1 hover:border-r-1 hover:translate-y-0.5 hover:translate-x-0.5 transition-all duration-200 winky-sans-font text-sm"
                >
                  <Icon
                    icon="mdi:logout"
                    className="inline mr-2"
                    width={16}
                    height={16}
                  />
                  Disconnect Wallet
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-cherry-cream to-cherry-cream/50 relative overflow-hidden flex items-center justify-center"
    >
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-cherry-red opacity-10 rounded-full animate-float"></div>
      <div
        className="absolute bottom-20 right-10 w-16 h-16 bg-cherry-red opacity-10 rounded-full animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 right-1/4 w-12 h-12 bg-cherry-red opacity-10 rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Main Card */}
          <div className="bg-cherry-cream rounded-2xl border-4 border-cherry-burgundy shadow-[8px_8px_0px_#5d4037] p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-20"></div>

            <div className="relative z-10">
              {/* Wallet Icon */}
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-cherry-red rounded-full flex items-center justify-center shadow-lg">
                  <Icon
                    icon="mdi:wallet"
                    className="text-cherry-cream"
                    width={48}
                    height={48}
                  />
                </div>
              </div>

              <h1 className="maladroit-font text-2xl md:text-4xl text-cherry-burgundy mb-4">
                Connect Your Wallet
              </h1>

              <p className="winky-sans-font text-lg text-cherry-burgundy mb-8">
                Connect your Solana wallet to start creating and managing your
                crypto projects with Cherry AI.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-cherry-burgundy rounded-xl p-4">
                  <Icon
                    icon="mdi:shield-check"
                    className="text-yellow-400 mx-auto mb-2"
                    width={24}
                    height={24}
                  />
                  <h3 className="winky-sans-font text-sm   text-cherry-cream mb-1">
                    Secure
                  </h3>
                  <p className="winky-sans-font text-xs text-cherry-cream opacity-80">
                    Your wallet stays secure in your control
                  </p>
                </div>
                <div className="bg-cherry-burgundy rounded-xl p-4">
                  <Icon
                    icon="mdi:lightning-bolt"
                    className="text-yellow-400 mx-auto mb-2"
                    width={24}
                    height={24}
                  />
                  <h3 className="winky-sans-font text-sm   text-cherry-cream mb-1">
                    Fast
                  </h3>
                  <p className="winky-sans-font text-xs text-cherry-cream opacity-80">
                    Lightning-fast Solana transactions
                  </p>
                </div>
                <div className="bg-cherry-burgundy rounded-xl p-4">
                  <Icon
                    icon="mdi:coin"
                    className="text-yellow-400 mx-auto mb-2"
                    width={24}
                    height={24}
                  />
                  <h3 className="winky-sans-font text-sm   text-cherry-cream mb-1">
                    Low Fees
                  </h3>
                  <p className="winky-sans-font text-xs text-cherry-cream opacity-80">
                    Minimal transaction costs
                  </p>
                </div>
              </div>

              {/* Connect Button */}
              <motion.button
                onClick={handleConnect}
                disabled={connecting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-cherry-red text-white py-4 px-8 rounded-xl border border-b-8 border-r-8 border-cherry-burgundy hover:border-b-2 hover:border-r-2 hover:translate-y-1 hover:translate-x-1 transition-all duration-200 transform-gpu text-xl flex items-center gap-3 shadow-[4px_4px_0px_#321017] hover:shadow-[2px_2px_0px_#321017] winky-sans-font mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connecting ? (
                  <>
                    <Icon
                      icon="mdi:loading"
                      className="animate-spin text-cherry-cream"
                      width={24}
                      height={24}
                    />
                    <span className="text-cherry-cream">Connecting...</span>
                  </>
                ) : (
                  <>
                    <Icon
                      icon="mdi:wallet-plus"
                      className="text-cherry-cream"
                      width={24}
                      height={24}
                    />
                    <span className="text-cherry-cream">Connect Wallet</span>
                  </>
                )}
              </motion.button>

              {/* Supported Wallets */}
              <div className="mt-6">
                <p className="winky-sans-font text-sm text-cherry-burgundy opacity-80 mb-3">
                  Supported Wallets:
                </p>
                <div className="flex justify-center gap-4">
                  <div className="bg-white rounded-lg p-2 border-2 border-cherry-burgundy">
                    <img
                      src="https://phantom.app/img/logo.png"
                      alt="Phantom"
                      className="w-8 h-8"
                    />
                  </div>
                  <div className="bg-white rounded-lg p-2 border-2 border-cherry-burgundy">
                    <img
                      src="https://solflare.com/assets/solflare-logo.svg"
                      alt="Solflare"
                      className="w-8 h-8"
                    />
                  </div>
                  <div className="bg-white rounded-lg p-2 border-2 border-cherry-burgundy">
                    <Icon
                      icon="simple-icons:ledger"
                      className="text-black w-8 h-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletConnection;
