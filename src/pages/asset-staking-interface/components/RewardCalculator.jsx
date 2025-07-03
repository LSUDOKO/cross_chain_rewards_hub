import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const RewardCalculator = ({ asset, stakingDuration, amount }) => {
  const [viewMode, setViewMode] = useState('projection'); // 'projection' or 'comparison'
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const calculateProjections = () => {
    if (!asset || !stakingDuration) return [];

    const baseValue = asset.type === 'nft' ? 100 : parseFloat(amount || asset.balance || 0) * 0.1;
    const dailyRate = 0.025; // 2.5% daily base rate
    const data = [];

    for (let day = 0; day <= Math.min(stakingDuration, 365); day += Math.ceil(stakingDuration / 12)) {
      const compoundReward = baseValue * Math.pow(1 + dailyRate / 100, day);
      const totalReward = compoundReward - baseValue;
      
      data.push({
        day,
        reward: totalReward,
        cumulative: totalReward,
        usdcValue: totalReward * 0.85
      });
    }

    return data;
  };

  const getComparisonData = () => {
    const durations = [7, 30, 90, 180, 365];
    const baseValue = asset?.type === 'nft' ? 100 : parseFloat(amount || asset?.balance || 0) * 0.1;
    
    return durations.map(days => {
      const apy = Math.min(5 + (days / 365) * 20, 25); // 5% to 25% APY
      const totalReward = (baseValue * apy / 100) * (days / 365);
      
      return {
        duration: days === 7 ? '1W' : days === 30 ? '1M' : days === 90 ? '3M' : days === 180 ? '6M' : '1Y',
        days,
        reward: totalReward,
        apy,
        usdcValue: totalReward * 0.85
      };
    });
  };

  const projectionData = calculateProjections();
  const comparisonData = getComparisonData();

  const formatTooltip = (value, name) => {
    if (name === 'reward') return [`${value.toFixed(4)} MATIC`, 'Rewards'];
    if (name === 'usdcValue') return [`$${value.toFixed(2)}`, 'USDC Value'];
    return [value, name];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-primary mb-2">
            {viewMode === 'projection' ? `Day ${label}` : label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('USDC') ? `$${entry.value.toFixed(2)}` : `${entry.value.toFixed(4)} MATIC`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} className="text-accent" />
          <span>Reward Calculator</span>
        </h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('projection')}
            className={`px-3 py-1 rounded-lg text-sm transition-smooth ${
              viewMode === 'projection' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-text-primary hover:bg-surface-700'
            }`}
          >
            Projection
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-3 py-1 rounded-lg text-sm transition-smooth ${
              viewMode === 'comparison' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-text-primary hover:bg-surface-700'
            }`}
          >
            Compare
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'projection' ? (
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="day" 
                stroke="var(--color-text-muted)"
                fontSize={12}
                tickFormatter={(value) => `${value}d`}
              />
              <YAxis 
                stroke="var(--color-text-muted)"
                fontSize={12}
                tickFormatter={(value) => `${value.toFixed(2)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="reward" 
                stroke="var(--color-accent)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
                name="MATIC Rewards"
              />
              <Line 
                type="monotone" 
                dataKey="usdcValue" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                name="USDC Value"
              />
            </LineChart>
          ) : (
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="duration" 
                stroke="var(--color-text-muted)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-muted)"
                fontSize={12}
                tickFormatter={(value) => `${value.toFixed(2)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="reward" 
                fill="var(--color-accent)"
                name="MATIC Rewards"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-700 rounded-lg p-3 text-center">
          <Icon name="Clock" size={16} className="text-text-muted mx-auto mb-1" />
          <p className="text-xs text-text-muted">Duration</p>
          <p className="font-mono text-sm text-text-primary">
            {stakingDuration || 0} days
          </p>
        </div>
        
        <div className="bg-surface-700 rounded-lg p-3 text-center">
          <Icon name="Coins" size={16} className="text-accent mx-auto mb-1" />
          <p className="text-xs text-text-muted">Total MATIC</p>
          <p className="font-mono text-sm text-accent">
            {projectionData.length > 0 ? projectionData[projectionData.length - 1]?.reward.toFixed(4) : '0.0000'}
          </p>
        </div>
        
        <div className="bg-surface-700 rounded-lg p-3 text-center">
          <Icon name="DollarSign" size={16} className="text-primary mx-auto mb-1" />
          <p className="text-xs text-text-muted">USDC Value</p>
          <p className="font-mono text-sm text-primary">
            ${projectionData.length > 0 ? projectionData[projectionData.length - 1]?.usdcValue.toFixed(2) : '0.00'}
          </p>
        </div>
        
        <div className="bg-surface-700 rounded-lg p-3 text-center">
          <Icon name="Percent" size={16} className="text-secondary mx-auto mb-1" />
          <p className="text-xs text-text-muted">Est. APY</p>
          <p className="font-mono text-sm text-secondary">
            {stakingDuration ? Math.min(5 + (stakingDuration / 365) * 20, 25).toFixed(1) : '0.0'}%
          </p>
        </div>
      </div>

      {/* Bonus Calculation */}
      <div className="bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Gift" size={20} className="text-secondary mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-text-primary mb-2">Bonus Rewards Calculation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-text-muted mb-1">Base Staking Rewards:</p>
                <p className="font-mono text-accent">
                  {projectionData.length > 0 ? projectionData[projectionData.length - 1]?.reward.toFixed(4) : '0.0000'} MATIC
                </p>
              </div>
              <div>
                <p className="text-text-muted mb-1">Multi-Asset Bonus:</p>
                <p className="font-mono text-secondary">+$25.00 USDC</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="font-medium text-text-primary">Total Potential Value:</span>
                <span className="font-mono text-lg text-accent">
                  ${(
                    (projectionData.length > 0 ? projectionData[projectionData.length - 1]?.usdcValue : 0) + 25
                  ).toFixed(2)} USDC
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Disclaimer */}
      <div className="bg-surface-700 border border-border rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
          <div className="text-xs text-text-muted">
            <p className="font-medium text-text-primary mb-1">Risk Disclaimer</p>
            <p>
              Reward calculations are estimates based on current rates and market conditions. 
              Actual rewards may vary due to network conditions, market volatility, and protocol changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardCalculator;