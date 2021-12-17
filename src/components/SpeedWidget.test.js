/*
 * @jest-environment jsdom
 */

import SpeedWidget from "./SpeedWidget.svelte";
import { render, screen } from "@testing-library/svelte";
import { sessionSummaries } from "../store/stores";
import { fakeSessionSummaries } from "../mocks/fakeData";

const realData = fakeSessionSummaries;

describe("Speed Widget", () => {
  beforeEach(() => {
    sessionSummaries.set([]);
  });

  it("displays a gauge with speed of 0.0 by default", () => {
    render(SpeedWidget);
    const speedNav = screen.getByTestId("speedWidget");
    const gaugeCover = speedNav.querySelector(".gauge__cover");
    const value = gaugeCover.textContent;
    expect(value).toEqual("0.0");
  });

  it("displays a gauge with a speed of 6.2 with real data", () => {
    sessionSummaries.set(realData);
    render(SpeedWidget);
    const speedNav = screen.getByTestId("speedWidget");
    const gaugeCover = speedNav.querySelector(".gauge__cover");
    const value = gaugeCover.textContent;
    expect(value).toEqual("6.3");
  });
});
