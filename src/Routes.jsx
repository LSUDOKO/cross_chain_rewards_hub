import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import WalletConnectionNetworkSetup from "pages/wallet-connection-network-setup";
import AssetDashboardPortfolioOverview from "pages/asset-dashboard-portfolio-overview";
import AssetStakingInterface from "pages/asset-staking-interface";
import TransactionHistoryActivityTracking from "pages/transaction-history-activity-tracking";
import RewardsManagementUsdcConversion from "pages/rewards-management-usdc-conversion";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<AssetDashboardPortfolioOverview />} />
        <Route path="/wallet-connection-network-setup" element={<WalletConnectionNetworkSetup />} />
        <Route path="/asset-dashboard-portfolio-overview" element={<AssetDashboardPortfolioOverview />} />
        <Route path="/asset-staking-interface" element={<AssetStakingInterface />} />
        <Route path="/transaction-history-activity-tracking" element={<TransactionHistoryActivityTracking />} />
        <Route path="/rewards-management-usdc-conversion" element={<RewardsManagementUsdcConversion />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;