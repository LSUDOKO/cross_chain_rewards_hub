import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const PortfolioSummaryCards = ({ assets, rewards, onConvertToUSDC }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const calculateTotalValue = () => {
    return assets.reduce((total, asset) => total + (asset.estimatedValue || 0), 0);
  };

  const getActiveStakes = () => {
    return assets.filter(asset => asset.stakingStatus === 'staked').length;
  };

  const getTotalRewards = () => {
    return rewards.reduce((total, reward) => total + (reward.amount || 0), 0);
  };

  const getUSDCConversionRate = () => {
    // Mock MATIC to USDC conversion rate
    return 0.85;
  };

  const handleQuickConvert = () => {
    if (onConvertToUSDC) {
      onConvertToUSDC();
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const totalValue = calculateTotalValue();
  const activeStakes = getActiveStakes();
  const totalRewards = getTotalRewards();
  const usdcValue = totalRewards * getUSDCConversionRate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Portfolio Value */}
      <div className="bg-surface border border-border rounded-lg p-4 hover:border-border-light transition-smooth">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon name="Wallet" size={20} className="text-primary" />
            <h3 className="font-medium text-text-primary">Total Value</h3>
          </div>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        </div>
        
        <div className="space-y-1">
          <p className="text-2xl font-bold text-text-primary">
            {formatCurrency(totalValue)}
          </p>
          <p className="text-sm text-text-secondary">
            {assets.length} assets across networks
          </p>
        </div>
        
        <div className="mt-3 flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">+12.5%</span>
          </div>
          <span className="text-xs text-text-muted">vs last week</span>
        </div>
      </div>

      {/* Active Stakes */}
      <div className="bg-surface border border-border rounded-lg p-4 hover:border-border-light transition-smooth">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon name="Lock" size={20} className="text-secondary" />
            <h3 className="font-medium text-text-primary">Active Stakes</h3>
          </div>
          {activeStakes > 0 && (
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-2xl font-bold text-text-primary">
            {activeStakes}
          </p>
          <p className="text-sm text-text-secondary">
            of {assets.length} total assets
          </p>
        </div>
        
        <div className="mt-3">
          <div className="w-full bg-surface-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${assets.length > 0 ? (activeStakes / assets.length) * 100 : 0}%` }}
            ></div>
          </div>
          <p className="text-xs text-text-muted mt-1">
            {assets.length > 0 ? Math.round((activeStakes / assets.length) * 100) : 0}% staked
          </p>
        </div>
      </div>

      {/* Pending Rewards */}
      <div className="bg-surface border border-border rounded-lg p-4 hover:border-border-light transition-smooth">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon name="Coins" size={20} className="text-accent" />
            <h3 className="font-medium text-text-primary">Pending Rewards</h3>
          </div>
          {totalRewards > 0 && (
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-text-primary">
              {totalRewards.toFixed(4)}
            </p>
            <span className="text-sm text-text-secondary">MATIC</span>
          </div>
          <p className="text-sm text-accent font-medium">
            ≈ {formatCurrency(usdcValue)} USDC
          </p>
        </div>
        
        <div className="mt-3">
          {totalRewards > 0 ? (
            <button
              onClick={handleQuickConvert}
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-medium py-2 px-3 rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
            >
              {isLoading ? (
                <Icon name="Loader2" size={14} className="animate-spin" />
              ) : (
                <>
                  <Icon name="ArrowUpDown" size={14} />
                  <span>Convert to USDC</span>
                </>
              )}
            </button>
          ) : (
            <p className="text-xs text-text-muted text-center py-2">
              No rewards available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummaryCards;