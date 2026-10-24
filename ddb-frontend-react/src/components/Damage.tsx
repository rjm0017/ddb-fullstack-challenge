import { useState } from "react";
import type { BaseSyntheticEvent } from "react";
import type { damageValuesObj } from "../utils/customTypes";
import styles from "./Damage.module.scss";

// valid damage types, used to populate the damage type dropdown options
const damageTypes = [
  "Bludgeoning",
  "Piercing",
  "Slashing",
  "Fire",
  "Cold",
  "Acid",
  "Thunder",
  "Lightning",
  "Poison",
  "Radiant",
  "Necrotic",
  "Psychic",
  "Force",
];

interface DamageProps {
  onDealDamage: (damageValues: damageValuesObj) => void;
}

export default function Damage({ onDealDamage }: DamageProps) {
  const handleSubmit = async (event: BaseSyntheticEvent) => {
    event.preventDefault();

    const response = await fetch("http://localhost:8080/api/damage", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        damage: damageValue,
        type: damageType,
      }),
    });
    const result = await response.json();
    onDealDamage(result);
  };

  const [damageValue, setDamageValue] = useState(0);
  const [damageType, setDamageType] = useState(damageTypes[0].toLowerCase());

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.damage}>
        <div>
          <input
            aria-label="Damage Amount"
            className={styles.damageInput}
            type="number"
            min="0"
            value={damageValue}
            onChange={(e) => setDamageValue(parseInt(e.target.value))}
          ></input>
        </div>

        <div>
          <select
            aria-label="Damage Type Select"
            className={styles.damageSelect}
            value={damageType}
            onChange={(e) => setDamageType(e.target.value)}
          >
            {damageTypes.map((type) => (
              <option key={type.toLowerCase()} value={type.toLowerCase()}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button aria-label="Take Damage" className={styles.damageButton}>
            Take Damage
          </button>
        </div>
      </div>
    </form>
  );
}
