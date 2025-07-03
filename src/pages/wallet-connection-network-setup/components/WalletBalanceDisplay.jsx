import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const WalletBalanceDisplay = ({ 
  walletAddress, 
  currentNetwork, 
  isConnected 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [balances, setBalances] = useState({
    'ethereum-sepolia': {
      eth: '2.4567',
      usdc: '1,234.56',
      tokens: 3,
      nfts: 7
    },
    'polygon-amoy': {
      matic: '156.789',
      usdc: '890.12',
      tokens: 5,
      nfts: 12
    }
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const getNetworkInfo = (networkId) => {
    const networks = {
      'ethereum-sepolia': {
        name: 'Ethereum Sepolia',
        currency: 'SepoliaETH',
        symbol: 'ETH',
        icon: 'Zap',
        color: 'text-primary'
      },
      'polygon-amoy': {
        name: 'Polygon Amoy',
        currency: 'MATIC',
        symbol: 'MATIC',
        icon: 'Triangle',
        color: 'text-secondary'
      }
    };
    return networks[networkId] || networks['ethereum-sepolia'];
  };

  const getCurrentNetworkBalance = () => {
    const networkKey = currentNetwork?.toLowerCase().replace(' ', '-') || 'ethereum-sepolia';
    return balances[networkKey] || balances['ethereum-sepolia'];
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected || !walletAddress) {
    return null;
  }

  const networkInfo = getNetworkInfo(currentNetwork?.toLowerCase().replace(' ', '-'));
  const currentBalance = getCurrentNetworkBalance();

  return (
    <div className="bg-surface border border-border rounded-xl p-6 md:p-8 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary">
          Wallet Balance
        </h2>
        <div className="flex items-center space-x-2">
          <Icon name={networkInfo.icon} size={20} className={networkInfo.color} />
          <span className="text-sm font-medium text-text-secondary">
            {networkInfo.name}
          </span>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="bg-surface-700 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted mb-1">Wallet Address</p>
            <p className="font-mono text-text-primary font-medium">
              {truncateAddress(walletAddress)}
            </p>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(walletAddress)}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-600 transition-smooth"
            title="Copy address"
          >
            <Icon name="Copy" size={16} />
          </button>
        </div>
      </div>

      {/* Balance Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Native Currency */}
        <div className="bg-surface-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name={networkInfo.icon} size={16} className={networkInfo.color} />
            <span className="text-sm font-medium text-text-secondary">
              {networkInfo.symbol}
            </span>
          </div>
          <p className="text-lg font-bold text-text-primary">
            {currentNetwork?.toLowerCase().includes('ethereum') ? currentBalance.eth : currentBalance.matic}
          </p>
        </div>

        {/* USDC */}
        <div className="bg-surface-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="DollarSign" size={16} className="text-accent" />
            <span className="text-sm font-medium text-text-secondary">USDC</span>
          </div>
          <p className="text-lg font-bold text-text-primary">
            {currentBalance.usdc}
          </p>
        </div>

        {/* Tokens */}
        <div className="bg-surface-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Coins" size={16} className="text-warning" />
            <span className="text-sm font-medium text-text-secondary">Tokens</span>
          </div>
          <p className="text-lg font-bold text-text-primary">
            {currentBalance.tokens}
          </p>
        </div>

        {/* NFTs */}
        <div className="bg-surface-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Image" size={16} className="text-primary" />
            <span className="text-sm font-medium text-text-secondary">NFTs</span>
          </div>
          <p className="text-lg font-bold text-text-primary">
            {currentBalance.nfts}
          </p>
        </div>
      </div>

      {/* All Networks Summary - Desktop Only */}
      <div className="hidden md:block">
        <h3 className="font-semibold text-text-primary mb-4">All Networks</h3>
        <div className="space-y-3">
          {Object.entries(balances).map(([networkId, balance]) => {
            const network = getNetworkInfo(networkId);
            const isCurrentNetwork = currentNetwork?.toLowerCase().replace(' ', '-') === networkId;
            
            return (
              <div
                key={networkId}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isCurrentNetwork
                    ? 'bg-primary/10 border-primary/20' :'bg-surface-700 border-border'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon name={network.icon} size={20} className={network.color} />
                  <div>
                    <p className="font-medium text-text-primary">{network.name}</p>
                    <p className="text-sm text-text-secondary">
                      {network.symbol}: {networkId.includes('ethereum') ? balance.eth : balance.matic}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-text-primary">
                    ${balance.usdc} USDC
                  </p>
                  <p className="text-xs text-text-muted">
                    {balance.tokens} tokens • {balance.nfts} NFTs
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => {
            // Simulate balance refresh
            console.log('Refreshing balances...');
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-smooth"
        >
          <Icon name="RefreshCw" size={16} />
          <span className="text-sm">Refresh Balances</span>
        </button>
      </div>
    </div>
  );
};

export default WalletBalanceDisplay;