import validDamageTypes from "./validDamageTypes.js";

/**
 * Utiltiy for calculating damage based on character data and damage incoming
 * @param {number} currentHP
 * @param {number} tempHP
 * @param {string[]} resistances
 * @param {string[]} immunities
 * @param {number} damage
 * @param {number} damageType
 * @returns { { remainingHp: number, remainingTempHp: number} }
 * object containing character's remaining hp and remaining temp hp after calculation
 */
function damageCalculation(
  currentHP,
  tempHP,
  resistances,
  immunities,
  damage,
  damageType,
) {
  // Check if damage type is valid, then check against resistances/immunities
  if (!validDamageTypes.includes(damageType)) {
    throw new Error("Invalid damage type");
  } else if (resistances.includes(damageType)) {
    damage = Math.floor(damage / 2);
  } else if (immunities.includes(damageType)) {
    damage = 0;
  }
  let remainingHp;
  let remainingTempHp;
  // check if tempHp would persist after damage, calculate accordingly
  if (tempHP >= damage) {
    remainingTempHp = tempHP - damage;
    remainingHp = currentHP;
  } else {
    remainingHp = currentHP - (damage - tempHP);
    remainingTempHp = 0;
  }
  // check if HP is negative as a final verification
  if (remainingHp < 0) remainingHp = 0;

  return {
    remainingHp,
    remainingTempHp,
  };
}

/**
 * Utiltiy for calculating healing based on character data and healing incoming
 * @param {number} currentHP
 * @param {number} maxHP
 * @param {number} healing
 * @returns {number} resulting hitpoints post heal
 */
function healingCalculation(currentHP, maxHP, healing) {
  let resultingHP = currentHP + healing;
  if (resultingHP > maxHP) resultingHP = maxHP;
  else if (resultingHP < 0) resultingHP = 0;
  return resultingHP;
}

/**
 * Utiltiy for calculating tempHP based on character data and tempHP
 * @param {number} currentTempHP
 * @param {number} incomingTempHP
 * @returns {number} resulting temporary hp after calculation
 */
function tempHpCalculation(currentTempHP, incomingTempHP) {
  if (incomingTempHP > currentTempHP) return incomingTempHP;
  else return currentTempHP;
}

export { damageCalculation, healingCalculation, tempHpCalculation };
