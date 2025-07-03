import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const PerformanceMetrics = ({ metrics, isExpanded, onToggleExpand }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'rewards', label: 'Rewards', icon: 'Coins' },
    { id: 'activity', label: 'Activity', icon: 'Activity' }
  ];

  const rewardTrendData = [
    { month: 'Jan', rewards: 245.50, conversions: 180.25 },
    { month: 'Feb', rewards: 312.75, conversions: 290.50 },
    { month: 'Mar', rewards: 428.90, conversions: 395.75 },
    { month: 'Apr', rewards: 567.25, conversions: 520.80 },
    { month: 'May', rewards: 689.40, conversions: 645.20 },
    { month: 'Jun', rewards: 756.85, conversions: 712.30 }
  ];

  const networkDistributionData = [
    { name: 'Ethereum', value: 45, color: '#3B82F6' },
    { name: 'Polygon', value: 35, color: '#8B5CF6' },
    { name: 'BSC', value: 20, color: '#F59E0B' }
  ];

  const activityData = [
    { day: 'Mon', stakes: 12, claims: 8, converts: 5 },
    { day: 'Tue', stakes: 15, claims: 12, converts: 7 },
    { day: 'Wed', stakes: 8, claims: 15, converts: 9 },
    { day: 'Thu', stakes: 18, claims: 10, converts: 6 },
    { day: 'Fri', stakes: 22, claims: 18, converts: 12 },
    { day: 'Sat', stakes: 16, claims: 14, converts: 8 },
    { day: 'Sun', stakes: 10, claims: 9, converts: 4 }
  ];

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const MetricCard = ({ title, value, change, icon, color = 'text-primary' }) => (
    <div className="bg-surface-700 border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg bg-surface-600 ${color}`}>
          <Icon name={icon} size={20} />
        </div>
        {change !== undefined && (
          <span className={`text-sm font-medium ${change >= 0 ? 'text-success' : 'text-error'}`}>
            {formatPercentage(change)}
          </span>
        )}
      </div>
      <h3 className="text-sm text-text-secondary mb-1">{title}</h3>
      <p className="text-xl font-semibold text-text-primary">{value}</p>
    </div>
  );

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Icon name="TrendingUp" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-text-primary">Performance Metrics</h2>
              <p className="text-sm text-text-secondary">Portfolio analytics and insights</p>
            </div>
          </div>
          
          <button
            onClick={onToggleExpand}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-700 transition-smooth"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
          </button>
        </div>
      </div>

      {/* Quick Stats - Always Visible */}
      <div className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Portfolio Value"
          value={formatCurrency(metrics.totalValue)}
          change={metrics.portfolioChange}
          icon="DollarSign"
          color="text-primary"
        />
        <MetricCard
          title="Total Rewards Earned"
          value={formatCurrency(metrics.totalRewards)}
          change={metrics.rewardsChange}
          icon="Coins"
          color="text-accent"
        />
        <MetricCard
          title="Successful Conversions"
          value={formatCurrency(metrics.totalConversions)}
          change={metrics.conversionsChange}
          icon="RefreshCw"
          color="text-secondary"
        />
        <MetricCard
          title="Staking Efficiency"
          value={`${metrics.stakingEfficiency}%`}
          change={metrics.efficiencyChange}
          icon="Target"
          color="text-warning"
        />
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border">
          {/* Tabs */}
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-smooth ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-text-secondary hover:text-text-primary hover:bg-surface-700'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Portfolio Growth Chart */}
                <div>
                  <h3 className="font-medium text-text-primary mb-4">Portfolio Growth Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={rewardTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="rewards"
                          stroke="#10B981"
                          strokeWidth={2}
                          dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                          name="Total Value"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Network Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-text-primary mb-4">Network Distribution</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={networkDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {networkDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1F2937',
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#F9FAFB'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-text-primary mb-4">Key Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-surface-700 rounded-lg">
                        <span className="text-sm text-text-secondary">Average Daily Rewards</span>
                        <span className="font-mono text-accent">{formatCurrency(metrics.avgDailyRewards)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-surface-700 rounded-lg">
                        <span className="text-sm text-text-secondary">Best Performing Asset</span>
                        <span className="font-medium text-text-primary">{metrics.bestAsset}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-surface-700 rounded-lg">
                        <span className="text-sm text-text-secondary">Total Transactions</span>
                        <span className="font-mono text-text-primary">{metrics.totalTransactions}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rewards' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-text-primary mb-4">Rewards vs Conversions</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={rewardTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }}
                        />
                        <Bar dataKey="rewards" fill="#10B981" name="Rewards Earned" />
                        <Bar dataKey="conversions" fill="#3B82F6" name="Converted to USDC" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-text-primary mb-4">Weekly Activity Breakdown</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }}
                        />
                        <Bar dataKey="stakes" fill="#3B82F6" name="Stakes" />
                        <Bar dataKey="claims" fill="#10B981" name="Claims" />
                        <Bar dataKey="converts" fill="#F59E0B" name="Converts" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetrics;