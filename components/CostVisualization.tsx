"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Award, Clock, IndianRupee } from 'lucide-react';

interface CostResult {
  carrier: string;
  cost: number;
  eta: string;
  reliability: number;
  features: string[];
  breakdown: {
    baseRate: number;
    weightCharges: number;
    speedSurcharge: number;
    distanceMultiplier: number;
  };
}

interface CostVisualizationProps {
  results: CostResult[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function CostVisualization({ results }: CostVisualizationProps) {
  const chartData = results.map((result, index) => ({
    name: result.carrier.split(' ')[0],
    cost: result.cost,
    reliability: result.reliability,
    eta: result.eta === 'Next day' ? 1 : parseInt(result.eta.split(' ')[0]),
    color: COLORS[index % COLORS.length]
  }));

  const pieData = results.map((result, index) => ({
    name: result.carrier.split(' ')[0],
    value: result.cost,
    color: COLORS[index % COLORS.length]
  }));

  const cheapest = results.reduce((min, current) => current.cost < min.cost ? current : min);
  const fastest = results.reduce((min, current) => {
    const currentDays = current.eta === 'Next day' ? 1 : parseInt(current.eta.split(' ')[0]);
    const minDays = min.eta === 'Next day' ? 1 : parseInt(min.eta.split(' ')[0]);
    return currentDays < minDays ? current : min;
  });
  const mostReliable = results.reduce((max, current) => current.reliability > max.reliability ? current : max);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm p-4 border border-slate-600 rounded-lg shadow-xl">
          <p className="font-semibold text-white mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-blue-400">Cost: ₹{data.cost}</p>
            <p className="text-emerald-400">Reliability: {data.reliability}%</p>
            <p className="text-orange-400">ETA: {data.eta === 1 ? 'Next day' : `${data.eta} days`}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 backdrop-blur-md border-emerald-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-400 text-sm font-medium">Cheapest Option</p>
                <p className="text-white text-xl font-bold">₹{cheapest.cost}</p>
                <p className="text-emerald-400 text-sm">{cheapest.carrier}</p>
              </div>
              <IndianRupee  className="h-8 w-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-md border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Fastest Delivery</p>
                <p className="text-white text-xl font-bold">{fastest.eta}</p>
                <p className="text-blue-400 text-sm">{fastest.carrier}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-md border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">Most Reliable</p>
                <p className="text-white text-xl font-bold">{mostReliable.reliability}%</p>
                <p className="text-purple-400 text-sm">{mostReliable.carrier}</p>
              </div>
              <Award className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Comparison Bar Chart */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              <span>Cost Comparison</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    stroke="#6b7280"
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Market Share Pie Chart */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Award className="h-5 w-5 text-emerald-400" />
              <span>Cost Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ₹${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`₹${value}`, 'Cost']}
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.95)',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reliability vs Cost Scatter */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            <span>Reliability vs Cost Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  stroke="#6b7280"
                />
                <YAxis 
                  yAxisId="cost"
                  orientation="left"
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  stroke="#6b7280"
                  tickFormatter={(value) => `₹${value}`}
                />
                <YAxis 
                  yAxisId="reliability"
                  orientation="right"
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  stroke="#6b7280"
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="cost" dataKey="cost" fill="#3b82f6" opacity={0.7} />
                <Line 
                  yAxisId="reliability" 
                  type="monotone" 
                  dataKey="reliability" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}