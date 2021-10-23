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
  it("has a Reviews/Day gauge", () => {
    render(App);
    const difficultyGauge = screen.getByRole("heading", {
      name: "Reviews/Day",
    });
    expect(difficultyGauge).toBeInTheDocument();
  });
  it("Has a Review Intervals bar chart", () => {
    render(App);
    const intervalChart = screen.getByRole("heading", {
      name: "Review Intervals",
    });
    expect(intervalChart).toBeInTheDocument();
  });
});
