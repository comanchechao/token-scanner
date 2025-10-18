import { useState, useCallback } from "react";
import { useAuth } from "../components/AuthProvider";
import { useToastContext } from "../contexts/ToastContext";

export const useLoginModal = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const { isAuthenticated } = useAuth();
  const { showInfo } = useToastContext();

  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  /**
   * Execute an action only if the user is authenticated
   * If not authenticated, shows the login modal
   * @param action The action to execute if authenticated
   * @param saveAction Whether to save the action to execute after login
   */
  const withAuth = useCallback(
    (action: () => void, saveAction = true) => {
      if (isAuthenticated) {
        action();
      } else {
        if (saveAction) {
          setPendingAction(() => action);
        }
        openLoginModal();
        showInfo("Authentication Required", "Please login to continue");
      }
    },
    [isAuthenticated, openLoginModal, showInfo]
  );

  /**
   * Try to execute the pending action if the user is authenticated
   */
  const tryPendingAction = useCallback(() => {
    if (isAuthenticated && pendingAction) {
      pendingAction();
      setPendingAction(null);
      return true;
    }
    return false;
  }, [isAuthenticated, pendingAction]);

  return {
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    withAuth,
    tryPendingAction,
    hasPendingAction: !!pendingAction,
  };
};

export default useLoginModal;
