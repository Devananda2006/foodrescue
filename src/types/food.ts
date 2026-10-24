export type FoodCategory =
  | 'cooked'
  | 'bakery'
  | 'produce'
  | 'dairy'
  | 'pantry'
  | 'beverages';

export type StorageType =
  | 'room_temp'
  | 'refrigerated'
  | 'frozen'
  | 'insulated_hot';

export type DonationStatus = 'available' | 'claimed' | 'delivered';

export interface Donation {
  id: string;
  title: string;
  category: FoodCategory;
  quantityKg: number;
  estimatedPortions: number;
  donorName: string;
  donorContact: string;
  location: string;
  area: string;
  prepTime: string;
  pickupDeadline: string;
  storageType: StorageType;
  safetyConfirmed: boolean;
  notes?: string;
  imageUrl?: string;
  status: DonationStatus;
  claimedBy?: string;
  claimedAt?: string;
  claimedPhone?: string;
  claimedNotes?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface RecipientFilterPreference {
  orgName: string;
  orgType: string;
  targetArea: string;
  capacityPortions: number;
  preferredCategory: string;
  urgencyOnly: boolean;
}

export interface MatchRecommendation {
  donation: Donation;
  matchScore: number; // 0 to 100
  reasons: string[];
  urgencyLevel: 'high' | 'medium' | 'normal';
}

export interface SurplusCalculationInput {
  eventType: string;
  mealsPrepared: number;
  mealsServed: number;
  costPerMeal: number;
  foodType: string;
}

export interface SurplusCalculationResult {
  surplusMeals: number;
  surplusPercentage: number;
  estimatedKg: number;
  co2SavedKg: number;
  waterSavedLiters: number;
  financialLoss: number;
  recommendedPrepAdjustment: number;
  advice: string[];
}
