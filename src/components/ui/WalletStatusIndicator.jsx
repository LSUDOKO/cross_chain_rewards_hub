import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const WalletStatusIndicator = ({ onNetworkSwitch, onDisconnect }) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [currentNetwork, setCurrentNetwork] = useState('Ethereum');
  const [balance, setBalance] = useState('0.00');
  const [isExpanded, setIsExpanded] = useState(false);
  const [networkStatus, setNetworkStatus] = useState('connected');

  const networks = [
    { name: 'Ethereum', chainId: '0x1', color: 'text-primary' },
    { name: 'Polygon', chainId: '0x89', color: 'text-secondary' },
    { name: 'BSC', chainId: '0x38', color: 'text-warning' },
    { name: 'Arbitrum', chainId: '0xa4b1', color: 'text-accent' }
  ];

  useEffect(() => {
    const checkWalletConnection = () => {
      const connected = localStorage.getItem('walletConnected') === 'true';
      if (connected) {
        setIsWalletConnected(true);
        setWalletAddress('0x742d35Cc6634C0532925a3b8D');
        setBalance('1,234.56');
        setCurrentNetwork('Ethereum');
      }
    };

    checkWalletConnection();
  }, []);

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleNetworkChange = (network) => {
    setCurrentNetwork(network.name);
    setNetworkStatus('switching');
    
    setTimeout(() => {
      setNetworkStatus('connected');
      if (onNetworkSwitch) {
        onNetworkSwitch(network);
      }
    }, 1500);
    
    setIsExpanded(false);
  };

  const handleDisconnect = () => {
    setIsWalletConnected(false);
    setWalletAddress('');
    setBalance('0.00');
    localStorage.removeItem('walletConnected');
    if (onDisconnect) {
      onDisconnect();
    }
    setIsExpanded(false);
  };

  const getNetworkColor = (networkName) => {
    const network = networks.find(n => n.name === networkName);
    return network ? network.color : 'text-text-primary';
  };

  if (!isWalletConnected) {
    return null;
  }

  return (
    <div className="relative">
      {/* Desktop View */}
      <div className="hidden md:block">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-3 bg-surface-700 hover:bg-surface-600 rounded-lg px-4 py-2 border border-border transition-smooth"
        >
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              networkStatus === 'connected' ? 'bg-success' : 
              networkStatus === 'switching' ? 'bg-warning animate-pulse' : 'bg-error'
            }`}></div>
            <span className="text-sm font-mono text-text-primary">
              {truncateAddress(walletAddress)}
            </span>
          </div>
          
          <div className="h-4 w-px bg-border"></div>
          
          <div className="flex items-center space-x-1">
            <span className={`text-sm font-medium ${getNetworkColor(currentNetwork)}`}>
              {currentNetwork}
            </span>
            {networkStatus === 'switching' && (
              <Icon name="Loader2" size={14} className="animate-spin text-warning" />
            )}
          </div>
          
          <div className="h-4 w-px bg-border"></div>
          
          <span className="text-sm font-mono text-accent font-medium">
            ${balance}
          </span>
          
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="text-text-secondary" 
          />
        </button>

        {/* Expanded Dropdown */}
        {isExpanded && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-lg shadow-lg z-150 animate-slide-down">
            <div className="p-4 space-y-4">
              {/* Wallet Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Wallet Address</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(walletAddress)}
                    className="flex items-center space-x-1 text-sm text-text-primary hover:text-primary transition-smooth"
                  >
                    <span className="font-mono">{truncateAddress(walletAddress)}</span>
                    <Icon name="Copy" size={14} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Balance</span>
                  <span className="text-sm font-mono text-accent font-medium">
                    ${balance} USD
                  </span>
                </div>
              </div>

              {/* Network Selection */}
              <div className="space-y-2">
                <span className="text-sm text-text-secondary">Switch Network</span>
                <div className="grid grid-cols-2 gap-2">
                  {networks.map((network) => (
                    <button
                      key={network.chainId}
                      onClick={() => handleNetworkChange(network)}
                      className={`flex items-center space-x-2 p-2 rounded-lg border transition-smooth ${
                        currentNetwork === network.name
                          ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-border-light text-text-secondary hover:text-text-primary'
                      }`}
                      disabled={networkStatus === 'switching'}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        currentNetwork === network.name ? 'bg-primary' : 'bg-text-muted'
                      }`}></div>
                      <span className="text-sm font-medium">{network.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setIsExpanded(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDisconnect}
                  className="flex-1"
                  iconName="LogOut"
                  iconPosition="left"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 bg-surface-700 hover:bg-surface-600 rounded-lg px-3 py-2 border border-border transition-smooth"
        >
          <div className={`w-2 h-2 rounded-full ${
            networkStatus === 'connected' ? 'bg-success' : 
            networkStatus === 'switching' ? 'bg-warning animate-pulse' : 'bg-error'
          }`}></div>
          <span className="text-sm font-mono text-text-primary">
            {truncateAddress(walletAddress)}
          </span>
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={14} 
            className="text-text-secondary" 
          />
        </button>

        {/* Mobile Expanded View */}
        {isExpanded && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-surface border border-border rounded-lg shadow-lg z-150 animate-slide-down">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Network</span>
                <span className={`text-sm font-medium ${getNetworkColor(currentNetwork)}`}>
                  {currentNetwork}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Balance</span>
                <span className="text-sm font-mono text-accent">${balance}</span>
              </div>
              
              <div className="flex space-x-2 pt-2 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setIsExpanded(false)}
                  className="flex-1 text-xs"
                >
                  Close
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDisconnect}
                  className="flex-1 text-xs"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletStatusIndicator;