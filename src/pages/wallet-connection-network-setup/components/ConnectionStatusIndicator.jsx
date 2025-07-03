import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ConnectionStatusIndicator = ({ 
  isConnected, 
  currentNetwork, 
  walletAddress, 
  connectionStep 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const steps = [
    {
      id: 'wallet',
      label: 'Connect Wallet',
      icon: 'Wallet',
      description: 'Connect your MetaMask wallet'
    },
    {
      id: 'network',
      label: 'Select Network',
      icon: 'Globe',
      description: 'Choose your preferred testnet'
    },
    {
      id: 'ready',
      label: 'Ready to Stake',
      icon: 'CheckCircle',
      description: 'Start earning rewards'
    }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const getCurrentStepIndex = () => {
    if (!isConnected) return 0;
    if (!currentNetwork) return 1;
    return 2;
  };

  const getStepStatus = (stepIndex) => {
    const currentIndex = getCurrentStepIndex();
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-text-primary mb-2">
          Setup Progress
        </h2>
        <p className="text-sm text-text-secondary">
          Complete these steps to start staking
        </p>
      </div>

      {/* Progress Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          
          return (
            <div key={step.id} className="flex items-center space-x-4">
              {/* Step Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                status === 'completed'
                  ? 'bg-success border-success'
                  : status === 'active' ?'bg-primary border-primary' :'bg-surface-700 border-border'
              }`}>
                {status === 'completed' ? (
                  <Icon name="Check" size={20} color="white" />
                ) : (
                  <Icon 
                    name={step.icon} 
                    size={20} 
                    className={status === 'active' ? 'text-white' : 'text-text-muted'} 
                  />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium ${
                    status === 'completed' || status === 'active'
                      ? 'text-text-primary' :'text-text-muted'
                  }`}>
                    {step.label}
                  </h3>
                  
                  {/* Status Badge */}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    status === 'completed'
                      ? 'bg-success/20 text-success'
                      : status === 'active' ?'bg-primary/20 text-primary' :'bg-surface-700 text-text-muted'
                  }`}>
                    {status === 'completed' ? 'Complete' : status === 'active' ? 'Active' : 'Pending'}
                  </span>
                </div>
                
                <p className={`text-sm mt-1 ${
                  status === 'completed' || status === 'active'
                    ? 'text-text-secondary' :'text-text-muted'
                }`}>
                  {step.description}
                </p>

                {/* Step Details */}
                {status === 'completed' && (
                  <div className="mt-2 text-xs text-text-muted">
                    {step.id === 'wallet' && walletAddress && (
                      <span>Connected: {truncateAddress(walletAddress)}</span>
                    )}
                    {step.id === 'network' && currentNetwork && (
                      <span>Network: {currentNetwork}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-9 mt-12 w-0.5 h-6 bg-border"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Status */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Overall Progress</span>
          <span className="text-sm font-medium text-text-primary">
            {getCurrentStepIndex()}/{steps.length} Complete
          </span>
        </div>
        
        <div className="mt-2 w-full bg-surface-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-success h-2 rounded-full transition-all duration-500"
            style={{ width: `${(getCurrentStepIndex() / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Next Step Hint */}
      {getCurrentStepIndex() < steps.length && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="ArrowRight" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              Next: {steps[getCurrentStepIndex()].label}
            </span>
          </div>
        </div>
      )}

      {/* Completion Message */}
      {getCurrentStepIndex() === steps.length && (
        <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">
              Setup Complete! Ready to start staking.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatusIndicator;