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

  it("displays a gauge with a speed of 9.6 qpm with real data", () => {
    sessionSummaries.set(realData);
    render(SpeedWidget);
    const value = screen.getByText("9.6");
    expect(value).toBeInTheDocument;
  });

  it("calculates the totals correctly with real data", () => {
    sessionSummaries.set(realData);
    display.set("data");
    render(SpeedWidget);
    const header = screen.getByRole("heading", {
      name: /7 sessions • 528 items • 1204 questions/i,
    });
    const firstSessionHeader = screen.getByRole("heading", {
      name: /1: 12\/17\/21, 10:21 am – 10:52 am \(31m\)/i,
    });
    const firstSessionText = screen.getByText(
      /123 items • 288 questions • 6\.4 spq • 9\.4 qpm 173\/288 = 60\.1% correct/i
    );
    const lastSessionHeader = screen.getByRole("heading", {
      name: /7: 12\/13\/21, 2:30 pm – 2:45 pm \(15m\)/i,
    });
    const lastSessionText = screen.getByText(
      /65 items • 142 questions • 6\.2 spq • 9\.7 qpm 106\/142 = 74\.6% correct/i
    );

    expect(header).toBeInTheDocument();
    expect(firstSessionHeader).toBeInTheDocument();
    expect(firstSessionText).toBeInTheDocument();
    expect(lastSessionHeader).toBeInTheDocument();
    expect(lastSessionText).toBeInTheDocument();
  });
});
