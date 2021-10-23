/*
 * @jest-environment jsdom
 */

import App from "./App.svelte";
import { render, screen } from "@testing-library/svelte";

describe("Ganbarometer", () => {
  it("has a section", () => {
    render(App);
    const gbSection = screen.getByTestId("ganbarometer");
    expect(gbSection).toBeInTheDocument();
  });
  it("has a Difficulty gauge", () => {
    render(App);
    const difficultyGauge = screen.getByRole("heading", { name: "Difficulty" });
    expect(difficultyGauge).toBeInTheDocument();
  });
});
