import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RewardsSummaryCard = ({ 
  totalMaticRewards, 
  estimatedUsdcValue, 
  bonusRewards, 
  onClaimAll,
  isLoading 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    if (bonusRewards > 0) {
      setAnimationClass('animate-pulse');
      setTimeout(() => setAnimationClass(''), 3000);
    }
  }, [bonusRewards]);

  const formatNumber = (num) => {
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 6 
    });
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 md:p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-text-primary">
          Rewards Summary
        </h2>
        <div className="flex items-center space-x-2">
          <Icon name="Coins" size={20} className="text-accent" />
          <span className="text-sm text-text-secondary">Total Claimable</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* MATIC Rewards */}
        <div className="bg-surface-700 rounded-lg p-4 border border-border">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Zap" size={18} className="text-secondary" />
            <span className="text-sm text-text-secondary">MATIC Rewards</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-text-primary font-mono">
              {formatNumber(totalMaticRewards)}
            </span>
            <span className="text-sm text-text-muted">MATIC</span>
          </div>
        </div>

        {/* USDC Value */}
        <div className="bg-surface-700 rounded-lg p-4 border border-border">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="DollarSign" size={18} className="text-accent" />
            <span className="text-sm text-text-secondary">Est. USDC Value</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-accent font-mono">
              ${formatNumber(estimatedUsdcValue)}
            </span>
            <span className="text-sm text-text-muted">USDC</span>
          </div>
        </div>

        {/* Bonus Rewards */}
        <div className={`bg-gradient-to-br from-warning/10 to-secondary/10 rounded-lg p-4 border border-warning/20 ${animationClass}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Gift" size={18} className="text-warning" />
            <span className="text-sm text-text-secondary">Bonus Rewards</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-warning font-mono">
              +${formatNumber(bonusRewards)}
            </span>
            <span className="text-sm text-text-muted">USDC</span>
          </div>
          {bonusRewards > 0 && (
            <div className="mt-2 flex items-center space-x-1">
              <Icon name="Star" size={14} className="text-warning" />
              <span className="text-xs text-warning">Multi-asset bonus!</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          onClick={onClaimAll}
          disabled={isLoading || totalMaticRewards === 0}
          loading={isLoading}
          className="flex-1 reward-glow"
          iconName="Download"
          iconPosition="left"
        >
          Claim All Rewards
        </Button>
        
        <Button
          variant="outline"
          className="flex-1"
          iconName="TrendingUp"
          iconPosition="left"
        >
          View Analytics
        </Button>
      </div>

      {/* Conversion Rate Info */}
      <div className="mt-4 p-3 bg-surface-700 rounded-lg border border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Current MATIC/USDC Rate:</span>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-text-primary">
              1 MATIC = ${(estimatedUsdcValue / totalMaticRewards || 0).toFixed(4)} USDC
            </span>
            <Icon name="RefreshCw" size={14} className="text-text-muted" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsSummaryCard;