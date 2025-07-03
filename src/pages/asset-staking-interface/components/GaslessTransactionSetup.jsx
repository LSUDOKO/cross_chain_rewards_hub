import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GaslessTransactionSetup = ({ isVisible, onSetupComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [error, setError] = useState('');
  const [dtkBalance, setDtkBalance] = useState(0);

  const setupSteps = [
    {
      id: 'check-dtk',
      title: 'Check DTK Balance',
      description: 'Verifying MetaMask DTK balance for gasless transactions',
      icon: 'Wallet',
      estimatedTime: 2
    },
    {
      id: 'enable-gasless',
      title: 'Enable Gasless Mode',
      description: 'Configuring MetaMask for gasless transactions',
      icon: 'Settings',
      estimatedTime: 3
    },
    {
      id: 'verify-network',
      title: 'Verify Network',
      description: 'Ensuring connection to Polygon Amoy testnet',
      icon: 'Globe',
      estimatedTime: 2
    },
    {
      id: 'setup-complete',
      title: 'Setup Complete',
      description: 'Ready for gasless staking transactions',
      icon: 'CheckCircle',
      estimatedTime: 0
    }
  ];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setIsSetupComplete(false);
      setError('');
      return;
    }

    // Simulate DTK setup process
    const simulateSetup = async () => {
      try {
        // Step 1: Check DTK Balance
        setCurrentStep(0);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate DTK balance check
        const mockBalance = Math.random() * 100 + 50; // 50-150 DTK
        setDtkBalance(mockBalance);

        if (mockBalance < 10) {
          throw new Error('Insufficient DTK balance for gasless transactions. Please top up your MetaMask DTK.');
        }

        // Step 2: Enable Gasless Mode
        setCurrentStep(1);
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Step 3: Verify Network
        setCurrentStep(2);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 4: Complete
        setCurrentStep(3);
        setIsSetupComplete(true);
        
        // Auto-complete after showing success
        setTimeout(() => {
          if (onSetupComplete) {
            onSetupComplete({
              dtkBalance: mockBalance,
              gaslessEnabled: true,
              network: 'Polygon Amoy'
            });
          }
        }, 1500);

      } catch (err) {
        setError(err.message || 'Failed to setup gasless transactions');
      }
    };

    simulateSetup();
  }, [isVisible, onSetupComplete]);

  const handleRetry = () => {
    setCurrentStep(0);
    setError('');
    setIsSetupComplete(false);
  };

  const handleClose = () => {
    onClose();
  };

  const getStepStatus = (stepIndex) => {
    if (error) return stepIndex <= currentStep ? 'error' : 'pending';
    if (isSetupComplete) return 'completed';
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
  };

  const getStepIcon = (step, status) => {
    if (status === 'error') return 'XCircle';
    if (status === 'completed') return 'CheckCircle';
    if (status === 'active') return 'Loader2';
    return step.icon;
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'active': return 'text-primary';
      case 'error': return 'text-error';
      default: return 'text-text-muted';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-200 flex items-center justify-center p-4">
      {/* Mobile Full Screen */}
      <div className="md:hidden w-full h-full bg-surface rounded-none flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">
            Gasless Transaction Setup
          </h2>
          {(isSetupComplete || error) && (
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-smooth"
            >
              <Icon name="X" size={20} />
            </button>
          )}
        </div>

        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* DTK Balance Display */}
          <div className="bg-surface-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-text-primary">MetaMask DTK Balance</h3>
              <Icon name="Fuel" size={20} className="text-accent" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-mono text-accent">
                {dtkBalance.toFixed(2)}
              </span>
              <span className="text-sm text-text-muted">DTK</span>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Sufficient for ~{Math.floor(dtkBalance / 0.5)} gasless transactions
            </p>
          </div>

          {/* Setup Steps */}
          <div className="space-y-4">
            <h3 className="font-medium text-text-primary">Setup Progress</h3>
            {setupSteps.map((step, index) => {
              const status = getStepStatus(index);
              const stepIcon = getStepIcon(step, status);
              const stepColor = getStepColor(status);

              return (
                <div key={step.id} className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    status === 'completed' ? 'border-success bg-success/10' :
                    status === 'active' ? 'border-primary bg-primary/10' :
                    status === 'error'? 'border-error bg-error/10' : 'border-border bg-surface-700'
                  }`}>
                    <Icon 
                      name={stepIcon} 
                      size={20} 
                      className={`${stepColor} ${status === 'active' ? 'animate-spin' : ''}`} 
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      status === 'active' ? 'text-text-primary' : 
                      status === 'completed' ? 'text-success' :
                      status === 'error'? 'text-error' : 'text-text-muted'
                    }`}>
                      {step.title}
                    </h4>
                    <p className="text-sm text-text-secondary mt-1">
                      {step.description}
                    </p>
                    {status === 'active' && step.estimatedTime > 0 && (
                      <p className="text-xs text-text-muted mt-1">
                        ~{step.estimatedTime}s remaining
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-lg p-4">
            <h4 className="font-medium text-text-primary mb-3 flex items-center space-x-2">
              <Icon name="Zap" size={16} className="text-accent" />
              <span>Gasless Benefits</span>
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Icon name="Check" size={14} className="text-success" />
                <span className="text-text-secondary">No gas fees for staking transactions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Check" size={14} className="text-success" />
                <span className="text-text-secondary">Faster transaction processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Check" size={14} className="text-success" />
                <span className="text-text-secondary">Seamless user experience</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Check" size={14} className="text-success" />
                <span className="text-text-secondary">Powered by MetaMask DTK</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="AlertCircle" size={20} className="text-error mt-0.5" />
                <div>
                  <h4 className="font-medium text-error mb-1">Setup Failed</h4>
                  <p className="text-sm text-text-secondary">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {isSetupComplete && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="CheckCircle" size={20} className="text-success mt-0.5" />
                <div>
                  <h4 className="font-medium text-success mb-1">Setup Complete!</h4>
                  <p className="text-sm text-text-secondary">
                    Gasless transactions are now enabled. You can proceed with staking.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border space-y-3">
          {error && (
            <Button
              variant="primary"
              onClick={handleRetry}
              className="w-full"
              iconName="RefreshCw"
              iconPosition="left"
            >
              Retry Setup
            </Button>
          )}
          
          {(isSetupComplete || error) && (
            <Button
              variant="outline"
              onClick={handleClose}
              className="w-full"
            >
              {isSetupComplete ? 'Continue' : 'Close'}
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Modal */}
      <div className="hidden md:block w-full max-w-md bg-surface rounded-xl shadow-xl border border-border animate-slide-up">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">
              Gasless Setup
            </h2>
            {(isSetupComplete || error) && (
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            )}
          </div>

          {/* DTK Balance */}
          <div className="bg-surface-700 rounded-lg p-4 text-center">
            <Icon name="Fuel" size={24} className="text-accent mx-auto mb-2" />
            <p className="text-sm text-text-muted mb-1">DTK Balance</p>
            <p className="text-xl font-mono text-accent">
              {dtkBalance.toFixed(2)} DTK
            </p>
          </div>

          {/* Setup Steps */}
          <div className="space-y-3">
            {setupSteps.map((step, index) => {
              const status = getStepStatus(index);
              const stepIcon = getStepIcon(step, status);
              const stepColor = getStepColor(status);

              return (
                <div key={step.id} className="flex items-center space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    status === 'completed' ? 'border-success bg-success/10' :
                    status === 'active' ? 'border-primary bg-primary/10' :
                    status === 'error'? 'border-error bg-error/10' : 'border-border bg-surface-700'
                  }`}>
                    <Icon 
                      name={stepIcon} 
                      size={16} 
                      className={`${stepColor} ${status === 'active' ? 'animate-spin' : ''}`} 
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-medium text-sm ${
                      status === 'active' ? 'text-text-primary' : 
                      status === 'completed' ? 'text-success' :
                      status === 'error'? 'text-error' : 'text-text-muted'
                    }`}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-text-secondary">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
                <div>
                  <h4 className="font-medium text-error text-sm mb-1">Setup Failed</h4>
                  <p className="text-xs text-text-secondary">{error}</p>
                </div>
              </div>
            </div>
          )}

          {isSetupComplete && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
                <div>
                  <h4 className="font-medium text-success text-sm mb-1">Setup Complete!</h4>
                  <p className="text-xs text-text-secondary">
                    Ready for gasless staking.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            {error && (
              <Button
                variant="primary"
                onClick={handleRetry}
                className="flex-1"
                iconName="RefreshCw"
                iconPosition="left"
              >
                Retry
              </Button>
            )}
            
            {(isSetupComplete || error) && (
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                {isSetupComplete ? 'Continue' : 'Close'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaslessTransactionSetup;