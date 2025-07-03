import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConversionFlow = ({ 
  isActive, 
  maticAmount, 
  usdcAmount, 
  onStartConversion, 
  onCancel,
  currentStep = 0 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [conversionRate, setConversionRate] = useState(0.85);
  const [fees, setFees] = useState({
    lifiSwapFee: 0.25,
    networkFee: 0.15,
    crossChainFee: 0.35
  });

  const steps = [
    {
      id: 'claim',
      title: 'Claim Rewards',
      description: 'Claim MATIC tokens from staking rewards',
      icon: 'Download',
      status: currentStep > 0 ? 'completed' : currentStep === 0 ? 'active' : 'pending'
    },
    {
      id: 'swap',
      title: 'Initiate Swap',
      description: 'Convert MATIC to USDC using LI.FI',
      icon: 'RefreshCw',
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : 'pending'
    },
    {
      id: 'transfer',
      title: 'Cross-Chain Transfer',
      description: 'Transfer USDC across networks',
      icon: 'ArrowRightLeft',
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'pending'
    },
    {
      id: 'deposit',
      title: 'Deposit to MetaMask',
      description: 'Final USDC deposit to Sepolia network',
      icon: 'Wallet',
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'active' : 'pending'
    }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const formatNumber = (num) => {
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 6 
    });
  };

  const getStepIcon = (step) => {
    if (step.status === 'completed') return 'CheckCircle';
    if (step.status === 'active') return step.icon;
    return step.icon;
  };

  const getStepColor = (step) => {
    if (step.status === 'completed') return 'text-success';
    if (step.status === 'active') return 'text-primary';
    return 'text-text-muted';
  };

  const getStepBgColor = (step) => {
    if (step.status === 'completed') return 'bg-success/10 border-success/20';
    if (step.status === 'active') return 'bg-primary/10 border-primary/20';
    return 'bg-surface-700 border-border';
  };

  const totalFees = Object.values(fees).reduce((sum, fee) => sum + fee, 0);
  const finalUsdcAmount = usdcAmount - totalFees;

  if (!isActive) return null;

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">USDC Conversion Flow</h3>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-700 transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Conversion Summary */}
        <div className="bg-surface-700 rounded-lg p-4 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Icon name="Zap" size={20} className="text-secondary" />
                <span className="text-sm text-text-secondary">Converting</span>
              </div>
              <div className="text-xl font-bold text-text-primary font-mono">
                {formatNumber(maticAmount)} MATIC
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Icon name="ArrowRight" size={24} className="text-text-muted" />
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Icon name="DollarSign" size={20} className="text-accent" />
                <span className="text-sm text-text-secondary">Receiving</span>
              </div>
              <div className="text-xl font-bold text-accent font-mono">
                ${formatNumber(finalUsdcAmount)} USDC
              </div>
            </div>
          </div>

          {/* Rate and Fees */}
          <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Exchange Rate:</span>
              <span className="text-text-primary font-mono">
                1 MATIC = ${conversionRate} USDC
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">LI.FI Swap Fee:</span>
              <span className="text-text-primary font-mono">${fees.lifiSwapFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Network Fee:</span>
              <span className="text-text-primary font-mono">${fees.networkFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Cross-Chain Fee:</span>
              <span className="text-text-primary font-mono">${fees.crossChainFee}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t border-border">
              <span className="text-text-primary">Total Fees:</span>
              <span className="text-error font-mono">${formatNumber(totalFees)}</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          <h4 className="font-medium text-text-primary">Conversion Progress</h4>
          
          {/* Desktop Steps */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStepBgColor(step)}`}>
                      <Icon 
                        name={getStepIcon(step)} 
                        size={20} 
                        className={`${getStepColor(step)} ${step.status === 'active' ? 'animate-pulse' : ''}`} 
                      />
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-medium ${getStepColor(step)}`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-text-muted max-w-24">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      currentStep > index ? 'bg-success' : 'bg-border'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Mobile Steps */}
          <div className="md:hidden space-y-3">
            {steps.map((step) => (
              <div key={step.id} className={`flex items-center space-x-3 p-3 rounded-lg border ${getStepBgColor(step)}`}>
                <Icon 
                  name={getStepIcon(step)} 
                  size={20} 
                  className={`${getStepColor(step)} ${step.status === 'active' ? 'animate-pulse' : ''}`} 
                />
                <div className="flex-1">
                  <div className={`font-medium ${getStepColor(step)}`}>
                    {step.title}
                  </div>
                  <div className="text-sm text-text-muted">
                    {step.description}
                  </div>
                </div>
                {step.status === 'completed' && (
                  <Icon name="Check" size={16} className="text-success" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Estimated Time */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={18} className="text-primary" />
            <span className="font-medium text-text-primary">Estimated Completion Time</span>
          </div>
          <p className="text-sm text-text-secondary">
            The entire conversion process typically takes 5-10 minutes depending on network congestion.
            You'll receive real-time updates for each step.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            onClick={onStartConversion}
            disabled={currentStep > 0}
            className="flex-1"
            iconName="Play"
            iconPosition="left"
          >
            {currentStep === 0 ? 'Start Conversion' : 'Conversion in Progress'}
          </Button>
          
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={currentStep > 0 && currentStep < 4}
            className="flex-1"
          >
            {currentStep === 0 ? 'Cancel' : 'Close'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversionFlow;