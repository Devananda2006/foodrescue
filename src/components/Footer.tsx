import React from 'react';
import { Leaf, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-stone-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                <Leaf className="w-4 h-4" />
              </div>
              <span>FoodRescue Lite</span>
            </div>
            <p className="text-xs text-stone-400 max-w-sm">
              An open-source prototype connecting food donors with non-profit recipients to eliminate edible waste and lower methane emissions.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs font-medium text-stone-300">
            <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
              Overview
            </button>
            <button onClick={() => onNavigate('available')} className="hover:text-white transition-colors">
              Available Food
            </button>
            <button onClick={() => onNavigate('donate')} className="hover:text-white transition-colors">
              Donate Food
            </button>
            <button onClick={() => onNavigate('matching')} className="hover:text-white transition-colors">
              Smart Matching
            </button>
            <button onClick={() => onNavigate('estimator')} className="hover:text-white transition-colors">
              Surplus Estimator
            </button>
            <button onClick={() => onNavigate('impact')} className="hover:text-white transition-colors">
              Impact Dashboard
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} FoodRescue Lite · Developed for Sustainability Hackathon.
          </p>
          <p className="flex items-center gap-1">
            Built for SDG 2, 12 & 13 Climate Action
          </p>
        </div>
      </div>
    </footer>
  );
};
