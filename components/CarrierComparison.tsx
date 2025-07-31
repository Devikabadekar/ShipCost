"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Truck, Clock, Shield, Star, TrendingUp, Package, Zap, Award } from 'lucide-react';

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

interface CarrierComparisonProps {
  results: CostResult[];
  formData: {
    pickupCity: string;
    destinationCity: string;
    weight: number;
    deliverySpeed: string;
  };
}

export function CarrierComparison({ results, formData }: CarrierComparisonProps) {
  const [selectedCarrier, setSelectedCarrier] = useState<CostResult | null>(null);

  const getCarrierIcon = (carrierName: string) => {
    const icons: Record<string, any> = {
      'BlueDart Express': { icon: Zap, color: 'text-blue-400' },
      'DTDC Courier': { icon: Package, color: 'text-emerald-400' },
      'FedEx India': { icon: Award, color: 'text-yellow-400' },
      'Ecom Express': { icon: TrendingUp, color: 'text-red-400' },
      'Delhivery': { icon: Shield, color: 'text-purple-400' }
    };
    return icons[carrierName] || { icon: Truck, color: 'text-gray-400' };
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 95) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    if (reliability >= 90) return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    if (reliability >= 85) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getSpeedBadge = (eta: string) => {
    if (eta === 'Next day') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    const days = parseInt(eta.split(' ')[0]);
    if (days <= 2) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (days <= 4) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    return 'bg-red-500/20 text-red-300 border-red-500/30';
  };

  const sortedResults = [...results].sort((a, b) => a.cost - b.cost);

  return (
    <>
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Shield className="h-5 w-5 text-purple-400" />
            <span>Carrier Comparison</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedResults.map((result, index) => {
            const { icon: Icon, color } = getCarrierIcon(result.carrier);
            const isRecommended = index === 0; // Cheapest option
            
            return (
              <div 
                key={result.carrier}
                className={`relative p-6 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                  isRecommended 
                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-emerald-500/40 shadow-lg shadow-emerald-500/10' 
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                }`}
                onClick={() => setSelectedCarrier(result)}
              >
                {isRecommended && (
                  <div className="absolute -top-3 left-6">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      AI Recommended
                    </Badge>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-white/10 ${color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{result.carrier}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <Badge className={getSpeedBadge(result.eta)}>
                          <Clock className="h-3 w-3 mr-1" />
                          {result.eta}
                        </Badge>
                        <Badge className={getReliabilityColor(result.reliability)}>
                          <Shield className="h-3 w-3 mr-1" />
                          {result.reliability}% Reliable
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">₹{result.cost}</div>
                    <div className="text-sm text-gray-300">Click for details</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {result.features.slice(0, 3).map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-white/5 border-white/20 text-gray-300">
                      {feature}
                    </Badge>
                  ))}
                  {result.features.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-white/5 border-white/20 text-gray-300">
                      +{result.features.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Detailed Modal */}
      <Dialog open={!!selectedCarrier} onOpenChange={() => setSelectedCarrier(null)}>
        <DialogContent className="max-w-md bg-slate-800/95 backdrop-blur-md border-slate-600">
          {selectedCarrier && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3 text-white">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Truck className="h-5 w-5 text-blue-400" />
                  </div>
                  <span>{selectedCarrier.carrier}</span>
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  Detailed breakdown and service information
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Cost Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center space-x-2 text-white">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span>Cost Breakdown</span>
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span>Base Rate</span>
                      <span>₹{selectedCarrier.breakdown.baseRate}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Weight Charges ({formData.weight}kg)</span>
                      <span>₹{selectedCarrier.breakdown.weightCharges}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Speed Surcharge ({formData.deliverySpeed})</span>
                      <span>₹{selectedCarrier.breakdown.speedSurcharge}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Distance Multiplier</span>
                      <span>×{selectedCarrier.breakdown.distanceMultiplier.toFixed(1)}</span>
                    </div>
                    <Separator className="bg-slate-600" />
                    <div className="flex justify-between font-semibold text-lg text-white">
                      <span>Total Cost</span>
                      <span className="text-emerald-400">₹{selectedCarrier.cost}</span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-600" />

                {/* Service Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center space-x-2 text-white">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span>Service Information</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Delivery Time</p>
                      <p className="text-white font-medium">{selectedCarrier.eta}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Reliability</p>
                      <p className="text-white font-medium">{selectedCarrier.reliability}%</p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-600" />

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center space-x-2 text-white">
                    <Shield className="h-4 w-4 text-purple-400" />
                    <span>Service Features</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedCarrier.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold"
                  onClick={() => setSelectedCarrier(null)}
                >
                  Close Details
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}