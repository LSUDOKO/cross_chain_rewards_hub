import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TransactionCard = ({ transaction, onExpand }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    success: {
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      icon: 'CheckCircle'
    },
    pending: {
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      icon: 'Clock'
    },
    failed: {
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20',
      icon: 'XCircle'
    },
    confirming: {
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      icon: 'Loader2'
    }
  };

  const typeConfig = {
    stake: {
      icon: 'Lock',
      color: 'text-primary',
      label: 'Stake'
    },
    unstake: {
      icon: 'Unlock',
      color: 'text-secondary',
      label: 'Unstake'
    },
    claim: {
      icon: 'Download',
      color: 'text-accent',
      label: 'Claim'
    },
    convert: {
      icon: 'RefreshCw',
      color: 'text-warning',
      label: 'Convert'
    },
    transfer: {
      icon: 'Send',
      color: 'text-text-secondary',
      label: 'Transfer'
    }
  };

  const networkConfig = {
    ethereum: {
      name: 'Ethereum',
      color: 'text-primary',
      icon: 'Zap'
    },
    polygon: {
      name: 'Polygon',
      color: 'text-secondary',
      icon: 'Triangle'
    },
    bsc: {
      name: 'BSC',
      color: 'text-warning',
      icon: 'Circle'
    }
  };

  const config = statusConfig[transaction.status] || statusConfig.pending;
  const typeInfo = typeConfig[transaction.type] || typeConfig.transfer;
  const networkInfo = networkConfig[transaction.network?.toLowerCase()] || networkConfig.ethereum;

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (onExpand) {
      onExpand(transaction.id, !isExpanded);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount, symbol) => {
    if (!amount) return '';
    return `${parseFloat(amount).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 6 
    })} ${symbol}`;
  };

  const truncateHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden transition-all duration-200 hover:border-border-light">
      {/* Main Card Content */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Transaction Type Icon */}
            <div className={`p-2 rounded-lg bg-surface-700 border border-border`}>
              <Icon name={typeInfo.icon} size={20} className={typeInfo.color} />
            </div>

            {/* Transaction Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium text-text-primary">{typeInfo.label}</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color} ${config.borderColor} border`}>
                  <Icon 
                    name={config.icon} 
                    size={12} 
                    className={`mr-1 ${transaction.status === 'confirming' ? 'animate-spin' : ''}`} 
                  />
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>

              <div className="flex items-center space-x-4 text-sm text-text-secondary mb-2">
                <div className="flex items-center space-x-1">
                  <Icon name={networkInfo.icon} size={14} className={networkInfo.color} />
                  <span>{networkInfo.name}</span>
                </div>
                <span>{formatDate(transaction.timestamp)}</span>
              </div>

              {/* Asset Information */}
              {transaction.asset && (
                <div className="flex items-center space-x-2 mb-2">
                  {transaction.asset.image && (
                    <Image
                      src={transaction.asset.image}
                      alt={transaction.asset.name}
                      className="w-6 h-6 rounded object-cover"
                    />
                  )}
                  <span className="text-sm font-medium text-text-primary">
                    {transaction.asset.name}
                  </span>
                  {transaction.asset.tokenId && (
                    <span className="text-xs text-text-muted">
                      #{transaction.asset.tokenId}
                    </span>
                  )}
                </div>
              )}

              {/* Amount */}
              {transaction.amount && (
                <div className="text-sm font-mono text-accent">
                  {formatAmount(transaction.amount, transaction.symbol)}
                </div>
              )}
            </div>
          </div>

          {/* Expand Button */}
          <button
            onClick={handleToggleExpand}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-700 transition-smooth"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border bg-surface-700/50 p-4 space-y-3">
          {/* Transaction Hash */}
          {transaction.hash && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Transaction Hash</span>
              <button
                onClick={() => navigator.clipboard.writeText(transaction.hash)}
                className="flex items-center space-x-1 text-sm font-mono text-text-primary hover:text-primary transition-smooth"
              >
                <span>{truncateHash(transaction.hash)}</span>
                <Icon name="Copy" size={14} />
              </button>
            </div>
          )}

          {/* Gas Fee */}
          {transaction.gasFee && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Gas Fee</span>
              <span className="text-sm font-mono text-text-primary">
                {formatAmount(transaction.gasFee, transaction.gasSymbol || 'ETH')}
              </span>
            </div>
          )}

          {/* Block Number */}
          {transaction.blockNumber && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Block Number</span>
              <span className="text-sm font-mono text-text-primary">
                {transaction.blockNumber.toLocaleString()}
              </span>
            </div>
          )}

          {/* Confirmations */}
          {transaction.confirmations && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Confirmations</span>
              <span className="text-sm font-mono text-text-primary">
                {transaction.confirmations}/12
              </span>
            </div>
          )}

          {/* Reward Information */}
          {transaction.rewardAmount && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Reward Earned</span>
              <span className="text-sm font-mono text-accent">
                +{formatAmount(transaction.rewardAmount, transaction.rewardSymbol)}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            {transaction.hash && (
              <button
                onClick={() => window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank')}
                className="flex items-center space-x-1 px-3 py-1.5 bg-surface border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-border-light transition-smooth"
              >
                <Icon name="ExternalLink" size={14} />
                <span>View on Explorer</span>
              </button>
            )}
            
            {transaction.status === 'failed' && (
              <button
                onClick={() => console.log('Retry transaction:', transaction.id)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary hover:bg-primary/20 transition-smooth"
              >
                <Icon name="RefreshCw" size={14} />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;