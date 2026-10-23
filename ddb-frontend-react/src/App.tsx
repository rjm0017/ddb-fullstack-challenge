import { useState, useEffect } from "react";
import Damage from "./components/Damage";
import Heal from "./components/Heal";
import TemporaryHitpoints from "./components/TemporaryHitpoints";
import type { damageValuesObj } from "./utils/customTypes";

export default function App() {
  // setCharData will be called whenever any of the damage/heal/temphp calcs are run
  const [charData, setCharData] = useState({
    currentHp: 0,
    tempHp: 0,
  });
  // setCharStats will be called on app load to populate immutable character data
  const [charStats, setCharStats] = useState({
    name: "",
    level: 0,
    class: "",
    maxHP: 0,
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  });

  // Calling useEffect hook once to make a request to the API to grab character information on startup
  // This is only called when the application starts
  useEffect(() => {
    const fetchCharacter = async () => {
      const response = await fetch("http://localhost:8080/api/getCharacter");
      const result = await response.json();
      console.log("character data fetched: ", result);

      // assign character data appropriately here:
      setCharStats({
        name: result.name,
        level: result.level,
        class: result.class,
        maxHP: result.maxHitPoints,
        strength: result.stats.strength,
        dexterity: result.stats.dexterity,
        constitution: result.stats.constitution,
        intelligence: result.stats.intelligence,
        wisdom: result.stats.wisdom,
        charisma: result.stats.charisma,
      });
      setCharData({
        currentHp: result.currentHitPoints,
        tempHp: result.tempHitPoints,
      });
    };
    fetchCharacter();
  }, []);

  /**
   * Handler for when the damage button is pressed
   * @param damageValues - object containing tempHp and currentHp after damage calculation
   */
  function handleDamage(damageValues: damageValuesObj) {
    let newData = {
      currentHp: damageValues.remainingHp,
      tempHp: damageValues.remainingTempHp,
    };
    setCharData(newData);
  }

  /**
   * Handler for when the heal button is pressed
   * @param remainingHp - hp remaining after the healing calculation
   */
  function handleHeal(remainingHp: number) {
    let newData = {
      currentHp: remainingHp,
      tempHp: charData.tempHp,
    };
    setCharData(newData);
  }

  /**
   * Handler for when the temp HP button is pressed
   * @param remainingTempHp - tempHp value after tempHp amount is applied
   */
  function handleTempHp(remainingTempHp: number) {
    let newData = {
      currentHp: charData.currentHp,
      tempHp: remainingTempHp,
    };
    setCharData(newData);
  }

  return (
    <>
      <div>
        <h1>{charStats.name || "Character Name"}</h1>
        <p>Class: {charStats.class}</p>
        <p>Level: {charStats.level}</p>
        <p>
          HP: {charData.currentHp}/{charStats.maxHP}
        </p>
        <p>Temporary HP: {charData.tempHp}</p>
        <p>Stats:</p>
        <ul title="Stats">
          <li>Strength: {charStats.strength}</li>
          <li>Dexterity: {charStats.dexterity}</li>
          <li>Constitution: {charStats.constitution}</li>
          <li>Intelligence: {charStats.intelligence}</li>
          <li>Wisdom: {charStats.wisdom}</li>
          <li>Charisma: {charStats.charisma}</li>
        </ul>
      </div>
      <div>
        <Damage onDealDamage={handleDamage}></Damage>
      </div>
      <div>
        <Heal onHeal={handleHeal}></Heal>
      </div>
      <div>
        <TemporaryHitpoints onTempHp={handleTempHp}></TemporaryHitpoints>
      </div>
    </>
  );
}
