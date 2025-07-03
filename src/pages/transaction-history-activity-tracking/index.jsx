import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import TransactionCard from './components/TransactionCard';
import FilterChips from './components/FilterChips';
import FilterSidebar from './components/FilterSidebar';
import PerformanceMetrics from './components/PerformanceMetrics';
import TransactionTable from './components/TransactionTable';
import SearchAndSort from './components/SearchAndSort';

const TransactionHistoryActivityTracking = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isMetricsExpanded, setIsMetricsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    type: [],
    status: [],
    network: [],
    dateRange: ''
  });

  const [sortConfig, setSortConfig] = useState({
    key: 'timestamp',
    direction: 'desc'
  });

  const mockTransactions = [
    {
      id: 'tx-001',
      type: 'stake',
      status: 'success',
      network: 'ethereum',
      timestamp: Date.now() - 3600000,
      hash: '0x1234567890abcdef1234567890abcdef12345678',
      asset: {
        name: 'Bored Ape #1234',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
        tokenId: '1234'
      },
      amount: '1',
      symbol: 'NFT',
      gasFee: '0.0045',
      gasSymbol: 'ETH',
      blockNumber: 18456789,
      confirmations: 12,
      rewardAmount: '25.50',
      rewardSymbol: 'MATIC'
    },
    {
      id: 'tx-002',
      type: 'claim',
      status: 'confirming',
      network: 'polygon',
      timestamp: Date.now() - 1800000,
      hash: '0xabcdef1234567890abcdef1234567890abcdef12',
      asset: {
        name: 'USDC Rewards',
        image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop'
      },
      amount: '156.75',
      symbol: 'USDC',
      gasFee: '0.02',
      gasSymbol: 'MATIC',
      blockNumber: 48123456,
      confirmations: 8
    },
    {
      id: 'tx-003',
      type: 'convert',
      status: 'success',
      network: 'ethereum',
      timestamp: Date.now() - 7200000,
      hash: '0x567890abcdef1234567890abcdef1234567890ab',
      asset: {
        name: 'MATIC to USDC',
        image: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=400&fit=crop'
      },
      amount: '245.80',
      symbol: 'MATIC',
      gasFee: '0.0067',
      gasSymbol: 'ETH',
      blockNumber: 18456234,
      confirmations: 12,
      rewardAmount: '234.15',
      rewardSymbol: 'USDC'
    },
    {
      id: 'tx-004',
      type: 'unstake',
      status: 'pending',
      network: 'polygon',
      timestamp: Date.now() - 900000,
      hash: '0x890abcdef1234567890abcdef1234567890abcdef',
      asset: {
        name: 'CryptoPunk #5678',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop',
        tokenId: '5678'
      },
      amount: '1',
      symbol: 'NFT',
      gasFee: '0.015',
      gasSymbol: 'MATIC',
      blockNumber: 48123789,
      confirmations: 3
    },
    {
      id: 'tx-005',
      type: 'stake',
      status: 'failed',
      network: 'bsc',
      timestamp: Date.now() - 14400000,
      hash: '0xcdef1234567890abcdef1234567890abcdef1234',
      asset: {
        name: 'Azuki #9876',
        image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&h=400&fit=crop',
        tokenId: '9876'
      },
      amount: '1',
      symbol: 'NFT',
      gasFee: '0.008',
      gasSymbol: 'BNB',
      blockNumber: 32456789,
      confirmations: 0
    },
    {
      id: 'tx-006',
      type: 'transfer',
      status: 'success',
      network: 'ethereum',
      timestamp: Date.now() - 21600000,
      hash: '0xdef1234567890abcdef1234567890abcdef12345',
      asset: {
        name: 'USDC Transfer',
        image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop'
      },
      amount: '500.00',
      symbol: 'USDC',
      gasFee: '0.0089',
      gasSymbol: 'ETH',
      blockNumber: 18455678,
      confirmations: 12
    }
  ];

  const mockMetrics = {
    totalValue: 12456.78,
    portfolioChange: 12.5,
    totalRewards: 3456.90,
    rewardsChange: 8.3,
    totalConversions: 2890.45,
    conversionsChange: 15.7,
    stakingEfficiency: 87.2,
    efficiencyChange: 2.1,
    avgDailyRewards: 45.67,
    bestAsset: 'Bored Ape #1234',
    totalTransactions: 156
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    // Simulate loading
    setTimeout(() => {
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setIsLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    filterAndSortTransactions();
  }, [transactions, filters, searchQuery, sortConfig]);

  const filterAndSortTransactions = () => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.type.toLowerCase().includes(query) ||
        tx.status.toLowerCase().includes(query) ||
        tx.network.toLowerCase().includes(query) ||
        tx.asset?.name.toLowerCase().includes(query) ||
        tx.hash?.toLowerCase().includes(query) ||
        tx.symbol?.toLowerCase().includes(query)
      );
    }

    // Apply category filters
    if (filters.type.length > 0) {
      filtered = filtered.filter(tx => filters.type.includes(tx.type));
    }

    if (filters.status.length > 0) {
      filtered = filtered.filter(tx => filters.status.includes(tx.status));
    }

    if (filters.network.length > 0) {
      filtered = filtered.filter(tx => filters.network.includes(tx.network));
    }

    // Apply date range filter
    if (filters.dateRange) {
      const now = Date.now();
      const ranges = {
        today: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        quarter: 90 * 24 * 60 * 60 * 1000,
        year: 365 * 24 * 60 * 60 * 1000
      };
      
      const range = ranges[filters.dateRange];
      if (range) {
        filtered = filtered.filter(tx => now - tx.timestamp <= range);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'amount') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortConfig.key === 'timestamp') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortConfig.key === 'asset') {
        aValue = a.asset?.name || '';
        bValue = b.asset?.name || '';
      }

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTransactions(filtered);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRemoveFilter = (category, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (category === 'dateRange') {
        newFilters[category] = '';
      } else {
        newFilters[category] = newFilters[category].filter(item => item !== value);
      }
      
      return newFilters;
    });
  };

  const handleClearAllFilters = () => {
    setFilters({
      type: [],
      status: [],
      network: [],
      dateRange: ''
    });
    setSearchQuery('');
  };

  const handleSort = (config) => {
    setSortConfig(config);
  };

  const handleExport = () => {
    const csvContent = [
      ['Type', 'Asset', 'Amount', 'Symbol', 'Network', 'Status', 'Date', 'Hash'].join(','),
      ...filteredTransactions.map(tx => [
        tx.type,
        tx.asset?.name || '',
        tx.amount || '',
        tx.symbol || '',
        tx.network,
        tx.status,
        new Date(tx.timestamp).toISOString(),
        tx.hash || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const hasActiveFilters = () => {
    return filters.type.length > 0 || 
           filters.status.length > 0 || 
           filters.network.length > 0 || 
           filters.dateRange !== '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="animate-pulse">
              <div className="h-8 bg-surface rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-surface rounded w-1/2"></div>
            </div>
            
            {/* Metrics Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-surface rounded-lg p-4">
                  <div className="h-4 bg-surface-700 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-surface-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            
            {/* Transaction Cards Skeleton */}
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-surface rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-surface-700 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-surface-700 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-surface-700 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
                Transaction History & Activity
              </h1>
              <p className="text-text-secondary">
                Track your cross-chain transactions and portfolio performance
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="hidden lg:flex items-center bg-surface border border-border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded text-sm transition-smooth ${
                    viewMode === 'cards' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon name="LayoutGrid" size={16} />
                  <span>Cards</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded text-sm transition-smooth ${
                    viewMode === 'table' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon name="Table" size={16} />
                  <span>Table</span>
                </button>
              </div>
              
              {/* Refresh Button */}
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                iconName="RefreshCw"
                iconPosition="left"
                className={isRefreshing ? 'animate-spin' : ''}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Performance Metrics */}
          <PerformanceMetrics
            metrics={mockMetrics}
            isExpanded={isMetricsExpanded}
            onToggleExpand={() => setIsMetricsExpanded(!isMetricsExpanded)}
          />

          {/* Search and Sort */}
          <SearchAndSort
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortConfig={sortConfig}
            onSortChange={handleSort}
            onToggleFilters={() => setIsFilterSidebarOpen(true)}
            onExport={handleExport}
            totalTransactions={transactions.length}
            filteredTransactions={filteredTransactions.length}
          />

          {/* Filter Chips */}
          {(hasActiveFilters() || searchQuery) && (
            <FilterChips
              activeFilters={filters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
          )}

          {/* Main Content */}
          <div className="flex gap-6">
            {/* Filter Sidebar - Desktop */}
            <div className="hidden lg:block">
              <FilterSidebar
                isOpen={true}
                onClose={() => {}}
                filters={filters}
                onApplyFilters={handleApplyFilters}
              />
            </div>

            {/* Transactions Content */}
            <div className="flex-1">
              {filteredTransactions.length === 0 ? (
                <div className="bg-surface border border-border rounded-lg p-8 text-center">
                  <Icon name="Search" size={48} className="text-text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    No transactions found
                  </h3>
                  <p className="text-text-secondary mb-4">
                    {searchQuery || hasActiveFilters() 
                      ? 'Try adjusting your search or filters' :'Your transaction history will appear here'
                    }
                  </p>
                  {(searchQuery || hasActiveFilters()) && (
                    <Button
                      variant="outline"
                      onClick={handleClearAllFilters}
                      iconName="RotateCcw"
                      iconPosition="left"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  {viewMode === 'table' && (
                    <div className="hidden lg:block">
                      <TransactionTable
                        transactions={filteredTransactions}
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      />
                    </div>
                  )}

                  {/* Mobile/Cards View */}
                  {(viewMode === 'cards' || window.innerWidth < 1024) && (
                    <div className="space-y-4">
                      {filteredTransactions.map((transaction) => (
                        <TransactionCard
                          key={transaction.id}
                          transaction={transaction}
                          onExpand={(id, expanded) => console.log('Expand:', id, expanded)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="font-medium text-text-primary mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/asset-dashboard-portfolio-overview')}
                iconName="LayoutGrid"
                iconPosition="left"
                className="justify-start"
              >
                View Portfolio
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/asset-staking-interface')}
                iconName="Lock"
                iconPosition="left"
                className="justify-start"
              >
                Stake Assets
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/rewards-management-usdc-conversion')}
                iconName="Coins"
                iconPosition="left"
                className="justify-start"
              >
                Claim Rewards
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/wallet-connection-network-setup')}
                iconName="Wallet"
                iconPosition="left"
                className="justify-start"
              >
                Wallet Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default TransactionHistoryActivityTracking;