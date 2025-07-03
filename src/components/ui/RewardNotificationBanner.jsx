import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const RewardNotificationBanner = ({ 
  rewards = [], 
  onDismiss, 
  onClaim 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const navigate = useNavigate();

  const rewardTypes = {
    staking: {
      icon: 'Coins',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
      title: 'Staking Rewards Available'
    },
    bonus: {
      icon: 'Gift',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20',
      title: 'Bonus Reward Unlocked'
    },
    milestone: {
      icon: 'Trophy',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      title: 'Milestone Achievement'
    },
    airdrop: {
      icon: 'Zap',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      title: 'Airdrop Available'
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    if (rewards.length > 0) {
      setIsVisible(true);
      // Add celebration animation for bonus rewards
      const hasBonusReward = rewards.some(reward => reward.type === 'bonus' || reward.type === 'milestone');
      if (hasBonusReward) {
        setAnimationClass('animate-bounce');
        setTimeout(() => setAnimationClass(''), 2000);
      }
    } else {
      setIsVisible(false);
    }
  }, [rewards]);

  const getTotalRewardValue = () => {
    return rewards.reduce((total, reward) => total + (reward.value || 0), 0);
  };

  const getPrimaryReward = () => {
    // Prioritize bonus and milestone rewards
    const priorityReward = rewards.find(r => r.type === 'bonus' || r.type === 'milestone');
    return priorityReward || rewards[0];
  };

  const handleClaimAll = () => {
    if (onClaim) {
      onClaim(rewards);
    }
    navigate('/rewards-management-usdc-conversion');
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleViewRewards = () => {
    navigate('/rewards-management-usdc-conversion');
  };

  if (!isVisible || rewards.length === 0) return null;

  const primaryReward = getPrimaryReward();
  const config = rewardTypes[primaryReward?.type] || rewardTypes.staking;
  const totalValue = getTotalRewardValue();
  const hasMultipleRewards = rewards.length > 1;

  return (
    <>
      {/* Desktop Banner */}
      <div className="hidden md:block sticky top-16 z-100 mx-4 lg:mx-6 mt-4">
        <div className={`${config.bgColor} ${config.borderColor} border rounded-lg shadow-md backdrop-blur-sm ${animationClass}`}>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
                  <Icon name={config.icon} size={24} className={config.color} />
                </div>
                
                <div>
                  <h3 className="font-semibold text-text-primary">
                    {config.title}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-sm text-text-secondary">
                      {primaryReward?.description || `You have ${rewards.length} reward${rewards.length > 1 ? 's' : ''} ready to claim`}
                    </p>
                    
                    {totalValue > 0 && (
                      <div className="flex items-center space-x-1">
                        <Icon name="DollarSign" size={16} className="text-accent" />
                        <span className="font-mono font-medium text-accent">
                          {totalValue.toLocaleString('en-US', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}
                        </span>
                      </div>
                    )}
                    
                    {hasMultipleRewards && (
                      <span className="text-xs bg-surface-700 text-text-secondary px-2 py-1 rounded">
                        +{rewards.length - 1} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleViewRewards}
                  iconName="Eye"
                  iconPosition="left"
                >
                  View All
                </Button>
                
                <Button
                  variant="success"
                  onClick={handleClaimAll}
                  iconName="Download"
                  iconPosition="left"
                  className="reward-glow"
                >
                  Claim {hasMultipleRewards ? 'All' : 'Reward'}
                </Button>
                
                <button
                  onClick={handleDismiss}
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-700 transition-smooth"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>
            
            {/* Progress Bar for Milestone Rewards */}
            {primaryReward?.type === 'milestone' && primaryReward?.progress && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                  <span>Progress to Next Milestone</span>
                  <span>{primaryReward.progress.current}/{primaryReward.progress.target}</span>
                </div>
                <div className="w-full bg-surface-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-accent to-secondary h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min((primaryReward.progress.current / primaryReward.progress.target) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Banner */}
      <div className="md:hidden sticky top-16 z-100 mx-4 mt-4">
        <div className={`${config.bgColor} ${config.borderColor} border rounded-lg shadow-md backdrop-blur-sm ${animationClass}`}>
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${config.bgColor} ${config.borderColor} border flex-shrink-0`}>
                <Icon name={config.icon} size={20} className={config.color} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary text-sm mb-1">
                  {config.title}
                </h3>
                
                <p className="text-xs text-text-secondary mb-2">
                  {primaryReward?.description || `${rewards.length} reward${rewards.length > 1 ? 's' : ''} available`}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  {totalValue > 0 && (
                    <div className="flex items-center space-x-1">
                      <Icon name="DollarSign" size={14} className="text-accent" />
                      <span className="font-mono font-medium text-accent text-sm">
                        ${totalValue.toLocaleString('en-US', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </span>
                    </div>
                  )}
                  
                  {hasMultipleRewards && (
                    <span className="text-xs bg-surface-700 text-text-secondary px-2 py-1 rounded">
                      +{rewards.length - 1} more
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleViewRewards}
                    className="flex-1 text-xs py-2"
                  >
                    View All
                  </Button>
                  
                  <Button
                    variant="success"
                    onClick={handleClaimAll}
                    className="flex-1 text-xs py-2 reward-glow"
                    iconName="Download"
                    iconPosition="left"
                  >
                    Claim
                  </Button>
                </div>
              </div>
              
              <button
                onClick={handleDismiss}
                className="p-1 rounded text-text-muted hover:text-text-primary transition-smooth flex-shrink-0"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            
            {/* Mobile Progress Bar */}
            {primaryReward?.type === 'milestone' && primaryReward?.progress && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                  <span>Next Milestone</span>
                  <span>{primaryReward.progress.current}/{primaryReward.progress.target}</span>
                </div>
                <div className="w-full bg-surface-700 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-accent to-secondary h-1.5 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min((primaryReward.progress.current / primaryReward.progress.target) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RewardNotificationBanner;