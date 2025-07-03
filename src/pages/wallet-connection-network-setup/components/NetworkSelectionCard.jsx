import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NetworkSelectionCard = ({ 
  currentNetwork, 
  onNetworkSwitch, 
  isSwitching, 
  switchError,
  isWalletConnected 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const networks = [
    {
      id: 'ethereum-sepolia',
      name: 'Ethereum Sepolia',
      chainId: '0xaa36a7',
      rpcUrl: 'https://sepolia.infura.io/v3/',
      icon: 'Zap',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      description: 'Ethereum testnet for development',
      currency: 'SepoliaETH',
      explorer: 'https://sepolia.etherscan.io'
    },
    {
      id: 'polygon-amoy',
      name: 'Polygon Amoy',
      chainId: '0x13882',
      rpcUrl: 'https://rpc-amoy.polygon.technology/',
      icon: 'Triangle',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20',
      description: 'Polygon testnet for staking',
      currency: 'MATIC',
      explorer: 'https://amoy.polygonscan.com'
    }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const handleNetworkSwitch = (network) => {
    if (onNetworkSwitch) {
      onNetworkSwitch(network);
    }
  };

  const isCurrentNetwork = (networkId) => {
    return currentNetwork?.toLowerCase() === networkId.toLowerCase();
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 md:p-8 shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
          Select Network
        </h2>
        <p className="text-text-secondary">
          Choose your preferred testnet for cross-chain operations
        </p>
      </div>

      {/* Network Switch Error */}
      {switchError && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} className="text-error mt-0.5" />
            <div>
              <h4 className="font-medium text-error mb-1">Network Switch Failed</h4>
              <p className="text-sm text-text-secondary">{switchError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Network Options */}
      <div className="space-y-4">
        {networks.map((network) => {
          const isActive = isCurrentNetwork(network.id);
          const isDisabled = !isWalletConnected || isSwitching;
          
          return (
            <div
              key={network.id}
              className={`relative border rounded-lg p-4 transition-all duration-200 ${
                isActive
                  ? `${network.bgColor} ${network.borderColor} border-2`
                  : 'border-border hover:border-border-light bg-surface-700'
              } ${isDisabled ? 'opacity-50' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${network.bgColor} ${network.borderColor} border`}>
                    <Icon name={network.icon} size={24} className={network.color} />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-text-primary">
                        {network.name}
                      </h3>
                      {isActive && (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <span className="text-xs text-success font-medium">Connected</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mt-1">
                      {network.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-text-muted">
                        Currency: {network.currency}
                      </span>
                      <span className="text-xs text-text-muted">
                        Chain ID: {network.chainId}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isSwitching && isActive && (
                    <Icon name="Loader2" size={20} className="text-primary animate-spin" />
                  )}
                  
                  {!isActive && isWalletConnected && (
                    <Button
                      variant="outline"
                      onClick={() => handleNetworkSwitch(network)}
                      disabled={isDisabled}
                      className="text-sm"
                    >
                      Switch
                    </Button>
                  )}
                  
                  {isActive && (
                    <Icon name="CheckCircle" size={20} className="text-success" />
                  )}
                </div>
              </div>
              
              {/* Network Details - Desktop Only */}
              <div className="hidden md:block mt-4 pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-muted">RPC URL:</span>
                    <p className="text-text-secondary font-mono text-xs mt-1 truncate">
                      {network.rpcUrl}
                    </p>
                  </div>
                  <div>
                    <span className="text-text-muted">Explorer:</span>
                    <button
                      onClick={() => window.open(network.explorer, '_blank')}
                      className="text-primary hover:text-primary-400 text-xs mt-1 block"
                    >
                      View Explorer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connection Required Notice */}
      {!isWalletConnected && (
        <div className="mt-6 p-4 bg-surface-700 rounded-lg border border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Info" size={20} className="text-primary" />
            <div>
              <h4 className="font-medium text-text-primary">Wallet Required</h4>
              <p className="text-sm text-text-secondary mt-1">
                Connect your MetaMask wallet first to switch networks
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Educational Info */}
      <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="BookOpen" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="font-medium text-accent mb-2">Cross-Chain Functionality</h4>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Ethereum Sepolia: View and manage your NFTs and tokens</li>
              <li>• Polygon Amoy: Stake assets and earn MATIC rewards</li>
              <li>• Automatic network switching when needed</li>
              <li>• Gasless transactions on Polygon using MetaMask DTK</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkSelectionCard;