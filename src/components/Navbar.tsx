import React from 'react';
import { Leaf, PlusCircle, AlertCircle, RotateCcw } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  availableCount: number;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  availableCount,
  onResetDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Overview' },
    { id: 'available', label: `Available Food (${availableCount})` },
    { id: 'donate', label: 'Donate Food' },
    { id: 'matching', label: 'Smart Matching' },
    { id: 'estimator', label: 'Surplus Estimator' },
    { id: 'impact', label: 'Impact Dashboard' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Prototype & Safety Notice Banner */}
      <div className="bg-emerald-900 text-emerald-50 px-4 py-1.5 text-xs text-center font-medium flex items-center justify-center gap-2">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-emerald-300" />
        <span>
          <strong className="font-semibold">Hackathon Prototype:</strong> Food safety & local safe-handling guidelines must be verified before actual physical food redistribution.
        </span>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 text-left text-emerald-950 font-bold text-xl tracking-tight whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white shadow-sm">
              <Leaf className="w-4 h-4" />
            </div>
            <span>FoodRescue Lite</span>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
                    isActive
                      ? 'text-emerald-900 font-semibold border-b-2 border-emerald-800'
                      : 'hover:text-emerald-800'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Reset Demo */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={onResetDemo}
              title="Reset sample records to initial state"
              className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
            <button
              onClick={() => setCurrentTab('donate')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-all hover:shadow whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Donate Food</span>
            </button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              aria-label="Toggle navigation"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm rounded-lg font-medium ${
                currentTab === item.id
                  ? 'bg-emerald-50 text-emerald-900 font-semibold'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
            <button
              onClick={() => {
                onResetDemo();
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-stone-600 border border-stone-200 rounded-lg"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
            <button
              onClick={() => {
                setCurrentTab('donate');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-xs font-semibold text-center text-white bg-emerald-800 rounded-lg"
            >
              + Donate Food
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
