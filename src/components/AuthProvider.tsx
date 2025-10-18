import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from "react";
import { AuthState, AuthContextType, User, TelegramUser } from "../types/auth";
import authService from "../services/authService";
import { useToastContext } from "../contexts/ToastContext";
import {
  hasTokenInUrl,
  extractDataFromUrl,
  clearTokenFromUrl,
} from "../utils/tokenExtractor";

const STORAGE_KEYS = {
  USER: "wallet_user",
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  TOKEN_ID: "token_id",
} as const;

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | {
      type: "LOGIN_SUCCESS";
      payload: {
        user: User;
        accessToken: string;
        refreshToken: string;
        tokenId: string;
      };
    }
  | { type: "LOGOUT" }
  | {
      type: "REFRESH_SUCCESS";
      payload: { accessToken: string; refreshToken: string; tokenId: string };
    }
  | {
      type: "UPDATE_WALLET_ADDRESS";
      payload: { walletAddress: string };
    };

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  tokenId: null,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        tokenId: action.payload.tokenId,
        error: null,
      };

    case "REFRESH_SUCCESS":
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        tokenId: action.payload.tokenId,
        error: null,
      };

    case "UPDATE_WALLET_ADDRESS":
      if (!state.user) return state;
      const updatedUser = {
        ...state.user,
        walletAddress: action.payload.walletAddress,
        id: action.payload.walletAddress,
        username: `${action.payload.walletAddress.substring(
          0,
          6
        )}...${action.payload.walletAddress.substring(
          action.payload.walletAddress.length - 4
        )}`,
      };
      // Update localStorage with new user data
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      return {
        ...state,
        user: updatedUser,
      };

    case "LOGOUT":
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { showError, showSuccess, showInfo } = useToastContext();

  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tokenRefreshListenerRef = useRef<((event: CustomEvent) => void) | null>(
    null
  );
  const authErrorListenerRef = useRef<((event: CustomEvent) => void) | null>(
    null
  );
  const refreshAuthRef = useRef<(() => Promise<void>) | null>(null);

  const scheduleTokenRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    if (state.isAuthenticated && state.refreshToken) {
      console.log(
        "⏰ [Auth Provider] Scheduling proactive token refresh in 9 minutes..."
      );

      refreshTimerRef.current = setInterval(async () => {
        console.log(
          "🔄 [Auth Provider] Proactive token refresh triggered (9-minute timer)"
        );

        try {
          if (refreshAuthRef.current) {
            await refreshAuthRef.current();
            console.log(
              "✅ [Auth Provider] Proactive token refresh successful"
            );
          }
        } catch (error) {
          console.error(
            "❌ [Auth Provider] Proactive token refresh failed:",
            error
          );
        }
      }, 9 * 60 * 1000);
    }
  }, [state.isAuthenticated, state.refreshToken]);

  useEffect(() => {
    const handleTokenRefreshed = (event: CustomEvent) => {
      console.log(
        "🎉 [Auth Provider] Token refreshed automatically by API interceptor"
      );

      const { accessToken, refreshToken, tokenId } = event.detail;

      dispatch({
        type: "REFRESH_SUCCESS",
        payload: { accessToken, refreshToken, tokenId },
      });

      scheduleTokenRefresh();
    };

    const handleAuthError = async (event: CustomEvent) => {
      console.log(
        "❌ [Auth Provider] Auth error from API interceptor:",
        event.detail
      );

      if (event.detail.shouldLogout) {
        showError(
          "Session Expired",
          "Your session has expired. Please login again."
        );

        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current);
          refreshTimerRef.current = null;
        }

        clearStoredAuthData();
        dispatch({ type: "LOGOUT" });
      }
    };

    tokenRefreshListenerRef.current = handleTokenRefreshed;
    authErrorListenerRef.current = handleAuthError;

    window.addEventListener(
      "tokenRefreshed",
      handleTokenRefreshed as unknown as EventListener
    );
    window.addEventListener(
      "authError",
      handleAuthError as unknown as EventListener
    );

    return () => {
      if (tokenRefreshListenerRef.current) {
        window.removeEventListener(
          "tokenRefreshed",
          tokenRefreshListenerRef.current as unknown as EventListener
        );
      }
      if (authErrorListenerRef.current) {
        window.removeEventListener(
          "authError",
          authErrorListenerRef.current as unknown as EventListener
        );
      }
    };
  }, [showError, scheduleTokenRefresh]);

  useEffect(() => {
    scheduleTokenRefresh();

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [scheduleTokenRefresh]);

  useEffect(() => {
    console.log("🔄 [Auth Provider] Initializing authentication...");

    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const savedAccessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const savedRefreshToken = localStorage.getItem(
        STORAGE_KEYS.REFRESH_TOKEN
      );
      const savedTokenId = localStorage.getItem(STORAGE_KEYS.TOKEN_ID);

      if (savedUser && savedAccessToken && savedRefreshToken && savedTokenId) {
        const user = JSON.parse(savedUser) as User;

        console.log("✅ [Auth Provider] Found saved auth data:", {
          authMethod: user.authMethod,
          userId: user.id,
          hasAccessToken: !!savedAccessToken,
          hasRefreshToken: !!savedRefreshToken,
          tokenId: savedTokenId,
        });

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user,
            accessToken: savedAccessToken,
            refreshToken: savedRefreshToken,
            tokenId: savedTokenId,
          },
        });
      } else {
        console.log("ℹ️ [Auth Provider] No saved auth data found");
      }
    } catch (error) {
      console.error("❌ [Auth Provider] Error loading saved auth data:", error);
      clearStoredAuthData();
    }
  }, []);

  const saveAuthData = (
    user: User,
    accessToken: string,
    refreshToken: string,
    tokenId: string
  ) => {
    console.log("💾 [Auth Provider] Saving auth data to localStorage...", {
      authMethod: user.authMethod,
      userId: user.id,
      tokenId,
    });

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.TOKEN_ID, tokenId);
  };

  const clearStoredAuthData = () => {
    console.log("🗑️ [Auth Provider] Clearing stored auth data...");

    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  const logout = async (): Promise<void> => {
    console.log("🚪 [Auth Provider] Starting logout process...");

    dispatch({ type: "SET_LOADING", payload: true });

    // Clear refresh timer
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    try {
      if (state.refreshToken) {
        await authService.logout(state.refreshToken);
        console.log("✅ [Auth Provider] Backend logout successful");
      }
    } catch (error: any) {
      console.error(
        "⚠️ [Auth Provider] Backend logout failed (continuing with local logout):",
        error.message
      );
    }

    clearStoredAuthData();
    dispatch({ type: "LOGOUT" });

    showSuccess("Logged Out", "You have been successfully logged out", 3000);

    console.log("✅ [Auth Provider] Logout complete");
  };

  const refreshAuth = async (): Promise<void> => {
    console.log("🔄 [Auth Provider] Starting token refresh...");

    if (!state.refreshToken) {
      console.error("❌ [Auth Provider] No refresh token available");
      dispatch({ type: "SET_ERROR", payload: "No refresh token available" });
      return;
    }

    try {
      const result = await authService.refreshToken(state.refreshToken);

      if (!result.success) {
        throw new Error("Token refresh failed");
      }

      const { accessToken, refreshToken, tokenId } = result.result;

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(STORAGE_KEYS.TOKEN_ID, tokenId);

      dispatch({
        type: "REFRESH_SUCCESS",
        payload: { accessToken, refreshToken, tokenId },
      });

      console.log("✅ [Auth Provider] Token refresh successful:", { tokenId });

      scheduleTokenRefresh();
    } catch (error: any) {
      console.error("❌ [Auth Provider] Token refresh failed:", {
        error: error.message,
        response: error.response?.data,
      });

      // Check for specific token expiration errors
      const errorMessage =
        error.response?.data?.error?.message || error.message;

      if (errorMessage && errorMessage.includes("Token has expired")) {
        showError(
          "Session Expired",
          "Your session has expired. Please login again with your wallet or Telegram."
        );

        dispatch({
          type: "SET_ERROR",
          payload: "Session expired. Please login again.",
        });
      } else {
        showError(
          "Authentication Error",
          "Failed to refresh your session. Please login again."
        );
        dispatch({
          type: "SET_ERROR",
          payload: "Session expired. Please login again.",
        });
      }

      await logout();
    }
  };

  refreshAuthRef.current = refreshAuth;

  const clearError = () => {
    dispatch({ type: "SET_ERROR", payload: null });
  };

  const loginWithWallet = async (
    walletAddress: string,
    accessToken: string,
    refreshToken: string,
    tokenId: string
  ): Promise<void> => {
    console.log("🚀 [Auth Provider] Starting wallet-based login...", {
      walletAddress,
      tokenId,
      timestamp: new Date().toISOString(),
    });

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const user: User = {
        id: walletAddress,
        walletAddress: walletAddress, // Initially set to Solana address, will be updated to SNIPER address later
        solanaWalletAddress: walletAddress, // Store the original Solana wallet address
        auth_date: Math.floor(Date.now() / 1000),
        username: `${walletAddress.substring(0, 6)}...${walletAddress.substring(
          walletAddress.length - 4
        )}`,
        authMethod: "wallet",
      };

      saveAuthData(user, accessToken, refreshToken, tokenId);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user,
          accessToken,
          refreshToken,
          tokenId,
        },
      });

      showSuccess(
        "Wallet Connected",
        "You have successfully authenticated with your wallet",
        5000
      );
    } catch (error: any) {
      console.error("💥 [Auth Provider] Wallet login failed:", {
        error: error.message,
        walletAddress,
        timestamp: new Date().toISOString(),
      });

      dispatch({
        type: "SET_LOADING",
        payload: false,
      });

      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to login with wallet",
      });

      showError(
        "Wallet Login Failed",
        error.message || "Failed to connect your wallet"
      );
    }
  };

  const loginWithTelegram = async (
    telegramUser: TelegramUser,
    accessToken: string,
    refreshToken: string,
    tokenId: string
  ): Promise<void> => {
    console.log("🚀 [Auth Provider] Starting Telegram-based login...", {
      telegramId: telegramUser.id,
      tokenId,
      timestamp: new Date().toISOString(),
    });

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const user: User = {
        id: telegramUser.id.toString(),
        walletAddress: `TG_${telegramUser.id}`, // Telegram users get a special identifier
        solanaWalletAddress: `TG_${telegramUser.id}`, // No actual wallet for Telegram users
        auth_date: telegramUser.auth_date,
        username:
          telegramUser.username ||
          `${telegramUser.first_name}${
            telegramUser.last_name ? ` ${telegramUser.last_name}` : ""
          }`,
        telegramId: telegramUser.id,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        photo_url: telegramUser.photo_url,
        hash: telegramUser.hash,
        authMethod: "telegram",
      };

      saveAuthData(user, accessToken, refreshToken, tokenId);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user,
          accessToken,
          refreshToken,
          tokenId,
        },
      });
    } catch (error: any) {
      console.error("💥 [Auth Provider] Telegram login failed:", {
        error: error.message,
        telegramId: telegramUser.id,
        timestamp: new Date().toISOString(),
      });

      dispatch({
        type: "SET_LOADING",
        payload: false,
      });

      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to login with Telegram",
      });

      showError(
        "Telegram Login Failed",
        error.message || "Failed to connect with Telegram"
      );
    }
  };

  // Check for Telegram auth token in URL on mount
  useEffect(() => {
    const checkForTelegramToken = async () => {
      if (hasTokenInUrl()) {
        console.log("🔍 [Auth Provider] Found Telegram auth token in URL");

        try {
          const { token, telegramId } = extractDataFromUrl();

          if (token) {
            showInfo("Telegram Authentication", "Processing login...");

            clearTokenFromUrl();

            const verifyResult = await authService.verifyToken(token);

            if (verifyResult.success) {
              const { accessToken, refreshToken, tokenId } =
                verifyResult.result;

              const telegramUser: TelegramUser = {
                id: telegramId || 1401138577, // Fallback ID if not provided
                first_name: "User",
                last_name: undefined,
                username: undefined,
                photo_url: undefined,
                auth_date: Math.floor(Date.now() / 1000),
                hash: "",
              };

              await loginWithTelegram(
                telegramUser,
                accessToken,
                refreshToken,
                tokenId
              );

              showSuccess(
                "Telegram Login",
                "Successfully logged in with Telegram",
                5000
              );
            }
          }
        } catch (error: any) {
          console.error(
            "❌ [Auth Provider] Telegram token verification failed:",
            error
          );

          if (error.message.includes("Token has expired")) {
            showError(
              "Login Link Expired",
              "Your Telegram login link has expired. Please try again."
            );
          } else {
            showError(
              "Authentication Failed",
              "Failed to verify Telegram login token."
            );
          }
        }
      }
    };

    checkForTelegramToken();
  }, [showInfo, showSuccess, showError, loginWithTelegram]);

  const updateWalletAddress = (newWalletAddress: string): void => {
    console.log(
      "🔄 [Auth Provider] Updating display wallet address (SNIPER):",
      {
        oldAddress: state.user?.walletAddress,
        newAddress: newWalletAddress,
        solanaAddress: state.user?.solanaWalletAddress,
        timestamp: new Date().toISOString(),
      }
    );

    dispatch({
      type: "UPDATE_WALLET_ADDRESS",
      payload: { walletAddress: newWalletAddress },
    });
  };

  const contextValue: AuthContextType = {
    ...state,
    loginWithWallet,
    loginWithTelegram,
    logout,
    refreshAuth,
    clearError,
    updateWalletAddress,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
