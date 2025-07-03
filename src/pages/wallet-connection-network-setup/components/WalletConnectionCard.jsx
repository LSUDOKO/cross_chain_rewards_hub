import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WalletConnectionCard = ({ 
  onConnect, 
  isConnecting, 
  connectionError, 
  isConnected, 
  walletAddress, 
  onDisconnect 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 md:p-8 shadow-lg">
      {/* MetaMask Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
          <Icon name="Wallet" size={32} color="white" />
        </div>
      </div>

      {/* Connection Status */}
      <div className="text-center mb-6">
        {isConnected ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <h2 className="text-xl md:text-2xl font-bold text-text-primary">
                Wallet Connected
              </h2>
            </div>
            <p className="text-text-secondary">
              Successfully connected to MetaMask
            </p>
            <div className="bg-surface-700 rounded-lg p-3 mt-4">
              <p className="text-sm text-text-muted mb-1">Connected Address</p>
              <p className="font-mono text-text-primary font-medium">
                {truncateAddress(walletAddress)}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-text-primary">
              Connect Your Wallet
            </h2>
            <p className="text-text-secondary">
              Connect MetaMask to start staking and earning rewards
            </p>
          </div>
        )}
      </div>

      {/* Connection Error */}
      {connectionError && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} className="text-error mt-0.5" />
            <div>
              <h4 className="font-medium text-error mb-1">Connection Failed</h4>
              <p className="text-sm text-text-secondary">{connectionError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {!isConnected ? (
          <Button
            variant="primary"
            onClick={onConnect}
            disabled={isConnecting}
            loading={isConnecting}
            className="w-full"
            iconName="Wallet"
            iconPosition="left"
          >
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </Button>
        ) : (
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onDisconnect}
              className="flex-1"
              iconName="LogOut"
              iconPosition="left"
            >
              Disconnect
            </Button>
            <Button
              variant="primary"
              onClick={() => window.location.href = '/asset-dashboard-portfolio-overview'}
              className="flex-1"
              iconName="ArrowRight"
              iconPosition="right"
            >
              Continue
            </Button>
          </div>
        )}
      </div>

      {/* MetaMask Installation Help */}
      {connectionError && connectionError.includes('MetaMask') && (
        <div className="mt-6 p-4 bg-surface-700 rounded-lg border border-border">
          <h4 className="font-medium text-text-primary mb-2">Need MetaMask?</h4>
          <p className="text-sm text-text-secondary mb-3">
            MetaMask is required to connect your wallet and interact with the blockchain.
          </p>
          <Button
            variant="outline"
            onClick={() => window.open('https://metamask.io/download/', '_blank')}
            className="w-full"
            iconName="ExternalLink"
            iconPosition="right"
          >
            Install MetaMask
          </Button>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-warning mt-0.5" />
          <div>
            <h4 className="font-medium text-warning mb-1">Testnet Only</h4>
            <p className="text-sm text-text-secondary">
              This application operates on testnets only. No real funds are at risk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectionCard;