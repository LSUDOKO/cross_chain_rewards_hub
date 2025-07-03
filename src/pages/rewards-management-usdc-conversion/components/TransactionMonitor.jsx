import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionMonitor = ({ 
  transactions = [], 
  onViewDetails, 
  onRetry 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [expandedTx, setExpandedTx] = useState(null);

  const statusConfig = {
    pending: {
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      label: 'Pending',
      description: 'Transaction submitted to network'
    },
    confirming: {
      icon: 'Loader2',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      label: 'Confirming',
      description: 'Waiting for network confirmations',
      animate: 'animate-spin'
    },
    confirmed: {
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      label: 'Confirmed',
      description: 'Transaction completed successfully'
    },
    failed: {
      icon: 'XCircle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20',
      label: 'Failed',
      description: 'Transaction failed or was rejected'
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const formatTimeRemaining = (estimatedTime) => {
    if (!estimatedTime) return '';
    const minutes = Math.ceil(estimatedTime / 60);
    return `~${minutes}m remaining`;
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  const getNetworkIcon = (network) => {
    const networkIcons = {
      'ethereum': 'Zap',
      'polygon': 'Triangle',
      'sepolia': 'Zap',
      'amoy': 'Triangle'
    };
    return networkIcons[network?.toLowerCase()] || 'Zap';
  };

  const getNetworkColor = (network) => {
    const networkColors = {
      'ethereum': 'text-primary',
      'polygon': 'text-secondary',
      'sepolia': 'text-primary',
      'amoy': 'text-secondary'
    };
    return networkColors[network?.toLowerCase()] || 'text-primary';
  };

  const toggleExpanded = (txId) => {
    setExpandedTx(expandedTx === txId ? null : txId);
  };

  const handleCopyHash = (hash) => {
    navigator.clipboard.writeText(hash);
  };

  const handleViewOnExplorer = (tx) => {
    // Mock explorer URL
    const explorerUrl = `https://etherscan.io/tx/${tx.hash}`;
    window.open(explorerUrl, '_blank');
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-8 text-center">
        <Icon name="Activity" size={48} className="text-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">No Active Transactions</h3>
        <p className="text-text-secondary">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Transaction Monitor</h3>
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={20} className="text-accent" />
            <span className="text-sm text-text-secondary">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {transactions.map((tx) => {
          const config = statusConfig[tx.status] || statusConfig.pending;
          const isExpanded = expandedTx === tx.id;

          return (
            <div key={tx.id} className="p-4 md:p-6">
              <div className="flex items-start space-x-4">
                {/* Status Icon */}
                <div className={`p-2 rounded-lg ${config.bgColor} ${config.borderColor} border flex-shrink-0`}>
                  <Icon 
                    name={config.icon} 
                    size={20} 
                    className={`${config.color} ${config.animate || ''}`} 
                  />
                </div>

                {/* Transaction Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-text-primary">
                        {tx.type || 'Transaction'}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-sm font-medium ${config.color}`}>
                          {config.label}
                        </span>
                        {tx.network && (
                          <>
                            <span className="text-text-muted">•</span>
                            <div className="flex items-center space-x-1">
                              <Icon 
                                name={getNetworkIcon(tx.network)} 
                                size={14} 
                                className={getNetworkColor(tx.network)} 
                              />
                              <span className="text-sm text-text-secondary capitalize">
                                {tx.network}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpanded(tx.id)}
                      className="p-1 rounded text-text-muted hover:text-text-primary transition-smooth"
                    >
                      <Icon 
                        name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                        size={16} 
                      />
                    </button>
                  </div>

                  {/* Transaction Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    {tx.amount && (
                      <div>
                        <span className="text-xs text-text-muted">Amount</span>
                        <div className="font-mono text-text-primary">
                          {tx.amount} {tx.symbol || 'MATIC'}
                        </div>
                      </div>
                    )}
                    
                    {tx.hash && (
                      <div>
                        <span className="text-xs text-text-muted">Transaction Hash</span>
                        <button
                          onClick={() => handleCopyHash(tx.hash)}
                          className="font-mono text-text-primary hover:text-primary transition-smooth text-sm"
                        >
                          {truncateHash(tx.hash)}
                        </button>
                      </div>
                    )}
                    
                    {tx.timestamp && (
                      <div>
                        <span className="text-xs text-text-muted">Time</span>
                        <div className="text-text-primary text-sm">
                          {formatTimestamp(tx.timestamp)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar for Confirming Transactions */}
                  {tx.status === 'confirming' && tx.confirmations && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                        <span>Confirmations</span>
                        <span>{tx.confirmations}/{tx.requiredConfirmations || 12}</span>
                      </div>
                      <div className="w-full bg-surface-700 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min((tx.confirmations / (tx.requiredConfirmations || 12)) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      {tx.estimatedTime && (
                        <p className="text-xs text-text-muted mt-1">
                          {formatTimeRemaining(tx.estimatedTime)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 p-4 bg-surface-700 rounded-lg border border-border space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-text-primary mb-2">Transaction Details</h5>
                          <div className="space-y-2 text-sm">
                            {tx.from && (
                              <div className="flex justify-between">
                                <span className="text-text-muted">From:</span>
                                <span className="text-text-primary font-mono">
                                  {truncateHash(tx.from)}
                                </span>
                              </div>
                            )}
                            {tx.to && (
                              <div className="flex justify-between">
                                <span className="text-text-muted">To:</span>
                                <span className="text-text-primary font-mono">
                                  {truncateHash(tx.to)}
                                </span>
                              </div>
                            )}
                            {tx.gasUsed && (
                              <div className="flex justify-between">
                                <span className="text-text-muted">Gas Used:</span>
                                <span className="text-text-primary">{tx.gasUsed.toLocaleString()}</span>
                              </div>
                            )}
                            {tx.gasFee && (
                              <div className="flex justify-between">
                                <span className="text-text-muted">Gas Fee:</span>
                                <span className="text-text-primary">${tx.gasFee}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-text-primary mb-2">Status Information</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-text-muted">Status:</span>
                              <span className={config.color}>{config.label}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Block:</span>
                              <span className="text-text-primary">
                                {tx.blockNumber || 'Pending'}
                              </span>
                            </div>
                            {tx.error && (
                              <div>
                                <span className="text-text-muted">Error:</span>
                                <p className="text-error text-xs mt-1">{tx.error}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                        {tx.hash && (
                          <Button
                            variant="outline"
                            onClick={() => handleViewOnExplorer(tx)}
                            className="text-xs"
                            iconName="ExternalLink"
                            iconPosition="right"
                          >
                            View on Explorer
                          </Button>
                        )}
                        
                        {tx.status === 'failed' && onRetry && (
                          <Button
                            variant="outline"
                            onClick={() => onRetry(tx)}
                            className="text-xs"
                            iconName="RefreshCw"
                            iconPosition="left"
                          >
                            Retry
                          </Button>
                        )}
                        
                        {onViewDetails && (
                          <Button
                            variant="ghost"
                            onClick={() => onViewDetails(tx)}
                            className="text-xs"
                            iconName="Info"
                            iconPosition="left"
                          >
                            Details
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  {!isExpanded && (
                    <div className="flex items-center space-x-2">
                      {tx.hash && (
                        <Button
                          variant="ghost"
                          onClick={() => handleViewOnExplorer(tx)}
                          className="text-xs py-1"
                          iconName="ExternalLink"
                          iconPosition="right"
                        >
                          Explorer
                        </Button>
                      )}
                      
                      {tx.status === 'failed' && onRetry && (
                        <Button
                          variant="outline"
                          onClick={() => onRetry(tx)}
                          className="text-xs py-1"
                          iconName="RefreshCw"
                          iconPosition="left"
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionMonitor;