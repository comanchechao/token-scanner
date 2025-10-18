import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import HomePage from "./pages/homepage";
import TradesPage from "./pages/trades";
import TokensPage from "./pages/tokens";
import LeaderboardPage from "./pages/leaderboard";
import AccountsPage from "./pages/accounts";
import ProfilePage from "./pages/profile";

import PageLayout from "./layouts/PageLayout";
import ScrollToTop from "./components/ScrollToTop";
import SolanaWalletProvider from "./components/WalletProvider";
import { AuthProvider } from "./components/AuthProvider";
import { SettingsProvider } from "./contexts/SettingsContext";
import { ToastProvider } from "./contexts/ToastContext";
import { LoginModalProvider } from "./contexts/LoginModalContext";
import { ConfirmationModalProvider } from "./contexts/ConfirmationModalContext";
import { AuthenticationModalProvider } from "./contexts/AuthenticationModalContext";
import AuthenticationModalWrapper from "./components/AuthenticationModalWrapper";
import { DepositModalProvider } from "./contexts/DepositModalContext";
import DepositModalWrapper from "./components/DepositModalWrapper";

function App() {
  const location = useLocation();

  return (
    <ToastProvider>
      <SettingsProvider>
        <AuthProvider>
          <SolanaWalletProvider>
            <AuthenticationModalProvider>
              <LoginModalProvider>
                <ConfirmationModalProvider>
                  <DepositModalProvider>
                    <ScrollToTop />
                    <AuthenticationModalWrapper />
                    <DepositModalWrapper />
                    <AnimatePresence mode="wait">
                      <Routes location={location} key={location.pathname}>
                        <Route
                          path="/"
                          element={
                            <PageLayout>
                              <HomePage />
                            </PageLayout>
                          }
                        />
                        <Route
                          path="/trades"
                          element={
                            <PageLayout>
                              <TradesPage />
                            </PageLayout>
                          }
                        />
                        <Route
                          path="/tokens"
                          element={
                            <PageLayout>
                              <TokensPage />
                            </PageLayout>
                          }
                        />
                        <Route
                          path="/leaderboard"
                          element={
                            <PageLayout>
                              <LeaderboardPage />
                            </PageLayout>
                          }
                        />
                        <Route
                          path="/accounts/:walletAddress"
                          element={
                            <PageLayout>
                              <AccountsPage />
                            </PageLayout>
                          }
                        />
                        <Route
                          path="/profile"
                          element={
                            <PageLayout>
                              <ProfilePage />
                            </PageLayout>
                          }
                        />
                        <Route
                          path="/homepage"
                          element={
                            <PageLayout>
                              <HomePage />
                            </PageLayout>
                          }
                        />

                        <Route
                          path="*"
                          element={
                            <PageLayout>
                              <HomePage />
                            </PageLayout>
                          }
                        />
                      </Routes>
                    </AnimatePresence>
                  </DepositModalProvider>
                </ConfirmationModalProvider>
              </LoginModalProvider>
            </AuthenticationModalProvider>
          </SolanaWalletProvider>
        </AuthProvider>
      </SettingsProvider>
    </ToastProvider>
  );
}

export default App;
