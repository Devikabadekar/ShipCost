"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Truck, MapPin, Package, Clock, TrendingUp, Zap, Shield, Star, ArrowRight, Calculator, Globe, Users } from 'lucide-react';
import { ShippingCalculator } from '@/components/ShippingCalculator';
import { PricingComparison } from '@/components/PricingComparison';
import { AIRecommendations } from '@/components/AIRecommendations';

export default function Home() {
  const [showCalculator, setShowCalculator] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">ShipCost</h1>
                  <p className="text-xs text-blue-200">Powered by Logistics Intelligence</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
                  <Zap className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                  <Globe className="h-3 w-3 mr-1" />
                  Pan-India
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {!showCalculator ? (
        /* Landing Page */
        <div className="relative z-10 pt-16">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className={`text-center transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
                <Star className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-white text-sm font-medium">Advanced Logistics Calculator</span>
              </div>
              
              <h1 className="text-center text-4xl md:text-6xl font-extrabold text-white mb-6 leading-snug tracking-tight">
  <span className="block text-blue-300 text-base md:text-lg font-semibold uppercase tracking-widest mb-2">
  </span>
  ShipCost
  <span className="block bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-500 bg-clip-text text-transparent mt-2">
    Compare. Optimize. Deliver.
  </span>
</h1>

              
              <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Instant, AI-powered shipping estimates with smart carrier comparisons.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Button 
                  onClick={() => setShowCalculator(true)}
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 group"
                >
                  <Calculator className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Calculate Shipping Cost
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
               
              </div>
            </div>

 {/* Calculator Overview Section */}
<div className={`mt-20 transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 lg:p-12 mx-auto w-full max-w-7xl">
    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">How ShipCost Works</h2>
    <p className="text-blue-100 text-center max-w-4xl mx-auto text-lg mb-8 leading-relaxed">
    Our smart calculator analyzes origin, destination, weight, and speed to instantly compare rates from India’s top logistics partners using real-time pricing logic.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white text-center">
      <div className="bg-white/10 border border-white/10 rounded-xl p-6 hover:bg-white/15 transition">
        <Truck className="w-10 h-10 mx-auto mb-4 text-emerald-400" />
        <h4 className="text-xl font-semibold mb-2">Easy Inputs</h4>
        <p className="text-blue-100 text-sm">
          Select source, destination, weight & speed — no login required.
        </p>
      </div>
      <div className="bg-white/10 border border-white/10 rounded-xl p-6 hover:bg-white/15 transition">
        <Calculator className="w-10 h-10 mx-auto mb-4 text-blue-400" />
        <h4 className="text-xl font-semibold mb-2">Live Cost Calculation</h4>
        <p className="text-blue-100 text-sm">
          Instant results based on real logistics hub distances & pricing rules.
        </p>
      </div>
      <div className="bg-white/10 border border-white/10 rounded-xl p-6 hover:bg-white/15 transition">
        <Zap className="w-10 h-10 mx-auto mb-4 text-yellow-400" />
        <h4 className="text-xl font-semibold mb-2">Smart Suggestions</h4>
        <p className="text-blue-100 text-sm">
          AI suggests optimal carriers by comparing price, time, and reliability.
        </p>
      </div>
    </div>
  </div>
</div>


            {/* Stats Section */}
            <div className={`mt-24 transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
                    <div className="text-blue-200 text-sm">Shipments Calculated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">25+</div>
                    <div className="text-blue-200 text-sm">Logistics Partners</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">99.9%</div>
                    <div className="text-blue-200 text-sm">Accuracy Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                    <div className="text-blue-200 text-sm">Support Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Calculator Page */
        <div className="relative z-10 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
                <p className="text-blue-200">Get instant quotes from India's top logistics providers</p>
              </div>
              <Button 
  onClick={() => setShowCalculator(false)}
  variant="outline"
  className="border border-transparent text-white bg-transparent hover:bg-black/10 backdrop-blur-sm"
>
  ← Back to Home
</Button>

            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <ShippingCalculator />
              </div>
              <div className="space-y-6">
                <AIRecommendations />
                <PricingComparison />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}