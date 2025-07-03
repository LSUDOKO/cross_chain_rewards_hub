import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GamificationProgress = ({ assets, onClaimBonus }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const getStakedAssetsCount = () => {
    return assets.filter(asset => 
      asset.stakingStatus === 'staked' || asset.stakingStatus === 'earning'
    ).length;
  };

  const getBonusProgress = () => {
    const stakedCount = getStakedAssetsCount();
    const milestones = [
      { threshold: 2, bonus: 10, label: 'Starter Bonus' },
      { threshold: 5, bonus: 25, label: 'Explorer Bonus' },
      { threshold: 10, bonus: 50, label: 'Master Bonus' },
      { threshold: 20, bonus: 100, label: 'Legend Bonus' }
    ];

    const currentMilestone = milestones.find(m => stakedCount < m.threshold) || milestones[milestones.length - 1];
    const previousMilestone = milestones[milestones.indexOf(currentMilestone) - 1];
    
    return {
      current: stakedCount,
      next: currentMilestone.threshold,
      bonus: currentMilestone.bonus,
      label: currentMilestone.label,
      progress: stakedCount / currentMilestone.threshold,
      canClaim: previousMilestone && stakedCount >= previousMilestone.threshold,
      claimableBonus: previousMilestone ? previousMilestone.bonus : 0,
      allMilestones: milestones
    };
  };

  const getNetworkDiversity = () => {
    const networks = new Set(
      assets
        .filter(asset => asset.stakingStatus === 'staked' || asset.stakingStatus === 'earning')
        .map(asset => asset.network)
    );
    return networks.size;
  };

  const getAssetTypeDiversity = () => {
    const types = new Set(
      assets
        .filter(asset => asset.stakingStatus === 'staked' || asset.stakingStatus === 'earning')
        .map(asset => asset.type)
    );
    return types.size;
  };

  const bonusProgress = getBonusProgress();
  const networkDiversity = getNetworkDiversity();
  const assetTypeDiversity = getAssetTypeDiversity();

  const handleClaimBonus = () => {
    if (onClaimBonus) {
      onClaimBonus(bonusProgress.claimableBonus);
    }
    navigate('/rewards-management-usdc-conversion');
  };

  const getDiversityBonus = () => {
    let bonus = 0;
    if (networkDiversity >= 2) bonus += 5;
    if (assetTypeDiversity >= 2) bonus += 5;
    return bonus;
  };

  const diversityBonus = getDiversityBonus();

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Icon name="Trophy" size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Staking Rewards Program</h3>
            <p className="text-sm text-text-secondary">
              Earn bonus USDC for staking multiple assets
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-smooth"
        >
          <Icon name={showDetails ? "ChevronUp" : "ChevronDown"} size={20} />
        </button>
      </div>

      {/* Progress Section */}
      <div className="space-y-4">
        {/* Main Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              {bonusProgress.label} Progress
            </span>
            <span className="text-sm text-text-secondary">
              {bonusProgress.current}/{bonusProgress.next} assets
            </span>
          </div>
          
          <div className="w-full bg-surface-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500 relative overflow-hidden"
              style={{ width: `${Math.min(bonusProgress.progress * 100, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">
              {bonusProgress.next - bonusProgress.current} more to unlock ${bonusProgress.bonus} USDC
            </span>
            <span className="text-xs font-medium text-primary">
              ${bonusProgress.bonus} USDC
            </span>
          </div>
        </div>

        {/* Claimable Bonus */}
        {bonusProgress.canClaim && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Gift" size={20} className="text-success" />
                <div>
                  <p className="font-medium text-success">Bonus Ready!</p>
                  <p className="text-xs text-text-secondary">
                    ${bonusProgress.claimableBonus} USDC available
                  </p>
                </div>
              </div>
              
              <Button
                variant="success"
                onClick={handleClaimBonus}
                iconName="Download"
                iconPosition="left"
                className="reward-glow"
              >
                Claim
              </Button>
            </div>
          </div>
        )}

        {/* Diversity Bonuses */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-lg border ${
            networkDiversity >= 2 
              ? 'bg-accent/10 border-accent/20' :'bg-surface-700 border-border'
          }`}>
            <div className="flex items-center space-x-2 mb-1">
              <Icon 
                name={networkDiversity >= 2 ? "CheckCircle" : "Circle"} 
                size={16} 
                className={networkDiversity >= 2 ? "text-accent" : "text-text-muted"} 
              />
              <span className="text-xs font-medium text-text-primary">
                Multi-Network
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              {networkDiversity}/2 networks • +$5 USDC
            </p>
          </div>
          
          <div className={`p-3 rounded-lg border ${
            assetTypeDiversity >= 2 
              ? 'bg-accent/10 border-accent/20' :'bg-surface-700 border-border'
          }`}>
            <div className="flex items-center space-x-2 mb-1">
              <Icon 
                name={assetTypeDiversity >= 2 ? "CheckCircle" : "Circle"} 
                size={16} 
                className={assetTypeDiversity >= 2 ? "text-accent" : "text-text-muted"} 
              />
              <span className="text-xs font-medium text-text-primary">
                Multi-Asset
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              {assetTypeDiversity}/2 types • +$5 USDC
            </p>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-border space-y-3">
          <h4 className="font-medium text-text-primary">All Milestones</h4>
          
          <div className="space-y-2">
            {bonusProgress.allMilestones.map((milestone, index) => {
              const isCompleted = bonusProgress.current >= milestone.threshold;
              const isCurrent = !isCompleted && (index === 0 || bonusProgress.current >= bonusProgress.allMilestones[index - 1].threshold);
              
              return (
                <div 
                  key={milestone.threshold}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    isCompleted 
                      ? 'bg-success/10 border border-success/20' 
                      : isCurrent 
                        ? 'bg-primary/10 border border-primary/20' :'bg-surface-700 border border-border'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={isCompleted ? "CheckCircle" : isCurrent ? "Target" : "Circle"} 
                      size={16} 
                      className={
                        isCompleted 
                          ? "text-success" 
                          : isCurrent 
                            ? "text-primary" :"text-text-muted"
                      } 
                    />
                    <span className="text-sm font-medium text-text-primary">
                      {milestone.label}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-accent">
                      ${milestone.bonus} USDC
                    </p>
                    <p className="text-xs text-text-muted">
                      {milestone.threshold} assets
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationProgress;