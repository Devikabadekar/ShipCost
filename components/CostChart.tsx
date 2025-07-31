"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CostData {
  carrier: string;
  total: number;
  eta: string;
  baseRate: number;
  weightCharges: number;
  speedSurcharge: number;
}

interface CostChartProps {
  data: CostData[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function CostChart({ data }: CostChartProps) {
  const chartData = data.map(item => ({
    name: item.carrier,
    cost: item.total,
    eta: item.eta,
    baseRate: item.baseRate,
    weightCharges: item.weightCharges,
    speedSurcharge: item.speedSurcharge
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <div className="space-y-1 mt-2">
            <p className="text-blue-600">Total Cost: ₹{data.cost}</p>
            <p className="text-gray-600">ETA: {data.eta}</p>
            <div className="border-t pt-2 mt-2 space-y-1">
              <p className="text-sm text-gray-500">Base Rate: ₹{data.baseRate}</p>
              <p className="text-sm text-gray-500">Weight Charges: ₹{data.weightCharges}</p>
              <p className="text-sm text-gray-500">Speed Surcharge: ₹{data.speedSurcharge}</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            stroke="#666"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#666"
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}