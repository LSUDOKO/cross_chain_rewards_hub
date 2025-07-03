import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import WalletConnectionCard from './components/WalletConnectionCard';
import NetworkSelectionCard from './components/NetworkSelectionCard';
import WalletBalanceDisplay from './components/WalletBalanceDisplay';
import ConnectionStatusIndicator from './components/ConnectionStatusIndicator';

const WalletConnectionNetworkSetup = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [currentNetwork, setCurrentNetwork] = useState('');
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchError, setSwitchError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    // Check if wallet is already connected
    const checkExistingConnection = () => {
      const connected = localStorage.getItem('walletConnected') === 'true';
      const address = localStorage.getItem('walletAddress');
      const network = localStorage.getItem('currentNetwork');
      
      if (connected && address) {
        setIsConnected(true);
        setWalletAddress(address);
        setCurrentNetwork(network || 'Ethereum Sepolia');
      }
    };

    checkExistingConnection();
  }, []);

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    setConnectionError('');

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate potential connection errors (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('User rejected the connection request');
      }

      // Mock successful connection
      const mockAddress = '0x742d35Cc6634C0532925a3b8D398C4C00E064533';
      const mockNetwork = 'Ethereum Sepolia';

      setIsConnected(true);
      setWalletAddress(mockAddress);
      setCurrentNetwork(mockNetwork);

      // Store connection state
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', mockAddress);
      localStorage.setItem('currentNetwork', mockNetwork);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      setConnectionError(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleWalletDisconnect = () => {
    setIsConnected(false);
    setWalletAddress('');
    setCurrentNetwork('');
    setConnectionError('');
    setSwitchError('');
    
    // Clear stored connection state
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('currentNetwork');
  };

  const handleNetworkSwitch = async (network) => {
    setIsSwitching(true);
    setSwitchError('');

    try {
      // Simulate network switching delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate potential switch errors (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Failed to switch network. Please try again.');
      }

      setCurrentNetwork(network.name);
      localStorage.setItem('currentNetwork', network.name);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      setSwitchError(error.message);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleContinueToDashboard = () => {
    navigate('/asset-dashboard-portfolio-overview');
  };

  const isSetupComplete = isConnected && currentNetwork;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg">
                <Icon name="Zap" size={24} color="white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-text-primary font-inter">
                  Cross-Chain Rewards Hub
                </h1>
              </div>
            </div>

            {/* Setup Complete Indicator */}
            {isSetupComplete && (
              <Button
                variant="primary"
                onClick={handleContinueToDashboard}
                iconName="ArrowRight"
                iconPosition="right"
              >
                Continue to Dashboard
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-4 z-100 bg-success/10 border border-success/20 rounded-lg p-4 shadow-lg backdrop-blur-sm animate-slide-down">
          <div className="flex items-center space-x-3">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <div>
              <h4 className="font-medium text-success">Success!</h4>
              <p className="text-sm text-text-secondary">
                {isConnected && currentNetwork ? 'Setup completed successfully' : 'Operation completed'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 lg:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Wallet Connection & Network Setup
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Connect your MetaMask wallet and configure network settings to start earning rewards through cross-chain staking
            </p>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-6">
            {/* Connection Status */}
            <ConnectionStatusIndicator
              isConnected={isConnected}
              currentNetwork={currentNetwork}
              walletAddress={walletAddress}
            />

            {/* Wallet Connection */}
            <WalletConnectionCard
              onConnect={handleWalletConnect}
              isConnecting={isConnecting}
              connectionError={connectionError}
              isConnected={isConnected}
              walletAddress={walletAddress}
              onDisconnect={handleWalletDisconnect}
            />

            {/* Network Selection */}
            <NetworkSelectionCard
              currentNetwork={currentNetwork}
              onNetworkSwitch={handleNetworkSwitch}
              isSwitching={isSwitching}
              switchError={switchError}
              isWalletConnected={isConnected}
            />

            {/* Wallet Balance */}
            {isConnected && (
              <WalletBalanceDisplay
                walletAddress={walletAddress}
                currentNetwork={currentNetwork}
                isConnected={isConnected}
              />
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column - Main Setup */}
              <div className="col-span-8 space-y-6">
                {/* Wallet Connection */}
                <WalletConnectionCard
                  onConnect={handleWalletConnect}
                  isConnecting={isConnecting}
                  connectionError={connectionError}
                  isConnected={isConnected}
                  walletAddress={walletAddress}
                  onDisconnect={handleWalletDisconnect}
                />

                {/* Network Selection */}
                <NetworkSelectionCard
                  currentNetwork={currentNetwork}
                  onNetworkSwitch={handleNetworkSwitch}
                  isSwitching={isSwitching}
                  switchError={switchError}
                  isWalletConnected={isConnected}
                />

                {/* Wallet Balance */}
                {isConnected && (
                  <WalletBalanceDisplay
                    walletAddress={walletAddress}
                    currentNetwork={currentNetwork}
                    isConnected={isConnected}
                  />
                )}
              </div>

              {/* Right Column - Status & Progress */}
              <div className="col-span-4">
                <div className="sticky top-24">
                  <ConnectionStatusIndicator
                    isConnected={isConnected}
                    currentNetwork={currentNetwork}
                    walletAddress={walletAddress}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Setup Complete Actions */}
          {isSetupComplete && (
            <div className="mt-8 text-center">
              <div className="bg-success/10 border border-success/20 rounded-xl p-6 max-w-2xl mx-auto">
                <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  Setup Complete!
                </h2>
                <p className="text-text-secondary mb-6">
                  Your wallet is connected and network is configured. You're ready to start staking and earning rewards.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="primary"
                    onClick={handleContinueToDashboard}
                    iconName="LayoutGrid"
                    iconPosition="left"
                    className="sm:w-auto"
                  >
                    View Portfolio
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/asset-staking-interface')}
                    iconName="Lock"
                    iconPosition="left"
                    className="sm:w-auto"
                  >
                    Start Staking
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-surface">
        <div className="px-4 lg:px-6 py-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-text-muted text-sm">
              © {new Date().getFullYear()} Cross-Chain Rewards Hub. Testnet environment for development purposes only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WalletConnectionNetworkSetup;