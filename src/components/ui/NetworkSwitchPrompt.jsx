import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NetworkSwitchPrompt = ({ 
  isOpen, 
  onClose, 
  requiredNetwork, 
  currentNetwork, 
  onNetworkSwitch,
  reason = "This action requires switching to a different network"
}) => {
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchError, setSwitchError] = useState('');

  const networks = {
    'ethereum': {
      name: 'Ethereum',
      chainId: '0x1',
      color: 'text-primary',
      icon: 'Zap',
      description: 'Ethereum Mainnet'
    },
    'polygon': {
      name: 'Polygon',
      chainId: '0x89',
      color: 'text-secondary',
      icon: 'Triangle',
      description: 'Polygon Network'
    },
    'bsc': {
      name: 'BSC',
      chainId: '0x38',
      color: 'text-warning',
      icon: 'Circle',
      description: 'Binance Smart Chain'
    },
    'arbitrum': {
      name: 'Arbitrum',
      chainId: '0xa4b1',
      color: 'text-accent',
      icon: 'Square',
      description: 'Arbitrum One'
    }
  };

  const requiredNetworkInfo = networks[requiredNetwork?.toLowerCase()] || networks.ethereum;
  const currentNetworkInfo = networks[currentNetwork?.toLowerCase()] || networks.ethereum;

  useEffect(() => {
    if (!isOpen) {
      setIsSwitching(false);
      setSwitchError('');
    }
  }, [isOpen]);

  const handleNetworkSwitch = async () => {
    setIsSwitching(true);
    setSwitchError('');

    try {
      // Simulate network switching delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate potential error (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('User rejected the request');
      }

      if (onNetworkSwitch) {
        onNetworkSwitch(requiredNetworkInfo);
      }
      
      onClose();
    } catch (error) {
      setSwitchError(error.message || 'Failed to switch network');
    } finally {
      setIsSwitching(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSwitching) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-200 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Mobile Full Screen */}
      <div className="md:hidden w-full h-full bg-surface rounded-none flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Network Switch Required</h2>
          {!isSwitching && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-smooth"
            >
              <Icon name="X" size={20} />
            </button>
          )}
        </div>

        <div className="flex-1 p-4 space-y-6">
          {/* Reason */}
          <div className="bg-surface-700 rounded-lg p-4 border border-border">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-text-primary mb-1">Action Required</h3>
                <p className="text-sm text-text-secondary">{reason}</p>
              </div>
            </div>
          </div>

          {/* Network Comparison */}
          <div className="space-y-4">
            <h3 className="font-medium text-text-primary">Network Switch</h3>
            
            {/* Current Network */}
            <div className="bg-surface-700 rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-3">
                <Icon name={currentNetworkInfo.icon} size={24} className={currentNetworkInfo.color} />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-text-primary">{currentNetworkInfo.name}</span>
                    <span className="text-xs bg-surface-600 text-text-secondary px-2 py-1 rounded">
                      Current
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">{currentNetworkInfo.description}</p>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <Icon name="ArrowDown" size={20} className="text-text-muted" />
            </div>

            {/* Required Network */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Icon name={requiredNetworkInfo.icon} size={24} className="text-primary" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-text-primary">{requiredNetworkInfo.name}</span>
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Required
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">{requiredNetworkInfo.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {switchError && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="AlertCircle" size={20} className="text-error mt-0.5" />
                <div>
                  <h4 className="font-medium text-error mb-1">Switch Failed</h4>
                  <p className="text-sm text-text-secondary">{switchError}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border space-y-3">
          <Button
            variant="primary"
            onClick={handleNetworkSwitch}
            disabled={isSwitching}
            loading={isSwitching}
            className="w-full"
            iconName="RefreshCw"
            iconPosition="left"
          >
            {isSwitching ? 'Switching Network...' : `Switch to ${requiredNetworkInfo.name}`}
          </Button>
          
          {!isSwitching && (
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Modal */}
      <div className="hidden md:block w-full max-w-md bg-surface rounded-xl shadow-xl border border-border animate-slide-up">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">Network Switch Required</h2>
            {!isSwitching && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            )}
          </div>

          {/* Reason */}
          <div className="bg-surface-700 rounded-lg p-4 border border-border">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-text-primary mb-1">Action Required</h3>
                <p className="text-sm text-text-secondary">{reason}</p>
              </div>
            </div>
          </div>

          {/* Network Comparison */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* Current */}
              <div className="flex items-center space-x-2">
                <Icon name={currentNetworkInfo.icon} size={20} className={currentNetworkInfo.color} />
                <span className="text-sm font-medium text-text-primary">{currentNetworkInfo.name}</span>
              </div>
              
              <Icon name="ArrowRight" size={16} className="text-text-muted" />
              
              {/* Required */}
              <div className="flex items-center space-x-2">
                <Icon name={requiredNetworkInfo.icon} size={20} className="text-primary" />
                <span className="text-sm font-medium text-primary">{requiredNetworkInfo.name}</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {switchError && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
                <div>
                  <h4 className="font-medium text-error text-sm mb-1">Switch Failed</h4>
                  <p className="text-xs text-text-secondary">{switchError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            {!isSwitching && (
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            
            <Button
              variant="primary"
              onClick={handleNetworkSwitch}
              disabled={isSwitching}
              loading={isSwitching}
              className="flex-1"
              iconName="RefreshCw"
              iconPosition="left"
            >
              {isSwitching ? 'Switching...' : 'Switch Network'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkSwitchPrompt;