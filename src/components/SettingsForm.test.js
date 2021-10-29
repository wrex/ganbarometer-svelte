/*
 * @jest-environment jsdom
 */

import SettingsForm from "./SettingsForm.svelte";
import { render, screen } from "@testing-library/svelte";

describe("Settings Form", () => {
  describe("layout", () => {
    it("renders a form with a text input for the API Key", () => {
      render(SettingsForm);
      const input = screen.getByLabelText(/api key/i);
      expect(input).toBeInTheDocument();
    });
    it("has a button to save settings", () => {
      render(SettingsForm);
      const button = screen.getByRole("button");
      expect(button.textContent).toBe("Save");
    });
    it("renders an input for the numnber of days to retrieve", () => {
      render(SettingsForm);
      const input = screen.getByLabelText(/number of days/i);
      expect(input).toBeInTheDocument();
    });
    it("renders radio buttons for reviews/day or sessions/day", () => {
      render(SettingsForm);
      const option1 = screen.getByLabelText(/reviews\/day/i);
      const option2 = screen.getByLabelText(/sessions\/day/i);
      expect(option1).toBeInTheDocument();
      expect(option2).toBeInTheDocument();
    });
    it("includes inputs for color theming", () => {
      render(SettingsForm);
      const [bgColor] = screen.getAllByLabelText(/background/i);
      const [fillColor] = screen.getAllByLabelText(/fill/i);
      const [warnColor] = screen.getAllByLabelText(/warning/i);
      const [alertColor] = screen.getAllByLabelText(/alert/i);
      expect(bgColor).toBeInTheDocument();
      expect(fillColor).toBeInTheDocument();
      expect(warnColor).toBeInTheDocument();
      expect(alertColor).toBeInTheDocument();
    });
    it("includes an input for desired number of reviews", () => {
      render(SettingsForm);
      const input = screen.getByLabelText(/desired reviews per/i);
      expect(input).toBeInTheDocument();
    });
    it("includes desired number of apprentice items", () => {
      render(SettingsForm);
      const input = screen.getByLabelText(/number of apprentice/i);
      expect(input).toBeInTheDocument();
    });
    it("includes an input for percentage of acceptable misses", () => {
      render(SettingsForm);
      const input = screen.getByLabelText(/acceptable percentage of misses/i);
      expect(input).toBeInTheDocument();
    });
    it("includes an input for new kanji weighting", () => {
      render(SettingsForm);
      const input = screen.getByLabelText(/new kanji/i);
      expect(input).toBeInTheDocument();
    });
    it("includes an input for new extra misses", () => {
      render(SettingsForm);
      const input = screen.getByLabelText(/excess misses/i);
      expect(input).toBeInTheDocument();
    });
  });
});
