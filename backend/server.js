import { createServer } from "http";
import path from "path";
import url from "url";
import initCharacter from "./utils/initCharacter.js";
import * as hpCalculator from "./utils/hpCalculator.js";

// configure PORT in .env in root directory if 8080 is occupied on your machine
const PORT = process.env.PORT || 8080;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const characterSheetPath = path.join(__dirname, "/resources", "/briv.json");
// TODO: setup method to only do this if characterData.json does not exist yet
await initCharacter(characterSheetPath);

// damage handler (move later)
const damageHandler = (req, res) => {
  let damageInfo;
  req.on("data", (chunk) => {
    let body = chunk.toString();
    damageInfo = JSON.parse(body);
    // pass this to hp calculator utility
    hpCalculator.damageCalculation(damageInfo.damage, damageInfo.type);
  });
  req.on("end", () => {
    res.writeHead(200, { "Content-type": "text/html" });
    // TODO: write JSON that actually updates FE with new data
    res.write("Temp HP: " + JSON.stringify(damageInfo));
    res.end();
  });
};

// healing handler
const healingHandler = (req, res) => {
  let healingInfo;
  req.on("data", (chunk) => {
    let body = chunk.toString();
    healingInfo = JSON.parse(body);
    // pass to hp calculator utility
    hpCalculator.healingCalculation(healingInfo?.healing);
  });
  req.on("end", () => {
    res.writeHead(200, { "Content-type": "text/html" });
    // TODO: write JSON that actually updates FE with new data
    res.write("Damage: " + JSON.stringify(healingInfo));
    res.end();
  });
};

// temp hp handler (move later)
const tempHpHandler = (req, res) => {
  let tempHpInfo;
  req.on("data", (chunk) => {
    let body = chunk.toString();
    tempHpInfo = JSON.parse(body);
    // pass to hp calculator utility
    hpCalculator.tempHpCalculation(tempHpInfo?.tempHp);
  });
  req.on("end", () => {
    res.writeHead(200, { "Content-type": "text/html" });
    // TODO: write JSON that actually updates FE with new data
    res.write("Damage: " + JSON.stringify(tempHpInfo));
    res.end();
  });
};

/**
 * Main server instance, contains main routing logic
 */
const server = createServer(async (req, res) => {
  // TODO: reevaluate if I need to split this into some sort of router component

  // Get Character API call
  if (req.url === "/api/getCharacter" && req.method === "GET") {
    res.writeHead(200, { "Content-type": "application/json" });
    // TODO: read in character sheet (characterData.json) and send client formatted json
    res.end();
  }
  // Heal API call
  else if (req.url === "/api/heal" && req.method === "POST") {
    healingHandler(req, res);
  }
  // Damage API call
  else if (req.url === "/api/damage" && req.method === "POST") {
    damageHandler(req, res);
  }
  // Temporary HP API call
  else if (req.url === "/api/temphp" && req.method === "POST") {
    tempHpHandler(req, res);
  }
  // Catch-all 404
  else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.write("route not found");
    res.end();
  }
});

server.listen(PORT, () => {
  console.log("Server running on ", PORT);
});
