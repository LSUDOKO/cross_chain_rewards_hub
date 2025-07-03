import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AssetFilterChips = ({ assets, onFilterChange, activeFilters }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const getNetworkCounts = () => {
    const counts = {};
    assets.forEach(asset => {
      counts[asset.network] = (counts[asset.network] || 0) + 1;
    });
    return counts;
  };

  const getAssetTypeCounts = () => {
    const counts = {};
    assets.forEach(asset => {
      counts[asset.type] = (counts[asset.type] || 0) + 1;
    });
    return counts;
  };

  const getStakingStatusCounts = () => {
    const counts = {};
    assets.forEach(asset => {
      const status = asset.stakingStatus || 'unstaked';
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  };

  const networkCounts = getNetworkCounts();
  const typeCounts = getAssetTypeCounts();
  const statusCounts = getStakingStatusCounts();

  const networks = [
    { key: 'ethereum', label: 'Ethereum', color: 'text-primary', icon: 'Zap' },
    { key: 'polygon', label: 'Polygon', color: 'text-secondary', icon: 'Triangle' },
    { key: 'bsc', label: 'BSC', color: 'text-warning', icon: 'Circle' }
  ];

  const assetTypes = [
    { key: 'nft', label: 'NFTs', color: 'text-accent', icon: 'Image' },
    { key: 'token', label: 'Tokens', color: 'text-primary', icon: 'Coins' }
  ];

  const stakingStatuses = [
    { key: 'all', label: 'All Assets', color: 'text-text-primary', icon: 'Grid3X3' },
    { key: 'staked', label: 'Staked', color: 'text-success', icon: 'Lock' },
    { key: 'unstaked', label: 'Available', color: 'text-text-secondary', icon: 'Unlock' },
    { key: 'earning', label: 'Earning', color: 'text-accent', icon: 'TrendingUp' }
  ];

  const handleFilterClick = (filterType, filterValue) => {
    if (onFilterChange) {
      onFilterChange(filterType, filterValue);
    }
  };

  const isActive = (filterType, filterValue) => {
    return activeFilters[filterType] === filterValue;
  };

  const getChipClasses = (isActive, color) => {
    const baseClasses = "inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth cursor-pointer";
    
    if (isActive) {
      return `${baseClasses} bg-primary text-primary-foreground border border-primary`;
    }
    
    return `${baseClasses} bg-surface-700 hover:bg-surface-600 text-text-secondary hover:text-text-primary border border-border hover:border-border-light`;
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Status Filters */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-text-secondary">Filter by Status</h4>
        <div className="flex flex-wrap gap-2">
          {stakingStatuses.map(status => {
            const count = status.key === 'all' ? assets.length : (statusCounts[status.key] || 0);
            return (
              <button
                key={status.key}
                onClick={() => handleFilterClick('status', status.key)}
                className={getChipClasses(isActive('status', status.key), status.color)}
              >
                <Icon name={status.icon} size={16} />
                <span>{status.label}</span>
                <span className="bg-surface-600 text-text-muted px-2 py-0.5 rounded-full text-xs">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Network Filters */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-text-secondary">Filter by Network</h4>
        <div className="flex flex-wrap gap-2">
          {networks.map(network => {
            const count = networkCounts[network.key] || 0;
            if (count === 0) return null;
            
            return (
              <button
                key={network.key}
                onClick={() => handleFilterClick('network', network.key)}
                className={getChipClasses(isActive('network', network.key), network.color)}
              >
                <Icon name={network.icon} size={16} />
                <span>{network.label}</span>
                <span className="bg-surface-600 text-text-muted px-2 py-0.5 rounded-full text-xs">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Asset Type Filters */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-text-secondary">Filter by Type</h4>
        <div className="flex flex-wrap gap-2">
          {assetTypes.map(type => {
            const count = typeCounts[type.key] || 0;
            if (count === 0) return null;
            
            return (
              <button
                key={type.key}
                onClick={() => handleFilterClick('type', type.key)}
                className={getChipClasses(isActive('type', type.key), type.color)}
              >
                <Icon name={type.icon} size={16} />
                <span>{type.label}</span>
                <span className="bg-surface-600 text-text-muted px-2 py-0.5 rounded-full text-xs">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear Filters */}
      {Object.values(activeFilters).some(filter => filter && filter !== 'all') && (
        <div className="flex justify-end">
          <button
            onClick={() => onFilterChange('clear')}
            className="inline-flex items-center space-x-1 text-sm text-text-muted hover:text-text-primary transition-smooth"
          >
            <Icon name="X" size={14} />
            <span>Clear all filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AssetFilterChips;