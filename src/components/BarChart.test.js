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
  it("creates a row for each value passed", () => {
    render(BarChart, { values: "[1,2,3,4]" });
    const row = screen.getAllByLabelText("values");
    expect(row.length).toBe(4);
  });
  it("creates a label for each label passed", () => {
    render(BarChart, { values: "[1,2,3]", labels: '["a", "b", "c"]' });
    const cols = screen.getAllByRole("rowheader", { name: "label" });
    expect(cols[0]).toHaveTextContent("a");
    expect(cols[1]).toHaveTextContent("b");
    expect(cols[2]).toHaveTextContent("c");
  });
  it("creates a cell for each value passed", () => {
    render(BarChart, { values: "[1,2,3]" });
    const cells = screen.getAllByRole("cell", { name: "value" });
    expect(cells[0]).toHaveTextContent("1");
    expect(cells[1]).toHaveTextContent("2");
    expect(cells[2]).toHaveTextContent("3");
  });
  it("styles height appropriate to values passed", () => {
    render(BarChart, { values: "[40,100,80]" });
    const rows = screen.getAllByRole("row", { name: "values" });
    const heights = [];
    heights.push(window.getComputedStyle(rows[0]).getPropertyValue("height"));
    heights.push(window.getComputedStyle(rows[1]).getPropertyValue("height"));
    heights.push(window.getComputedStyle(rows[2]).getPropertyValue("height"));
    expect(heights[0]).toBe("40%");
    expect(heights[1]).toBe("100%");
    expect(heights[2]).toBe("80%");
  });

  // I don't know how to grab the counter in the pseudo element!
  it.todo("Labels the top bar with the max value"); //, () => {
  //   render(BarChart, { values: "[10,30,20]" });
  //   const tbody = screen.getByTestId("chart-body");
  //   const before = window.getComputedStyle(tbody, ":before");
  //   expect(before["content"]).toBe("0");
  // });
});
