import { FoodCategory, StorageType, DonationStatus } from '../types/food';

export const CATEGORY_LABELS: Record<FoodCategory, string> = {
  cooked: 'Cooked Meals',
  bakery: 'Bakery & Pastries',
  produce: 'Fresh Farm Produce',
  dairy: 'Dairy & Plant Milks',
  pantry: 'Packaged & Pantry',
  beverages: 'Beverages & Juices',
};

export const STORAGE_LABELS: Record<StorageType, string> = {
  room_temp: 'Ambient / Shelf Stable',
  refrigerated: 'Chilled (0°C – 4°C)',
  frozen: 'Frozen (-18°C)',
  insulated_hot: 'Hot Holding (>60°C)',
};

export const STATUS_LABELS: Record<DonationStatus, string> = {
  available: 'Available for Pickup',
  claimed: 'Claimed (Pickup Pending)',
  delivered: 'Delivered & Distributed',
};

export const formatDeadlineTime = (isoString: string): { text: string; isUrgent: boolean; isExpired: boolean } => {
  const target = new Date(isoString).getTime();
  const now = Date.now();
  const diffMs = target - now;

  if (diffMs <= 0) {
    return { text: 'Expired', isUrgent: true, isExpired: true };
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const remainingMinutes = diffMinutes % 60;

  if (diffHours < 1) {
    return {
      text: `${remainingMinutes}m left`,
      isUrgent: true,
      isExpired: false,
    };
  }

  if (diffHours < 4) {
    return {
      text: `${diffHours}h ${remainingMinutes}m left`,
      isUrgent: true,
      isExpired: false,
    };
  }

  if (diffHours < 24) {
    return {
      text: `${diffHours} hours left`,
      isUrgent: false,
      isExpired: false,
    };
  }

  const days = Math.floor(diffHours / 24);
  return {
    text: `${days} day${days > 1 ? 's' : ''} left`,
    isUrgent: false,
    isExpired: false,
  };
};

export const formatDateTime = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
};
