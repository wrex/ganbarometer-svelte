/*
 * @jest-environment jsdom
 */

import Ganbarometer from "./Ganbarometer.svelte";
import { render, screen } from "@testing-library/svelte";

import "fake-indexeddb/auto";
import FDBFactory from "fake-indexeddb/lib/FDBFactory";
import {
  mockWkof,
  mockReview,
  mockReviewCollection,
  clearMockedAPIData,
} from "../mocks/wkof";

// Setup
mockWkof();
const wkofApiv2Mock = window.wkof.Apiv2.fetch_endpoint;

beforeEach(() => {
  window.indexedDB = new FDBFactory(); // reset database
});

describe("Ganbarometer layout", () => {
  mockReviewCollection([]);

  it("creates a div with the ganbarometer widgets", () => {
    render(Ganbarometer);
    const gbSection = screen.getByTestId("gbwidgets");
    expect(gbSection).toBeInTheDocument();
  });

  it("has a nav for showing graphs", () => {
    render(Ganbarometer);
    const element = screen.getByText("Graphs");
    expect(element).toBeInTheDocument();
  });

  it("has a nav for showing data", () => {
    render(Ganbarometer);
    const element = screen.getByText("Data");
    expect(element).toBeInTheDocument();
  });

  it("has an input for entering the number of days to retrieve", () => {
    render(Ganbarometer);
    const element = screen.getByLabelText(/Days to display/i);
    expect(element).toBeInTheDocument();
  });

  it("has a button to change the settings", () => {
    render(Ganbarometer);
    const button = screen.getByRole("button", { name: "settings" });
    expect(button).toBeInTheDocument();
  });

  it("has a Ganbarometer gauge", () => {
    render(Ganbarometer);
    const difficultyGauge = screen.getByRole("heading", {
      name: "GanbarOmeter",
    });
    expect(difficultyGauge).toBeInTheDocument();
  });

  it("has a speed gauge", () => {
    render(Ganbarometer);
    const reviewsGauge = screen.getByRole("heading", {
      name: "Speed",
    });
    expect(reviewsGauge).toBeInTheDocument();
  });

  it("Has a review accuracy bar chart", () => {
    render(Ganbarometer);
    const accuracyChart = screen.getByRole("heading", {
      name: "Accuracy",
    });
    expect(accuracyChart).toBeInTheDocument();
  });
});
