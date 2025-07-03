import React from 'react';

const AssetLoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-surface border border-border rounded-lg p-4 animate-pulse">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-surface-700 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-surface-700 rounded w-24"></div>
                <div className="h-3 bg-surface-700 rounded w-16"></div>
              </div>
            </div>
            <div className="h-6 bg-surface-700 rounded w-16"></div>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <div className="h-3 bg-surface-700 rounded w-16"></div>
              <div className="h-3 bg-surface-700 rounded w-20"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-3 bg-surface-700 rounded w-20"></div>
              <div className="h-3 bg-surface-700 rounded w-16"></div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-2 bg-surface-700 rounded-full"></div>
          </div>

          {/* Button */}
          <div className="h-10 bg-surface-700 rounded-lg"></div>
        </div>
      ))}
    </div>
  );
};

export default AssetLoadingSkeleton;