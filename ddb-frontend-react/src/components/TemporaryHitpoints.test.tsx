import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TemporaryHitpoints from "./TemporaryHitpoints";

describe("TemporaryHitpoints", () => {
  it("sends the temporary hit point amount and reports the result", async () => {
    const onTempHp = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ remainingTempHp: 5 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<TemporaryHitpoints onTempHp={onTempHp} />);
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "5" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Apply Temporary Hitpoints" }),
    );

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8080/api/temphp", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ tempHp: 5 }),
    });
    await waitFor(() => {
      expect(onTempHp).toHaveBeenCalledWith(5);
    });
  });
});
