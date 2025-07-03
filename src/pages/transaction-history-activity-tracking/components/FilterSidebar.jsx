import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterSidebar = ({ isOpen, onClose, filters, onApplyFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const filterOptions = {
    type: [
      { value: 'stake', label: 'Stake', icon: 'Lock' },
      { value: 'unstake', label: 'Unstake', icon: 'Unlock' },
      { value: 'claim', label: 'Claim', icon: 'Download' },
      { value: 'convert', label: 'Convert', icon: 'RefreshCw' },
      { value: 'transfer', label: 'Transfer', icon: 'Send' }
    ],
    status: [
      { value: 'success', label: 'Success', icon: 'CheckCircle', color: 'text-success' },
      { value: 'pending', label: 'Pending', icon: 'Clock', color: 'text-warning' },
      { value: 'failed', label: 'Failed', icon: 'XCircle', color: 'text-error' },
      { value: 'confirming', label: 'Confirming', icon: 'Loader2', color: 'text-primary' }
    ],
    network: [
      { value: 'ethereum', label: 'Ethereum', icon: 'Zap', color: 'text-primary' },
      { value: 'polygon', label: 'Polygon', icon: 'Triangle', color: 'text-secondary' },
      { value: 'bsc', label: 'BSC', icon: 'Circle', color: 'text-warning' }
    ],
    dateRange: [
      { value: 'today', label: 'Today' },
      { value: 'week', label: 'This Week' },
      { value: 'month', label: 'This Month' },
      { value: 'quarter', label: 'This Quarter' },
      { value: 'year', label: 'This Year' }
    ]
  };

  const handleFilterChange = (category, value) => {
    setLocalFilters(prev => {
      const newFilters = { ...prev };
      
      if (category === 'dateRange') {
        newFilters[category] = newFilters[category] === value ? '' : value;
      } else {
        if (!newFilters[category]) {
          newFilters[category] = [];
        }
        
        const currentValues = [...newFilters[category]];
        const index = currentValues.indexOf(value);
        
        if (index > -1) {
          currentValues.splice(index, 1);
        } else {
          currentValues.push(value);
        }
        
        newFilters[category] = currentValues;
      }
      
      return newFilters;
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      type: [],
      status: [],
      network: [],
      dateRange: ''
    };
    setLocalFilters(resetFilters);
  };

  const isFilterActive = (category, value) => {
    if (category === 'dateRange') {
      return localFilters[category] === value;
    }
    return localFilters[category]?.includes(value) || false;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.entries(localFilters).forEach(([category, values]) => {
      if (category === 'dateRange') {
        if (values) count++;
      } else if (Array.isArray(values)) {
        count += values.length;
      }
    });
    return count;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-200" onClick={onClose} />
      
      {/* Sidebar */}
      <div className={`fixed lg:sticky top-0 right-0 lg:right-auto h-full lg:h-auto w-80 lg:w-64 bg-surface border-l lg:border-l-0 lg:border-r border-border z-300 lg:z-auto transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-text-primary">Filters</h3>
            <div className="flex items-center space-x-2">
              {getActiveFilterCount() > 0 && (
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-700 transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Transaction Type */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Transaction Type</h4>
              <div className="space-y-2">
                {filterOptions.type.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-surface-700 cursor-pointer transition-smooth"
                  >
                    <input
                      type="checkbox"
                      checked={isFilterActive('type', option.value)}
                      onChange={() => handleFilterChange('type', option.value)}
                      className="w-4 h-4 text-primary bg-surface-700 border-border rounded focus:ring-primary focus:ring-2"
                    />
                    <Icon name={option.icon} size={16} className="text-text-secondary" />
                    <span className="text-sm text-text-primary">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Status</h4>
              <div className="space-y-2">
                {filterOptions.status.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-surface-700 cursor-pointer transition-smooth"
                  >
                    <input
                      type="checkbox"
                      checked={isFilterActive('status', option.value)}
                      onChange={() => handleFilterChange('status', option.value)}
                      className="w-4 h-4 text-primary bg-surface-700 border-border rounded focus:ring-primary focus:ring-2"
                    />
                    <Icon name={option.icon} size={16} className={option.color} />
                    <span className="text-sm text-text-primary">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Network */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Network</h4>
              <div className="space-y-2">
                {filterOptions.network.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-surface-700 cursor-pointer transition-smooth"
                  >
                    <input
                      type="checkbox"
                      checked={isFilterActive('network', option.value)}
                      onChange={() => handleFilterChange('network', option.value)}
                      className="w-4 h-4 text-primary bg-surface-700 border-border rounded focus:ring-primary focus:ring-2"
                    />
                    <Icon name={option.icon} size={16} className={option.color} />
                    <span className="text-sm text-text-primary">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Date Range</h4>
              <div className="space-y-2">
                {filterOptions.dateRange.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-surface-700 cursor-pointer transition-smooth"
                  >
                    <input
                      type="radio"
                      name="dateRange"
                      checked={isFilterActive('dateRange', option.value)}
                      onChange={() => handleFilterChange('dateRange', option.value)}
                      className="w-4 h-4 text-primary bg-surface-700 border-border focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-text-primary">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <Button
              variant="primary"
              onClick={handleApply}
              className="w-full"
              iconName="Filter"
              iconPosition="left"
            >
              Apply Filters
            </Button>
            
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full"
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;