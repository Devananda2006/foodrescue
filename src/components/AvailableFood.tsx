import React, { useState, useMemo } from 'react';
import { Donation, FoodCategory, DonationStatus } from '../types/food';
import { CATEGORY_LABELS, STORAGE_LABELS, formatDeadlineTime, formatDateTime } from '../utils/formatters';
import { Search, MapPin, Clock, Building, CheckCircle2, Truck, AlertCircle, Sparkles, Filter, ChevronRight } from 'lucide-react';

interface AvailableFoodProps {
  donations: Donation[];
  onOpenClaimModal: (donation: Donation) => void;
  onConfirmDelivered: (donationId: string) => void;
  onNavigateToDonate: () => void;
}

export const AvailableFood: React.FC<AvailableFoodProps> = ({
  donations,
  onOpenClaimModal,
  onConfirmDelivered,
  onNavigateToDonate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'quantity' | 'newest'>('deadline');

  const filteredDonations = useMemo(() => {
    return donations
      .filter((d) => {
        // Search filter
        const matchSearch =
          d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.area.toLowerCase().includes(searchTerm.toLowerCase());

        // Category filter
        const matchCategory =
          selectedCategory === 'all' || d.category === selectedCategory;

        // Status filter
        const matchStatus =
          selectedStatus === 'all' || d.status === selectedStatus;

        return matchSearch && matchCategory && matchStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          // Available items first, sorted by pickup deadline
          return new Date(a.pickupDeadline).getTime() - new Date(b.pickupDeadline).getTime();
        }
        if (sortBy === 'quantity') {
          return b.quantityKg - a.quantityKg;
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
  }, [donations, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'cooked', label: 'Cooked Meals' },
    { id: 'bakery', label: 'Bakery' },
    { id: 'produce', label: 'Fresh Produce' },
    { id: 'dairy', label: 'Dairy' },
    { id: 'pantry', label: 'Pantry' },
  ];

  return (
    <div className="py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Active Community Listings</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
            Available Surplus Food
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Browse wholesome surplus ready for pickup by verified food banks, shelters, and relief partners.
          </p>
        </div>
        <button
          onClick={onNavigateToDonate}
          className="self-start sm:self-auto px-4 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-all whitespace-nowrap"
        >
          + Donate New Surplus
        </button>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by food name, donor cafe, or neighborhood..."
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="all">All Statuses ({donations.length})</option>
              <option value="available">Available ({donations.filter((d) => d.status === 'available').length})</option>
              <option value="claimed">Claimed ({donations.filter((d) => d.status === 'claimed').length})</option>
              <option value="delivered">Delivered ({donations.filter((d) => d.status === 'delivered').length})</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="deadline">Sort: Pickup Deadline (Soonest)</option>
              <option value="quantity">Sort: Largest Quantity (kg)</option>
              <option value="newest">Sort: Newly Listed</option>
            </select>
          </div>
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-stone-400 font-medium mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => {
            const count =
              cat.id === 'all'
                ? donations.length
                : donations.filter((d) => d.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Donations Grid */}
      {filteredDonations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-800">No Food Donations Found</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            No active listings match your selected search keywords and filter criteria. Try resetting your filters or list a new donation.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
            >
              Reset Filters
            </button>
            <button
              onClick={onNavigateToDonate}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg"
            >
              Post a Food Donation
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonations.map((item) => {
            const deadlineInfo = formatDeadlineTime(item.pickupDeadline);
            const isClaimed = item.status === 'claimed';
            const isDelivered = item.status === 'delivered';
            const isAvailable = item.status === 'available';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  isAvailable
                    ? 'border-stone-200 hover:border-emerald-300'
                    : isClaimed
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-stone-200 opacity-90'
                }`}
              >
                {/* Visual Thumbnail */}
                <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-stone-100 text-stone-400 p-4 text-center">
                      <Building className="w-8 h-8 text-emerald-800/40 mb-1" />
                      <span className="text-xs font-medium text-stone-500">{item.title}</span>
                    </div>
                  )}

                  {/* Status Overlay Tag */}
                  <div className="absolute top-3 right-3">
                    {isAvailable && (
                      <span className="px-2.5 py-1 text-xs font-bold bg-white text-emerald-900 rounded-md shadow-xs border border-emerald-200">
                        Available
                      </span>
                    )}
                    {isClaimed && (
                      <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-900 rounded-md shadow-xs border border-amber-300">
                        Claimed
                      </span>
                    )}
                    {isDelivered && (
                      <span className="px-2.5 py-1 text-xs font-bold bg-stone-100 text-stone-700 rounded-md shadow-xs border border-stone-300">
                        Delivered
                      </span>
                    )}
                  </div>

                  {/* Category Chip */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-0.5 text-xs font-medium bg-stone-900/80 text-white rounded backdrop-blur-xs">
                      {CATEGORY_LABELS[item.category]}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Metadata text with subtle separators */}
                    <div className="text-xs text-stone-600 flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-emerald-900 text-sm">{item.quantityKg} kg</span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="font-medium text-stone-700">~{item.estimatedPortions} meals</span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span>{STORAGE_LABELS[item.storageType]}</span>
                    </div>

                    {/* Donor and Location */}
                    <div className="space-y-1 pt-1 text-xs text-stone-600">
                      <div className="flex items-center gap-1.5 font-medium text-stone-800">
                        <Building className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{item.donorName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{item.location} ({item.area})</span>
                      </div>
                    </div>

                    {/* Notes if available */}
                    {item.notes && (
                      <p className="text-xs text-stone-500 bg-stone-50 p-2 rounded-lg border border-stone-100 line-clamp-2">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  {/* Deadline & Claim Status footer */}
                  <div className="pt-3 border-t border-stone-100 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" /> Pickup Deadline:
                      </span>
                      <span
                        className={`font-semibold tabular-nums ${
                          deadlineInfo.isUrgent
                            ? 'text-red-700 bg-red-50 px-1.5 py-0.5 rounded'
                            : 'text-stone-800'
                        }`}
                      >
                        {deadlineInfo.text}
                      </span>
                    </div>

                    {/* Claim Details info if claimed */}
                    {isClaimed && (
                      <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                        <div className="font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                          <span>Reserved by: {item.claimedBy}</span>
                        </div>
                        {item.claimedPhone && (
                          <p className="text-amber-800">Contact: {item.claimedPhone}</p>
                        )}
                        {item.claimedNotes && (
                          <p className="text-amber-700 italic">"{item.claimedNotes}"</p>
                        )}
                      </div>
                    )}

                    {/* Delivered confirmation notice */}
                    {isDelivered && (
                      <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 space-y-0.5">
                        <div className="font-semibold text-stone-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Distributed by: {item.claimedBy}</span>
                        </div>
                        <p className="text-stone-500">Completed at {formatDateTime(item.deliveredAt || '')}</p>
                      </div>
                    )}

                    {/* Card Actions */}
                    <div>
                      {isAvailable && (
                        <button
                          onClick={() => onOpenClaimModal(item)}
                          className="w-full py-2.5 px-3 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <span>Claim Donation</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {isClaimed && (
                        <button
                          onClick={() => onConfirmDelivered(item.id)}
                          className="w-full py-2 px-3 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-emerald-300"
                        >
                          <Truck className="w-3.5 h-3.5 text-emerald-800" />
                          <span>Confirm Pickup & Delivered</span>
                        </button>
                      )}

                      {isDelivered && (
                        <div className="py-2 text-center text-xs font-medium text-stone-400 bg-stone-100 rounded-xl">
                          Completed Donation
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
