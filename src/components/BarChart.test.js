/*
 * @jest-environment jsdom
 */

import BarChart from "./BarChart.svelte";
import { render, screen } from "@testing-library/svelte";

describe("BarChart", () => {
  it("creates a bar-chart table to render", () => {
    render(BarChart, { values: "[1,2,3]" });
    const chart = screen.getByRole("table", { name: "bar-chart" });
    expect(chart).toBeInTheDocument();
  });
  it("creates labels for each label passed", () => {
    render(BarChart, { values: "[1,2,3]", labels: '["a", "b", "c"]' });
    const cols = screen.getAllByRole("columnheader", { name: "label" });
    expect(cols[0]).toHaveTextContent("a");
    expect(cols[1]).toHaveTextContent("b");
    expect(cols[2]).toHaveTextContent("c");
  });
  it("creates a row for the values", () => {
    render(BarChart, { values: "[1,2,3]" });
    const row = screen.getByRole("row", { name: "values" });
    expect(row).toBeInTheDocument();
  });
  it("creates a cell for each value passed", () => {
    render(BarChart, { values: "[1,2,3]" });
    const cells = screen.getAllByRole("cell", { name: "value" });
    expect(cells[0]).toHaveTextContent("1");
    expect(cells[1]).toHaveTextContent("2");
    expect(cells[2]).toHaveTextContent("3");
  });
});
