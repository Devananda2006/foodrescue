import { Donation } from '../types/food';

// Helper to create dates relative to current time
const getFutureISO = (hoursAhead: number) => {
  return new Date(Date.now() + hoursAhead * 60 * 60 * 1000).toISOString();
};

const getPastISO = (hoursAgo: number) => {
  return new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
};

export const INITIAL_DONATIONS: Donation[] = [
  {
    id: 'don-001',
    title: 'Nutritious Mediterranean Grain Bowls & Pasta',
    category: 'cooked',
    quantityKg: 18.5,
    estimatedPortions: 42,
    donorName: 'Harvest Greens Corporate Cafe',
    donorContact: '+1 (555) 234-8890',
    location: '450 Mission St, 4th Floor Kitchen',
    area: 'Downtown Financial',
    prepTime: getPastISO(2),
    pickupDeadline: getFutureISO(3.5),
    storageType: 'refrigerated',
    safetyConfirmed: true,
    notes: 'Individually packed in compostable kraft bowls. Chilled immediately at 3°C after 1:30 PM lunch buffet.',
    imageUrl: '/src/assets/images/prepared_meals_catering_1792856833304.jpg',
    status: 'available',
    createdAt: getPastISO(2.5),
  },
  {
    id: 'don-002',
    title: 'Artisan Sourdough Loaves & Croissants',
    category: 'bakery',
    quantityKg: 24.0,
    estimatedPortions: 60,
    donorName: 'Golden Crust Artisan Bakery',
    donorContact: '+1 (555) 789-1122',
    location: '128 Valencia St, Alley Loading Dock',
    area: 'Mission District',
    prepTime: getPastISO(5),
    pickupDeadline: getFutureISO(5),
    storageType: 'room_temp',
    safetyConfirmed: true,
    notes: 'Baked fresh this morning. Includes 16 country sourdough loaves and 30 assorted breakfast pastries in clean bakery boxes.',
    imageUrl: '/src/assets/images/artisan_bakery_surplus_1792856834314.jpg',
    status: 'available',
    createdAt: getPastISO(4),
  },
  {
    id: 'don-003',
    title: 'Organic Bell Peppers, Heirloom Tomatoes & Greens',
    category: 'produce',
    quantityKg: 35.0,
    estimatedPortions: 85,
    donorName: 'Valley Sunrise Organic Co-op',
    donorContact: '+1 (555) 345-6677',
    location: '820 4th Ave, Bay B',
    area: 'Warehouse District',
    prepTime: getPastISO(8),
    pickupDeadline: getFutureISO(14),
    storageType: 'refrigerated',
    safetyConfirmed: true,
    notes: 'Surplus harvest crates from morning wholesale delivery. High grade produce, perfect for community soup kitchen meal prep.',
    imageUrl: '/src/assets/images/fresh_farm_produce_1792856833824.jpg',
    status: 'available',
    createdAt: getPastISO(7),
  },
  {
    id: 'don-004',
    title: 'Roasted Chicken & Quinoa Dinner Trays',
    category: 'cooked',
    quantityKg: 15.0,
    estimatedPortions: 35,
    donorName: 'Bayview Executive Catering',
    donorContact: '+1 (555) 901-2244',
    location: '710 Howard St, Catering Entrance',
    area: 'Downtown Financial',
    prepTime: getPastISO(3),
    pickupDeadline: getFutureISO(2.0),
    storageType: 'insulated_hot',
    safetyConfirmed: true,
    notes: 'Prepared for executive lunch summit. Held in commercial thermal carriers at >63°C. Ready for immediate pickup.',
    status: 'available',
    createdAt: getPastISO(2.8),
  },
  {
    id: 'don-005',
    title: 'Greek Yogurt, Oat Milk & Whole Milk Cartons',
    category: 'dairy',
    quantityKg: 20.0,
    estimatedPortions: 50,
    donorName: 'Cornerstone University Dining',
    donorContact: '+1 (555) 432-8811',
    location: 'Student Union Hall, Dock 2',
    area: 'University Heights',
    prepTime: getPastISO(6),
    pickupDeadline: getFutureISO(20),
    storageType: 'refrigerated',
    safetyConfirmed: true,
    notes: 'Unopened dairy items from weekend cafeteria stock rotation. Kept steadily at 2°C with 7+ days before expiration.',
    status: 'claimed',
    claimedBy: 'St. Anthony Community Shelter',
    claimedAt: getPastISO(1),
    claimedPhone: '+1 (555) 601-9922',
    claimedNotes: 'Volunteer van arriving at 4:30 PM with cooler bags.',
    createdAt: getPastISO(5),
  },
  {
    id: 'don-006',
    title: 'Organic Whole Grain Pantry Staples & Canned Beans',
    category: 'pantry',
    quantityKg: 42.0,
    estimatedPortions: 110,
    donorName: 'City Green Grocery Market',
    donorContact: '+1 (555) 887-3301',
    location: '1040 Folsom St',
    area: 'South of Market',
    prepTime: getPastISO(24),
    pickupDeadline: getPastISO(2),
    storageType: 'room_temp',
    safetyConfirmed: true,
    notes: 'Sealed pantry items with 3+ months remaining shelf life.',
    status: 'delivered',
    claimedBy: 'Mercy Family Food Pantry',
    claimedAt: getPastISO(6),
    claimedPhone: '+1 (555) 777-0099',
    claimedNotes: 'Delivered and distributed to 28 families.',
    deliveredAt: getPastISO(1.5),
    createdAt: getPastISO(20),
  },
];

const LOCAL_STORAGE_KEY = 'foodrescue_lite_donations_v1';

export const loadStoredDonations = (): Donation[] => {
  if (typeof window === 'undefined') return INITIAL_DONATIONS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      saveStoredDonations(INITIAL_DONATIONS);
      return INITIAL_DONATIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_DONATIONS;
  } catch (err) {
    console.error('Error loading donations from storage:', err);
    return INITIAL_DONATIONS;
  }
};

export const saveStoredDonations = (donations: Donation[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(donations));
  } catch (err) {
    console.error('Error saving donations to storage:', err);
  }
};

export const resetStoredDonations = (): Donation[] => {
  if (typeof window === 'undefined') return INITIAL_DONATIONS;
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    saveStoredDonations(INITIAL_DONATIONS);
  } catch (err) {
    console.error('Error resetting donations:', err);
  }
  return INITIAL_DONATIONS;
};
