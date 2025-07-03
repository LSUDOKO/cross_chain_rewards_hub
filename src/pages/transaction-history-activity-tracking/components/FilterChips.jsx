import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ activeFilters, onRemoveFilter, onClearAll }) => {
  const filterLabels = {
    type: {
      stake: 'Stake',
      unstake: 'Unstake',
      claim: 'Claim',
      convert: 'Convert',
      transfer: 'Transfer'
    },
    status: {
      success: 'Success',
      pending: 'Pending',
      failed: 'Failed',
      confirming: 'Confirming'
    },
    network: {
      ethereum: 'Ethereum',
      polygon: 'Polygon',
      bsc: 'BSC'
    },
    dateRange: {
      today: 'Today',
      week: 'This Week',
      month: 'This Month',
      quarter: 'This Quarter',
      year: 'This Year'
    }
  };

  const getFilterChips = () => {
    const chips = [];
    
    Object.entries(activeFilters).forEach(([category, values]) => {
      if (Array.isArray(values)) {
        values.forEach(value => {
          if (value && filterLabels[category] && filterLabels[category][value]) {
            chips.push({
              category,
              value,
              label: filterLabels[category][value],
              key: `${category}-${value}`
            });
          }
        });
      } else if (values && filterLabels[category] && filterLabels[category][values]) {
        chips.push({
          category,
          value: values,
          label: filterLabels[category][values],
          key: `${category}-${values}`
        });
      }
    });

    return chips;
  };

  const filterChips = getFilterChips();

  if (filterChips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-surface-700/30 border-b border-border">
      <span className="text-sm text-text-secondary font-medium">Active Filters:</span>
      
      {filterChips.map((chip) => (
        <div
          key={chip.key}
          className="inline-flex items-center space-x-1 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary"
        >
          <span>{chip.label}</span>
          <button
            onClick={() => onRemoveFilter(chip.category, chip.value)}
            className="p-0.5 rounded-full hover:bg-primary/20 transition-smooth"
          >
            <Icon name="X" size={12} />
          </button>
        </div>
      ))}
      
      {filterChips.length > 1 && (
        <button
          onClick={onClearAll}
          className="inline-flex items-center space-x-1 px-3 py-1 bg-error/10 border border-error/20 rounded-full text-sm text-error hover:bg-error/20 transition-smooth"
        >
          <Icon name="X" size={12} />
          <span>Clear All</span>
        </button>
      )}
    </div>
  );
};

export default FilterChips;