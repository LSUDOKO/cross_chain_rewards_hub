import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionProgress = ({ 
  isVisible, 
  onClose, 
  stakingData, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [transactionHash, setTransactionHash] = useState('');
  const [error, setError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const steps = [
    {
      id: 'prepare',
      title: 'Preparing Transaction',
      description: 'Setting up gasless transaction parameters',
      icon: 'Settings',
      estimatedTime: 3
    },
    {
      id: 'sign',
      title: 'Awaiting Signature',
      description: 'Please sign the transaction in MetaMask',
      icon: 'PenTool',
      estimatedTime: 0
    },
    {
      id: 'submit',
      title: 'Submitting to Blockchain',
      description: 'Broadcasting transaction to Polygon network',
      icon: 'Send',
      estimatedTime: 5
    },
    {
      id: 'confirm',
      title: 'Confirming Transaction',
      description: 'Waiting for blockchain confirmation',
      icon: 'CheckCircle',
      estimatedTime: 30
    }
  ];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setTransactionHash('');
      setError('');
      setIsCompleted(false);
      return;
    }

    // Simulate transaction progress
    const simulateProgress = async () => {
      try {
        // Step 1: Prepare
        setCurrentStep(0);
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Step 2: Sign
        setCurrentStep(1);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate potential signing rejection (10% chance)
        if (Math.random() < 0.1) {
          throw new Error('User rejected the transaction signature');
        }

        // Step 3: Submit
        setCurrentStep(2);
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Generate mock transaction hash
        const mockHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
        setTransactionHash(mockHash);

        // Step 4: Confirm
        setCurrentStep(3);
        await new Promise(resolve => setTimeout(resolve, 8000));

        // Complete
        setIsCompleted(true);
        if (onComplete) {
          onComplete({
            ...stakingData,
            transactionHash: mockHash,
            timestamp: new Date().toISOString()
          });
        }

      } catch (err) {
        setError(err.message || 'Transaction failed');
      }
    };

    simulateProgress();
  }, [isVisible, stakingData, onComplete]);

  const handleRetry = () => {
    setCurrentStep(0);
    setError('');
    setTransactionHash('');
    setIsCompleted(false);
  };

  const handleClose = () => {
    onClose();
  };

  const getStepStatus = (stepIndex) => {
    if (error) return stepIndex <= currentStep ? 'error' : 'pending';
    if (isCompleted) return 'completed';
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
            {isCompleted ? 'Staking Complete!' : 'Processing Stake'}
          </h2>
          {(isCompleted || error) && (
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-smooth"
            >
              <Icon name="X" size={20} />
            </button>
          )}
        </div>

        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Asset Summary */}
          <div className="bg-surface-700 rounded-lg p-4">
            <h3 className="font-medium text-text-primary mb-3">Staking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Asset:</span>
                <span className="text-text-primary">{stakingData?.asset?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Duration:</span>
                <span className="text-text-primary">{stakingData?.duration} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Expected Rewards:</span>
                <span className="text-accent">{stakingData?.expectedRewards?.total?.toFixed(4)} MATIC</span>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
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

          {/* Transaction Hash */}
          {transactionHash && (
            <div className="bg-surface-700 rounded-lg p-4">
              <h4 className="font-medium text-text-primary mb-2">Transaction Hash</h4>
              <button
                onClick={() => navigator.clipboard.writeText(transactionHash)}
                className="flex items-center space-x-2 text-sm text-text-secondary hover:text-text-primary transition-smooth"
              >
                <span className="font-mono break-all">{transactionHash}</span>
                <Icon name="Copy" size={16} />
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="AlertCircle" size={20} className="text-error mt-0.5" />
                <div>
                  <h4 className="font-medium text-error mb-1">Transaction Failed</h4>
                  <p className="text-sm text-text-secondary">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {isCompleted && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="CheckCircle" size={20} className="text-success mt-0.5" />
                <div>
                  <h4 className="font-medium text-success mb-1">Staking Successful!</h4>
                  <p className="text-sm text-text-secondary">
                    Your asset has been successfully staked. You can track your rewards in the dashboard.
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
              Retry Transaction
            </Button>
          )}
          
          {(isCompleted || error) && (
            <Button
              variant="outline"
              onClick={handleClose}
              className="w-full"
            >
              {isCompleted ? 'View Dashboard' : 'Close'}
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Modal */}
      <div className="hidden md:block w-full max-w-lg bg-surface rounded-xl shadow-xl border border-border animate-slide-up">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">
              {isCompleted ? 'Staking Complete!' : 'Processing Stake'}
            </h2>
            {(isCompleted || error) && (
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            )}
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              const stepIcon = getStepIcon(step, status);
              const stepColor = getStepColor(status);

              return (
                <div key={step.id} className="flex items-center space-x-4">
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
                  
                  {status === 'active' && step.estimatedTime > 0 && (
                    <span className="text-xs text-text-muted">
                      ~{step.estimatedTime}s
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Transaction Hash */}
          {transactionHash && (
            <div className="bg-surface-700 rounded-lg p-3">
              <h4 className="font-medium text-text-primary text-sm mb-2">Transaction Hash</h4>
              <button
                onClick={() => navigator.clipboard.writeText(transactionHash)}
                className="flex items-center space-x-2 text-xs text-text-secondary hover:text-text-primary transition-smooth w-full"
              >
                <span className="font-mono truncate">{transactionHash}</span>
                <Icon name="Copy" size={14} />
              </button>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
                <div>
                  <h4 className="font-medium text-error text-sm mb-1">Transaction Failed</h4>
                  <p className="text-xs text-text-secondary">{error}</p>
                </div>
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
                <div>
                  <h4 className="font-medium text-success text-sm mb-1">Staking Successful!</h4>
                  <p className="text-xs text-text-secondary">
                    Your asset has been successfully staked.
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
            
            {(isCompleted || error) && (
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                {isCompleted ? 'View Dashboard' : 'Close'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionProgress;