"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Truck, Clock, DollarSign, Package, Zap, Shield } from 'lucide-react';

interface CarrierData {
  carrier: string;
  total: number;
  eta: string;
  baseRate: number;
  weightCharges: number;
  speedSurcharge: number;
  distanceMultiplier: number;
}

interface CarrierModalProps {
  carrier: CarrierData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CarrierModal({ carrier, isOpen, onClose }: CarrierModalProps) {
  if (!carrier) return null;

  const getCarrierInfo = (carrierName: string) => {
    const carriers: Record<string, { description: string; features: string[]; rating: number }> = {
      'BlueDart Express': {
        description: 'Premium express delivery service with nationwide coverage and guaranteed delivery times.',
        features: ['Real-time tracking', 'Insurance coverage', 'Signature confirmation', 'Weekend delivery'],
        rating: 4.8
      },
      'DTDC Courier': {
        description: 'Reliable domestic courier service with extensive network across India.',
        features: ['Affordable pricing', 'COD available', 'Bulk discounts', 'SMS notifications'],
        rating: 4.5
      },
      'FedEx India': {
        description: 'International courier leader with premium domestic services.',
        features: ['Global network', 'Express options', 'Customs clearance', 'Premium packaging'],
        rating: 4.7
      },
      'Ecom Express': {
        description: 'E-commerce focused logistics with competitive pricing.',
        features: ['E-commerce optimized', 'Bulk shipping', 'Returns management', 'API integration'],
        rating: 4.3
      },
      'Delhivery': {
        description: 'Tech-enabled logistics platform with comprehensive solutions.',
        features: ['Technology driven', 'Flexible delivery', 'Warehousing', 'Last mile expertise'],
        rating: 4.4
      }
    };

    return carriers[carrierName] || {
      description: 'Professional courier service with reliable delivery options.',
      features: ['Standard delivery', 'Basic tracking', 'Customer support'],
      rating: 4.0
    };
  };

  const carrierInfo = getCarrierInfo(carrier.carrier);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <span>{carrier.carrier}</span>
          </DialogTitle>
          <DialogDescription>
            {carrierInfo.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Rating */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Service Rating</span>
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold">{carrierInfo.rating}</span>
              <span className="text-gray-500 text-sm">/5.0</span>
            </div>
          </div>

          <Separator />

          {/* Cost Breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span>Cost Breakdown</span>
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Rate</span>
                <span>₹{carrier.baseRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight Charges</span>
                <span>₹{carrier.weightCharges}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Speed Surcharge</span>
                <span>₹{carrier.speedSurcharge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Distance Multiplier</span>
                <span>×{carrier.distanceMultiplier}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Cost</span>
                <span className="text-blue-600">₹{carrier.total}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Info */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span>Delivery Information</span>
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Estimated Delivery</span>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {carrier.eta}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center space-x-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <span>Service Features</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {carrierInfo.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}