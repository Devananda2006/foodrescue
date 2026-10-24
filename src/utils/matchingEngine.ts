import { Donation, RecipientFilterPreference, MatchRecommendation } from '../types/food';

export const runRuleBasedMatching = (
  donations: Donation[],
  preferences: RecipientFilterPreference
): MatchRecommendation[] => {
  // Only match available donations
  const candidates = donations.filter((d) => d.status === 'available');

  const scoredResults: MatchRecommendation[] = candidates.map((donation) => {
    let score = 0;
    const reasons: string[] = [];

    // Factor 1: Location / Area Match (up to 30 pts)
    if (
      preferences.targetArea &&
      preferences.targetArea !== 'all' &&
      donation.area.toLowerCase().includes(preferences.targetArea.toLowerCase())
    ) {
      score += 30;
      reasons.push(`Exact geographic match: Located in ${donation.area}`);
    } else if (preferences.targetArea === 'all') {
      score += 15;
      reasons.push(`Open location criteria (${donation.area})`);
    } else {
      score += 5;
      reasons.push(`Alternative district: ${donation.area}`);
    }

    // Factor 2: Capacity & Portion alignment (up to 25 pts)
    const portionDiff = Math.abs(donation.estimatedPortions - preferences.capacityPortions);
    if (portionDiff <= 15) {
      score += 25;
      reasons.push(`Ideal batch size: ${donation.estimatedPortions} portions matches requested capacity (~${preferences.capacityPortions})`);
    } else if (portionDiff <= 35) {
      score += 18;
      reasons.push(`Manageable portion volume: ${donation.estimatedPortions} portions`);
    } else {
      score += 10;
      reasons.push(`Large quantity allocation: ${donation.estimatedPortions} portions`);
    }

    // Factor 3: Category Preference (up to 20 pts)
    if (
      preferences.preferredCategory &&
      preferences.preferredCategory !== 'all' &&
      donation.category === preferences.preferredCategory
    ) {
      score += 20;
      reasons.push(`Category priority: Matches requested food type (${donation.category.toUpperCase()})`);
    } else {
      score += 10;
      reasons.push(`Nutritional complement: ${donation.category} items`);
    }

    // Factor 4: Expiration & Urgency Window (up to 15 pts)
    const deadlineTime = new Date(donation.pickupDeadline).getTime();
    const hoursRemaining = (deadlineTime - Date.now()) / (1000 * 60 * 60);

    let urgencyLevel: 'high' | 'medium' | 'normal' = 'normal';

    if (hoursRemaining <= 0) {
      score = 0; // Expired, do not match
      reasons.push('Deadline already passed');
    } else if (hoursRemaining <= 3) {
      urgencyLevel = 'high';
      score += 15;
      reasons.push(`High urgency rescue: Pickup required within ${hoursRemaining.toFixed(1)} hours`);
    } else if (hoursRemaining <= 8) {
      urgencyLevel = 'medium';
      score += 10;
      reasons.push(`Same-day collection: Pickup deadline in ${hoursRemaining.toFixed(1)} hours`);
    } else {
      urgencyLevel = 'normal';
      score += 8;
      reasons.push(`Flexible pickup window: Valid for next ${hoursRemaining.toFixed(0)} hours`);
    }

    // Factor 5: Safety & Prepared packaging baseline (10 pts)
    if (donation.safetyConfirmed) {
      score += 10;
      reasons.push(`Food safety & cold-chain verified by donor`);
    }

    // Cap score at 100
    const finalScore = Math.min(100, Math.max(0, score));

    return {
      donation,
      matchScore: finalScore,
      reasons,
      urgencyLevel,
    };
  });

  // Filter out any expired or zero scores, then sort descending by matchScore
  return scoredResults
    .filter((r) => r.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
};
