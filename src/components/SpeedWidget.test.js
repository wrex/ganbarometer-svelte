/*
 * @jest-environment jsdom
 */

import SpeedWidget from "./SpeedWidget.svelte";
import { render, screen } from "@testing-library/svelte";
import { display, sessionSummaries } from "../store/stores";
import { fakeSessionSummaries } from "../mocks/fakeData";

const realData = fakeSessionSummaries;

describe("Speed Widget", () => {
  beforeEach(() => {
    sessionSummaries.set([]);
  });

  it("displays a gauge with speed of Infinity Q/m by default", () => {
    render(SpeedWidget);
    const value = screen.getByText("Infinity");
    expect(value).toBeInTheDocument;
  });

  it("displays a gauge with a speed of 9.1 qpm with real data", () => {
    sessionSummaries.set(realData);
    render(SpeedWidget);
    const value = screen.getByText(/9\.1/i);
    expect(value).toBeInTheDocument;
  });

  it("calculates the totals correctly with real data", () => {
    sessionSummaries.set(realData);
    display.set("data");
    render(SpeedWidget);
    const header = screen.getByRole("heading", {
      name: /8 sessions • 387 items • 866 questions/i,
    });
    const firstSessionHeader = screen.getByRole("heading", {
      name: /1: 1\/13\/22, 10:36 am – 10:38 am \(2\.60m\)/i,
    });
    const firstSessionText = screen.getByText(
      /20 items • 40 questions • 3\.9 spq • 15\.4 qpm 40\/40 = 100\.0% correct/i
    );
    const singleReviewHeader = screen.getByRole("heading", {
      name: /7: 1\/12\/22, 11:48 am – 11:48 am \(0\.09m\)/i,
    });
    const singleReviewText = screen.getByText(
      /1 items • 2 questions • 2\.8 spq • 21\.1 qpm 2\/2 = 100\.0% correct/i
    );
    const lastSessionHeader = screen.getByRole("heading", {
      name: /8: 1\/11\/22, 10:26 am – 11:00 am \(34\.48m\)/i,
    });
    const lastSessionText = screen.getByText(
      /145 items • 329 questions • 6\.3 spq • 9\.5 qpm 286\/329 = 86\.9% correct/i
    );

    expect(header).toBeInTheDocument();
    expect(firstSessionHeader).toBeInTheDocument();
    expect(firstSessionText).toBeInTheDocument();
    expect(singleReviewHeader).toBeInTheDocument();
    expect(singleReviewText).toBeInTheDocument();
    expect(lastSessionHeader).toBeInTheDocument();
    expect(lastSessionText).toBeInTheDocument();
  });
});
