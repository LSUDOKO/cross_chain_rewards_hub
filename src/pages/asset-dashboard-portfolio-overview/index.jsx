import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import PortfolioSummaryCards from './components/PortfolioSummaryCards';
import AssetFilterChips from './components/AssetFilterChips';
import AssetCard from './components/AssetCard';
import GamificationProgress from './components/GamificationProgress';
import QuickStatsBar from './components/QuickStatsBar';
import FloatingRewardButton from './components/FloatingRewardButton';
import AssetLoadingSkeleton from './components/AssetLoadingSkeleton';
import RewardNotificationBanner from '../../components/ui/RewardNotificationBanner';
import TransactionStatusToast from '../../components/ui/TransactionStatusToast';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AssetDashboardPortfolioOverview = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [assets, setAssets] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
    network: null,
    type: null
  });
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [availableRewards, setAvailableRewards] = useState([]);
  const navigate = useNavigate();

  // Mock data
  const mockAssets = [
    {
      id: 'nft-1',
      name: 'Bored Ape #1234',
      type: 'nft',
      network: 'ethereum',
      tokenId: '1234',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
      estimatedValue: 45000,
      stakingStatus: 'earning',
      apy: 12.5,
      estimatedDailyReward: 0.0234,
      rewardProgress: 0.65,
      stakedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'token-1',
      name: 'Ethereum',
      type: 'token',
      network: 'ethereum',
      symbol: 'ETH',
      balance: '2.5',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop',
      estimatedValue: 8750,
      stakingStatus: 'staked',
      apy: 8.2,
      stakedAt: '2024-01-20T14:30:00Z'
    },
    {
      id: 'nft-2',
      name: 'CryptoPunk #5678',
      type: 'nft',
      network: 'ethereum',
      tokenId: '5678',
      image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&h=400&fit=crop',
      estimatedValue: 78000,
      stakingStatus: 'unstaked',
      apy: 15.0
    },
    {
      id: 'token-2',
      name: 'Polygon',
      type: 'token',
      network: 'polygon',
      symbol: 'MATIC',
      balance: '1250.75',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop',
      estimatedValue: 1063,
      stakingStatus: 'earning',
      apy: 18.5,
      estimatedDailyReward: 0.0567,
      rewardProgress: 0.42,
      stakedAt: '2024-01-18T09:15:00Z'
    },
    {
      id: 'nft-3',
      name: 'Azuki #9876',
      type: 'nft',
      network: 'polygon',
      tokenId: '9876',
      image: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=400&h=400&fit=crop',
      estimatedValue: 12500,
      stakingStatus: 'staked',
      apy: 22.0,
      stakedAt: '2024-01-22T16:45:00Z'
    },
    {
      id: 'token-3',
      name: 'BNB',
      type: 'token',
      network: 'bsc',
      symbol: 'BNB',
      balance: '15.25',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop',
      estimatedValue: 4575,
      stakingStatus: 'unstaked',
      apy: 14.8
    }
  ];

  const mockRewards = [
    {
      id: 'reward-1',
      assetId: 'nft-1',
      amount: 0.0234,
      type: 'staking',
      timestamp: new Date(Date.now() - 86400000)
    },
    {
      id: 'reward-2',
      assetId: 'token-2',
      amount: 0.0567,
      type: 'staking',
      timestamp: new Date(Date.now() - 43200000)
    },
    {
      id: 'reward-3',
      assetId: 'bonus-1',
      amount: 10,
      type: 'bonus',
      timestamp: new Date(Date.now() - 21600000)
    }
  ];

  const mockAvailableRewards = [
    {
      id: 'available-1',
      type: 'staking',
      value: 25.50,
      description: 'Daily staking rewards from 3 assets ready to claim'
    },
    {
      id: 'available-2',
      type: 'bonus',
      value: 10,
      description: 'Multi-asset staking bonus unlocked!',
      progress: { current: 3, target: 5 }
    }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
    
    loadAssets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [assets, activeFilters]);

  const loadAssets = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAssets(mockAssets);
      setRewards(mockRewards);
      setAvailableRewards(mockAvailableRewards);
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await loadAssets();
    } finally {
      setIsRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...assets];

    // Status filter
    if (activeFilters.status && activeFilters.status !== 'all') {
      filtered = filtered.filter(asset => asset.stakingStatus === activeFilters.status);
    }

    // Network filter
    if (activeFilters.network) {
      filtered = filtered.filter(asset => asset.network === activeFilters.network);
    }

    // Type filter
    if (activeFilters.type) {
      filtered = filtered.filter(asset => asset.type === activeFilters.type);
    }

    setFilteredAssets(filtered);
  };

  const handleFilterChange = (filterType, filterValue) => {
    if (filterType === 'clear') {
      setActiveFilters({
        status: 'all',
        network: null,
        type: null
      });
    } else {
      setActiveFilters(prev => ({
        ...prev,
        [filterType]: filterValue
      }));
    }
  };

  const handleStakeAsset = async (asset) => {
    try {
      // Add pending transaction
      const newTransaction = {
        id: `tx-${Date.now()}`,
        type: 'Stake Asset',
        description: `Staking ${asset.name}`,
        status: 'pending',
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        estimatedTime: 180
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Navigate to staking interface
      navigate('/asset-staking-interface', { state: { asset } });
    } catch (error) {
      console.error('Staking failed:', error);
    }
  };

  const handleManageAsset = async (asset) => {
    navigate('/asset-staking-interface', { state: { asset } });
  };

  const handleConvertToUSDC = () => {
    navigate('/rewards-management-usdc-conversion');
  };

  const handleClaimBonus = (bonusAmount) => {
    const newReward = {
      id: `bonus-${Date.now()}`,
      type: 'bonus',
      value: bonusAmount,
      description: `Bonus reward for staking multiple assets`
    };
    
    setAvailableRewards(prev => [newReward, ...prev]);
  };

  const handleQuickClaimRewards = (rewardsTolaim) => {
    const newTransaction = {
      id: `tx-${Date.now()}`,
      type: 'Claim Rewards',
      description: 'Claiming pending rewards',
      status: 'pending',
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      estimatedTime: 120
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    navigate('/rewards-management-usdc-conversion');
  };

  const handleDismissRewardBanner = () => {
    setAvailableRewards([]);
  };

  const handleTransactionDismiss = (txId) => {
    setTransactions(prev => prev.filter(tx => tx.id !== txId));
  };

  const handleTransactionDetails = (tx) => {
    navigate('/transaction-history-activity-tracking', { state: { transaction: tx } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Reward Notification Banner */}
      <RewardNotificationBanner
        rewards={availableRewards}
        onDismiss={handleDismissRewardBanner}
        onClaim={handleQuickClaimRewards}
      />

      {/* Main Content */}
      <div className="px-4 lg:px-6 py-6">
        {/* Pull to Refresh Indicator */}
        {isRefreshing && (
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-2 text-primary">
              <Icon name="RefreshCw" size={20} className="animate-spin" />
              <span className="text-sm font-medium">Refreshing assets...</span>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-6">
            {/* Loading Skeleton for Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-surface border border-border rounded-lg p-4 animate-pulse">
                  <div className="h-6 bg-surface-700 rounded w-32 mb-2"></div>
                  <div className="h-8 bg-surface-700 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-surface-700 rounded w-40"></div>
                </div>
              ))}
            </div>
            
            {/* Loading Skeleton for Assets */}
            <AssetLoadingSkeleton count={6} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Portfolio Summary */}
            <PortfolioSummaryCards
              assets={assets}
              rewards={rewards}
              onConvertToUSDC={handleConvertToUSDC}
            />

            {/* Gamification Progress */}
            <GamificationProgress
              assets={assets}
              onClaimBonus={handleClaimBonus}
            />

            {/* Quick Stats */}
            <QuickStatsBar
              assets={assets}
              rewards={rewards}
            />

            {/* Asset Filters */}
            <AssetFilterChips
              assets={assets}
              onFilterChange={handleFilterChange}
              activeFilters={activeFilters}
            />

            {/* Assets Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-primary">
                  Your Assets ({filteredAssets.length})
                </h2>
                
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  iconName="RefreshCw"
                  iconPosition="left"
                  className={isRefreshing ? 'animate-spin' : ''}
                >
                  Refresh
                </Button>
              </div>

              {filteredAssets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-surface-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Wallet" size={32} className="text-text-muted" />
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    No assets found
                  </h3>
                  <p className="text-text-secondary mb-4">
                    {Object.values(activeFilters).some(filter => filter && filter !== 'all')
                      ? 'Try adjusting your filters to see more assets.' :'Connect your wallet to view your assets.'}
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/wallet-connection-network-setup')}
                    iconName="Wallet"
                    iconPosition="left"
                  >
                    Connect Wallet
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAssets.map(asset => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      onStake={handleStakeAsset}
                      onManage={handleManageAsset}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Reward Button */}
      <FloatingRewardButton
        rewards={rewards}
        onQuickClaim={handleQuickClaimRewards}
      />

      {/* Transaction Status Toast */}
      <TransactionStatusToast
        transactions={transactions}
        onDismiss={handleTransactionDismiss}
        onViewDetails={handleTransactionDetails}
      />
    </div>
  );
};

export default AssetDashboardPortfolioOverview;