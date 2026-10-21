import path from "path";
import url from "url";
import fs from "fs/promises";
import validDamageTypes from "./validDamageTypes.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const characterSheetPath = path.join(
  __dirname,
  "../data",
  "/characterData.json",
);

/**
 * Utility for calculating the result of temporary hp received, and storing the result in character data
 * @param {number} tempHpIn - the amount of temporary hitpoints being received by character
 */
async function tempHpCalculation(tempHpIn) {
  let characterData = JSON.parse(await fs.readFile(characterSheetPath, "utf8"));

  // if tempHpIn is less than current character tempHP, no action needs to be taken
  if (tempHpIn > characterData.tempHitPoints) {
    characterData.tempHitPoints = tempHpIn;
    await fs.writeFile(characterSheetPath, JSON.stringify(characterData));
  }
}

/**
 * Utility for calculating incoming damage, and storing the result in character data
 * @param {number} damageIn - the amount of healing the character is receiving
 * @param {string} damageType - the type of damage being dealt
 */
async function damageCalculation(damageIn, damageType) {
  let characterData = JSON.parse(await fs.readFile(characterSheetPath, "utf8"));

  // if damageType is invalid, throw error
  if (!validDamageTypes.includes(damageType)) {
    console.error("invalid damage type");
  }

  // if damageType is resisted, damageIn/2 rounded down
  else if (characterData.resistances.includes(damageType)) {
    damageIn = Math.floor(damageIn / 2);
  }

  // if damageType is negated, damage = 0 and no action is needed
  else if (characterData.immunities.includes(damageType)) {
    damageIn = 0;
  }
  // else, treat damage as normal
  let currentHp = characterData.currentHitPoints - damageIn;
  if (currentHp < 0) currentHp = 0;
  characterData.currentHitPoints = currentHp;

  /* 
    TODO: do I want to move these writes to the main server file, and
    allow for the write and the sendback to be done at the same time,
    rather than doing a redundant readfile? might optimize some 
  */
  await fs.writeFile(characterSheetPath, JSON.stringify(characterData));
}

/**
 * Utility for calculating the result of a heal, and storing the result in character data
 * @param {number} healingIn - the amount of healing the character is receiving
 */
async function healingCalculation(healingIn) {
  let characterData = JSON.parse(await fs.readFile(characterSheetPath, "utf8"));

  let currentHp = characterData.currentHitPoints + healingIn;
  if (currentHp > characterData.maxHitPoints)
    currentHp = characterData.maxHitPoints;

  await fs.writeFile(characterSheetPath, JSON.stringify(characterData));
}

export { tempHpCalculation, damageCalculation, healingCalculation };
