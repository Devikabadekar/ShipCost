"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, Clock, IndianRupee, Award, Brain } from 'lucide-react';


export function AIRecommendations() {
  const recommendations = [
    {
      type: 'Cost Optimization',
      title: 'Save up to 25% on shipping',
      description: 'Choose standard delivery for non-urgent shipments to maximize savings',
      icon: IndianRupee,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/30'
    },
    {
      type: 'Speed Optimization',
      title: 'Express delivery recommended',
      description: 'For time-sensitive shipments, express options provide best value',
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      type: 'Reliability Focus',
      title: 'Premium carriers available',
      description: 'High-value shipments benefit from premium carrier reliability',
      icon: Award,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    }
  ];

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Brain className="h-5 w-5 text-emerald-400" />
          <span>AI Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border ${rec.bgColor} ${rec.borderColor} transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-white/10 ${rec.color}`}>
                <rec.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{rec.title}</h4>
                  <Badge variant="outline" className="text-xs bg-white/5 border-white/20 text-gray-300">
                    {rec.type}
                  </Badge>
                </div>
                <p className="text-gray-300 text-sm">{rec.description}</p>
              </div>
            </div>
          </div>
        ))}

      </CardContent>
    </Card>
  );
}