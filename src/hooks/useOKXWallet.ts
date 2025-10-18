import { useState, useEffect } from "react";
import {
  OKXTonConnect,
  OkxConnectError,
  OKX_CONNECT_ERROR_CODES,
} from "okxconnect";

interface UseOKXWalletReturn {
  isConnected: boolean;
  account: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  formatAddress: (address: string) => string;
}

export const useOKXWallet = (): UseOKXWalletReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [okxTonConnect] = useState(
    () =>
      new OKXTonConnect({
        metaData: {
          name: "Cherry Bot",
          icon: "https://storage.cherrybot.ai/favicon.ico",
        },
      })
  );

  // Helper function to format address
  const formatAddress = (address: string): string => {
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
  };

  // Check and assign wallet connection
  const assignWallet = async () => {
    try {
      const connected = okxTonConnect.connected;
      console.log("connect : ", connected);

      if (connected === true && okxTonConnect.account) {
        const accountAddress = okxTonConnect.account.address;
        setIsConnected(true);
        setAccount(accountAddress);
      }
    } catch (error) {
      if (error instanceof OkxConnectError) {
        if (error.code === OKX_CONNECT_ERROR_CODES.USER_REJECTS_ERROR) {
          alert("User rejected the connection");
        } else if (
          error.code === OKX_CONNECT_ERROR_CODES.ALREADY_CONNECTED_ERROR
        ) {
          alert("You are already connected");
          assignWallet();
        } else {
          alert(error.message);
        }
      } else {
        alert((error as Error).message);
      }
    }
  };

  // Connect to wallet
  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      await okxTonConnect.connect({
        tonProof: "signmessage",
        redirect: "https://www.cherrybot.net",
        openUniversalLink: true,
      });
      await assignWallet();
    } catch (error) {
      if (error instanceof OkxConnectError) {
        if (error.code === OKX_CONNECT_ERROR_CODES.USER_REJECTS_ERROR) {
          alert("User rejected the connection");
        } else if (
          error.code === OKX_CONNECT_ERROR_CODES.ALREADY_CONNECTED_ERROR
        ) {
          await assignWallet();
          alert("You are already connected");
        } else {
          alert(error.message);
        }
      } else {
        alert((error as Error).message);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect from wallet
  const disconnectWallet = async () => {
    try {
      await okxTonConnect.disconnect();
      setIsConnected(false);
      setAccount(null);
    } catch (error) {
      if (error instanceof OkxConnectError) {
        if (error.code === OKX_CONNECT_ERROR_CODES.NOT_CONNECTED_ERROR) {
          alert("You are not connected");
        } else {
          alert(error.message);
        }
      } else {
        alert((error as Error).message);
      }
    }
  };

  // Restore connection on load
  useEffect(() => {
    const restoreConnection = async () => {
      try {
        await okxTonConnect.restoreConnection();
        await assignWallet();
      } catch (error) {
        console.error(error);
      }
    };

    restoreConnection();
  }, [okxTonConnect]);

  return {
    isConnected,
    account,
    isConnecting,
    connectWallet,
    disconnectWallet,
    formatAddress,
  };
};
