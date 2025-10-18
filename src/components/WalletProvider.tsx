import React, { useEffect, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, type ConnectionConfig } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";
import {
  createDefaultAuthorizationCache,
  createDefaultChainSelector,
  createDefaultWalletNotFoundHandler,
  registerMwa,
} from "@solana-mobile/wallet-standard-mobile";

interface SolanaWalletProviderProps {
  children: React.ReactNode;
}

function getUriForAppIdentity(): string | undefined {
  const loc = globalThis.location;
  if (!loc) return undefined;
  return `${loc.protocol}//${loc.host}`;
}

const connectionConfig: ConnectionConfig = { commitment: "processed" };

const SolanaWalletProvider: React.FC<SolanaWalletProviderProps> = ({
  children,
}) => {
  const network = WalletAdapterNetwork.Mainnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  useEffect(() => {
    registerMwa({
      appIdentity: {
        uri: getUriForAppIdentity(),
        name: "Token Find",
      },
      authorizationCache: createDefaultAuthorizationCache(),
      chains: ["solana:mainnet"],
      chainSelector: createDefaultChainSelector(),
      onWalletNotFound: createDefaultWalletNotFoundHandler(),
      // remoteHostAuthority: process.env.NEXT_PUBLIC_REFLECTOR_HOST_AUTHORITY, // optional
    });
  }, []);

  const desktopWallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  );

  const handleWalletError = (err: WalletError) => {
    console.error(`${err.name}: ${err.message}`);
  };

  return (
    <ConnectionProvider endpoint={endpoint} config={connectionConfig}>
      <WalletProvider
        autoConnect
        onError={handleWalletError}
        wallets={desktopWallets}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SolanaWalletProvider;
