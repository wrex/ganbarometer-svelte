/*
 * @jest-environment jsdom
 */

import App from "./App.svelte";
import { render, screen } from "@testing-library/svelte";
import * as api from "./API/core";

api.getApiKey = jest.fn();

describe("App", () => {
  describe("renders ganbarometer with an API key", () => {
    beforeAll(() => {
      api.getApiKey.mockReset();
      api.getApiKey.mockReturnValue("some valid token");
    });

    it("creates a section for the ganbarometer", () => {
      render(App);
      const gbSection = screen.getByTestId("ganbarometer");
      expect(gbSection).toBeInTheDocument();
    });

    it("has a button to change the settings", () => {
      render(App);
      const button = screen.getByRole("button", { name: "settings" });
      expect(button).toBeInTheDocument();
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

  describe("renders settings form without an API key", () => {
    beforeAll(() => {
      api.getApiKey.mockReset();
      api.getApiKey.mockReturnValue("");
    });
    it("renders a form", () => {
      render(App);
      const form = screen.getByRole("form");
      expect(form).toBeInTheDocument();
    });
  });
});
