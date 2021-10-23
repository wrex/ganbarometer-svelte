/*
 * @jest-environment jsdom
 */

import Gauge from "./Gauge.svelte";
import { render, screen } from "@testing-library/svelte";

describe("Gauge", () => {
  it("displays a dial gage", () => {
    render(Gauge);
    dial = screen.getByTestId("dial");
    expect(dial).toBeInTheDocument();
  });
});
