import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import AssetPreviewCard from './components/AssetPreviewCard';
import StakingForm from './components/StakingForm';
import TransactionProgress from './components/TransactionProgress';
import RewardCalculator from './components/RewardCalculator';
import GaslessTransactionSetup from './components/GaslessTransactionSetup';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AssetStakingInterface = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isStaking, setIsStaking] = useState(false);
  const [showTransactionProgress, setShowTransactionProgress] = useState(false);
  const [showGaslessSetup, setShowGaslessSetup] = useState(false);
  const [stakingData, setStakingData] = useState(null);
  const [gaslessEnabled, setGaslessEnabled] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Mock assets data
  const mockAssets = [
    {
      id: 1,
      name: "CryptoPunk #1234",
      type: "nft",
      collection: "CryptoPunks",
      network: "Ethereum",
      tokenId: "1234",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
      contractAddress: "0x742d35Cc6634C0532925a3b8D",
      description: "A rare CryptoPunk with unique attributes and historical significance in the NFT space.",
      attributes: [
        { trait_type: "Type", value: "Human" },
        { trait_type: "Accessory", value: "Sunglasses" },
        { trait_type: "Background", value: "Blue" },
        { trait_type: "Rarity", value: "Rare" }
      ]
    },
    {
      id: 2,
      name: "USDC",
      type: "token",
      symbol: "USDC",
      network: "Polygon",
      balance: "1500.50",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop",
      contractAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      description: "USD Coin is a fully collateralized US dollar stablecoin."
    }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    // Get selected asset from navigation state or use first asset as default
    const assetFromState = location.state?.selectedAsset;
    if (assetFromState) {
      setSelectedAsset(assetFromState);
    } else {
      setSelectedAsset(mockAssets[0]);
    }
  }, [location.state]);

  const handleBackToPortfolio = () => {
    navigate('/asset-dashboard-portfolio-overview');
  };

  const handleStake = async (stakingFormData) => {
    setStakingData(stakingFormData);
    
    // Check if gasless is enabled, if not show setup
    if (!gaslessEnabled) {
      setShowGaslessSetup(true);
      return;
    }

    // Proceed with staking
    setIsStaking(true);
    setShowTransactionProgress(true);
  };

  const handleGaslessSetupComplete = (setupData) => {
    setGaslessEnabled(true);
    setShowGaslessSetup(false);
    
    // Now proceed with staking
    setIsStaking(true);
    setShowTransactionProgress(true);
  };

  const handleTransactionComplete = (completedData) => {
    setIsStaking(false);
    
    // Start redirect timer
    const timer = setTimeout(() => {
      navigate('/asset-dashboard-portfolio-overview', {
        state: { 
          stakingSuccess: true,
          stakedAsset: completedData
        }
      });
    }, 5000);
    
    setRedirectTimer(timer);
  };

  const handleCloseTransaction = () => {
    setShowTransactionProgress(false);
    setIsStaking(false);
    
    if (redirectTimer) {
      clearTimeout(redirectTimer);
      setRedirectTimer(null);
    }
    
    navigate('/asset-dashboard-portfolio-overview');
  };

  const handleAssetSwitch = (direction) => {
    const currentIndex = mockAssets.findIndex(asset => asset.id === selectedAsset?.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % mockAssets.length;
    } else {
      newIndex = currentIndex === 0 ? mockAssets.length - 1 : currentIndex - 1;
    }
    
    setSelectedAsset(mockAssets[newIndex]);
  };

  if (!selectedAsset) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Icon name="Loader2" size={32} className="text-primary animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Loading asset details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="px-4 lg:px-6 py-4 border-b border-border">
        <div className="flex items-center space-x-2 text-sm">
          <button
            onClick={handleBackToPortfolio}
            className="text-text-secondary hover:text-text-primary transition-smooth"
          >
            Portfolio
          </button>
          <Icon name="ChevronRight" size={16} className="text-text-muted" />
          <span className="text-text-primary">Stake Asset</span>
          <Icon name="ChevronRight" size={16} className="text-text-muted" />
          <span className="text-text-secondary truncate">{selectedAsset.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 lg:px-6 py-6">
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {/* Asset Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleAssetSwitch('prev')}
              className="p-2 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary transition-smooth"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
            
            <div className="text-center">
              <p className="text-sm text-text-muted">
                {mockAssets.findIndex(a => a.id === selectedAsset.id) + 1} of {mockAssets.length}
              </p>
            </div>
            
            <button
              onClick={() => handleAssetSwitch('next')}
              className="p-2 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary transition-smooth"
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </div>

          <AssetPreviewCard 
            asset={selectedAsset} 
            onBack={handleBackToPortfolio}
          />
          
          <StakingForm 
            asset={selectedAsset}
            onStake={handleStake}
            isLoading={isStaking}
          />
          
          <RewardCalculator 
            asset={selectedAsset}
            stakingDuration={30}
            amount={selectedAsset.type === 'token' ? selectedAsset.balance : null}
          />
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Asset Preview */}
            <div className="col-span-5 space-y-6">
              {/* Asset Navigation */}
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-text-primary">Stake Asset</h1>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAssetSwitch('prev')}
                    className="p-2 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary transition-smooth"
                  >
                    <Icon name="ChevronLeft" size={20} />
                  </button>
                  
                  <span className="text-sm text-text-muted px-3">
                    {mockAssets.findIndex(a => a.id === selectedAsset.id) + 1} of {mockAssets.length}
                  </span>
                  
                  <button
                    onClick={() => handleAssetSwitch('next')}
                    className="p-2 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary transition-smooth"
                  >
                    <Icon name="ChevronRight" size={20} />
                  </button>
                </div>
              </div>

              <AssetPreviewCard 
                asset={selectedAsset} 
                onBack={handleBackToPortfolio}
              />
              
              <RewardCalculator 
                asset={selectedAsset}
                stakingDuration={30}
                amount={selectedAsset.type === 'token' ? selectedAsset.balance : null}
              />
            </div>

            {/* Right Column - Staking Form */}
            <div className="col-span-7">
              <div className="sticky top-20">
                <StakingForm 
                  asset={selectedAsset}
                  onStake={handleStake}
                  isLoading={isStaking}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
          <Button
            variant="outline"
            onClick={handleBackToPortfolio}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back to Portfolio
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => navigate('/rewards-management-usdc-conversion')}
            iconName="Coins"
            iconPosition="left"
          >
            View Rewards
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => navigate('/transaction-history-activity-tracking')}
            iconName="Clock"
            iconPosition="left"
          >
            Transaction History
          </Button>
        </div>
      </div>

      {/* Modals */}
      <GaslessTransactionSetup
        isVisible={showGaslessSetup}
        onSetupComplete={handleGaslessSetupComplete}
        onClose={() => setShowGaslessSetup(false)}
      />

      <TransactionProgress
        isVisible={showTransactionProgress}
        onClose={handleCloseTransaction}
        stakingData={stakingData}
        onComplete={handleTransactionComplete}
      />
    </div>
  );
};

export default AssetStakingInterface;