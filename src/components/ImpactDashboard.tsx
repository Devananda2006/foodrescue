import React, { useState } from 'react';
import { Donation } from '../types/food';
import { CATEGORY_LABELS } from '../utils/formatters';
import { BarChart3, TrendingUp, CheckCircle2, RotateCcw, Award, Globe, Leaf, Droplets, AlertTriangle } from 'lucide-react';

interface ImpactDashboardProps {
  donations: Donation[];
  onResetDemo: () => void;
  onNavigateToAvailable: () => void;
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({
  donations,
  onResetDemo,
  onNavigateToAvailable,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Dynamic calculations from current donations state
  const totalDonations = donations.length;

  const totalKgListed = donations.reduce((sum, d) => sum + d.quantityKg, 0);

  // Distinguish claimed vs confirmed delivered
  const claimedOnlyDonations = donations.filter((d) => d.status === 'claimed');
  const deliveredDonations = donations.filter((d) => d.status === 'delivered');
  const availableDonations = donations.filter((d) => d.status === 'available');

  const kgClaimedPending = claimedOnlyDonations.reduce((sum, d) => sum + d.quantityKg, 0);
  const kgDelivered = deliveredDonations.reduce((sum, d) => sum + d.quantityKg, 0);
  const totalKgRescued = kgClaimedPending + kgDelivered;

  const mealsTotal = donations.reduce((sum, d) => sum + d.estimatedPortions, 0);
  const mealsClaimedOrDelivered = donations
    .filter((d) => d.status === 'claimed' || d.status === 'delivered')
    .reduce((sum, d) => sum + d.estimatedPortions, 0);
  const mealsDelivered = deliveredDonations.reduce((sum, d) => sum + d.estimatedPortions, 0);

  // Completion rate: delivered items as % of total listed
  const completionRate = totalDonations > 0 ? (deliveredDonations.length / totalDonations) * 100 : 0;
  // Rescue allocation rate: claimed or delivered as % of total
  const rescueRate = totalDonations > 0 ? ((claimedOnlyDonations.length + deliveredDonations.length) / totalDonations) * 100 : 0;

  // Environmental equivalencies
  const co2ePreventedKg = totalKgRescued * 2.5;
  const waterSavedLiters = Math.round(totalKgRescued * 1000);
  const carMilesEquivalent = Math.round(co2ePreventedKg * 2.4);

  // Category breakdown
  const categoryData = Object.entries(CATEGORY_LABELS).map(([catKey, label]) => {
    const items = donations.filter((d) => d.category === catKey);
    const kg = items.reduce((sum, d) => sum + d.quantityKg, 0);
    const percentage = totalKgListed > 0 ? (kg / totalKgListed) * 100 : 0;
    return {
      key: catKey,
      label,
      count: items.length,
      kg: Number(kg.toFixed(1)),
      percentage: Number(percentage.toFixed(1)),
    };
  }).filter((c) => c.kg > 0);

  return (
    <div className="py-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Sustainability Hackathon Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Real-Time Impact Dashboard
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Dynamic verified tracking of food rescued, emissions prevented, and community meals distributed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-300 rounded-lg shadow-xs hover:bg-stone-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Records</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset Demo */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-stone-200 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Reset Demo Data?</h3>
              <p className="text-xs text-stone-600 mt-1">
                This will restore the original 6 sample donations in localStorage, resetting all claimed and newly created listings.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetDemo();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Core KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Listed */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Listed</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 tabular-nums">
              {totalKgListed.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-stone-400">kg</span>
          </div>
          <p className="text-xs text-stone-500 pt-1">
            Across {totalDonations} separate food donations
          </p>
        </div>

        {/* Rescued (Claimed + Delivered) */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-300 shadow-xs space-y-1">
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Surplus Rescued</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900 tabular-nums">
              {totalKgRescued.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-emerald-700">kg</span>
          </div>
          <p className="text-xs text-emerald-700 pt-1">
            {rescueRate.toFixed(0)}% of listed surplus reserved
          </p>
        </div>

        {/* Community Meals */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Meals Provided</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 tabular-nums">
              {mealsClaimedOrDelivered.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-stone-400">portions</span>
          </div>
          <p className="text-xs text-stone-500 pt-1">
            {mealsDelivered.toLocaleString()} confirmed delivered
          </p>
        </div>

        {/* Completion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Full Completion Rate</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tabular-nums">
              {completionRate.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-stone-500 pt-1">
            Delivered & verified at recipient site
          </p>
        </div>
      </div>

      {/* Critical Requirement: Distinction between Claimed vs Confirmed Delivered */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
        <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Surplus Lifecycle & Verification Breakdown
            </h2>
            <p className="text-xs text-stone-500">
              Clear verification distinguishing reserved surplus from confirmed physical deliveries
            </p>
          </div>
          <span className="text-xs font-semibold bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md">
            Chain of Custody
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Status 1: Available */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 uppercase tracking-wide">1. Available for Pickup</span>
              <span className="font-bold text-stone-900">{availableDonations.length} items</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-stone-900 tabular-nums">
                {availableDonations.reduce((s, d) => s + d.quantityKg, 0).toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-stone-500">kg available</span>
            </div>
            <p className="text-xs text-stone-500">
              Active on public board awaiting organization reservation.
            </p>
          </div>

          {/* Status 2: Claimed (In Transit / Pickup Pending) */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-900 uppercase tracking-wide">2. Claimed (In Transit)</span>
              <span className="font-bold text-amber-900">{claimedOnlyDonations.length} items</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-950 tabular-nums">
                {kgClaimedPending.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-amber-800">kg reserved</span>
            </div>
            <p className="text-xs text-amber-800">
              Driver dispatched with verified pickup commitment notes.
            </p>
          </div>

          {/* Status 3: Confirmed Delivered */}
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-900 uppercase tracking-wide">3. Confirmed Delivered</span>
              <span className="font-bold text-emerald-900">{deliveredDonations.length} items</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-950 tabular-nums">
                {kgDelivered.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-emerald-800">kg distributed</span>
            </div>
            <p className="text-xs text-emerald-800">
              Safely received at shelter/pantry and distributed to clients.
            </p>
          </div>
        </div>
      </div>

      {/* Environmental & Carbon Equivalencies */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Ecological Return on Investment
            </span>
            <h2 className="text-xl font-bold text-white">Landfill Diversion Impact</h2>
          </div>
          <Leaf className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1">
            <p className="text-xs text-emerald-200">Greenhouse Gases Prevented</p>
            <p className="text-3xl font-extrabold text-white tabular-nums font-mono">
              {co2ePreventedKg.toFixed(1)} <span className="text-base font-normal text-emerald-300">kg CO₂e</span>
            </p>
            <p className="text-xs text-stone-300">
              Prevents organic methane emission in anaerobic landfills.
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-emerald-200">Agricultural Water Conserved</p>
            <p className="text-3xl font-extrabold text-white tabular-nums font-mono">
              {waterSavedLiters.toLocaleString()} <span className="text-base font-normal text-emerald-300">Liters</span>
            </p>
            <p className="text-xs text-stone-300">
              Virtual water embedded in food cultivation & processing.
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-emerald-200">Carbon Offset Equivalency</p>
            <p className="text-3xl font-extrabold text-amber-300 tabular-nums font-mono">
              {carMilesEquivalent} <span className="text-base font-normal text-amber-200">miles</span>
            </p>
            <p className="text-xs text-stone-300">
              Equivalent passenger car driving emissions neutralized.
            </p>
          </div>
        </div>
      </div>

      {/* Category Distribution Chart / Visual Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h2 className="text-base font-bold text-stone-900">
            Rescued Food Distribution by Category
          </h2>
          <p className="text-xs text-stone-500">
            Proportional breakdown of food categories across all demo listings
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {categoryData.map((cat) => (
            <div key={cat.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-800">{cat.label}</span>
                <span className="text-stone-500 tabular-nums">
                  {cat.kg} kg ({cat.percentage}%) · {cat.count} listings
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-700 h-full rounded-full transition-all duration-300"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
