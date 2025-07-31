"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Truck, MapPin, Package, Clock, Calculator, Zap, TrendingUp } from 'lucide-react';
import { CostVisualization } from './CostVisualization';
import { CarrierComparison } from './CarrierComparison';

interface ShippingData {
  pickupCity: string;
  destinationCity: string;
  weight: number;
  deliverySpeed: string;
}

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

const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad', 
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad'
];

const CARRIERS_DATA = [
  {
    name: 'BlueDart Express',
    baseRate: 180,
    weightMultiplier: 28,
    speedMultipliers: { standard: 1, express: 1.8, overnight: 2.6 },
    reliability: 96,
    features: ['Real-time tracking', 'Insurance coverage', 'Signature confirmation', 'Weekend delivery'],
    color: '#3b82f6'
  },
  {
    name: 'DTDC Courier',
    baseRate: 140,
    weightMultiplier: 22,
    speedMultipliers: { standard: 1, express: 1.6, overnight: 2.3 },
    reliability: 89,
    features: ['Affordable pricing', 'COD available', 'Bulk discounts', 'SMS notifications'],
    color: '#10b981'
  },
  {
    name: 'FedEx India',
    baseRate: 220,
    weightMultiplier: 32,
    speedMultipliers: { standard: 1, express: 1.9, overnight: 2.9 },
    reliability: 98,
    features: ['Global network', 'Express options', 'Customs clearance', 'Premium packaging'],
    color: '#f59e0b'
  },
  {
    name: 'Ecom Express',
    baseRate: 120,
    weightMultiplier: 20,
    speedMultipliers: { standard: 1, express: 1.5, overnight: 2.1 },
    reliability: 87,
    features: ['E-commerce optimized', 'Bulk shipping', 'Returns management', 'API integration'],
    color: '#ef4444'
  },
  {
    name: 'Delhivery',
    baseRate: 130,
    weightMultiplier: 24,
    speedMultipliers: { standard: 1, express: 1.7, overnight: 2.4 },
    reliability: 91,
    features: ['Technology driven', 'Flexible delivery', 'Warehousing', 'Last mile expertise'],
    color: '#8b5cf6'
  }
];

