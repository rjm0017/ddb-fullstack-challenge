import { useState } from "react";
import type { BaseSyntheticEvent } from "react";
import styles from "./Heal.module.scss";

interface HealProps {
  onHeal: (healing: number) => void;
}

export default function Heal({ onHeal }: HealProps) {
  const handleSubmit = async (event: BaseSyntheticEvent) => {
    event.preventDefault();

    const response = await fetch("http://localhost:8080/api/heal", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        healing: healValue,
      }),
    });
    const result = await response.json();
    onHeal(result.remainingHp);
  };

  const [healValue, setHealValue] = useState(0);

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.heal}>
        <div>
          <input
            className={styles.healInput}
            type="number"
            min="0"
            value={healValue}
            onChange={(e) => setHealValue(parseInt(e.target.value))}
          ></input>
        </div>
        <div>
          <button>Apply Heal</button>
        </div>
      </div>
    </form>
  );
}
