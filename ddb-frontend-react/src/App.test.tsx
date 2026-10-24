import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App", () => {
  it("loads and displays character details and hit points", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        name: "Billy",
        level: 4,
        class: "druid",
        maxHitPoints: 12,
        currentHitPoints: 10,
        tempHitPoints: 1,
        stats: {
          strength: 12,
          dexterity: 13,
          constitution: 14,
          intelligence: 15,
          wisdom: 8,
          charisma: 13,
        },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    expect(await screen.findByRole("heading", { name: "Billy" })).toBeVisible();
    expect(screen.getByText("Lv 4 Druid")).toBeVisible();
    expect(screen.getByText("HP: 10 / 12")).toBeVisible();
    expect(screen.getByText("Temp HP: 1")).toBeVisible();
    expect(
      screen.getByText(
        (_content, element) =>
          element?.tagName === "P" &&
          element.textContent?.includes("STR:") === true,
      ),
    ).toHaveTextContent("STR: 12");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/api/getCharacter",
    );
  });
});
