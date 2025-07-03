import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CircleWalletIntegration = ({ 
  isVisible, 
  onClose, 
  usdcAmount, 
  onTransferComplete 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [transferStep, setTransferStep] = useState('auth'); // auth, transfer, complete
  const [walletBalance, setWalletBalance] = useState(1250.75);

  const mockPin = '123456'; // Mock PIN for demonstration

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) {
      // Reset state when modal closes
      setPin('');
      setIsAuthenticated(false);
      setError('');
      setTransferStep('auth');
      setIsLoading(false);
    }
  }, [isVisible]);

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate PIN verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (pin === mockPin) {
        setIsAuthenticated(true);
        setTransferStep('transfer');
      } else {
        setError('Invalid PIN. Please try again. (Hint: Use 123456)');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate USDC transfer
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate potential error (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Transfer failed due to network congestion');
      }

      setTransferStep('complete');
      setWalletBalance(prev => prev + usdcAmount);
      
      if (onTransferComplete) {
        onTransferComplete(usdcAmount);
      }
    } catch (err) {
      setError(err.message || 'Transfer failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-200 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Mobile Full Screen */}
      <div className="md:hidden w-full h-full bg-surface rounded-none flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Circle Wallet</h2>
          {!isLoading && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-smooth"
            >
              <Icon name="X" size={20} />
            </button>
          )}
        </div>

        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* PIN Authentication Step */}
          {transferStep === 'auth' && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Shield" size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Secure Authentication
                </h3>
                <p className="text-text-secondary">
                  Enter your Circle Wallet PIN to authorize the USDC transfer
                </p>
              </div>

              <div className="bg-surface-700 rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-secondary">Transfer Amount</span>
                  <div className="flex items-center space-x-1">
                    <Icon name="DollarSign" size={16} className="text-accent" />
                    <span className="font-mono font-medium text-accent">
                      ${formatNumber(usdcAmount)} USDC
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Current Balance</span>
                  <span className="font-mono text-text-primary">
                    ${formatNumber(walletBalance)} USDC
                  </span>
                </div>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Enter PIN
                  </label>
                  <Input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="6-digit PIN"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
                      <p className="text-sm text-error">{error}</p>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  disabled={pin.length !== 6 || isLoading}
                  loading={isLoading}
                  className="w-full"
                  iconName="Unlock"
                  iconPosition="left"
                >
                  Authenticate
                </Button>
              </form>
            </>
          )}

          {/* Transfer Confirmation Step */}
          {transferStep === 'transfer' && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="ArrowRightLeft" size={32} className="text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Confirm Transfer
                </h3>
                <p className="text-text-secondary">
                  Review the transfer details before proceeding
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-surface-700 rounded-lg p-4 border border-border">
                  <h4 className="font-medium text-text-primary mb-3">Transfer Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Amount:</span>
                      <span className="text-accent font-mono">${formatNumber(usdcAmount)} USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">From:</span>
                      <span className="text-text-primary">Circle Wallet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">To:</span>
                      <span className="text-text-primary">MetaMask (Sepolia)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Network Fee:</span>
                      <span className="text-text-primary">$0.15</span>
                    </div>
                  </div>
                </div>

                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                    <p className="text-sm text-text-secondary">
                      This transfer cannot be reversed. Please verify all details are correct.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
                    <p className="text-sm text-error">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setTransferStep('auth')}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  variant="success"
                  onClick={handleTransfer}
                  disabled={isLoading}
                  loading={isLoading}
                  className="flex-1"
                  iconName="Send"
                  iconPosition="left"
                >
                  Confirm Transfer
                </Button>
              </div>
            </>
          )}

          {/* Transfer Complete Step */}
          {transferStep === 'complete' && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle" size={32} className="text-success" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Transfer Complete!
                </h3>
                <p className="text-text-secondary">
                  Your USDC has been successfully transferred to MetaMask
                </p>
              </div>

              <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success font-mono mb-2">
                    +${formatNumber(usdcAmount)} USDC
                  </div>
                  <p className="text-sm text-text-secondary">
                    Added to your MetaMask wallet on Sepolia network
                  </p>
                </div>
              </div>

              <div className="bg-surface-700 rounded-lg p-4 border border-border">
                <h4 className="font-medium text-text-primary mb-2">Transaction Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Transaction Hash:</span>
                    <span className="text-primary font-mono">0x742d...8D5A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Network:</span>
                    <span className="text-text-primary">Sepolia Testnet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Status:</span>
                    <span className="text-success">Confirmed</span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={onClose}
                className="w-full"
                iconName="Check"
                iconPosition="left"
              >
                Done
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Desktop Modal */}
      <div className="hidden md:block w-full max-w-md bg-surface rounded-xl shadow-xl border border-border animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">Circle Wallet</h2>
            {!isLoading && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            )}
          </div>

          {/* Same content as mobile but with adjusted spacing */}
          <div className="space-y-6">
            {transferStep === 'auth' && (
              <>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="Shield" size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Secure Authentication
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Enter your Circle Wallet PIN to authorize the USDC transfer
                  </p>
                </div>

                <div className="bg-surface-700 rounded-lg p-3 border border-border text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-text-secondary">Transfer Amount</span>
                    <span className="text-accent font-mono">${formatNumber(usdcAmount)} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Current Balance</span>
                    <span className="text-text-primary font-mono">${formatNumber(walletBalance)} USDC</span>
                  </div>
                </div>

                <form onSubmit={handlePinSubmit} className="space-y-4">
                  <Input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 6-digit PIN"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                    disabled={isLoading}
                  />

                  {error && (
                    <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <Icon name="AlertCircle" size={14} className="text-error mt-0.5" />
                        <p className="text-xs text-error">{error}</p>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={pin.length !== 6 || isLoading}
                    loading={isLoading}
                    className="w-full"
                  >
                    Authenticate
                  </Button>
                </form>
              </>
            )}

            {transferStep === 'transfer' && (
              <>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="ArrowRightLeft" size={24} className="text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Confirm Transfer
                  </h3>
                </div>

                <div className="bg-surface-700 rounded-lg p-3 border border-border">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Amount:</span>
                      <span className="text-accent font-mono">${formatNumber(usdcAmount)} USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">To:</span>
                      <span className="text-text-primary">MetaMask (Sepolia)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Fee:</span>
                      <span className="text-text-primary">$0.15</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                    <p className="text-xs text-error">{error}</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setTransferStep('auth')}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleTransfer}
                    disabled={isLoading}
                    loading={isLoading}
                    className="flex-1"
                  >
                    Confirm
                  </Button>
                </div>
              </>
            )}

            {transferStep === 'complete' && (
              <>
                <div className="text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="CheckCircle" size={24} className="text-success" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Transfer Complete!
                  </h3>
                  <div className="text-xl font-bold text-success font-mono">
                    +${formatNumber(usdcAmount)} USDC
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={onClose}
                  className="w-full"
                >
                  Done
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircleWalletIntegration;