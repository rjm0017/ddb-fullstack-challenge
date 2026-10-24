import express from "express";
import * as hpCalc from "../utils/hpCalculator.js";
import fs from "fs/promises";
import path from "path";
import url from "url";
import initCharacter from "../utils/initCharacterData.js";
const router = express.Router();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const characterFile = path.join(__dirname, "../resources", "/briv.json");

// initialize character data from briv.json
let characterName = await initCharacter(characterFile);
characterName = characterName.toLowerCase();
// use character name to find locally stored mutable data
const storedCharacterPath = path.join(
  __dirname,
  "../data",
  `/${characterName}Data.json`,
);

router.get("/getCharacter", async (req, res) => {
  let storedCharData = JSON.parse(
    await fs.readFile(storedCharacterPath, "utf8"),
  );
  res.status(200).json(storedCharData);
});

router.post("/damage", async (req, res) => {
  let storedCharData = JSON.parse(
    await fs.readFile(storedCharacterPath, "utf8"),
  );

  let damage = req.body.damage;
  let damageType = req.body.type;
  let calcResult;

  try {
    calcResult = hpCalc.damageCalculation(
      storedCharData.currentHitPoints,
      storedCharData.tempHitPoints,
      storedCharData.resistances,
      storedCharData.immunities,
      damage,
      damageType,
    );
  } catch (err) {
    res.status(400).json({ message: err.message });
    return;
  }

  storedCharData.currentHitPoints = calcResult.remainingHp;
  storedCharData.tempHitPoints = calcResult.remainingTempHp;
  await fs.writeFile(storedCharacterPath, JSON.stringify(storedCharData));
  res.status(200).json(calcResult);
});

router.post("/heal", async (req, res) => {
  let healing = req.body.healing;

  let storedCharData = JSON.parse(
    await fs.readFile(storedCharacterPath, "utf8"),
  );

  let resultingHp = hpCalc.healingCalculation(
    storedCharData.currentHitPoints,
    storedCharData.maxHitPoints,
    healing,
  );

  storedCharData.currentHitPoints = resultingHp;
  await fs.writeFile(storedCharacterPath, JSON.stringify(storedCharData));
  res.status(200).json({ remainingHp: resultingHp });
});

router.post("/temphp", async (req, res) => {
  let tempHp = req.body.tempHp;

  let storedCharData = JSON.parse(
    await fs.readFile(storedCharacterPath, "utf8"),
  );

  let resultingTempHp = hpCalc.tempHpCalculation(
    storedCharData.tempHitPoints,
    tempHp,
  );

  storedCharData.tempHitPoints = resultingTempHp;
  await fs.writeFile(storedCharacterPath, JSON.stringify(storedCharData));
  res.status(200).json({ remainingTempHp: resultingTempHp });
});

export default router;
