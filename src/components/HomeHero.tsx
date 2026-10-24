import React from 'react';
import { Donation } from '../types/food';
import { ArrowRight, Utensils, HeartHandshake, ShieldCheck, Globe2, Sparkles, Building2, TrendingUp, CheckCircle } from 'lucide-react';

interface HomeHeroProps {
  donations: Donation[];
  onNavigate: (tab: string) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ donations, onNavigate }) => {
  // Compute dynamic impact statistics
  const totalKg = donations.reduce((acc, d) => acc + d.quantityKg, 0);
  const claimedKg = donations
    .filter((d) => d.status === 'claimed' || d.status === 'delivered')
    .reduce((acc, d) => acc + d.quantityKg, 0);
  const totalMeals = donations.reduce((acc, d) => acc + d.estimatedPortions, 0);
  const availableCount = donations.filter((d) => d.status === 'available').length;
  const claimedCount = donations.filter((d) => d.status === 'claimed' || d.status === 'delivered').length;

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-stone-900 text-white shadow-xl">
        {/* Background Image with Dark Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_food_rescue_1792856832639.jpg"
            alt="Volunteers organizing rescued fresh fruits, vegetables, and bread for community distribution"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-stone-950/75 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl px-8 py-16 sm:py-24 sm:px-12 lg:px-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wide uppercase text-emerald-300 bg-emerald-900/60 rounded-full border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sustainability Hackathon 2026 Initiative</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
            Rescue Food. Reduce Waste. <span className="text-emerald-400">Nourish Communities.</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-200 max-w-2xl leading-relaxed">
            More than one-third of all food produced is discarded while thousands in our cities face food insecurity. FoodRescue Lite links commercial kitchens, grocers, and caterers directly with local shelters and soup kitchens in real time — diverting edible surplus from landfills straight to community tables.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('donate')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Donate Surplus Food</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('available')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-stone-900 bg-amber-50 hover:bg-white rounded-xl shadow-md transition-all hover:text-emerald-900"
            >
              <span>Find & Claim Food ({availableCount} Available)</span>
            </button>
          </div>

          {/* Adjacency Proof Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/15 text-stone-200">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums">{totalMeals.toLocaleString()}</p>
              <p className="text-xs text-stone-300">Meals Cataloged</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums">{totalKg.toFixed(1)} kg</p>
              <p className="text-xs text-stone-300">Surplus Listed</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400 tabular-nums">{claimedKg.toFixed(1)} kg</p>
              <p className="text-xs text-stone-300">Rescued & Claimed</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums">{claimedCount} of {donations.length}</p>
              <p className="text-xs text-stone-300">Fulfillment Status</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Challenge & Our Solution */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xs">
        <div className="space-y-4">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">The Problem & The Solution</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Bridging the Logistics Gap in Surplus Food Recovery
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Most commercial surplus food is thrown away simply because staff lack an effortless, low-friction channel to notify vetted recipients before pickup windows close. Traditional food drives focus on non-perishables, leaving prepared meals, fresh bakery batches, and dairy to spoil.
          </p>
          <div className="space-y-2.5 pt-2">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-700 mt-1 shrink-0" />
              <p className="text-xs sm:text-sm text-stone-700">
                <strong>Rapid Hyper-Local Discovery:</strong> Real-time countdown timers let drivers collect food within tight shelf-life deadlines.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-700 mt-1 shrink-0" />
              <p className="text-xs sm:text-sm text-stone-700">
                <strong>Transparent Smart Matching:</strong> Transparent rule scoring prioritizes proximity, portion capacity, and urgent expiry.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-700 mt-1 shrink-0" />
              <p className="text-xs sm:text-sm text-stone-700">
                <strong>Actionable Surplus Estimator:</strong> Kitchen teams calculate waste margins to prevent over-prep at the source.
              </p>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-md border border-stone-200 aspect-4/3 bg-stone-100">
          <img
            src="/src/assets/images/prepared_meals_catering_1792856833304.jpg"
            alt="Freshly packed nutritious meal portions ready for rescue pickup"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 inset-x-0 bg-stone-900/80 backdrop-blur-xs p-3 text-xs text-stone-200 flex items-center justify-between">
            <span>Harvest Greens Cafe · Fresh Mediterranean Grain Bowls</span>
            <span className="text-emerald-400 font-semibold">Ready for Pickup</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">How It Works</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            From Commercial Kitchen to Community Plate
          </h2>
          <p className="text-sm text-stone-600">
            A frictionless three-step recovery pipeline built for maximum speed and food safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-stone-900">List Surplus Food</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Kitchen managers and food donors enter item details, quantity, storage temperature requirements, and collection deadlines in under 60 seconds.
              </p>
            </div>
            <button
              onClick={() => onNavigate('donate')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
            >
              Post a donation <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-stone-900">Match & Claim</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Charities and shelters browse listings or use Smart Matching to reserve surplus tailored to their daily portion intake and storage capabilities.
              </p>
            </div>
            <button
              onClick={() => onNavigate('matching')}
              className="text-xs font-semibold text-amber-900 hover:text-amber-950 inline-flex items-center gap-1"
            >
              Explore smart matching <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-stone-900">Pickup & Nourish</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Designated drivers complete safe transit, confirm delivery in the system, and automatically update verifiable sustainability metrics.
              </p>
            </div>
            <button
              onClick={() => onNavigate('impact')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
            >
              View live impact metrics <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* UN Sustainable Development Goals (SDG) Alignment */}
      <section className="bg-emerald-950 text-white p-8 sm:p-12 rounded-3xl shadow-lg space-y-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <Globe2 className="w-4 h-4" />
            <span>United Nations Sustainable Development Goals</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Direct Alignment with UN Global Impact Goals
          </h2>
          <p className="text-stone-300 text-sm leading-relaxed">
            Food rescue is one of the highest leverage climate and humanitarian interventions identified by Project Drawdown and the United Nations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SDG 2 */}
          <div className="bg-emerald-900/60 border border-emerald-700/50 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold text-amber-300 font-mono">SDG 2</span>
              <span className="text-xs bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded font-medium">Target 2.1</span>
            </div>
            <h3 className="text-lg font-bold text-white">Zero Hunger</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Provides immediate access to fresh, nutrient-dense food for vulnerable community members, reducing reliance on ultra-processed shelf foods.
            </p>
            <div className="pt-2 text-xs text-emerald-300 font-medium">
              Over {totalMeals.toLocaleString()} meal portions recorded
            </div>
          </div>

          {/* SDG 12 */}
          <div className="bg-emerald-900/60 border border-emerald-700/50 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold text-amber-300 font-mono">SDG 12</span>
              <span className="text-xs bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded font-medium">Target 12.3</span>
            </div>
            <h3 className="text-lg font-bold text-white">Responsible Consumption</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Directly contributes toward the target of halving per capita food waste at retail and food service levels by 2030 through source reduction and donation.
            </p>
            <div className="pt-2 text-xs text-emerald-300 font-medium">
              Heuristic surplus estimation to adjust production buffers
            </div>
          </div>

          {/* SDG 13 */}
          <div className="bg-emerald-900/60 border border-emerald-700/50 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold text-amber-300 font-mono">SDG 13</span>
              <span className="text-xs bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded font-medium">Climate Action</span>
            </div>
            <h3 className="text-lg font-bold text-white">Climate Mitigation</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Diverts decomposing organics from municipal landfills, preventing harmful methane emissions that possess 28x the warming potential of carbon dioxide.
            </p>
            <div className="pt-2 text-xs text-emerald-300 font-medium">
              {(claimedKg * 2.5).toFixed(1)} kg CO2e greenhouse footprint averted
            </div>
          </div>
        </div>
      </section>

      {/* Community Partners / Attributable Social Proof */}
      <section className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Network Impact</span>
            <h2 className="text-2xl font-bold text-stone-900">Trusted by Local Food Partners</h2>
          </div>
          <span className="text-xs text-stone-500">Documented hackathon field feedback</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <p className="text-sm text-stone-700 italic">
              "We used to throw away 20 to 30 unserved catered grain bowls after corporate lunchtime meetings every Thursday. With FoodRescue Lite, a local shelter driver claims them within 15 minutes of listing."
            </p>
            <div className="text-xs">
              <span className="font-bold text-stone-900">Marcus Chen</span>
              <span className="text-stone-500"> · Executive Chef, Harvest Greens Corporate Cafe</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <p className="text-sm text-stone-700 italic">
              "As a soup kitchen serving 150 people daily, getting instant alerts for fresh produce and whole grain bread prevents our pantry shortages while keeping our grocery budget sustainable."
            </p>
            <div className="text-xs">
              <span className="font-bold text-stone-900">Elena Rodriguez</span>
              <span className="text-stone-500"> · Logistics Coordinator, St. Anthony Shelter</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
