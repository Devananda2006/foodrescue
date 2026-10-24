import React, { useState } from 'react';
import { Donation, FoodCategory, StorageType } from '../types/food';
import { CATEGORY_LABELS, STORAGE_LABELS } from '../utils/formatters';
import { PlusCircle, Clock, MapPin, Building, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

interface DonateFoodProps {
  onAddDonation: (donation: Donation) => void;
  onNavigateToAvailable: () => void;
}

export const DonateFood: React.FC<DonateFoodProps> = ({ onAddDonation, onNavigateToAvailable }) => {
  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FoodCategory>('cooked');
  const [quantityKg, setQuantityKg] = useState<string>('12.5');
  const [estimatedPortions, setEstimatedPortions] = useState<string>('30');
  const [donorName, setDonorName] = useState('');
  const [donorContact, setDonorContact] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('Downtown Financial');
  
  // Default prep time to 1 hour ago
  const now = new Date();
  const defaultPrep = new Date(now.getTime() - 60 * 60 * 1000).toISOString().slice(0, 16);
  // Default deadline to 4 hours from now
  const defaultDeadline = new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const [prepTime, setPrepTime] = useState(defaultPrep);
  const [pickupDeadline, setPickupDeadline] = useState(defaultDeadline);
  const [storageType, setStorageType] = useState<StorageType>('refrigerated');
  const [safetyConfirmed, setSafetyConfirmed] = useState(true);
  const [notes, setNotes] = useState('');

  // Status and validation feedback
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdItem, setCreatedItem] = useState<Donation | null>(null);

  // Auto-calculate portions when kg changes (approx 0.4kg per meal)
  const handleKgChange = (val: string) => {
    setQuantityKg(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      setEstimatedPortions(Math.round(parsed / 0.42).toString());
    }
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!title.trim()) {
      errs.title = 'Please enter a descriptive food title.';
    }

    const numKg = parseFloat(quantityKg);
    if (isNaN(numKg) || numKg <= 0) {
      errs.quantityKg = 'Quantity must be greater than 0 kg.';
    }

    const numPortions = parseInt(estimatedPortions, 10);
    if (isNaN(numPortions) || numPortions <= 0) {
      errs.estimatedPortions = 'Portions must be at least 1.';
    }

    if (!donorName.trim()) {
      errs.donorName = 'Donor organization or business name is required.';
    }

    if (!donorContact.trim()) {
      errs.donorContact = 'Contact phone number is required for coordinating pickup.';
    }

    if (!location.trim()) {
      errs.location = 'Pickup address is required.';
    }

    if (!pickupDeadline) {
      errs.pickupDeadline = 'Please set a pickup deadline.';
    } else {
      const deadlineDate = new Date(pickupDeadline).getTime();
      const currentDate = Date.now();
      if (deadlineDate <= currentDate) {
        errs.pickupDeadline = 'Pickup deadline cannot be in the past. Must be a future time.';
      }
    }

    if (!safetyConfirmed) {
      errs.safetyConfirmed = 'You must confirm that food safety and temperature hygiene standards have been met.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Pick image based on category if available
    let assignedImage: string | undefined = undefined;
    if (category === 'cooked') {
      assignedImage = '/src/assets/images/prepared_meals_catering_1792856833304.jpg';
    } else if (category === 'bakery') {
      assignedImage = '/src/assets/images/artisan_bakery_surplus_1792856834314.jpg';
    } else if (category === 'produce') {
      assignedImage = '/src/assets/images/fresh_farm_produce_1792856833824.jpg';
    }

    const newDonation: Donation = {
      id: `don-${Date.now()}`,
      title: title.trim(),
      category,
      quantityKg: parseFloat(quantityKg),
      estimatedPortions: parseInt(estimatedPortions, 10),
      donorName: donorName.trim(),
      donorContact: donorContact.trim(),
      location: location.trim(),
      area,
      prepTime: new Date(prepTime).toISOString(),
      pickupDeadline: new Date(pickupDeadline).toISOString(),
      storageType,
      safetyConfirmed: true,
      notes: notes.trim() || undefined,
      imageUrl: assignedImage,
      status: 'available',
      createdAt: new Date().toISOString(),
    };

    onAddDonation(newDonation);
    setCreatedItem(newDonation);
    setIsSuccess(true);
  };

  const handleResetForm = () => {
    setTitle('');
    setQuantityKg('15');
    setEstimatedPortions('35');
    setNotes('');
    setIsSuccess(false);
    setCreatedItem(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-4">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Surplus Food Rescue Listing</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
          Donate Edible Surplus Food
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          List surplus from your restaurant, grocery store, bakery, or catering event to immediately connect with verified local food pantries and shelters.
        </p>
      </div>

      {/* Success Notification Banner */}
      {isSuccess && createdItem && (
        <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-950">Donation Listed Successfully!</h3>
              <p className="text-xs sm:text-sm text-emerald-800 mt-0.5">
                "{createdItem.title}" ({createdItem.quantityKg} kg · ~{createdItem.estimatedPortions} portions) is now live on the Available Food board for community claiming.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-emerald-200">
            <button
              onClick={onNavigateToAvailable}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg inline-flex items-center gap-1.5 shadow-xs"
            >
              <span>View in Available Food</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetForm}
              className="px-4 py-2 text-xs font-medium text-emerald-900 bg-white border border-emerald-300 hover:bg-emerald-100 rounded-lg"
            >
              List Another Donation
            </button>
          </div>
        </div>
      )}

      {/* Main Donation Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Section 1: Food Description & Category */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-900 pb-2 border-b border-stone-100 flex items-center gap-2">
            <span>01. Food Details & Classification</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Food Item Title / Description *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              placeholder="e.g. Fresh Artisan Sourdough Loaves & Croissants, or Mediterranean Grain Bowls"
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-stone-300 focus:ring-emerald-700 focus:border-emerald-700'
              }`}
            />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Storage & Temperature *
              </label>
              <select
                value={storageType}
                onChange={(e) => setStorageType(e.target.value as StorageType)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {Object.entries(STORAGE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Total Quantity (kg) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  required
                  value={quantityKg}
                  onChange={(e) => handleKgChange(e.target.value)}
                  placeholder="e.g. 15.0"
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.quantityKg
                      ? 'border-red-400 focus:ring-red-300'
                      : 'border-stone-300 focus:ring-emerald-700 focus:border-emerald-700'
                  }`}
                />
                <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-medium">kg</span>
              </div>
              {errors.quantityKg && <p className="text-xs text-red-600 mt-1">{errors.quantityKg}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Estimated Meal Portions *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  required
                  value={estimatedPortions}
                  onChange={(e) => setEstimatedPortions(e.target.value)}
                  placeholder="e.g. 35"
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.estimatedPortions
                      ? 'border-red-400 focus:ring-red-300'
                      : 'border-stone-300 focus:ring-emerald-700 focus:border-emerald-700'
                  }`}
                />
                <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-medium">meals</span>
              </div>
              {errors.estimatedPortions && <p className="text-xs text-red-600 mt-1">{errors.estimatedPortions}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Timing & Pickup Deadlines */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-900 pb-2 border-b border-stone-100 flex items-center gap-2">
            <span>02. Preparation Time & Strict Pickup Deadline</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Preparation / Packaging Time *
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  required
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
              <p className="text-xs text-stone-500 mt-1">When the food was cooked, baked, or harvested.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Pickup Deadline (Must be in the future) *
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  required
                  value={pickupDeadline}
                  onChange={(e) => {
                    setPickupDeadline(e.target.value);
                    if (errors.pickupDeadline) setErrors((prev) => ({ ...prev, pickupDeadline: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.pickupDeadline
                      ? 'border-red-400 focus:ring-red-300'
                      : 'border-stone-300 focus:ring-emerald-700 focus:border-emerald-700'
                  }`}
                />
              </div>
              {errors.pickupDeadline ? (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.pickupDeadline}</p>
              ) : (
                <p className="text-xs text-stone-500 mt-1">Hard cutoff when food must be collected.</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Donor Organization & Pickup Location */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-900 pb-2 border-b border-stone-100 flex items-center gap-2">
            <span>03. Donor Information & Location</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Donor / Organization Name *
              </label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => {
                  setDonorName(e.target.value);
                  if (errors.donorName) setErrors((prev) => ({ ...prev, donorName: '' }));
                }}
                placeholder="e.g. Green Leaf Bistro or Grand Hotel Banquets"
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.donorName
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-stone-300 focus:ring-emerald-700 focus:border-emerald-700'
                }`}
              />
              {errors.donorName && <p className="text-xs text-red-600 mt-1">{errors.donorName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Contact Phone Number *
              </label>
              <input
                type="text"
                required
                value={donorContact}
                onChange={(e) => {
                  setDonorContact(e.target.value);
                  if (errors.donorContact) setErrors((prev) => ({ ...prev, donorContact: '' }));
                }}
                placeholder="e.g. +1 (555) 342-9988"
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.donorContact
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-stone-300 focus:ring-emerald-700 focus:border-emerald-700'
                }`}
              />
              {errors.donorContact && <p className="text-xs text-red-600 mt-1">{errors.donorContact}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Pickup Address / Specific Loading Dock *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
                }}
                placeholder="e.g. 520 Main Street, Rear Kitchen Dock 3"
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.location
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-stone-300 focus:ring-emerald-700 focus:border-emerald-700'
                }`}
              />
              {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                City District / Area *
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="Downtown Financial">Downtown Financial</option>
                <option value="Mission District">Mission District</option>
                <option value="Warehouse District">Warehouse District</option>
                <option value="University Heights">University Heights</option>
                <option value="South of Market">South of Market</option>
                <option value="Westside Suburbs">Westside Suburbs</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Allergen & Packaging Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Contains gluten; dairy-free; packaged in disposable aluminum pans; driver should bring cart."
              className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
            />
          </div>
        </div>

        {/* Section 4: Food Safety & Hygiene Commitment */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                Food Safety & Good Samaritan Protection Confirmation
              </h3>
              <p className="text-xs text-stone-600">
                Food donors are protected under standard Good Samaritan food donation laws when donating apparently wholesome food in good faith. Donated items must comply with safe temperature limits.
              </p>
            </div>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={safetyConfirmed}
              onChange={(e) => {
                setSafetyConfirmed(e.target.checked);
                if (errors.safetyConfirmed) setErrors((prev) => ({ ...prev, safetyConfirmed: '' }));
              }}
              className="mt-1 h-4 w-4 rounded border-stone-300 text-emerald-700 focus:ring-emerald-600"
            />
            <span className="text-xs font-medium text-stone-800">
              I certify that this food was handled under commercial food safety conditions, stored at correct temperatures, and is wholesome and safe for immediate human consumption. *
            </span>
          </label>
          {errors.safetyConfirmed && <p className="text-xs text-red-600 font-semibold">{errors.safetyConfirmed}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={handleResetForm}
            className="px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg border border-stone-300 hover:bg-stone-50"
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-all hover:shadow"
          >
            Publish Surplus Food Donation
          </button>
        </div>
      </form>
    </div>
  );
};
