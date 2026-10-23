import { useState } from "react";
import type { BaseSyntheticEvent } from "react";

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
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={tempHpValue}
          onChange={(e) => setTempHpValue(parseInt(e.target.value))}
        ></input>
        <button>Apply Temp HP</button>
      </form>
    </>
  );
}
