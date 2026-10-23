import validDamageTypes from "./validDamageTypes.js";

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
    // console.log("Invalid Damage Type");
    // TODO: make this valid damage type error handling better
    return -1;
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

function healingCalculation(currentHP, maxHP, healing) {
  let resultingHP = currentHP + healing;
  if (resultingHP > maxHP) resultingHP = maxHP;
  return resultingHP;
}

function tempHpCalculation(currentTempHP, incomingTempHP) {
  if (incomingTempHP > currentTempHP) return incomingTempHP;
  else return currentTempHP;
}

export { damageCalculation, healingCalculation, tempHpCalculation };
