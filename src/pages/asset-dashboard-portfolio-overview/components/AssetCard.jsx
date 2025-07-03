import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const AssetCard = ({ asset, onStake, onManage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const networkConfig = {
    ethereum: {
      name: 'Ethereum',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      icon: 'Zap'
    },
    polygon: {
      name: 'Polygon',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20',
      icon: 'Triangle'
    },
    bsc: {
      name: 'BSC',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      icon: 'Circle'
    }
  };

  const stakingStatusConfig = {
    unstaked: {
      color: 'text-text-secondary',
      bgColor: 'bg-surface-700',
      borderColor: 'border-border',
      label: 'Available to Stake',
      icon: 'Unlock'
    },
    staked: {
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      label: 'Currently Staked',
      icon: 'Lock'
    },
    earning: {
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
      label: 'Earning Rewards',
      icon: 'TrendingUp'
    }
  };

  const network = networkConfig[asset.network] || networkConfig.ethereum;
  const status = stakingStatusConfig[asset.stakingStatus || 'unstaked'];

  const handlePrimaryAction = async () => {
    setIsLoading(true);
    
    try {
      if (asset.stakingStatus === 'unstaked') {
        if (onStake) {
          await onStake(asset);
        } else {
          navigate('/asset-staking-interface', { state: { asset } });
        }
      } else {
        if (onManage) {
          await onManage(asset);
        } else {
          navigate('/asset-staking-interface', { state: { asset } });
        }
      }
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBalance = (balance, decimals = 4) => {
    if (!balance) return '0';
    const num = parseFloat(balance);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(decimals);
  };

  const getEstimatedRewards = () => {
    if (asset.stakingStatus === 'earning' && asset.estimatedDailyReward) {
      return asset.estimatedDailyReward;
    }
    return null;
  };

  const getStakingDuration = () => {
    if (asset.stakingStatus !== 'unstaked' && asset.stakedAt) {
      const stakedDate = new Date(asset.stakedAt);
      const now = new Date();
      const diffTime = Math.abs(now - stakedDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
    return null;
  };

  return (
    <div className={`bg-surface border-2 ${status.borderColor} rounded-lg p-4 hover:border-border-light transition-smooth group`}>
      {/* Asset Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-700 flex items-center justify-center">
              {asset.image ? (
                <Image 
                  src={asset.image} 
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icon 
                  name={asset.type === 'nft' ? 'Image' : 'Coins'} 
                  size={24} 
                  className="text-text-muted" 
                />
              )}
            </div>
            
            {/* Network Badge */}
            <div className={`absolute -bottom-1 -right-1 ${network.bgColor} ${network.borderColor} border rounded-full p-1`}>
              <Icon name={network.icon} size={12} className={network.color} />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary truncate">
              {asset.name}
            </h3>
            <p className="text-sm text-text-secondary">
              {network.name}
            </p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={`${status.bgColor} ${status.borderColor} border rounded-lg px-2 py-1 flex items-center space-x-1`}>
          <Icon name={status.icon} size={12} className={status.color} />
          <span className={`text-xs font-medium ${status.color}`}>
            {asset.stakingStatus === 'unstaked' ? 'Available' : 
             asset.stakingStatus === 'staked' ? 'Staked' : 'Earning'}
          </span>
        </div>
      </div>

      {/* Asset Details */}
      <div className="space-y-2 mb-4">
        {asset.type === 'nft' ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Token ID</span>
            <span className="text-sm font-mono text-text-primary">
              #{asset.tokenId}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Balance</span>
            <span className="text-sm font-mono text-text-primary">
              {formatBalance(asset.balance)} {asset.symbol}
            </span>
          </div>
        )}
        
        {asset.estimatedValue && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Est. Value</span>
            <span className="text-sm font-medium text-accent">
              ${asset.estimatedValue.toFixed(2)}
            </span>
          </div>
        )}
        
        {getStakingDuration() && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Staked For</span>
            <span className="text-sm text-text-primary">
              {getStakingDuration()}
            </span>
          </div>
        )}
        
        {getEstimatedRewards() && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Daily Reward</span>
            <span className="text-sm font-medium text-accent">
              {getEstimatedRewards().toFixed(4)} MATIC
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar for Earning Assets */}
      {asset.stakingStatus === 'earning' && asset.rewardProgress && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-text-muted mb-1">
            <span>Reward Progress</span>
            <span>{Math.round(asset.rewardProgress * 100)}%</span>
          </div>
          <div className="w-full bg-surface-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-accent to-secondary h-2 rounded-full transition-all duration-500"
              style={{ width: `${asset.rewardProgress * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <Button
        variant={asset.stakingStatus === 'unstaked' ? 'primary' : 'outline'}
        onClick={handlePrimaryAction}
        disabled={isLoading}
        loading={isLoading}
        className="w-full"
        iconName={asset.stakingStatus === 'unstaked' ? 'Lock' : 'Settings'}
        iconPosition="left"
      >
        {asset.stakingStatus === 'unstaked' ? 'Stake Asset' : 'Manage Stake'}
      </Button>

      {/* Quick Actions */}
      {asset.stakingStatus !== 'unstaked' && (
        <div className="flex space-x-2 mt-2">
          <Button
            variant="ghost"
            onClick={() => navigate('/rewards-management-usdc-conversion')}
            className="flex-1 text-xs py-2"
            iconName="Coins"
            iconPosition="left"
          >
            View Rewards
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => navigate('/transaction-history-activity-tracking')}
            className="flex-1 text-xs py-2"
            iconName="Clock"
            iconPosition="left"
          >
            History
          </Button>
        </div>
      )}
    </div>
  );
};

export default AssetCard;