import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const RewardsBreakdownList = ({ 
  rewardsByAsset, 
  onClaimIndividual, 
  isLoading 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [expandedAssets, setExpandedAssets] = useState(new Set());

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const toggleExpanded = (assetId) => {
    const newExpanded = new Set(expandedAssets);
    if (newExpanded.has(assetId)) {
      newExpanded.delete(assetId);
    } else {
      newExpanded.add(assetId);
    }
    setExpandedAssets(newExpanded);
  };

  const formatNumber = (num) => {
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 6 
    });
  };

  const getNetworkIcon = (network) => {
    const networkIcons = {
      'ethereum': 'Zap',
      'polygon': 'Triangle',
      'bsc': 'Circle',
      'arbitrum': 'Square'
    };
    return networkIcons[network.toLowerCase()] || 'Zap';
  };

  const getNetworkColor = (network) => {
    const networkColors = {
      'ethereum': 'text-primary',
      'polygon': 'text-secondary',
      'bsc': 'text-warning',
      'arbitrum': 'text-accent'
    };
    return networkColors[network.toLowerCase()] || 'text-primary';
  };

  const calculateDailyReward = (totalReward, stakingDays) => {
    return stakingDays > 0 ? totalReward / stakingDays : 0;
  };

  if (!rewardsByAsset || rewardsByAsset.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-8 text-center">
        <Icon name="Coins" size={48} className="text-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">No Rewards Available</h3>
        <p className="text-text-secondary">Start staking your assets to earn MATIC rewards!</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="p-4 md:p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary">Rewards by Asset</h3>
        <p className="text-sm text-text-secondary mt-1">
          Detailed breakdown of rewards earned from each staked asset
        </p>
      </div>

      <div className="divide-y divide-border">
        {rewardsByAsset.map((asset) => {
          const isExpanded = expandedAssets.has(asset.id);
          const dailyReward = calculateDailyReward(asset.totalRewards, asset.stakingDays);

          return (
            <div key={asset.id} className="p-4 md:p-6">
              <div className="flex items-start space-x-4">
                {/* Asset Image */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border border-border">
                    <Image
                      src={asset.image}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Asset Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-text-primary truncate">
                        {asset.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Icon 
                          name={getNetworkIcon(asset.network)} 
                          size={14} 
                          className={getNetworkColor(asset.network)} 
                        />
                        <span className="text-sm text-text-secondary">{asset.network}</span>
                        <span className="text-xs bg-surface-700 text-text-muted px-2 py-1 rounded">
                          {asset.type}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpanded(asset.id)}
                      className="p-1 rounded text-text-muted hover:text-text-primary transition-smooth"
                    >
                      <Icon 
                        name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                        size={16} 
                      />
                    </button>
                  </div>

                  {/* Rewards Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div>
                      <span className="text-xs text-text-muted">Total Rewards</span>
                      <div className="font-mono font-medium text-accent">
                        {formatNumber(asset.totalRewards)} MATIC
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs text-text-muted">USDC Value</span>
                      <div className="font-mono font-medium text-text-primary">
                        ${formatNumber(asset.usdcValue)}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs text-text-muted">Daily Rate</span>
                      <div className="font-mono font-medium text-text-secondary">
                        {formatNumber(dailyReward)} MATIC
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs text-text-muted">APY</span>
                      <div className="font-mono font-medium text-success">
                        {asset.apy}%
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 p-4 bg-surface-700 rounded-lg border border-border space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-text-primary mb-2">Staking Details</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-text-muted">Staked Amount:</span>
                              <span className="text-text-primary font-mono">
                                {asset.stakedAmount} {asset.type === 'NFT' ? 'NFT' : asset.symbol}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Staking Duration:</span>
                              <span className="text-text-primary">{asset.stakingDays} days</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Start Date:</span>
                              <span className="text-text-primary">{asset.startDate}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-text-primary mb-2">Reward History</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-text-muted">Last Claim:</span>
                              <span className="text-text-primary">{asset.lastClaim || 'Never'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Total Claimed:</span>
                              <span className="text-text-primary font-mono">
                                {formatNumber(asset.totalClaimed)} MATIC
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Pending:</span>
                              <span className="text-accent font-mono">
                                {formatNumber(asset.totalRewards)} MATIC
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-xs text-text-muted mb-1">
                          <span>Reward Progress</span>
                          <span>{Math.min(asset.stakingDays, 30)}/30 days</span>
                        </div>
                        <div className="w-full bg-surface-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-accent to-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((asset.stakingDays / 30) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      onClick={() => onClaimIndividual(asset)}
                      disabled={isLoading || asset.totalRewards === 0}
                      className="w-full sm:w-auto"
                      iconName="Download"
                      iconPosition="left"
                    >
                      Claim {formatNumber(asset.totalRewards)} MATIC
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RewardsBreakdownList;