import { SurplusCalculationInput, SurplusCalculationResult } from '../types/food';

export const calculateSurplus = (input: SurplusCalculationInput): SurplusCalculationResult => {
  const prepared = Math.max(0, Number(input.mealsPrepared) || 0);
  const served = Math.max(0, Number(input.mealsServed) || 0);
  const cost = Math.max(0, Number(input.costPerMeal) || 3.5);

  const surplusMeals = Math.max(0, prepared - served);
  const surplusPercentage = prepared > 0 ? (surplusMeals / prepared) * 100 : 0;

  // Average weight per meal portion is approximately 0.42 kg
  const estimatedKg = Number((surplusMeals * 0.42).toFixed(1));

  // 1 kg of food waste ≈ 2.5 kg CO2e greenhouse emissions (UN FAO estimate)
  const co2SavedKg = Number((estimatedKg * 2.5).toFixed(1));

  // 1 kg of food waste ≈ 1,000 liters of virtual agricultural water embedded
  const waterSavedLiters = Math.round(estimatedKg * 1000);

  // Financial loss from surplus meals
  const financialLoss = Number((surplusMeals * cost).toFixed(2));

  // Recommended buffer adjustment
  let recommendedPrepAdjustment = 0;
  const advice: string[] = [];

  if (surplusPercentage > 25) {
    recommendedPrepAdjustment = Math.min(20, Math.round(surplusPercentage * 0.65));
    advice.push(`Significant over-production detected (${surplusPercentage.toFixed(1)}%). Reduce baseline prep batch size by ${recommendedPrepAdjustment}%.`);
    advice.push('Implement progressive staging: Prepare 70% in primary prep, and batch-finish remaining 30% only as orders or headcounts confirm.');
    advice.push('Pre-schedule donation pickup 2 hours before closing to eliminate overnight holding risk.');
  } else if (surplusPercentage > 10) {
    recommendedPrepAdjustment = Math.round(surplusPercentage * 0.5);
    advice.push(`Moderate surplus rate (${surplusPercentage.toFixed(1)}%). Fine-tune portion buffer downward by ${recommendedPrepAdjustment}%.`);
    advice.push('Adopt modular menu design where unserved raw vegetables and grains can be quickly blast-chilled for donation.');
  } else if (surplusPercentage > 0) {
    recommendedPrepAdjustment = Math.max(2, Math.round(surplusPercentage * 0.4));
    advice.push(`Lean kitchen operation (${surplusPercentage.toFixed(1)}% variance). Maintain buffer but consider listing remaining portions for immediate rescue.`);
  } else {
    advice.push('Zero surplus recorded: Demand matched supply perfectly! Ensure portion satisfaction was met across all guests.');
  }

  return {
    surplusMeals,
    surplusPercentage,
    estimatedKg,
    co2SavedKg,
    waterSavedLiters,
    financialLoss,
    recommendedPrepAdjustment,
    advice,
  };
};
