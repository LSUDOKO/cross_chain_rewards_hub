import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [currentNetwork, setCurrentNetwork] = useState('Ethereum');
  const [balance, setBalance] = useState('0.00');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Portfolio',
      path: '/asset-dashboard-portfolio-overview',
      icon: 'LayoutGrid',
      tooltip: 'View and manage your assets'
    },
    {
      label: 'Stake',
      path: '/asset-staking-interface',
      icon: 'Lock',
      tooltip: 'Stake assets for rewards'
    },
    {
      label: 'Rewards',
      path: '/rewards-management-usdc-conversion',
      icon: 'Coins',
      tooltip: 'Claim and convert rewards'
    },
    {
      label: 'Activity',
      path: '/transaction-history-activity-tracking',
      icon: 'Clock',
      tooltip: 'Track transaction history'
    }
  ];

  const languages = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    zh: '中文',
    ja: '日本語'
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    // Simulate wallet connection check
    const checkWalletConnection = () => {
      const connected = localStorage.getItem('walletConnected') === 'true';
      if (connected) {
        setIsWalletConnected(true);
        setWalletAddress('0x742d35Cc6634C0532925a3b8D');
        setBalance('1,234.56');
      }
    };

    checkWalletConnection();
  }, []);

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('selectedLanguage', langCode);
    setIsMobileMenuOpen(false);
  };

  const handleWalletConnect = () => {
    if (!isWalletConnected) {
      navigate('/wallet-connection-network-setup');
    }
  };

  const handleNetworkSwitch = () => {
    // Network switching logic would go here
    console.log('Switching network...');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-100 bg-surface border-b border-border">
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-smooth ${
                  isActivePath(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-700'
                }`}
                title={item.tooltip}
              >
                <Icon name={item.icon} size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Language Selector - Desktop */}
            <div className="hidden md:block relative">
              <select
                value={currentLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-surface-700 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code} className="bg-surface-700">
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Wallet Status */}
            {isWalletConnected ? (
              <div className="hidden sm:flex items-center space-x-3 bg-surface-700 rounded-lg px-4 py-2 border border-border">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm font-mono text-text-primary">
                    {truncateAddress(walletAddress)}
                  </span>
                </div>
                <div className="h-4 w-px bg-border"></div>
                <button
                  onClick={handleNetworkSwitch}
                  className="flex items-center space-x-1 text-sm text-text-secondary hover:text-text-primary transition-smooth"
                >
                  <span>{currentNetwork}</span>
                  <Icon name="ChevronDown" size={14} />
                </button>
                <div className="h-4 w-px bg-border"></div>
                <span className="text-sm font-mono text-accent">
                  ${balance}
                </span>
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={handleWalletConnect}
                className="hidden sm:flex"
                iconName="Wallet"
                iconPosition="left"
              >
                Connect Wallet
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-smooth"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4 space-y-2">
            {/* Mobile Navigation */}
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-smooth ${
                  isActivePath(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-700'
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}

            {/* Mobile Wallet Connection */}
            {!isWalletConnected && (
              <div className="pt-2 border-t border-border">
                <Button
                  variant="primary"
                  onClick={handleWalletConnect}
                  className="w-full"
                  iconName="Wallet"
                  iconPosition="left"
                >
                  Connect Wallet
                </Button>
              </div>
            )}

            {/* Mobile Language Selector */}
            <div className="pt-2 border-t border-border">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Language
              </label>
              <select
                value={currentLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full bg-surface-700 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code} className="bg-surface-700">
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Wallet Status */}
            {isWalletConnected && (
              <div className="pt-2 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Wallet</span>
                  <span className="text-sm font-mono text-text-primary">
                    {truncateAddress(walletAddress)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Network</span>
                  <button
                    onClick={handleNetworkSwitch}
                    className="flex items-center space-x-1 text-sm text-text-primary hover:text-primary transition-smooth"
                  >
                    <span>{currentNetwork}</span>
                    <Icon name="ChevronDown" size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Balance</span>
                  <span className="text-sm font-mono text-accent">
                    ${balance}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;