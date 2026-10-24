import React, { useState } from 'react';
import { Donation } from '../types/food';
import { X, CheckCircle2, Clock, MapPin, Building, Phone, AlertTriangle } from 'lucide-react';
import { formatDateTime } from '../utils/formatters';

interface ClaimModalProps {
  donation: Donation | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmClaim: (
    donationId: string,
    recipientInfo: { claimedBy: string; claimedPhone: string; claimedNotes: string }
  ) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  donation,
  isOpen,
  onClose,
  onConfirmClaim,
}) => {
  const [claimedBy, setClaimedBy] = useState('Hope Family Shelter');
  const [claimedPhone, setClaimedPhone] = useState('+1 (555) 432-1098');
  const [claimedNotes, setClaimedNotes] = useState('Volunteer driver will arrive with insulated cooler boxes in ~45 minutes.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !donation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimedBy.trim()) {
      setError('Recipient organization or individual name is required.');
      return;
    }
    if (!claimedPhone.trim()) {
      setError('Contact phone number is required for pickup coordination.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmClaim(donation.id, {
        claimedBy: claimedBy.trim(),
        claimedPhone: claimedPhone.trim(),
        claimedNotes: claimedNotes.trim(),
      });
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Claim Surplus Food Donation</h3>
            <p className="text-xs text-emerald-200">Confirm pickup commitment for this donation</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Donation Summary Card */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2">
            <h4 className="font-semibold text-emerald-950 text-sm">{donation.title}</h4>
            <div className="text-xs text-stone-600 flex flex-wrap gap-x-3 gap-y-1">
              <span className="flex items-center gap-1 font-medium text-emerald-800">
                {donation.quantityKg} kg · ~{donation.estimatedPortions} portions
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {donation.location}
              </span>
              <span className="flex items-center gap-1 text-amber-800">
                <Clock className="w-3.5 h-3.5" />
                Pickup before: {formatDateTime(donation.pickupDeadline)}
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form fields */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Recipient Organization or Name *
            </label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                required
                value={claimedBy}
                onChange={(e) => {
                  setClaimedBy(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Hope Community Shelter or Volunteer Name"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Contact Phone for Donor Coordination *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                required
                value={claimedPhone}
                onChange={(e) => {
                  setClaimedPhone(e.target.value);
                  setError('');
                }}
                placeholder="e.g. +1 (555) 000-0000"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Pickup ETA & Transportation Notes
            </label>
            <textarea
              rows={2}
              value={claimedNotes}
              onChange={(e) => setClaimedNotes(e.target.value)}
              placeholder="e.g. Van arrival time, thermal carrier equipment, driver contact"
              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 resize-none"
            />
          </div>

          {/* Safety & Commitment notice */}
          <div className="text-xs text-stone-500 bg-emerald-50/70 p-3 rounded-lg border border-emerald-100 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              By claiming, your organization pledges to pick up this surplus food prior to the specified deadline and maintain temperature hygiene.
            </span>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg border border-stone-300 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Confirming Claim...' : 'Confirm Claim & Reserve Food'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
