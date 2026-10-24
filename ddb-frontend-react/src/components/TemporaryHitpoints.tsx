import { useState } from "react";
import type { BaseSyntheticEvent } from "react";
import styles from "./TemporaryHitpoints.module.scss";

interface TemporaryHitpointsProps {
  onTempHp: (tempHp: number) => void;
}

export default function TemporaryHitpoints({
  onTempHp,
}: TemporaryHitpointsProps) {
  const handleSubmit = async (event: BaseSyntheticEvent) => {
    event.preventDefault();

    const response = await fetch("http://localhost:8080/api/temphp", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        tempHp: tempHpValue,
      }),
    });
    const result = await response.json();
    onTempHp(result.remainingTempHp);
  };

  const [tempHpValue, setTempHpValue] = useState(0);

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.tempHp}>
        <div>
          <input
            aria-label="Temporary Hitpoints Amount"
            className={styles.tempHpInput}
            type="number"
            min="0"
            value={tempHpValue}
            onChange={(e) => setTempHpValue(parseInt(e.target.value))}
          ></input>
        </div>
        <div>
          <button
            aria-label="Apply Temporary Hitpoints"
            className={styles.tempHpButton}
          >
            Apply Temp HP
          </button>
        </div>
      </div>
    </form>
  );
}
