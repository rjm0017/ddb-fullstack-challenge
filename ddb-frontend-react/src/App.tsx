import { useState, useEffect } from "react";
import Damage from "./components/Damage";
import Heal from "./components/Heal";
import TemporaryHitpoints from "./components/TemporaryHitpoints";
import type { damageValuesObj } from "./utils/customTypes";
import fighterIcon from "./assets/fighter.png";
import "./App.scss";

export default function App() {
  // setCharData will be called whenever any of the damage/heal/temphp calcs are run,
  // as well as on app load
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

      // make sure class name is capitalized
      // leave name capitalization alone for Role Playing purpouses
      const firstLetter = result.class.charAt(0);
      const firstLetterCap = firstLetter.toUpperCase();
      const remainingLetters = result.class.slice(1);
      const capitalizedClassName =
        firstLetterCap + remainingLetters.toLowerCase();

      // assign character data appropriately here:
      setCharStats({
        name: result.name,
        level: result.level,
        class: capitalizedClassName,
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
      <div className="headerNav">
        <h1>D&D Character HP Tracker</h1>
      </div>
      <div className="container">
        <div>
          <img
            className="dndClassIcon"
            alt="D&D Class Icon"
            aria-label="D&D Class Icon"
            src={fighterIcon}
          />
        </div>
        <div className="characterInfo">
          <h2>{charStats.name}</h2>
          <p>
            Lv {charStats.level} {charStats.class}
          </p>
          <p>
            HP: {charData.currentHp} / {charStats.maxHP}
          </p>
          <p>Temp HP: {charData.tempHp}</p>
        </div>

        <div className="characterPaneRight">
          <p>
            <b>STR:</b> {charStats.strength}
          </p>
          <p>
            <b>DEX:</b> {charStats.dexterity}
          </p>
          <p>
            <b>CON:</b> {charStats.constitution}
          </p>
          <p>
            <b>INT:</b> {charStats.intelligence}
          </p>
          <p>
            <b>WIS:</b> {charStats.wisdom}
          </p>
          <p>
            <b>CHA:</b> {charStats.charisma}
          </p>
        </div>
      </div>

      <div className="hpBars">
        <div className="mainHealthBar">
          <div>Hitpoints:</div>
          <progress
            className="progress is-danger"
            aria-label="Hitpoints Bar"
            value={charData.currentHp}
            max={charStats.maxHP}
          ></progress>
        </div>
        <div className="tempHealthBar">
          <div>Temp HP:</div>
          <progress
            className="progress is-info"
            aria-label="Temporary Hitpoints Bar"
            value={charData.tempHp}
            max="15"
          ></progress>
        </div>
      </div>

      <div className="inputInterface">
        <Damage onDealDamage={handleDamage}></Damage>
        <Heal onHeal={handleHeal}></Heal>
        <TemporaryHitpoints onTempHp={handleTempHp}></TemporaryHitpoints>
      </div>
    </>
  );
}
