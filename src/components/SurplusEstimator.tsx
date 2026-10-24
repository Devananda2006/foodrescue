import React, { useState } from 'react';
import { calculateSurplus } from '../utils/surplusCalculator';
import { Calculator, Sparkles, TrendingDown, DollarSign, Cloud, Droplets, ArrowRight, Lightbulb, Check } from 'lucide-react';

interface SurplusEstimatorProps {
  onPreFillDonation: (data: { title: string; quantityKg: number; estimatedPortions: number; category: string }) => void;
}

export const SurplusEstimator: React.FC<SurplusEstimatorProps> = ({ onPreFillDonation }) => {
  const [eventType, setEventType] = useState('Corporate Buffet Lunch');
  const [mealsPrepared, setMealsPrepared] = useState<number>(120);
  const [mealsServed, setMealsServed] = useState<number>(85);
  const [costPerMeal, setCostPerMeal] = useState<number>(6.5);
  const [foodCategory, setFoodCategory] = useState('cooked');

  const result = calculateSurplus({
    eventType,
    mealsPrepared,
    mealsServed,
    costPerMeal,
    foodType: foodCategory,
  });

  const handleCreateDonationFromSurplus = () => {
    onPreFillDonation({
      title: `Surplus ${foodCategory === 'cooked' ? 'Prepared Meals' : 'Bakery Surplus'} from ${eventType}`,
      quantityKg: result.estimatedKg,
      estimatedPortions: result.surplusMeals,
      category: foodCategory,
    });
  };

  return (
    <div className="py-4 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-stone-200 pb-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
          <Calculator className="w-3.5 h-3.5" />
          <span>Heuristic Kitchen Planning & Recovery Tool</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Surplus Food Estimator
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Calculate unserved portions, assess direct carbon and financial waste, and receive planning adjustments to optimize future prep schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Calculation Input Form */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-5">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Kitchen Production Inputs
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Enter numbers from today's service or shift
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Service / Operation Type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="Corporate Buffet Lunch">Corporate Buffet Lunch</option>
              <option value="Conference Banquet Dinner">Conference Banquet Dinner</option>
              <option value="Campus Dining Hall Shift">Campus Dining Hall Shift</option>
              <option value="Restaurant Daily Service">Restaurant Daily Service</option>
              <option value="Bakery Production Batch">Bakery Production Batch</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Food Item Category
            </label>
            <select
              value={foodCategory}
              onChange={(e) => setFoodCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="cooked">Cooked Hot / Cold Meals</option>
              <option value="bakery">Bakery & Breads</option>
              <option value="produce">Fresh Produce Prep</option>
              <option value="dairy">Dairy & Refrigerated Stock</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Meals Prepared
              </label>
              <input
                type="number"
                min="1"
                value={mealsPrepared}
                onChange={(e) => setMealsPrepared(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Meals Served
              </label>
              <input
                type="number"
                min="0"
                value={mealsServed}
                onChange={(e) => setMealsServed(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Average Cost Per Meal ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-stone-400 text-sm">$</span>
              <input
                type="number"
                step="0.5"
                min="0"
                value={costPerMeal}
                onChange={(e) => setCostPerMeal(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full pl-7 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">Used to calculate potential financial loss</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-500">
            <strong>Prototype Disclaimer:</strong> This estimator uses standard food service heuristics (~0.42 kg/portion, 2.5 kg CO2e/kg food). It is designed as an educational and planning aid, not an accounting auditor.
          </div>
        </div>

        {/* Right Column: Calculated Results & Planning Advice */}
        <div className="md:col-span-7 space-y-6">
          {/* Key Metric Highlights */}
          <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-800 pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-300 tracking-wider">
                  Calculated Surplus Result
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {result.surplusMeals} Unserved Meals ({result.surplusPercentage.toFixed(1)}% of Batch)
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-300 tabular-nums font-mono">
                  {result.estimatedKg} kg
                </span>
                <p className="text-[11px] text-emerald-200">Total Surplus Weight</p>
              </div>
            </div>

            {/* Impact Grid */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-800">
                <div className="flex items-center justify-center text-amber-300 mb-1">
                  <DollarSign className="w-4 h-4" />
                </div>
                <p className="text-lg font-bold tabular-nums text-white">${result.financialLoss.toFixed(0)}</p>
                <p className="text-[11px] text-stone-300">Food Cost Wasted</p>
              </div>

              <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-800">
                <div className="flex items-center justify-center text-emerald-400 mb-1">
                  <Cloud className="w-4 h-4" />
                </div>
                <p className="text-lg font-bold tabular-nums text-white">{result.co2SavedKg} kg</p>
                <p className="text-[11px] text-stone-300">CO2e If Rescued</p>
              </div>

              <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-800">
                <div className="flex items-center justify-center text-sky-400 mb-1">
                  <Droplets className="w-4 h-4" />
                </div>
                <p className="text-lg font-bold tabular-nums text-white">{result.waterSavedLiters.toLocaleString()} L</p>
                <p className="text-[11px] text-stone-300">Virtual Water Footprint</p>
              </div>
            </div>

            {/* Action CTA: Convert to donation */}
            {result.surplusMeals > 0 && (
              <div className="pt-2">
                <button
                  onClick={handleCreateDonationFromSurplus}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Transfer Surplus to Donation Listing ({result.estimatedKg} kg)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Planning Adjustments for Future Meals */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h3>Recommended Planning Adjustments for Next Service</h3>
            </div>

            {result.recommendedPrepAdjustment > 0 && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Target Adjustment:</strong> Decrease next production run by <strong>{result.recommendedPrepAdjustment}%</strong> (approx. {Math.round(result.surplusMeals * 0.75)} fewer baseline portions).
                </span>
              </div>
            )}

            <div className="space-y-2.5">
              {result.advice.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
