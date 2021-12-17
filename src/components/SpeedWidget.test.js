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

  it("displays a gauge with speed of 0.0 by default", () => {
    render(SpeedWidget);
    const widget = screen.getByTestId("speedWidget");
    const gaugeCover = widget.querySelector(".gauge__cover");
    const value = gaugeCover.textContent;
    expect(value).toEqual("0.0");
  });

  it("displays a gauge with a speed of 6.2 with real data", () => {
    sessionSummaries.set(realData);
    render(SpeedWidget);
    const widget = screen.getByTestId("speedWidget");
    const gaugeCover = widget.querySelector(".gauge__cover");
    const value = gaugeCover.textContent;
    expect(value).toEqual("6.3");
  });

  it("calculates the totals correctly with real data", () => {
    sessionSummaries.set(realData);
    display.set("data");
    render(SpeedWidget);
    const header = screen.getByRole("heading", {
      name: /7 sessions • 528 items • 1204 questions/i,
    });
    const firstSessionHeader = screen.getByRole("heading", {
      name: /1: 12\/13\/21, 2:30 pm – 2:45 pm \(15m\)/i,
    });
    const firstSessionText = screen.getByText(
      /65 items • 142 questions • 6\.2 s\/q 106\/142 = 74\.6% correct/i
    );
    const lastSessionHeader = screen.getByRole("heading", {
      name: /7: 12\/17\/21, 10:21 am – 10:52 am \(31m\)/i,
    });
    const lastSessionText = screen.getByText(
      /123 items • 288 questions • 6\.4 s\/q 173\/288 = 60\.1% correct/i
    );

    expect(header).toBeInTheDocument();
    expect(firstSessionHeader).toBeInTheDocument();
    expect(firstSessionText).toBeInTheDocument();
    expect(lastSessionHeader).toBeInTheDocument();
    expect(lastSessionText).toBeInTheDocument();
  });
});
