import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Heal from "./Heal";

describe("Heal", () => {
  it("sends the healing amount and reports the remaining hit points", async () => {
    const onHeal = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ remainingHp: 18 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Heal onHeal={onHeal} />);
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "6" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Apply Healing" }));

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8080/api/heal", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ healing: 6 }),
    });
    await waitFor(() => {
      expect(onHeal).toHaveBeenCalledWith(18);
    });
  });
});
