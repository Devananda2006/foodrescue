import React, { useState, useMemo } from 'react';
import { Donation, RecipientFilterPreference } from '../types/food';
import { runRuleBasedMatching } from '../utils/matchingEngine';
import { CATEGORY_LABELS, formatDeadlineTime } from '../utils/formatters';
import { Sparkles, SlidersHorizontal, CheckCircle2, Clock, MapPin, Building, ChevronRight, Info } from 'lucide-react';

interface SmartMatchingProps {
  donations: Donation[];
  onOpenClaimModal: (donation: Donation) => void;
}

export const SmartMatching: React.FC<SmartMatchingProps> = ({ donations, onOpenClaimModal }) => {
  // Recipient organization preferences
  const [preferences, setPreferences] = useState<RecipientFilterPreference>({
    orgName: 'St. Anthony Community Soup Kitchen',
    orgType: 'Soup Kitchen & Meal Center',
    targetArea: 'Downtown Financial',
    capacityPortions: 40,
    preferredCategory: 'cooked',
    urgencyOnly: false,
  });

  // Calculate transparent rule-based recommendations
  const recommendations = useMemo(() => {
    return runRuleBasedMatching(donations, preferences);
  }, [donations, preferences]);

  return (
    <div className="py-4 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Rule-Based Heuristic Matching Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Smart Food Rescue Matching
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-3xl">
          Instantly connects surplus listings to recipient organizations by transparently scoring proximity, batch size suitability, dietary category, and urgent collection deadlines.
        </p>
      </div>

      {/* Recipient Preference Configurator */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
            <span>Recipient Organization Profile & Preferences</span>
          </h2>
          <span className="text-xs text-stone-500">Updates match scoring live</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Your Facility Type
            </label>
            <select
              value={preferences.orgType}
              onChange={(e) => setPreferences({ ...preferences, orgType: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="Soup Kitchen & Meal Center">Soup Kitchen / Meal Center</option>
              <option value="Emergency Family Shelter">Emergency Family Shelter</option>
              <option value="Community Food Pantry">Community Food Pantry</option>
              <option value="Neighborhood Free Fridge">Neighborhood Free Fridge</option>
              <option value="Senior Community Dining">Senior Community Dining</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Primary Location / District
            </label>
            <select
              value={preferences.targetArea}
              onChange={(e) => setPreferences({ ...preferences, targetArea: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="all">Any District / Citywide</option>
              <option value="Downtown Financial">Downtown Financial</option>
              <option value="Mission District">Mission District</option>
              <option value="Warehouse District">Warehouse District</option>
              <option value="University Heights">University Heights</option>
              <option value="South of Market">South of Market</option>
              <option value="Westside Suburbs">Westside Suburbs</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Capacity Target: {preferences.capacityPortions} Portions
            </label>
            <input
              type="range"
              min="10"
              max="150"
              step="5"
              value={preferences.capacityPortions}
              onChange={(e) =>
                setPreferences({ ...preferences, capacityPortions: parseInt(e.target.value, 10) })
              }
              className="w-full accent-emerald-800 cursor-pointer mt-2"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>Small (10)</span>
              <span>Medium (60)</span>
              <span>Bulk (150)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Category Priority
            </label>
            <select
              value={preferences.preferredCategory}
              onChange={(e) => setPreferences({ ...preferences, preferredCategory: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="all">All Food Types Accepted</option>
              <option value="cooked">Cooked Meals</option>
              <option value="bakery">Bakery & Bread</option>
              <option value="produce">Fresh Produce</option>
              <option value="dairy">Dairy & Milks</option>
              <option value="pantry">Pantry Staples</option>
            </select>
          </div>
        </div>

        {/* Algorithm Transparency Card */}
        <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
          <p>
            <strong className="text-stone-800">Deterministic Rule Weighting:</strong> Geographic Proximity (30%), Portion Size Alignment (25%), Dietary Category Match (20%), Imminent Pickup Urgency (15%), Safety Certification (10%). No opaque black-box AI model is used.
          </p>
        </div>
      </div>

      {/* Recommended Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900">
            Top Ranked Rescue Matches ({recommendations.length})
          </h2>
          <span className="text-xs text-stone-500">Sorted by match coefficient</span>
        </div>

        {recommendations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-sm">
            No unclaimed donations currently meet the active criteria. Broaden your location or category filters above.
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => {
              const { donation, matchScore, reasons, urgencyLevel } = rec;
              const deadline = formatDeadlineTime(donation.pickupDeadline);

              return (
                <div
                  key={donation.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-300 transition-all p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  {/* Left: Thumbnail & Core Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {donation.imageUrl ? (
                      <img
                        src={donation.imageUrl}
                        alt={donation.title}
                        referrerPolicy="no-referrer"
                        className="w-24 h-24 rounded-xl object-cover shrink-0 border border-stone-200"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200 text-emerald-800 font-bold text-xs">
                        {CATEGORY_LABELS[donation.category]}
                      </div>
                    )}

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                          {CATEGORY_LABELS[donation.category]}
                        </span>
                        {urgencyLevel === 'high' && (
                          <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                            Urgent Pickup Required
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-stone-900 text-base sm:text-lg">
                        {donation.title}
                      </h3>

                      <div className="text-xs text-stone-600 flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-emerald-900">{donation.quantityKg} kg</span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span className="font-medium">~{donation.estimatedPortions} meal portions</span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          {donation.area}
                        </span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span className="flex items-center gap-1 text-stone-700">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          {deadline.text}
                        </span>
                      </div>

                      {/* Matching Explanation Breakdown */}
                      <div className="pt-2">
                        <p className="text-xs font-bold text-emerald-900 mb-1">
                          Why this matches your facility:
                        </p>
                        <ul className="space-y-1">
                          {reasons.slice(0, 3).map((r, i) => (
                            <li key={i} className="text-xs text-stone-600 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Right: Score Box & Claim Button */}
                  <div className="w-full lg:w-48 shrink-0 flex flex-col items-end sm:items-stretch lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-stone-100 pt-4 lg:pt-0 lg:pl-6 space-y-3">
                    <div className="text-right w-full">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-3xl font-extrabold text-emerald-900 tabular-nums">
                          {matchScore}%
                        </span>
                        <span className="text-xs font-semibold text-stone-400">Match</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className="bg-emerald-700 h-full rounded-full"
                          style={{ width: `${matchScore}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenClaimModal(donation)}
                      className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>Claim This Match</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