export function ShippingCalculator() {
  const [formData, setFormData] = useState<ShippingData>({
    pickupCity: '',
    destinationCity: '',
    weight: 0,
    deliverySpeed: ''
  });
  
  const [results, setResults] = useState<CostResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const calculateDistance = (pickup: string, destination: string): number => {
    const distances: Record<string, Record<string, number>> = {
      'mumbai': { 'delhi': 1.8, 'bangalore': 1.5, 'chennai': 1.6, 'kolkata': 2.1, 'pune': 1.2, 'hyderabad': 1.4 },
      'delhi': { 'mumbai': 1.8, 'bangalore': 1.9, 'chennai': 2.2, 'kolkata': 1.7, 'pune': 1.6, 'hyderabad': 1.5 },
      'bangalore': { 'mumbai': 1.5, 'delhi': 1.9, 'chennai': 1.3, 'kolkata': 2.3, 'pune': 1.4, 'hyderabad': 1.2 },
      'chennai': { 'mumbai': 1.6, 'delhi': 2.2, 'bangalore': 1.3, 'kolkata': 1.9, 'pune': 1.5, 'hyderabad': 1.3 },
      'kolkata': { 'mumbai': 2.1, 'delhi': 1.7, 'bangalore': 2.3, 'chennai': 1.9, 'pune': 2.0, 'hyderabad': 1.8 },
      'pune': { 'mumbai': 1.2, 'delhi': 1.6, 'bangalore': 1.4, 'chennai': 1.5, 'kolkata': 2.0, 'hyderabad': 1.3 }
    };

    const pickupKey = pickup.toLowerCase();
    const destKey = destination.toLowerCase();
    
    return distances[pickupKey]?.[destKey] || 1.6;
  };

  const calculateETA = (speed: string, distance: number): string => {
    const baseDays = { standard: 4, express: 2, overnight: 1 };
    const days = Math.ceil(baseDays[speed as keyof typeof baseDays] * Math.min(distance, 2.2));
    return days === 1 ? 'Next day' : `${days} days`;
  };

  const validateForm = (): boolean => {
    if (!formData.pickupCity.trim()) {
      toast.error('Please select a pickup city');
      return false;
    }
    if (!formData.destinationCity.trim()) {
      toast.error('Please select a destination city');
      return false;
    }
    if (formData.pickupCity.toLowerCase() === formData.destinationCity.toLowerCase()) {
      toast.error('Pickup and destination cities must be different');
      return false;
    }
    if (!formData.weight || formData.weight <= 0) {
      toast.error('Please enter a valid package weight');
      return false;
    }
    if (formData.weight > 50) {
      toast.error('Maximum weight limit is 50kg');
      return false;
    }
    if (!formData.deliverySpeed) {
      toast.error('Please select delivery speed');
      return false;
    }
    return true;
  };

  const handleCalculate = async () => {
    if (!validateForm()) return;

    setIsCalculating(true);
    
    // Simulate API call
    setTimeout(() => {
      const distance = calculateDistance(formData.pickupCity, formData.destinationCity);
      
      const calculatedResults = CARRIERS_DATA.map(carrier => {
        const speedMultiplier = carrier.speedMultipliers[formData.deliverySpeed as keyof typeof carrier.speedMultipliers];
        const baseRate = carrier.baseRate;
        const weightCharges = Math.ceil(formData.weight * carrier.weightMultiplier);
        const speedSurcharge = Math.ceil(baseRate * (speedMultiplier - 1));
        const total = Math.ceil((baseRate + weightCharges + speedSurcharge) * distance);

        return {
          carrier: carrier.name,
          cost: total,
          eta: calculateETA(formData.deliverySpeed, distance),
          reliability: carrier.reliability,
          features: carrier.features,
          breakdown: {
            baseRate,
            weightCharges,
            speedSurcharge,
            distanceMultiplier: distance
          }
        };
      });

      setResults(calculatedResults);
      setShowResults(true);
      setIsCalculating(false);
      toast.success('Cost calculation completed successfully!');
    }, 2000);
  };

  const resetForm = () => {
    setFormData({ pickupCity: '', destinationCity: '', weight: 0, deliverySpeed: '' });
    setResults([]);
    setShowResults(false);
    toast.info('Form reset successfully');
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600/80 to-emerald-600/80 backdrop-blur-sm rounded-t-lg border-b border-white/20">
          <CardTitle className="flex items-center space-x-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <Calculator className="h-5 w-5" />
            </div>
            <span>Shipping Cost Calculator</span>
          </CardTitle>
          <CardDescription className="text-blue-100">
            Enter your shipment details to get instant cost estimates from top carriers
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="flex items-center space-x-2 text-white font-medium">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span>Pickup City</span>
              </Label>
              <Select value={formData.pickupCity} onValueChange={(value) => setFormData(prev => ({ ...prev, pickupCity: value }))}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/15 transition-colors">
                  <SelectValue placeholder="Select pickup city" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {INDIAN_CITIES.map(city => (
                    <SelectItem key={city} value={city} className="text-white hover:bg-slate-700">
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center space-x-2 text-white font-medium">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span>Destination City</span>
              </Label>
              <Select value={formData.destinationCity} onValueChange={(value) => setFormData(prev => ({ ...prev, destinationCity: value }))}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/15 transition-colors">
                  <SelectValue placeholder="Select destination city" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {INDIAN_CITIES.map(city => (
                    <SelectItem key={city} value={city} className="text-white hover:bg-slate-700">
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center space-x-2 text-white font-medium">
                <Package className="h-4 w-4 text-orange-400" />
                <span>Package Weight (kg)</span>
              </Label>
              <Input
                type="number"
                min="0.1"
                max="50"
                step="0.1"
                placeholder="Enter weight in kg"
                value={formData.weight || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 backdrop-blur-sm hover:bg-white/15 focus:bg-white/20 transition-colors"
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center space-x-2 text-white font-medium">
                <Clock className="h-4 w-4 text-purple-400" />
                <span>Delivery Speed</span>
              </Label>
              <Select value={formData.deliverySpeed} onValueChange={(value) => setFormData(prev => ({ ...prev, deliverySpeed: value }))}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/15 transition-colors">
                  <SelectValue placeholder="Select delivery speed" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="standard" className="text-white hover:bg-slate-700">
                    Standard (3-5 days) 
                  </SelectItem>
                  <SelectItem value="express" className="text-white hover:bg-slate-700">
                    Express (1-2 days) 
                  </SelectItem>
                  <SelectItem value="overnight" className="text-white hover:bg-slate-700">
                    Overnight (Next day) 
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button 
              onClick={handleCalculate}
              disabled={isCalculating}
              className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Calculating Costs...
                </>
              ) : (
                <>
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Calculate Shipping Cost
                </>
              )}
            </Button>
            
            <Button 
              onClick={resetForm}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-6"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {showResults && (
        <div className="space-y-6">
          <CostVisualization results={results} />
          <CarrierComparison results={results} formData={formData} />
        </div>
      )}
    </div>
  );
}