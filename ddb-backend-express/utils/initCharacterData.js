import fs from "fs/promises";
import path from "path";
import url from "url";
import validDamageTypes from "./validDamageTypes.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// schema for storing character data for application usage/modification
let characterData = {
  name: "",
  level: 0,
  class: "",
  maxHitPoints: 0,
  currentHitPoints: 0,
  tempHitPoints: 0,
  resistances: [],
  immunities: [],
  stats: {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  },
};

/**
 * Utility for initializing necessary information to modify character HP
 * @param {string} fileIn - source of incoming character information (briv.json)
 */
export default async function initCharacter(fileIn) {
  const character = JSON.parse(await fs.readFile(fileIn, "utf8"));

  characterData.name = character.name;

  // use character name as identifier in filename
  const characterDataPath = path.join(
    __dirname,
    "../data",
    `/${characterData.name.toLowerCase()}Data.json`,
  );

  // TODO: read characterDataPath file to check if it exists
  // terminate init if it exists
  // I basically dont want the file overwritten every time the
  // server restarts

  characterData.level = character.level;
  characterData.class = character.classes[0].name;
  characterData.maxHitPoints = character.hitPoints;
  characterData.currentHitPoints = character.hitPoints;
  // temp HP is not set on base character sheet, init to 0

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

  characterData.stats = {
    strength: character.stats.strength,
    dexterity: character.stats.dexterity,
    constitution: character.stats.constitution,
    intelligence: character.stats.intelligence,
    wisdom: character.stats.wisdom,
    charisma: character.stats.charisma,
  };
  await fs.writeFile(characterDataPath, JSON.stringify(characterData));

  return characterData.name;
}
