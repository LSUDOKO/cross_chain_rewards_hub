import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RewardsSummaryCard from './components/RewardsSummaryCard';
import RewardsBreakdownList from './components/RewardsBreakdownList';
import ConversionFlow from './components/ConversionFlow';
import CircleWalletIntegration from './components/CircleWalletIntegration';
import RewardsAnalytics from './components/RewardsAnalytics';
import TransactionMonitor from './components/TransactionMonitor';
import RewardNotificationBanner from '../../components/ui/RewardNotificationBanner';
import TransactionStatusToast from '../../components/ui/TransactionStatusToast';

const RewardsManagementUsdcConversion = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [showConversionFlow, setShowConversionFlow] = useState(false);
  const [showCircleWallet, setShowCircleWallet] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [conversionStep, setConversionStep] = useState(0);
  const [pendingConversion, setPendingConversion] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activeTransactions, setActiveTransactions] = useState([]);
  const navigate = useNavigate();

  // Mock data for rewards
  const mockRewardsSummary = {
    totalMaticRewards: 127.85,
    estimatedUsdcValue: 108.67,
    bonusRewards: 15.25
  };

  const mockRewardsByAsset = [
    {
      id: 'punk-1234',
      name: 'CryptoPunk #1234',
      type: 'NFT',
      network: 'Ethereum',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
      totalRewards: 45.2,
      usdcValue: 38.42,
      apy: 12.5,
      stakingDays: 28,
      stakedAmount: 1,
      symbol: 'NFT',
      startDate: '2024-01-01',
      lastClaim: '2024-01-05',
      totalClaimed: 12.8
    },
    {
      id: 'ape-5678',
      name: 'Bored Ape #5678',
      type: 'NFT',
      network: 'Ethereum',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      totalRewards: 38.7,
      usdcValue: 32.9,
      apy: 15.2,
      stakingDays: 22,
      stakedAmount: 1,
      symbol: 'NFT',
      startDate: '2024-01-08',
      lastClaim: '2024-01-12',
      totalClaimed: 8.5
    },
    {
      id: 'usdc-tokens',
      name: 'USDC Tokens',
      type: 'ERC20',
      network: 'Polygon',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop',
      totalRewards: 28.5,
      usdcValue: 24.22,
      apy: 8.7,
      stakingDays: 35,
      stakedAmount: 5000,
      symbol: 'USDC',
      startDate: '2023-12-25',
      lastClaim: '2024-01-01',
      totalClaimed: 45.2
    },
    {
      id: 'eth-tokens',
      name: 'ETH Tokens',
      type: 'ERC20',
      network: 'Ethereum',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop',
      totalRewards: 15.45,
      usdcValue: 13.13,
      apy: 10.3,
      stakingDays: 18,
      stakedAmount: 2.5,
      symbol: 'ETH',
      startDate: '2024-01-15',
      lastClaim: 'Never',
      totalClaimed: 0
    }
  ];

  const mockTransactions = [
    {
      id: 'tx-1',
      type: 'Reward Claim',
      status: 'confirming',
      hash: '0x742d35Cc6634C0532925a3b8D5A2c8F6F47f23aB',
      amount: 45.2,
      symbol: 'MATIC',
      network: 'polygon',
      timestamp: Date.now() - 300000,
      confirmations: 8,
      requiredConfirmations: 12,
      estimatedTime: 240,
      from: '0x1234567890123456789012345678901234567890',
      to: '0x0987654321098765432109876543210987654321',
      gasUsed: 21000,
      gasFee: '0.15'
    },
    {
      id: 'tx-2',
      type: 'USDC Conversion',
      status: 'pending',
      hash: '0x8A3B2C1D4E5F6789012345678901234567890ABC',
      amount: 38.42,
      symbol: 'USDC',
      network: 'ethereum',
      timestamp: Date.now() - 120000,
      from: '0x1234567890123456789012345678901234567890',
      to: '0x0987654321098765432109876543210987654321'
    }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    // Check for bonus rewards
    const hasMultipleAssets = mockRewardsByAsset.length >= 2;
    if (hasMultipleAssets && mockRewardsSummary.bonusRewards > 0) {
      setNotifications([
        {
          type: 'bonus',
          value: mockRewardsSummary.bonusRewards,
          description: `Bonus reward for staking ${mockRewardsByAsset.length} different assets!`
        }
      ]);
    }

    // Set active transactions
    setActiveTransactions(mockTransactions);
  }, []);

  const handleClaimAll = async () => {
    setIsLoading(true);
    
    try {
      // Simulate claiming all rewards
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Start conversion flow
      setPendingConversion({
        maticAmount: mockRewardsSummary.totalMaticRewards,
        usdcAmount: mockRewardsSummary.estimatedUsdcValue + mockRewardsSummary.bonusRewards
      });
      setShowConversionFlow(true);
      
      // Add success notification
      setNotifications(prev => [...prev, {
        type: 'staking',
        value: mockRewardsSummary.totalMaticRewards,
        description: 'All rewards claimed successfully!'
      }]);
      
    } catch (error) {
      console.error('Failed to claim rewards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimIndividual = async (asset) => {
    setIsLoading(true);
    
    try {
      // Simulate individual claim
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add transaction to monitor
      const newTransaction = {
        id: `tx-${Date.now()}`,
        type: 'Individual Claim',
        status: 'confirming',
        hash: `0x${Math.random().toString(16).substr(2, 40)}`,
        amount: asset.totalRewards,
        symbol: 'MATIC',
        network: asset.network.toLowerCase(),
        timestamp: Date.now(),
        confirmations: 1,
        requiredConfirmations: 12,
        estimatedTime: 300
      };
      
      setActiveTransactions(prev => [newTransaction, ...prev]);
      
    } catch (error) {
      console.error('Failed to claim individual reward:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartConversion = async () => {
    setConversionStep(1);
    
    // Simulate conversion steps
    const steps = [
      { step: 1, delay: 2000 },
      { step: 2, delay: 3000 },
      { step: 3, delay: 2500 },
      { step: 4, delay: 1500 }
    ];
    
    for (const { step, delay } of steps) {
      await new Promise(resolve => setTimeout(resolve, delay));
      setConversionStep(step);
    }
    
    // Show Circle Wallet integration
    setTimeout(() => {
      setShowConversionFlow(false);
      setShowCircleWallet(true);
    }, 1000);
  };

  const handleTransferComplete = (amount) => {
    // Add success notification
    setNotifications(prev => [...prev, {
      type: 'milestone',
      value: amount,
      description: `Successfully transferred $${amount} USDC to MetaMask!`,
      progress: { current: 100, target: 100 }
    }]);
    
    setShowCircleWallet(false);
    setConversionStep(0);
    setPendingConversion(null);
  };

  const handleViewTransactionDetails = (tx) => {
    navigate('/transaction-history-activity-tracking', { 
      state: { selectedTransaction: tx.id } 
    });
  };

  const handleRetryTransaction = (tx) => {
    // Simulate retry
    const updatedTx = { ...tx, status: 'pending', timestamp: Date.now() };
    setActiveTransactions(prev => 
      prev.map(t => t.id === tx.id ? updatedTx : t)
    );
  };

  const handleDismissNotifications = () => {
    setNotifications([]);
  };

  const handleClaimNotificationRewards = (rewards) => {
    handleClaimAll();
  };

  const handleDismissTransaction = (txId) => {
    setActiveTransactions(prev => prev.filter(tx => tx.id !== txId));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Reward Notification Banner */}
      <RewardNotificationBanner
        rewards={notifications}
        onDismiss={handleDismissNotifications}
        onClaim={handleClaimNotificationRewards}
      />

      {/* Main Content */}
      <main className="px-4 lg:px-6 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
              Rewards Management
            </h1>
            <p className="text-text-secondary mt-1">
              Claim your staking rewards and convert them to USDC
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowAnalytics(true)}
              iconName="BarChart3"
              iconPosition="left"
            >
              Analytics
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/transaction-history-activity-tracking')}
              iconName="History"
              iconPosition="left"
            >
              History
            </Button>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm">
          <button
            onClick={() => navigate('/asset-dashboard-portfolio-overview')}
            className="text-text-secondary hover:text-text-primary transition-smooth"
          >
            Portfolio
          </button>
          <Icon name="ChevronRight" size={14} className="text-text-muted" />
          <span className="text-text-primary">Rewards</span>
        </nav>

        {/* Rewards Summary */}
        <RewardsSummaryCard
          totalMaticRewards={mockRewardsSummary.totalMaticRewards}
          estimatedUsdcValue={mockRewardsSummary.estimatedUsdcValue}
          bonusRewards={mockRewardsSummary.bonusRewards}
          onClaimAll={handleClaimAll}
          isLoading={isLoading}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Rewards Breakdown */}
          <div className="xl:col-span-2 space-y-6">
            <RewardsBreakdownList
              rewardsByAsset={mockRewardsByAsset}
              onClaimIndividual={handleClaimIndividual}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column - Transaction Monitor */}
          <div className="space-y-6">
            <TransactionMonitor
              transactions={activeTransactions}
              onViewDetails={handleViewTransactionDetails}
              onRetry={handleRetryTransaction}
            />

            {/* Quick Actions */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="font-medium text-text-primary mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/asset-staking-interface')}
                  className="w-full"
                  iconName="Lock"
                  iconPosition="left"
                >
                  Stake More Assets
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/asset-dashboard-portfolio-overview')}
                  className="w-full"
                  iconName="LayoutGrid"
                  iconPosition="left"
                >
                  View Portfolio
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/wallet-connection-network-setup')}
                  className="w-full"
                  iconName="Settings"
                  iconPosition="left"
                >
                  Network Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only Transaction Monitor */}
        <div className="xl:hidden">
          <TransactionMonitor
            transactions={activeTransactions}
            onViewDetails={handleViewTransactionDetails}
            onRetry={handleRetryTransaction}
          />
        </div>
      </main>

      {/* Conversion Flow Modal */}
      <ConversionFlow
        isActive={showConversionFlow}
        maticAmount={pendingConversion?.maticAmount || 0}
        usdcAmount={pendingConversion?.usdcAmount || 0}
        onStartConversion={handleStartConversion}
        onCancel={() => {
          setShowConversionFlow(false);
          setConversionStep(0);
          setPendingConversion(null);
        }}
        currentStep={conversionStep}
      />

      {/* Circle Wallet Integration Modal */}
      <CircleWalletIntegration
        isVisible={showCircleWallet}
        onClose={() => setShowCircleWallet(false)}
        usdcAmount={pendingConversion?.usdcAmount || 0}
        onTransferComplete={handleTransferComplete}
      />

      {/* Analytics Modal */}
      <RewardsAnalytics
        isVisible={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      {/* Transaction Status Toast */}
      <TransactionStatusToast
        transactions={activeTransactions.filter(tx => 
          tx.status === 'pending' || 
          tx.status === 'confirming' || 
          (tx.status === 'confirmed' && !tx.dismissed) ||
          (tx.status === 'failed' && !tx.dismissed)
        )}
        onDismiss={handleDismissTransaction}
        onViewDetails={handleViewTransactionDetails}
      />
    </div>
  );
};

export default RewardsManagementUsdcConversion;