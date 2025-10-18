import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useWalletConnection } from "../hooks/useWalletConnection";
import { useAuth } from "../components/AuthProvider";

interface AuthenticationModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  onSuccess: () => void;
}

const AuthenticationModalContext = createContext<
  AuthenticationModalContextType | undefined
>(undefined);

interface AuthenticationModalProviderProps {
  children: ReactNode;
}

export const AuthenticationModalProvider: React.FC<
  AuthenticationModalProviderProps
> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { connected, disconnectWallet } = useWalletConnection();
  const { isAuthenticated } = useAuth();

  // Auto-open modal when wallet connects but user is not authenticated
  useEffect(() => {
    console.log("🔍 [Auth Modal Context] Checking conditions:", {
      connected,
      isAuthenticated,
      modalIsOpen: isOpen,
      condition1: connected,
      condition2: !isAuthenticated,
      condition3: !isOpen,
      allConditionsMet: connected && !isAuthenticated && !isOpen,
    });

    // Use the exact same condition as WalletAuth component
    if (connected && !isAuthenticated && !isOpen) {
      console.log(
        "🔐 [Auth Modal Context] Wallet connected but not authenticated, opening modal..."
      );
      setIsOpen(true);
    } else {
      console.log(
        "🚫 [Auth Modal Context] Conditions not met for opening modal"
      );
    }
  }, [connected, isAuthenticated, isOpen]);

  // Auto-close modal when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      console.log(
        "✅ [Auth Modal Context] User authenticated, closing modal..."
      );
      setIsOpen(false);
    }
  }, [isAuthenticated, isOpen]);

  const openModal = () => {
    console.log(
      "🔐 [Auth Modal Context] Manually opening authentication modal..."
    );
    setIsOpen(true);
  };

  const closeModal = () => {
    console.log("❌ [Auth Modal Context] Closing authentication modal...");
    setIsOpen(false);

    // If wallet is connected but not authenticated, disconnect the wallet
    if (connected && !isAuthenticated) {
      console.log(
        "🔌 [Auth Modal Context] Disconnecting wallet since modal was closed without authentication"
      );
      disconnectWallet().catch((err) => {
        console.error("Error disconnecting wallet:", err);
      });
    }
  };

  const onSuccess = () => {
    console.log("✅ [Auth Modal Context] Authentication successful!");
    // Additional success handling can be added here
  };

  const contextValue: AuthenticationModalContextType = {
    isOpen,
    openModal,
    closeModal,
    onSuccess,
  };

  return (
    <AuthenticationModalContext.Provider value={contextValue}>
      {children}
    </AuthenticationModalContext.Provider>
  );
};

export const useAuthenticationModal = (): AuthenticationModalContextType => {
  const context = useContext(AuthenticationModalContext);

  if (context === undefined) {
    throw new Error(
      "useAuthenticationModal must be used within an AuthenticationModalProvider"
    );
  }

  return context;
};
