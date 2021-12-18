import { writable, readable } from "svelte/store";

declare var wkof: any;

// Keys/indexes into localstorage
export const SETTINGSKEY = "gbSettings";

export const display = writable("chart");

export const daysToReview = writable("4");

// Grr. JSON.stringify() is NOT reversible with JSON.parse()
// because Dates get turned into strings
const unStringify = (summaries) => {
  let withStringDates = JSON.parse(summaries);
  return withStringDates.map((s) => {
    return { ...s, start: new Date(s.start), end: new Date(s.end) };
  });
};

export const sessionSummaries = writable(
  localStorage.getItem("sessionSummaries")
    ? unStringify(localStorage.getItem("sessionSummaries"))
    : []
);
sessionSummaries.subscribe((val) => {
  localStorage.setItem("sessionSummaries", JSON.stringify(val));
});

export const defaultSettings = {
  textColor: "#eeeeee",
  bgColor: "#000000",
  fillColor: "#333333",
  goodColor: "#00ff00",
  warnColor: "#ffff00",
  alertColor: "#ff0000",
  tzOffset: 0,
  targetApprentice: 100,
  newRWeight: 0.75,
  newKWeight: 3.0,
  newVWeight: 1.0,
  targetSpeed: 7.0,
  madCutoff: 10.0,
  targetRevDay: 150,
};

// Store #2: the user settings for Ganbarometer
export const gbSettings = writable(
  JSON.parse(localStorage.getItem(SETTINGSKEY)) ?? defaultSettings
);
gbSettings.subscribe((val) =>
  localStorage.setItem(SETTINGSKEY, JSON.stringify(val))
);
