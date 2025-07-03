import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';


const RewardsAnalytics = ({ isVisible, onClose }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'earnings', label: 'Earnings', icon: 'TrendingUp' },
    { id: 'assets', label: 'Asset Performance', icon: 'PieChart' },
    { id: 'history', label: 'History', icon: 'Clock' }
  ];

  const timeRanges = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: '1y', label: '1 Year' }
  ];

  // Mock data for charts
  const earningsData = [
    { date: '2024-01-01', matic: 12.5, usdc: 10.6, bonus: 2.1 },
    { date: '2024-01-02', matic: 15.2, usdc: 12.9, bonus: 0 },
    { date: '2024-01-03', matic: 18.7, usdc: 15.9, bonus: 3.2 },
    { date: '2024-01-04', matic: 22.1, usdc: 18.8, bonus: 1.5 },
    { date: '2024-01-05', matic: 25.8, usdc: 21.9, bonus: 4.1 },
    { date: '2024-01-06', matic: 28.3, usdc: 24.1, bonus: 0 },
    { date: '2024-01-07', matic: 32.6, usdc: 27.7, bonus: 5.8 }
  ];

  const assetPerformanceData = [
    { name: 'CryptoPunk #1234', value: 35, color: '#3B82F6' },
    { name: 'Bored Ape #5678', value: 28, color: '#8B5CF6' },
    { name: 'USDC Tokens', value: 22, color: '#10B981' },
    { name: 'ETH Tokens', value: 15, color: '#F59E0B' }
  ];

  const dailyRewardsData = [
    { day: 'Mon', rewards: 4.2 },
    { day: 'Tue', rewards: 5.1 },
    { day: 'Wed', rewards: 3.8 },
    { day: 'Thu', rewards: 6.3 },
    { day: 'Fri', rewards: 7.2 },
    { day: 'Sat', rewards: 5.9 },
    { day: 'Sun', rewards: 8.1 }
  ];

  const rewardsHistory = [
    {
      id: 1,
      date: '2024-01-07',
      type: 'Claim',
      asset: 'CryptoPunk #1234',
      amount: 8.5,
      usdcValue: 7.23,
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-01-06',
      type: 'Bonus',
      asset: 'Multi-asset Staking',
      amount: 5.8,
      usdcValue: 4.93,
      status: 'completed'
    },
    {
      id: 3,
      date: '2024-01-05',
      type: 'Claim',
      asset: 'Bored Ape #5678',
      amount: 6.2,
      usdcValue: 5.27,
      status: 'completed'
    },
    {
      id: 4,
      date: '2024-01-04',
      type: 'Claim',
      asset: 'USDC Tokens',
      amount: 4.1,
      usdcValue: 3.49,
      status: 'completed'
    }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const formatNumber = (num) => {
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalEarnings = () => {
    const latest = earningsData[earningsData.length - 1];
    return {
      matic: latest.matic,
      usdc: latest.usdc,
      bonus: latest.bonus
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'pending': return 'text-warning';
      case 'failed': return 'text-error';
      default: return 'text-text-muted';
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isVisible) return null;

  const totalEarnings = getTotalEarnings();

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-200 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Mobile Full Screen */}
      <div className="md:hidden w-full h-full bg-surface rounded-none flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Rewards Analytics</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Mobile Tabs */}
        <div className="flex overflow-x-auto border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 whitespace-nowrap border-b-2 transition-smooth ${
                activeTab === tab.id
                  ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-700 rounded-lg p-4 border border-border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Coins" size={16} className="text-accent" />
                    <span className="text-xs text-text-secondary">Total MATIC</span>
                  </div>
                  <div className="text-lg font-bold text-text-primary font-mono">
                    {formatNumber(totalEarnings.matic)}
                  </div>
                </div>
                
                <div className="bg-surface-700 rounded-lg p-4 border border-border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="DollarSign" size={16} className="text-accent" />
                    <span className="text-xs text-text-secondary">USDC Value</span>
                  </div>
                  <div className="text-lg font-bold text-accent font-mono">
                    ${formatNumber(totalEarnings.usdc)}
                  </div>
                </div>
              </div>

              <div className="bg-surface-700 rounded-lg p-4 border border-border">
                <h3 className="font-medium text-text-primary mb-3">Daily Rewards (7 Days)</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyRewardsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="day" stroke="var(--color-text-muted)" fontSize={12} />
                      <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--color-surface)', 
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="rewards" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-text-primary">Earnings Trend</h3>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-surface-700 border border-border rounded-lg px-3 py-1 text-sm text-text-primary"
                >
                  {timeRanges.map((range) => (
                    <option key={range.id} value={range.id}>{range.label}</option>
                  ))}
                </select>
              </div>

              <div className="bg-surface-700 rounded-lg p-4 border border-border">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="var(--color-text-muted)" 
                        fontSize={12}
                        tickFormatter={formatDate}
                      />
                      <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--color-surface)', 
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="usdc" 
                        stackId="1"
                        stroke="var(--color-accent)" 
                        fill="var(--color-accent)" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="bonus" 
                        stackId="1"
                        stroke="var(--color-warning)" 
                        fill="var(--color-warning)" 
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Assets Tab */}
          {activeTab === 'assets' && (
            <div className="space-y-6">
              <h3 className="font-medium text-text-primary">Asset Performance</h3>
              
              <div className="bg-surface-700 rounded-lg p-4 border border-border">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetPerformanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {assetPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-2">
                {assetPerformanceData.map((asset, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-surface-700 rounded-lg border border-border">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: asset.color }}
                      ></div>
                      <span className="text-sm text-text-primary">{asset.name}</span>
                    </div>
                    <span className="text-sm font-medium text-text-primary">{asset.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="font-medium text-text-primary">Recent Transactions</h3>
              
              <div className="space-y-3">
                {rewardsHistory.map((transaction) => (
                  <div key={transaction.id} className="bg-surface-700 rounded-lg p-4 border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-text-primary">{transaction.type}</span>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary mt-1">{transaction.asset}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-accent">
                          {formatNumber(transaction.amount)} MATIC
                        </div>
                        <div className="text-sm text-text-muted">
                          ${formatNumber(transaction.usdcValue)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-text-muted">
                      {formatDate(transaction.date)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Modal */}
      <div className="hidden md:block w-full max-w-4xl bg-surface rounded-xl shadow-xl border border-border animate-slide-up max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Rewards Analytics</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="flex">
          {/* Desktop Sidebar */}
          <div className="w-48 border-r border-border p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-smooth ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-700'
                  }`}
                >
                  <Icon name={tab.icon} size={18} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Desktop Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-surface-700 rounded-lg p-4 border border-border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Coins" size={20} className="text-accent" />
                      <span className="text-sm text-text-secondary">Total MATIC</span>
                    </div>
                    <div className="text-2xl font-bold text-text-primary font-mono">
                      {formatNumber(totalEarnings.matic)}
                    </div>
                  </div>
                  
                  <div className="bg-surface-700 rounded-lg p-4 border border-border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="DollarSign" size={20} className="text-accent" />
                      <span className="text-sm text-text-secondary">USDC Value</span>
                    </div>
                    <div className="text-2xl font-bold text-accent font-mono">
                      ${formatNumber(totalEarnings.usdc)}
                    </div>
                  </div>

                  <div className="bg-surface-700 rounded-lg p-4 border border-border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Gift" size={20} className="text-warning" />
                      <span className="text-sm text-text-secondary">Bonus Rewards</span>
                    </div>
                    <div className="text-2xl font-bold text-warning font-mono">
                      +${formatNumber(totalEarnings.bonus)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-surface-700 rounded-lg p-4 border border-border">
                    <h3 className="font-medium text-text-primary mb-4">Daily Rewards</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailyRewardsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                          <XAxis dataKey="day" stroke="var(--color-text-muted)" />
                          <YAxis stroke="var(--color-text-muted)" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'var(--color-surface)', 
                              border: '1px solid var(--color-border)',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar dataKey="rewards" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-surface-700 rounded-lg p-4 border border-border">
                    <h3 className="font-medium text-text-primary mb-4">Asset Distribution</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={assetPerformanceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {assetPerformanceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-text-primary">Earnings Trend</h3>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-surface-700 border border-border rounded-lg px-3 py-2 text-text-primary"
                  >
                    {timeRanges.map((range) => (
                      <option key={range.id} value={range.id}>{range.label}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-surface-700 rounded-lg p-6 border border-border">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={earningsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis 
                          dataKey="date" 
                          stroke="var(--color-text-muted)"
                          tickFormatter={formatDate}
                        />
                        <YAxis stroke="var(--color-text-muted)" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--color-surface)', 
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="usdc" 
                          stackId="1"
                          stroke="var(--color-accent)" 
                          fill="var(--color-accent)" 
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="bonus" 
                          stackId="1"
                          stroke="var(--color-warning)" 
                          fill="var(--color-warning)" 
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assets' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-text-primary">Asset Performance</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-surface-700 rounded-lg p-6 border border-border">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={assetPerformanceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {assetPerformanceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {assetPerformanceData.map((asset, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-surface-700 rounded-lg border border-border">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: asset.color }}
                          ></div>
                          <span className="text-text-primary">{asset.name}</span>
                        </div>
                        <span className="font-medium text-text-primary">{asset.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-text-primary">Transaction History</h3>
                
                <div className="space-y-3">
                  {rewardsHistory.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-surface-700 rounded-lg border border-border">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-text-primary">{transaction.type}</span>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                        <span className="text-text-secondary">{transaction.asset}</span>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="font-mono text-accent">
                            {formatNumber(transaction.amount)} MATIC
                          </div>
                          <div className="text-sm text-text-muted">
                            ${formatNumber(transaction.usdcValue)}
                          </div>
                        </div>
                        <div className="text-sm text-text-muted">
                          {formatDate(transaction.date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsAnalytics;