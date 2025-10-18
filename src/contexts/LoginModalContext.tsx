import React, { createContext, useContext, ReactNode, useEffect } from "react";
import useLoginModal from "../hooks/useLoginModal";
import LoginModal from "../components/LoginModal";
import { useAuth } from "../components/AuthProvider";

type LoginModalContextType = ReturnType<typeof useLoginModal>;

const LoginModalContext = createContext<LoginModalContextType | undefined>(
  undefined
);

export const LoginModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const loginModalState = useLoginModal();
  const { isAuthenticated } = useAuth();

  // When authentication status changes, try to execute pending actions
  useEffect(() => {
    if (isAuthenticated) {
      const executed = loginModalState.tryPendingAction();
      if (executed && loginModalState.isLoginModalOpen) {
        loginModalState.closeLoginModal();
      }
    }
  }, [isAuthenticated, loginModalState]);

  return (
    <LoginModalContext.Provider value={loginModalState}>
      {children}
      <LoginModal
        open={loginModalState.isLoginModalOpen}
        onClose={loginModalState.closeLoginModal}
        hasPendingAction={loginModalState.hasPendingAction}
      />
    </LoginModalContext.Provider>
  );
};

export const useLoginModalContext = (): LoginModalContextType => {
  const context = useContext(LoginModalContext);

  if (context === undefined) {
    throw new Error(
      "useLoginModalContext must be used within a LoginModalProvider"
    );
  }

  return context;
};

export default LoginModalProvider;
