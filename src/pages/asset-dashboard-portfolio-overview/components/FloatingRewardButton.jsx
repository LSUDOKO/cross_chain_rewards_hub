import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const FloatingRewardButton = ({ rewards, onQuickClaim }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasClaimableRewards = rewards.some(reward => reward.amount > 0);
    setIsVisible(hasClaimableRewards);
    
    if (hasClaimableRewards) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [rewards]);

  const getTotalRewards = () => {
    return rewards.reduce((total, reward) => total + (reward.amount || 0), 0);
  };

  const handleClick = () => {
    navigate('/rewards-management-usdc-conversion');
  };

  const handleQuickClaim = (e) => {
    e.stopPropagation();
    if (onQuickClaim) {
      onQuickClaim(rewards);
    }
  };

  if (!isVisible) return null;

  const totalRewards = getTotalRewards();

  return (
    <>
      {/* Desktop Floating Button */}
      <div className="hidden md:block fixed bottom-6 right-6 z-150">
        <div className="relative">
          {/* Pulse Animation */}
          {isAnimating && (
            <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-75"></div>
          )}
          
          {/* Main Button */}
          <button
            onClick={handleClick}
            className="relative bg-gradient-to-r from-accent to-secondary text-accent-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 reward-glow"
          >
            <div className="flex items-center space-x-3">
              <Icon name="Coins" size={24} />
              <div className="text-left">
                <p className="text-sm font-medium">Rewards Ready</p>
                <p className="text-xs opacity-90">
                  {totalRewards.toFixed(4)} MATIC
                </p>
              </div>
            </div>
          </button>
          
          {/* Quick Claim Button */}
          <button
            onClick={handleQuickClaim}
            className="absolute -top-2 -right-2 bg-success text-success-foreground rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110"
            title="Quick Claim"
          >
            <Icon name="Download" size={16} />
          </button>
        </div>
      </div>

      {/* Mobile Floating Button */}
      <div className="md:hidden fixed bottom-20 right-4 z-150">
        <div className="relative">
          {/* Pulse Animation */}
          {isAnimating && (
            <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-75"></div>
          )}
          
          {/* Main Button */}
          <button
            onClick={handleClick}
            className="relative bg-gradient-to-r from-accent to-secondary text-accent-foreground rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 reward-glow"
          >
            <Icon name="Coins" size={20} />
          </button>
          
          {/* Reward Amount Badge */}
          <div className="absolute -top-2 -left-2 bg-surface border border-border rounded-full px-2 py-1 shadow-md">
            <span className="text-xs font-mono text-accent font-medium">
              {totalRewards.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingRewardButton;