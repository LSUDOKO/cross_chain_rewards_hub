import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const AssetPreviewCard = ({ asset, onBack }) => {
  if (!asset) return null;

  const getNetworkIcon = (network) => {
    const networkIcons = {
      'ethereum': 'Zap',
      'polygon': 'Triangle',
      'bsc': 'Circle',
      'arbitrum': 'Square'
    };
    return networkIcons[network?.toLowerCase()] || 'Globe';
  };

  const getNetworkColor = (network) => {
    const networkColors = {
      'ethereum': 'text-primary',
      'polygon': 'text-secondary',
      'bsc': 'text-warning',
      'arbitrum': 'text-accent'
    };
    return networkColors[network?.toLowerCase()] || 'text-text-primary';
  };

  const formatBalance = (balance) => {
    if (!balance) return '0';
    return parseFloat(balance).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4
    });
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Asset Details</h2>
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-smooth"
        >
          <Icon name="ArrowLeft" size={20} />
          <span className="text-sm">Back to Portfolio</span>
        </button>
      </div>

      {/* Asset Card */}
      <div className="bg-surface-700 border border-border rounded-lg p-4 space-y-4">
        {/* Asset Image and Basic Info */}
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-surface-600 flex-shrink-0">
            {asset.image ? (
              <Image
                src={asset.image}
                alt={asset.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon name={asset.type === 'nft' ? 'Image' : 'Coins'} size={24} className="text-text-muted" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-text-primary text-lg truncate">
                  {asset.name}
                </h3>
                <p className="text-sm text-text-secondary">
                  {asset.collection || asset.symbol}
                </p>
              </div>
              
              <div className="flex items-center space-x-2 bg-surface-600 rounded-lg px-3 py-1">
                <Icon 
                  name={getNetworkIcon(asset.network)} 
                  size={16} 
                  className={getNetworkColor(asset.network)} 
                />
                <span className="text-sm font-medium text-text-primary">
                  {asset.network}
                </span>
              </div>
            </div>

            {/* Asset Type and ID/Balance */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-text-muted">Type:</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    asset.type === 'nft' ?'bg-secondary/20 text-secondary' :'bg-accent/20 text-accent'
                  }`}>
                    {asset.type === 'nft' ? 'NFT' : 'Token'}
                  </span>
                </div>
                
                {asset.type === 'nft' && asset.tokenId && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-text-muted">ID:</span>
                    <span className="text-xs font-mono text-text-primary">
                      #{asset.tokenId}
                    </span>
                  </div>
                )}
              </div>

              {asset.type === 'token' && asset.balance && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-text-muted">Balance:</span>
                  <span className="text-sm font-mono text-text-primary">
                    {formatBalance(asset.balance)} {asset.symbol}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Asset Description */}
        {asset.description && (
          <div className="pt-3 border-t border-border">
            <h4 className="text-sm font-medium text-text-primary mb-2">Description</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              {asset.description}
            </p>
          </div>
        )}

        {/* Asset Attributes/Properties */}
        {asset.attributes && asset.attributes.length > 0 && (
          <div className="pt-3 border-t border-border">
            <h4 className="text-sm font-medium text-text-primary mb-3">Attributes</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {asset.attributes.slice(0, 6).map((attr, index) => (
                <div key={index} className="bg-surface-600 rounded-lg p-2">
                  <p className="text-xs text-text-muted truncate">{attr.trait_type}</p>
                  <p className="text-sm font-medium text-text-primary truncate">{attr.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contract Address */}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Contract Address:</span>
            <button
              onClick={() => navigator.clipboard.writeText(asset.contractAddress)}
              className="flex items-center space-x-1 text-xs text-text-secondary hover:text-text-primary transition-smooth"
            >
              <span className="font-mono">
                {asset.contractAddress ? 
                  `${asset.contractAddress.slice(0, 6)}...${asset.contractAddress.slice(-4)}` : 
                  'N/A'
                }
              </span>
              <Icon name="Copy" size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetPreviewCard;