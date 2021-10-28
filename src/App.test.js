/*
 * @jest-environment jsdom
 */

import App from "./App.svelte";
import { render, screen } from "@testing-library/svelte";
import * as api from "./API/core";

api.getApiKey = jest.fn();

describe("App", () => {
  beforeAll(() => {});

  it("creates a section for the ganbarometer", () => {
    render(App);
    const gbSection = screen.getByTestId("ganbarometer");
    expect(gbSection).toBeInTheDocument();
  });

  it.todo("displays the settings dialog if settings selected");

  describe("without API key", () => {
    api.getApiKey.mockReturnValue("");

    it("displays 'enter key' form if not stored", () => {
      render(App);
      const keyInput = screen.getByLabelText("Enter API key:");
      expect(keyInput).toBeInTheDocument();
    });
  });

  describe("with API key", () => {
    beforeAll(() => {
      api.getApiKey.mockReturnValue("some weird api key");
    });

    it("has a Difficulty gauge", () => {
      render(App);
      const difficultyGauge = screen.getByRole("heading", {
        name: "Difficulty",
      });
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
});
