/*
 * @jest-environment jsdom
 */

import Ganbarometer from "./Ganbarometer.svelte";
import { render, screen, within } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
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

describe("Ganbarometer layout", () => {
  beforeEach(() => {
    window.indexedDB = new FDBFactory(); // reset database
    mockReviewCollection([]);
  });

  afterEach(() => {
    clearMockedAPIData();
  });

  it("creates a div with the ganbarometer widgets", () => {
    render(Ganbarometer);
    const gbSection = screen.getByTestId("gbwidgets");
    expect(gbSection).toBeInTheDocument();
  });

  it("has a nav for showing graphs", () => {
    render(Ganbarometer);
    const navbar = screen.getByRole("navigation");
    const element = within(navbar).getByText("Graphs");
    expect(element).toBeInTheDocument();
  });

  it("has a nav for showing data", () => {
    render(Ganbarometer);
    const navbar = screen.getByRole("navigation");
    const element = within(navbar).getByText("Data");
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

describe("Interaction", () => {
  beforeEach(() => {
    window.indexedDB = new FDBFactory(); // reset database
  });

  afterEach(() => {
    clearMockedAPIData();
  });

  it("Displays data tables when Data nav is clicked", async () => {
    mockReviewCollection([]);
    render(Ganbarometer);
    const navbar = screen.getByRole("navigation");
    const dataNav = within(navbar).getByText("Data");
    await userEvent.click(dataNav);

    const gbTableHeading = screen.getByRole("heading", {
      name: /ganbarometer: 0%/i,
    });
    expect(gbTableHeading).toBeInTheDocument();

    const speedHeading = screen.getByRole("heading", {
      name: /speed: 0\.0 s\/q/i,
    });
    expect(speedHeading).toBeInTheDocument();

    const accuracyHeading = screen.getByRole("heading", {
      name: /0 reviews/i,
    });
    expect(accuracyHeading).toBeInTheDocument();
  });
});
