/*
 * @jest-environment jsdom
 */

import Gauge from "./Gauge.svelte";
import { render, screen } from "@testing-library/svelte";

describe("Gauge", () => {
  it("displays a dial gage at 50% by default", () => {
    render(Gauge);
    const gauge = screen.getByText("50%");
    expect(gauge).toBeInTheDocument();
  });

  it("displays a dial with a passed value", () => {
    render(Gauge, { value: "0.12" });
    const gauge = screen.getByText("12%");
    expect(gauge).toBeInTheDocument();
  });

  // Normally bad testing practice to test implementation, but we want to test
  // styling of the fill (rotation value)
  it("styles the fill with correct rotation amount", () => {
    render(Gauge, { value: "0.8" });
    const fill = document.querySelector(".gauge__fill");
    const computedStyles = window.getComputedStyle(fill);
    const rotation = computedStyles.getPropertyValue("transform");
    expect(rotation).toBe("rotate(0.4000turn)");
  });
});
