import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const TransactionStatusToast = ({ 
  transactions = [], 
  onDismiss, 
  onViewDetails 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const statusConfig = {
    pending: {
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      label: 'Pending'
    },
    confirming: {
      icon: 'Loader2',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      label: 'Confirming',
      animate: 'animate-spin'
    },
    confirmed: {
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      label: 'Confirmed'
    },
    failed: {
      icon: 'XCircle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20',
      label: 'Failed'
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const getActiveTransactions = () => {
    return transactions.filter(tx => 
      tx.status === 'pending' || 
      tx.status === 'confirming' || 
      (tx.status === 'confirmed' && !tx.dismissed) ||
      (tx.status === 'failed' && !tx.dismissed)
    );
  };

  const activeTransactions = getActiveTransactions();
  const primaryTransaction = activeTransactions[0];

  if (!primaryTransaction) return null;

  const config = statusConfig[primaryTransaction.status];
  const hasMultiple = activeTransactions.length > 1;

  const formatTimeRemaining = (estimatedTime) => {
    if (!estimatedTime) return '';
    const minutes = Math.ceil(estimatedTime / 60);
    return `~${minutes}m remaining`;
  };

  const truncateHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const handleDismiss = (txId) => {
    if (onDismiss) {
      onDismiss(txId);
    }
  };

  const handleViewDetails = (tx) => {
    if (onViewDetails) {
      onViewDetails(tx);
    }
  };

  return (
    <>
      {/* Desktop Toast - Top Right */}
      <div className="hidden md:block fixed top-20 right-4 z-300 w-80">
        <div className={`${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg backdrop-blur-sm`}>
          {/* Primary Transaction */}
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <Icon 
                name={config.icon} 
                size={20} 
                className={`${config.color} ${config.animate || ''} mt-0.5`} 
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-text-primary text-sm">
                    {primaryTransaction.type || 'Transaction'}
                  </h4>
                  <span className={`text-xs font-medium ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                
                <p className="text-xs text-text-secondary mb-2">
                  {primaryTransaction.description || 'Processing transaction...'}
                </p>
                
                {primaryTransaction.hash && (
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-text-muted">Hash:</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(primaryTransaction.hash)}
                      className="text-xs font-mono text-text-secondary hover:text-text-primary transition-smooth"
                    >
                      {truncateHash(primaryTransaction.hash)}
                    </button>
                  </div>
                )}
                
                {primaryTransaction.estimatedTime && primaryTransaction.status === 'confirming' && (
                  <p className="text-xs text-text-muted">
                    {formatTimeRemaining(primaryTransaction.estimatedTime)}
                  </p>
                )}
                
                {primaryTransaction.confirmations && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                      <span>Confirmations</span>
                      <span>{primaryTransaction.confirmations}/12</span>
                    </div>
                    <div className="w-full bg-surface-700 rounded-full h-1">
                      <div 
                        className="bg-primary h-1 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((primaryTransaction.confirmations / 12) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-1">
                {primaryTransaction.status === 'confirmed' || primaryTransaction.status === 'failed' ? (
                  <button
                    onClick={() => handleDismiss(primaryTransaction.id)}
                    className="p-1 rounded text-text-muted hover:text-text-primary transition-smooth"
                  >
                    <Icon name="X" size={14} />
                  </button>
                ) : null}
                
                {hasMultiple && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 rounded text-text-muted hover:text-text-primary transition-smooth"
                  >
                    <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} />
                  </button>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2 mt-3">
              <Button
                variant="outline"
                onClick={() => handleViewDetails(primaryTransaction)}
                className="flex-1 text-xs py-1"
                iconName="ExternalLink"
                iconPosition="right"
              >
                View Details
              </Button>
              
              {hasMultiple && (
                <Button
                  variant="ghost"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs py-1"
                >
                  +{activeTransactions.length - 1} more
                </Button>
              )}
            </div>
          </div>
          
          {/* Expanded Additional Transactions */}
          {isExpanded && hasMultiple && (
            <div className="border-t border-border">
              <div className="p-3 space-y-2 max-h-40 overflow-y-auto">
                {activeTransactions.slice(1).map((tx) => {
                  const txConfig = statusConfig[tx.status];
                  return (
                    <div key={tx.id} className="flex items-center space-x-2 p-2 rounded bg-surface-700">
                      <Icon name={txConfig.icon} size={16} className={`${txConfig.color} ${txConfig.animate || ''}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text-primary truncate">
                          {tx.type || 'Transaction'}
                        </p>
                        <p className="text-xs text-text-muted">
                          {truncateHash(tx.hash)}
                        </p>
                      </div>
                      <span className={`text-xs ${txConfig.color}`}>
                        {txConfig.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Toast - Bottom */}
      <div className="md:hidden fixed bottom-20 left-4 right-4 z-300">
        <div className={`${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg backdrop-blur-sm`}>
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <Icon 
                name={config.icon} 
                size={20} 
                className={`${config.color} ${config.animate || ''}`} 
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-text-primary text-sm">
                    {primaryTransaction.type || 'Transaction'}
                  </h4>
                  <span className={`text-xs font-medium ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                
                {primaryTransaction.confirmations && (
                  <div className="mb-2">
                    <div className="w-full bg-surface-700 rounded-full h-1">
                      <div 
                        className="bg-primary h-1 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((primaryTransaction.confirmations / 12) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    {primaryTransaction.hash ? truncateHash(primaryTransaction.hash) : 'Processing...'}
                  </span>
                  
                  {hasMultiple && (
                    <span className="text-xs text-text-muted">
                      +{activeTransactions.length - 1} more
                    </span>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => handleViewDetails(primaryTransaction)}
                className="p-2 rounded text-text-muted hover:text-text-primary transition-smooth"
              >
                <Icon name="ExternalLink" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionStatusToast;