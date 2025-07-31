interface ShippingData {
  pickupCity: string;
  destinationCity: string;
  weight: number;
  deliverySpeed: string;
}

interface CostBreakdown {
  baseRate: number;
  weightCharges: number;
  speedSurcharge: number;
  distanceMultiplier: number;
  total: number;
  eta: string;
  carrier: string;
}

// Mock carrier data with realistic pricing
const CARRIERS = [
  {
    name: 'BlueDart Express',
    baseRate: 150,
    weightMultiplier: 25,
    speedMultipliers: { standard: 1, express: 1.8, overnight: 2.5 },
    reliability: 0.95
  },
  {
    name: 'DTDC Courier',
    baseRate: 120,
    weightMultiplier: 20,
    speedMultipliers: { standard: 1, express: 1.6, overnight: 2.2 },
    reliability: 0.88
  },
  {
    name: 'FedEx India',
    baseRate: 180,
    weightMultiplier: 30,
    speedMultipliers: { standard: 1, express: 1.9, overnight: 2.8 },
    reliability: 0.97
  },
  {
    name: 'Ecom Express',
    baseRate: 100,
    weightMultiplier: 18,
    speedMultipliers: { standard: 1, express: 1.5, overnight: 2.0 },
    reliability: 0.85
  },
  {
    name: 'Delhivery',
    baseRate: 110,
    weightMultiplier: 22,
    speedMultipliers: { standard: 1, express: 1.7, overnight: 2.3 },
    reliability: 0.90
  }
];

// Distance multipliers based on city pairs (mock data)
const getDistanceMultiplier = (pickup: string, destination: string): number => {
  const distances: Record<string, Record<string, number>> = {
    'mumbai': { 'delhi': 1.8, 'bangalore': 1.5, 'chennai': 1.6, 'kolkata': 2.0, 'pune': 1.2 },
    'delhi': { 'mumbai': 1.8, 'bangalore': 1.9, 'chennai': 2.1, 'kolkata': 1.7, 'pune': 1.6 },
    'bangalore': { 'mumbai': 1.5, 'delhi': 1.9, 'chennai': 1.3, 'kolkata': 2.2, 'pune': 1.4 },
    'chennai': { 'mumbai': 1.6, 'delhi': 2.1, 'bangalore': 1.3, 'kolkata': 1.8, 'pune': 1.5 },
    'kolkata': { 'mumbai': 2.0, 'delhi': 1.7, 'bangalore': 2.2, 'chennai': 1.8, 'pune': 1.9 },
    'pune': { 'mumbai': 1.2, 'delhi': 1.6, 'bangalore': 1.4, 'chennai': 1.5, 'kolkata': 1.9 }
  };

  const pickupKey = pickup.toLowerCase();
  const destKey = destination.toLowerCase();
  
  return distances[pickupKey]?.[destKey] || 1.5; // Default multiplier
};

// ETA calculation based on speed and distance
const calculateETA = (speed: string, distanceMultiplier: number): string => {
  const baseDays = {
    standard: 4,
    express: 2,
    overnight: 1
  };

  const days = Math.ceil(baseDays[speed as keyof typeof baseDays] * Math.min(distanceMultiplier, 2));
  
  if (days === 1) return 'Next day';
  return `${days} days`;
};

export function validateForm(data: ShippingData): { isValid: boolean; message: string } {
  if (!data.pickupCity.trim()) {
    return { isValid: false, message: 'Please enter a pickup city' };
  }
  
  if (!data.destinationCity.trim()) {
    return { isValid: false, message: 'Please enter a destination city' };
  }
  
  if (data.pickupCity.toLowerCase() === data.destinationCity.toLowerCase()) {
    return { isValid: false, message: 'Pickup and destination cities cannot be the same' };
  }
  
  if (!data.weight || data.weight <= 0) {
    return { isValid: false, message: 'Please enter a valid package weight (greater than 0)' };
  }
  
  if (data.weight > 50) {
    return { isValid: false, message: 'Package weight cannot exceed 50kg for this service' };
  }
  
  if (!data.deliverySpeed) {
    return { isValid: false, message: 'Please select a delivery speed' };
  }
  
  return { isValid: true, message: 'Form is valid' };
}

export function calculateShippingCost(data: ShippingData): CostBreakdown[] {
  const distanceMultiplier = getDistanceMultiplier(data.pickupCity, data.destinationCity);
  
  return CARRIERS.map(carrier => {
    const speedMultiplier = carrier.speedMultipliers[data.deliverySpeed as keyof typeof carrier.speedMultipliers];
    
    const baseRate = carrier.baseRate;
    const weightCharges = Math.ceil(data.weight * carrier.weightMultiplier);
    const speedSurcharge = Math.ceil(baseRate * (speedMultiplier - 1));
    
    const subtotal = baseRate + weightCharges + speedSurcharge;
    const total = Math.ceil(subtotal * distanceMultiplier);
    
    return {
      carrier: carrier.name,
      baseRate,
      weightCharges,
      speedSurcharge,
      distanceMultiplier,
      total,
      eta: calculateETA(data.deliverySpeed, distanceMultiplier)
    };
  });
}

export function getAIRecommendation(results: CostBreakdown[], formData: ShippingData) {
  // AI logic for recommendations
  const sortedByCost = [...results].sort((a, b) => a.total - b.total);
  const sortedBySpeed = [...results].sort((a, b) => {
    const etaA = a.eta === 'Next day' ? 1 : parseInt(a.eta.split(' ')[0]);
    const etaB = b.eta === 'Next day' ? 1 : parseInt(b.eta.split(' ')[0]);
    return etaA - etaB;
  });

  const cheapest = sortedByCost[0];
  const fastest = sortedBySpeed[0];
  
  // AI decision logic
  let recommendation;
  let reason;

  if (formData.deliverySpeed === 'overnight') {
    recommendation = fastest;
    reason = `For overnight delivery, ${fastest.carrier} offers the most reliable next-day service with excellent tracking.`;
  } else if (formData.weight > 10) {
    // For heavy packages, recommend based on reliability and cost
    const reliableCarriers = results.filter(r => 
      r.carrier.includes('BlueDart') || r.carrier.includes('FedEx')
    );
    recommendation = reliableCarriers.length > 0 ? reliableCarriers[0] : cheapest;
    reason = `For heavier packages (${formData.weight}kg), ${recommendation.carrier} offers the best balance of reliability and handling expertise.`;
  } else if (cheapest.total < fastest.total * 0.7) {
    recommendation = cheapest;
    reason = `${cheapest.carrier} offers excellent value with significant cost savings (₹${fastest.total - cheapest.total} less than premium options).`;
  } else {
    // Balanced recommendation
    const balancedOption = results.find(r => 
      r.total <= cheapest.total * 1.2 && 
      (r.eta === fastest.eta || parseInt(r.eta.split(' ')[0] || '1') <= parseInt(fastest.eta.split(' ')[0] || '1') + 1)
    ) || cheapest;
    
    recommendation = balancedOption;
    reason = `${balancedOption.carrier} provides the optimal balance of cost-effectiveness and delivery speed for your shipment.`;
  }

  return {
    recommended: recommendation,
    reason,
    alternatives: {
      cheapest: cheapest.carrier !== recommendation.carrier ? cheapest : null,
      fastest: fastest.carrier !== recommendation.carrier ? fastest : null
    }
  };
}