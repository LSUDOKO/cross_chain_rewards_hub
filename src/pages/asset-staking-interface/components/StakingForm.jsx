import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const StakingForm = ({ asset, onStake, isLoading }) => {
  const [stakingDuration, setStakingDuration] = useState(30);
  const [customAmount, setCustomAmount] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const stakingOptions = [
    { days: 7, label: '1 Week', apy: 5.2, popular: false },
    { days: 30, label: '1 Month', apy: 8.5, popular: true },
    { days: 90, label: '3 Months', apy: 12.8, popular: false },
    { days: 180, label: '6 Months', apy: 18.5, popular: false },
    { days: 365, label: '1 Year', apy: 25.0, popular: false }
  ];

  const calculateRewards = () => {
    const selectedOption = stakingOptions.find(opt => opt.days === stakingDuration);
    if (!selectedOption || !asset) return { daily: 0, total: 0, apy: 0 };

    const baseValue = asset.type === 'nft' ? 100 : parseFloat(asset.balance || 0) * 0.1;
    const dailyReward = (baseValue * selectedOption.apy / 100) / 365;
    const totalReward = dailyReward * stakingDuration;

    return {
      daily: dailyReward,
      total: totalReward,
      apy: selectedOption.apy
    };
  };

  const rewards = calculateRewards();

  const handleStake = () => {
    if (!termsAccepted) return;
    
    const stakingData = {
      asset,
      duration: stakingDuration,
      amount: asset.type === 'token' ? customAmount || asset.balance : 1,
      expectedRewards: rewards
    };
    
    onStake(stakingData);
  };

  const isFormValid = () => {
    if (!termsAccepted) return false;
    if (asset?.type === 'token' && customAmount) {
      const amount = parseFloat(customAmount);
      return amount > 0 && amount <= parseFloat(asset.balance || 0);
    }
    return true;
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Stake Asset</h2>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="Shield" size={16} className="text-accent" />
          <span>Gasless Transaction</span>
        </div>
      </div>

      {/* Amount Selection (for tokens) */}
      {asset?.type === 'token' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text-primary">
            Staking Amount
          </label>
          <div className="relative">
            <Input
              type="number"
              placeholder={`Max: ${asset.balance || 0}`}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="pr-20"
              min="0"
              max={asset.balance}
              step="0.0001"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <span className="text-sm text-text-muted">{asset.symbol}</span>
              <button
                onClick={() => setCustomAmount(asset.balance)}
                className="text-xs text-primary hover:text-primary-400 transition-smooth"
              >
                MAX
              </button>
            </div>
          </div>
          <p className="text-xs text-text-muted">
            Available: {parseFloat(asset.balance || 0).toLocaleString()} {asset.symbol}
          </p>
        </div>
      )}

      {/* Duration Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-text-primary">
          Staking Duration
        </label>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {stakingOptions.map((option) => (
            <button
              key={option.days}
              onClick={() => setStakingDuration(option.days)}
              className={`relative p-3 rounded-lg border transition-smooth ${
                stakingDuration === option.days
                  ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-border-light text-text-secondary hover:text-text-primary'
              }`}
            >
              {option.popular && (
                <div className="absolute -top-2 -right-2 bg-accent text-white text-xs px-2 py-1 rounded-full">
                  Popular
                </div>
              )}
              <div className="text-center">
                <p className="font-medium">{option.label}</p>
                <p className="text-xs opacity-80">{option.apy}% APY</p>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Duration */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-sm text-text-secondary hover:text-text-primary transition-smooth"
        >
          <Icon name={showAdvanced ? "ChevronUp" : "ChevronDown"} size={16} />
          <span>Custom Duration</span>
        </button>

        {showAdvanced && (
          <div className="bg-surface-700 rounded-lg p-4 space-y-3">
            <label className="block text-sm font-medium text-text-primary">
              Custom Days (7-365)
            </label>
            <Input
              type="number"
              value={stakingDuration}
              onChange={(e) => setStakingDuration(Math.max(7, Math.min(365, parseInt(e.target.value) || 7)))}
              min="7"
              max="365"
              className="w-full"
            />
            <p className="text-xs text-text-muted">
              Estimated APY: {((stakingDuration / 365) * 25).toFixed(1)}%
            </p>
          </div>
        )}
      </div>

      {/* Reward Preview */}
      <div className="bg-surface-700 border border-border rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-text-primary flex items-center space-x-2">
          <Icon name="Calculator" size={16} className="text-accent" />
          <span>Reward Calculation</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-text-muted">Daily Rewards</p>
            <p className="font-mono text-sm text-accent">
              {rewards.daily.toFixed(4)} MATIC
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Total Rewards</p>
            <p className="font-mono text-sm text-accent">
              {rewards.total.toFixed(4)} MATIC
            </p>
          </div>
        </div>
        
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Est. USDC Value:</span>
            <span className="font-mono text-sm text-text-primary">
              ${(rewards.total * 0.85).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Bonus Rewards Info */}
      <div className="bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Gift" size={20} className="text-secondary mt-0.5" />
          <div>
            <h4 className="font-medium text-text-primary mb-1">Bonus Rewards Available</h4>
            <p className="text-sm text-text-secondary mb-2">
              Stake 2 or more assets to unlock bonus USDC rewards!
            </p>
            <div className="flex items-center space-x-2">
              <Icon name="Plus" size={14} className="text-accent" />
              <span className="text-sm font-medium text-accent">+$25 USDC Bonus</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <Input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1"
          />
          <div className="text-sm text-text-secondary">
            <p>
              I understand that staking locks my assets for the selected duration. 
              I agree to the{' '}
              <button className="text-primary hover:underline">
                staking terms and conditions
              </button>
              {' '}and acknowledge the risks involved.
            </p>
          </div>
        </div>
      </div>

      {/* Stake Button */}
      <Button
        variant="primary"
        onClick={handleStake}
        disabled={!isFormValid() || isLoading}
        loading={isLoading}
        className="w-full"
        iconName="Lock"
        iconPosition="left"
      >
        {isLoading ? 'Processing Stake...' : `Stake ${asset?.type === 'nft' ? 'NFT' : 'Tokens'}`}
      </Button>

      {/* Security Notice */}
      <div className="bg-surface-700 border border-border rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="Shield" size={16} className="text-accent mt-0.5" />
          <div className="text-xs text-text-muted">
            <p className="font-medium text-text-primary mb-1">Secure Staking</p>
            <p>
              Your assets are secured by audited smart contracts. 
              Gasless transactions powered by MetaMask DTK.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingForm;