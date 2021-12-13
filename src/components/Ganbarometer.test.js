/*
 * @jest-environment jsdom
 */

import App from "../App.svelte";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { mockWkof } from "../mocks/wkof";

describe("App layout", () => {
  mockWkof();

  it("creates a section for the ganbarometer", () => {
    render(App);
    const gbSection = screen.getByTestId("ganbarometer");
    expect(gbSection).toBeInTheDocument();
  });

  it("has a nav for showing graphs", () => {
    render(App);
    const element = screen.getByText("Graphs");
    expect(element).toBeInTheDocument();
  });

  it("has a nav for showing data", () => {
    render(App);
    const element = screen.getByText("Data");
    expect(element).toBeInTheDocument();
  });

  it("has an input for entering the number of days to retrieve", () => {
    render(App);
    const element = screen.getByLabelText(/Days to display/i);
    expect(element).toBeInTheDocument();
  });

  it("has a button to change the settings", () => {
    render(App);
    const button = screen.getByRole("button", { name: "settings" });
    expect(button).toBeInTheDocument();
  });

  it("has a Ganbarometer gauge", () => {
    render(App);
    const difficultyGauge = screen.getByRole("heading", {
      name: "GanbarOmeter",
    });
    expect(difficultyGauge).toBeInTheDocument();
  });

  it("has a speed gauge", () => {
    render(App);
    const reviewsGauge = screen.getByRole("heading", {
      name: "Speed",
    });
    expect(reviewsGauge).toBeInTheDocument();
  });

  it("has an accuracy gauge", () => {
    render(App);
    const reviewsGauge = screen.getByRole("heading", {
      name: "Accuracy",
    });
    expect(reviewsGauge).toBeInTheDocument();
  });

  it("Has a load bar chart", () => {
    render(App);
    const intervalChart = screen.getByRole("heading", {
      name: "Reviews/day",
    });
    expect(intervalChart).toBeInTheDocument();
  });
});

describe("Interaction", () => {
  it("replaces the ganbarometer with settings form when button clicked", async () => {
    render(App);
    const button = screen.getByRole("button", { name: "settings" });
    await userEvent.click(button);
    const form = screen.getByRole("form", { name: "Settings Form" });
    expect(form).toBeInTheDocument();
  });

  it("displays the reviews/day table when the Data nav is clicked", async () => {
    render(App);
    const dataNav = screen.getByText("Data");
    await userEvent.click(dataNav);
    const table = screen.getByTestId("reviews-per-day-table");
    expect(table).toBeInTheDocument();
  });

  it("reverts to the chart view when the Graphs nav is clicked", async () => {
    render(App);
    const graphNav = screen.getByText("Graphs");
    const dataNav = screen.getByText("Data");
    await userEvent.click(dataNav);
    await userEvent.click(graphNav);
    const table = screen.queryByTestId("reviews-per-day-table");
    expect(table).not.toBeInTheDocument();
  });
});
