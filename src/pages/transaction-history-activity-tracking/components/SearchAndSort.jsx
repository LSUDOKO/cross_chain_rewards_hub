import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchAndSort = ({ 
  searchQuery, 
  onSearchChange, 
  sortConfig, 
  onSortChange, 
  onToggleFilters,
  onExport,
  totalTransactions,
  filteredTransactions 
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const sortOptions = [
    { value: 'timestamp-desc', label: 'Newest First', icon: 'ArrowDown' },
    { value: 'timestamp-asc', label: 'Oldest First', icon: 'ArrowUp' },
    { value: 'amount-desc', label: 'Highest Amount', icon: 'ArrowDown' },
    { value: 'amount-asc', label: 'Lowest Amount', icon: 'ArrowUp' },
    { value: 'type-asc', label: 'Type A-Z', icon: 'ArrowUp' },
    { value: 'status-asc', label: 'Status', icon: 'ArrowUp' }
  ];

  const handleSortChange = (value) => {
    const [key, direction] = value.split('-');
    onSortChange({ key, direction });
  };

  const getCurrentSortValue = () => {
    if (!sortConfig) return 'timestamp-desc';
    return `${sortConfig.key}-${sortConfig.direction}`;
  };

  const getCurrentSortLabel = () => {
    const currentValue = getCurrentSortValue();
    const option = sortOptions.find(opt => opt.value === currentValue);
    return option ? option.label : 'Sort by';
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
      {/* Top Row - Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <div className={`relative transition-all duration-200 ${
            isSearchFocused ? 'transform scale-[1.02]' : ''
          }`}>
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
            />
            <Input
              type="search"
              placeholder="Search transactions, assets, or hash..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-smooth"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={onToggleFilters}
            iconName="Filter"
            iconPosition="left"
          >
            Filters
          </Button>
          
          <Button
            variant="outline"
            onClick={onExport}
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Bottom Row - Sort, Stats, and Mobile Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2">
          <Icon name="ArrowUpDown" size={16} className="text-text-muted" />
          <select
            value={getCurrentSortValue()}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-surface-700 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-surface-700">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Transaction Count */}
        <div className="flex items-center space-x-4 text-sm text-text-secondary">
          <span>
            Showing {filteredTransactions} of {totalTransactions} transactions
          </span>
          
          {searchQuery && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 border border-primary/20 rounded text-primary">
              <Icon name="Search" size={12} />
              <span className="text-xs">"{searchQuery}"</span>
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="sm:hidden flex items-center space-x-2 w-full">
          <Button
            variant="outline"
            onClick={onToggleFilters}
            iconName="Filter"
            iconPosition="left"
            className="flex-1"
          >
            Filters
          </Button>
          
          <Button
            variant="outline"
            onClick={onExport}
            iconName="Download"
            iconPosition="left"
            className="flex-1"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Quick Filter Suggestions */}
      {!searchQuery && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <span className="text-xs text-text-muted">Quick search:</span>
          {['stake', 'claim', 'convert', 'ethereum', 'polygon', 'success', 'pending'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSearchChange(suggestion)}
              className="px-2 py-1 bg-surface-700 hover:bg-surface-600 border border-border rounded text-xs text-text-secondary hover:text-text-primary transition-smooth"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAndSort;