import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";
import express from "express";

const projectRoot = path.resolve(
  path.dirname(url.fileURLToPath(import.meta.url)),
  "..",
);
const filesToCopy = [
  "routes/api.js",
  "utils/hpCalculator.js",
  "utils/initCharacterData.js",
  "utils/validDamageTypes.js",
  "resources/briv.json",
];

let temporaryProject;
let server;
let baseUrl;
let storedCharacterPath;
let initialCharacter;

before(async () => {
  temporaryProject = await fs.mkdtemp(path.join(projectRoot, ".api-tests-"));

  for (const relativePath of filesToCopy) {
    const destination = path.join(temporaryProject, relativePath);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(path.join(projectRoot, relativePath), destination);
  }
  await fs.mkdir(path.join(temporaryProject, "data"));

  const character = JSON.parse(
    await fs.readFile(
      path.join(temporaryProject, "resources/briv.json"),
      "utf8",
    ),
  );
  storedCharacterPath = path.join(
    temporaryProject,
    "data",
    `${character.name.toLowerCase()}Data.json`,
  );

  const routeUrl = url.pathToFileURL(
    path.join(temporaryProject, "routes/api.js"),
  );
  const { default: api } = await import(routeUrl.href);
  const app = express();
  app.use(express.json());
  app.use("/api", api);
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}/api`;
  initialCharacter = JSON.parse(await fs.readFile(storedCharacterPath, "utf8"));
});

beforeEach(async () => {
  await fs.writeFile(storedCharacterPath, JSON.stringify(initialCharacter));
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  if (temporaryProject)
    await fs.rm(temporaryProject, { recursive: true, force: true });
});

async function post(route, body) {
  return fetch(`${baseUrl}/${route}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("GET /getCharacter returns the stored character", async () => {
  const response = await fetch(`${baseUrl}/getCharacter`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), initialCharacter);
});

test("POST /damage applies resistance and consumes temporary HP first", async () => {
  const character = {
    ...initialCharacter,
    currentHitPoints: 20,
    tempHitPoints: 1,
  };
  await fs.writeFile(storedCharacterPath, JSON.stringify(character));

  const response = await post("damage", { damage: 5, type: "bludgeoning" });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    remainingHp: 16,
    remainingTempHp: 0,
  });
  const savedCharacter = JSON.parse(
    await fs.readFile(storedCharacterPath, "utf8"),
  );
  assert.equal(savedCharacter.currentHitPoints, 16);
  assert.equal(savedCharacter.tempHitPoints, 0);
});

test("POST /damage rejects an invalid damage type without changing state", async () => {
  const response = await post("damage", { damage: 5, type: "invalid" });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { message: "Damage Type Invalid" });
  assert.deepEqual(
    JSON.parse(await fs.readFile(storedCharacterPath, "utf8")),
    initialCharacter,
  );
});

test("POST /heal caps current HP at maximum HP and persists the result", async () => {
  const character = { ...initialCharacter, currentHitPoints: 20 };
  await fs.writeFile(storedCharacterPath, JSON.stringify(character));

  const response = await post("heal", { healing: 10 });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { remainingHp: 25 });
  const savedCharacter = JSON.parse(
    await fs.readFile(storedCharacterPath, "utf8"),
  );
  assert.equal(savedCharacter.currentHitPoints, 25);
});

test("POST /temphp keeps the greater temporary HP value and persists it", async () => {
  const character = { ...initialCharacter, tempHitPoints: 4 };
  await fs.writeFile(storedCharacterPath, JSON.stringify(character));

  const strongerResponse = await post("temphp", { tempHp: 8 });
  assert.equal(strongerResponse.status, 200);
  assert.deepEqual(await strongerResponse.json(), { remainingTempHp: 8 });

  const weakerResponse = await post("temphp", { tempHp: 6 });
  assert.equal(weakerResponse.status, 200);
  assert.deepEqual(await weakerResponse.json(), { remainingTempHp: 8 });
  const savedCharacter = JSON.parse(
    await fs.readFile(storedCharacterPath, "utf8"),
  );
  assert.equal(savedCharacter.tempHitPoints, 8);
});
