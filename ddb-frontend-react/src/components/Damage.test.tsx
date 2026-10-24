import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Damage from "./Damage";

describe("Damage", () => {
  it("sends the selected damage and type, then reports the remaining hit points", async () => {
    const onDealDamage = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        remainingHp: 12,
        remainingTempHp: 3,
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Damage onDealDamage={onDealDamage} />);
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "7" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "fire" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Take Damage" }));

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8080/api/damage", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ damage: 7, type: "fire" }),
    });
    await waitFor(() => {
      expect(onDealDamage).toHaveBeenCalledWith({
        remainingHp: 12,
        remainingTempHp: 3,
      });
    });
  });
});
