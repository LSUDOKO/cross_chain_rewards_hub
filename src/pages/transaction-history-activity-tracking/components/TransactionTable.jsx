import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TransactionTable = ({ transactions, onSort, sortConfig }) => {
  const [selectedTransactions, setSelectedTransactions] = useState([]);

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
    stake: { icon: 'Lock', color: 'text-primary', label: 'Stake' },
    unstake: { icon: 'Unlock', color: 'text-secondary', label: 'Unstake' },
    claim: { icon: 'Download', color: 'text-accent', label: 'Claim' },
    convert: { icon: 'RefreshCw', color: 'text-warning', label: 'Convert' },
    transfer: { icon: 'Send', color: 'text-text-secondary', label: 'Transfer' }
  };

  const networkConfig = {
    ethereum: { name: 'Ethereum', color: 'text-primary', icon: 'Zap' },
    polygon: { name: 'Polygon', color: 'text-secondary', icon: 'Triangle' },
    bsc: { name: 'BSC', color: 'text-warning', icon: 'Circle' }
  };

  const columns = [
    { key: 'type', label: 'Type', sortable: true },
    { key: 'asset', label: 'Asset', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'network', label: 'Network', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'timestamp', label: 'Date', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  const handleSort = (key) => {
    if (onSort) {
      onSort(key);
    }
  };

  const handleSelectTransaction = (transactionId) => {
    setSelectedTransactions(prev => {
      if (prev.includes(transactionId)) {
        return prev.filter(id => id !== transactionId);
      } else {
        return [...prev, transactionId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(transactions.map(tx => tx.id));
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount, symbol) => {
    if (!amount) return '-';
    return `${parseFloat(amount).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 6 
    })} ${symbol}`;
  };

  const truncateHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-muted" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-700 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedTransactions.length === transactions.length && transactions.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary focus:ring-2"
                />
              </th>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left">
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center space-x-1 text-sm font-medium text-text-secondary hover:text-text-primary transition-smooth"
                    >
                      <span>{column.label}</span>
                      {getSortIcon(column.key)}
                    </button>
                  ) : (
                    <span className="text-sm font-medium text-text-secondary">{column.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((transaction) => {
              const statusInfo = statusConfig[transaction.status] || statusConfig.pending;
              const typeInfo = typeConfig[transaction.type] || typeConfig.transfer;
              const networkInfo = networkConfig[transaction.network?.toLowerCase()] || networkConfig.ethereum;
              
              return (
                <tr
                  key={transaction.id}
                  className={`hover:bg-surface-700/50 transition-smooth ${
                    selectedTransactions.includes(transaction.id) ? 'bg-primary/5' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(transaction.id)}
                      onChange={() => handleSelectTransaction(transaction.id)}
                      className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary focus:ring-2"
                    />
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Icon name={typeInfo.icon} size={16} className={typeInfo.color} />
                      <span className="text-sm font-medium text-text-primary">{typeInfo.label}</span>
                    </div>
                  </td>

                  {/* Asset */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {transaction.asset?.image && (
                        <Image
                          src={transaction.asset.image}
                          alt={transaction.asset.name}
                          className="w-6 h-6 rounded object-cover"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-text-primary">
                          {transaction.asset?.name || 'Unknown Asset'}
                        </div>
                        {transaction.asset?.tokenId && (
                          <div className="text-xs text-text-muted">
                            #{transaction.asset.tokenId}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3">
                    <div className="text-sm font-mono text-text-primary">
                      {formatAmount(transaction.amount, transaction.symbol)}
                    </div>
                    {transaction.rewardAmount && (
                      <div className="text-xs font-mono text-accent">
                        +{formatAmount(transaction.rewardAmount, transaction.rewardSymbol)}
                      </div>
                    )}
                  </td>

                  {/* Network */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <Icon name={networkInfo.icon} size={14} className={networkInfo.color} />
                      <span className="text-sm text-text-primary">{networkInfo.name}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor} border`}>
                      <Icon 
                        name={statusInfo.icon} 
                        size={12} 
                        className={`mr-1 ${transaction.status === 'confirming' ? 'animate-spin' : ''}`} 
                      />
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3">
                    <div className="text-sm text-text-primary">
                      {formatDate(transaction.timestamp)}
                    </div>
                    {transaction.hash && (
                      <div className="text-xs font-mono text-text-muted">
                        {truncateHash(transaction.hash)}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      {transaction.hash && (
                        <button
                          onClick={() => window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank')}
                          className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-600 transition-smooth"
                          title="View on Explorer"
                        >
                          <Icon name="ExternalLink" size={14} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => navigator.clipboard.writeText(transaction.hash || transaction.id)}
                        className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-600 transition-smooth"
                        title="Copy Hash"
                      >
                        <Icon name="Copy" size={14} />
                      </button>
                      
                      {transaction.status === 'failed' && (
                        <button
                          onClick={() => console.log('Retry transaction:', transaction.id)}
                          className="p-1 rounded text-primary hover:bg-primary/10 transition-smooth"
                          title="Retry Transaction"
                        >
                          <Icon name="RefreshCw" size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bulk Actions */}
      {selectedTransactions.length > 0 && (
        <div className="border-t border-border p-4 bg-surface-700/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              {selectedTransactions.length} transaction{selectedTransactions.length > 1 ? 's' : ''} selected
            </span>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => console.log('Export selected:', selectedTransactions)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary hover:bg-primary/20 transition-smooth"
              >
                <Icon name="Download" size={14} />
                <span>Export</span>
              </button>
              
              <button
                onClick={() => setSelectedTransactions([])}
                className="flex items-center space-x-1 px-3 py-1.5 bg-surface border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-border-light transition-smooth"
              >
                <Icon name="X" size={14} />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;