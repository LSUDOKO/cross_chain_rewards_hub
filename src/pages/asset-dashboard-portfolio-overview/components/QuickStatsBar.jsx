import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsBar = ({ assets, rewards }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const getNetworkStats = () => {
    const stats = {};
    assets.forEach(asset => {
      if (!stats[asset.network]) {
        stats[asset.network] = { total: 0, staked: 0 };
      }
      stats[asset.network].total++;
      if (asset.stakingStatus === 'staked' || asset.stakingStatus === 'earning') {
        stats[asset.network].staked++;
      }
    });
    return stats;
  };

  const getTotalEarnings = () => {
    return rewards.reduce((total, reward) => total + (reward.amount || 0), 0);
  };

  const getAverageAPY = () => {
    const stakedAssets = assets.filter(asset => 
      asset.stakingStatus === 'staked' || asset.stakingStatus === 'earning'
    );
    
    if (stakedAssets.length === 0) return 0;
    
    const totalAPY = stakedAssets.reduce((sum, asset) => sum + (asset.apy || 0), 0);
    return totalAPY / stakedAssets.length;
  };

  const getTopPerformingAsset = () => {
    const earningAssets = assets.filter(asset => asset.stakingStatus === 'earning');
    if (earningAssets.length === 0) return null;
    
    return earningAssets.reduce((top, asset) => {
      const currentReward = asset.estimatedDailyReward || 0;
      const topReward = top.estimatedDailyReward || 0;
      return currentReward > topReward ? asset : top;
    });
  };

  const networkStats = getNetworkStats();
  const totalEarnings = getTotalEarnings();
  const averageAPY = getAverageAPY();
  const topAsset = getTopPerformingAsset();

  const networkConfig = {
    ethereum: { name: 'ETH', color: 'text-primary', icon: 'Zap' },
    polygon: { name: 'MATIC', color: 'text-secondary', icon: 'Triangle' },
    bsc: { name: 'BSC', color: 'text-warning', icon: 'Circle' }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Network Distribution */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Icon name="Globe" size={16} className="text-text-secondary" />
            <span className="text-sm font-medium text-text-secondary">Networks</span>
          </div>
          
          <div className="space-y-1">
            {Object.entries(networkStats).map(([network, stats]) => {
              const config = networkConfig[network] || { name: network, color: 'text-text-primary', icon: 'Circle' };
              return (
                <div key={network} className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Icon name={config.icon} size={12} className={config.color} />
                    <span className="text-xs text-text-primary">{config.name}</span>
                  </div>
                  <span className="text-xs text-text-secondary">
                    {stats.staked}/{stats.total}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total Earnings */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-accent" />
            <span className="text-sm font-medium text-text-secondary">Earnings</span>
          </div>
          
          <div>
            <p className="text-lg font-bold text-accent">
              {totalEarnings.toFixed(4)}
            </p>
            <p className="text-xs text-text-muted">MATIC earned</p>
          </div>
        </div>

        {/* Average APY */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Icon name="Percent" size={16} className="text-primary" />
            <span className="text-sm font-medium text-text-secondary">Avg APY</span>
          </div>
          
          <div>
            <p className="text-lg font-bold text-primary">
              {averageAPY.toFixed(1)}%
            </p>
            <p className="text-xs text-text-muted">Annual yield</p>
          </div>
        </div>

        {/* Top Performer */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Icon name="Star" size={16} className="text-warning" />
            <span className="text-sm font-medium text-text-secondary">Top Asset</span>
          </div>
          
          <div>
            {topAsset ? (
              <>
                <p className="text-sm font-medium text-text-primary truncate">
                  {topAsset.name}
                </p>
                <p className="text-xs text-warning">
                  {topAsset.estimatedDailyReward?.toFixed(4) || '0'} MATIC/day
                </p>
              </>
            ) : (
              <p className="text-xs text-text-muted">No earning assets</p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(networkStats).map(([network, stats]) => {
            const config = networkConfig[network] || { name: network, color: 'text-text-primary' };
            const percentage = stats.total > 0 ? (stats.staked / stats.total) * 100 : 0;
            
            return (
              <div key={network} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">{config.name} Staking</span>
                  <span className="text-xs text-text-muted">{Math.round(percentage)}%</span>
                </div>
                <div className="w-full bg-surface-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      network === 'ethereum' ? 'bg-primary' :
                      network === 'polygon'? 'bg-secondary' : 'bg-warning'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickStatsBar;