"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

export function PricingComparison() {
  const marketData = [
    {
      carrier: 'BlueDart',
      marketShare: 28,
      avgCost: 245,
      trend: 'up',
      change: '+5%'
    },
    {
      carrier: 'DTDC',
      marketShare: 22,
      avgCost: 195,
      trend: 'down',
      change: '-3%'
    },
    {
      carrier: 'FedEx',
      marketShare: 18,
      avgCost: 285,
      trend: 'up',
      change: '+2%'
    },
    {
      carrier: 'Ecom Express',
      marketShare: 16,
      avgCost: 175,
      trend: 'stable',
      change: '0%'
    },
    {
      carrier: 'Delhivery',
      marketShare: 16,
      avgCost: 205,
      trend: 'up',
      change: '+1%'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-emerald-400" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-400" />;
      default: return <Minus className="h-3 w-3 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-emerald-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <BarChart3 className="h-5 w-5 text-blue-400" />
          <span>Market Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {marketData.map((data, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-full" 
                   style={{ height: `${data.marketShare}px` }}></div>
              <div>
                <p className="text-white font-medium">{data.carrier}</p>
                <p className="text-gray-400 text-xs">{data.marketShare}% market share</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <span className="text-white font-semibold">₹{data.avgCost}</span>
                <div className={`flex items-center space-x-1 ${getTrendColor(data.trend)}`}>
                  {getTrendIcon(data.trend)}
                  <span className="text-xs">{data.change}</span>
                </div>
              </div>
              <p className="text-gray-400 text-xs">avg. cost</p>
            </div>
          </div>
        ))}

        <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
          <p className="text-purple-200 text-sm font-medium mb-1">Market Insight</p>
          <p className="text-gray-300 text-xs">
            Express delivery demand increased 15% this quarter. 
            Consider booking early for better rates during peak seasons.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}