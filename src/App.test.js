/*
 * @jest-environment jsdom
 */

import App from "./App.svelte";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { settings } from "./store/stores";

describe("App layout", () => {
  beforeAll(() => {
    settings.set({
      apiKey: "78ca70da-d268-4100-96ad-696014a53231",
    });
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

describe("Interaction", () => {
  it("renders a placeholder if no API token is stored", () => {
    settings.set({ apiKey: "" });
    render(App);
    const placeHolder = screen.getByText(/enter a valid token/i);
    expect(placeHolder).toBeInTheDocument();
  });

  it("replaces the ganbarometer with settings form when button clicked", async () => {
    render(App);
    const button = screen.getByRole("button", { name: "settings" });
    await userEvent.click(button);
    const form = screen.getByRole("form", { name: "Settings Form" });
    expect(form).toBeInTheDocument();
  });
});
