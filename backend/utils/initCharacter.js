import fs from "fs/promises";
import path from "path";
import url from "url";
import validDamageTypes from "./validDamageTypes.js";

/**
 * Schema for character info stored for calculating HP
 */
let characterData = {
  name: "",
  maxHitPoints: undefined,
  currentHitPoints: 0,
  tempHitPoints: 0,
  resistances: [],
  immunities: [],
};

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Utility for initializing necessary information to modify character HP
 * @param {string} fileIn - source of incoming character information (briv.json)
 */
async function initCharacter(fileIn) {
  const character = JSON.parse(await fs.readFile(fileIn, "utf8"));
  // TODO: add error checking
  characterData.name = character.name;
  characterData.maxHitPoints = character.hitPoints;
  // default setting current hp to max hp as well on init
  characterData.currentHitPoints = character.hitPoints;

  // loop through defenses to write to resistances and immunitites
  let immunities = [];
  let resistances = [];
  character.defenses.forEach((def) => {
    if (validDamageTypes.includes(def.type)) {
      if (def.defense === "immunity") {
        immunities.push(def.type);
      } else if (def.defense === "resistance") {
        resistances.push(def.type);
      }
    }
  });
  characterData.immunities = immunities;
  characterData.resistances = resistances;

  const characterDataPath = path.join(
    __dirname,
    "../data",
    "/characterData.json",
  );

  await fs.writeFile(characterDataPath, JSON.stringify(characterData));
}

export default initCharacter;
