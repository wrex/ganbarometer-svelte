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
  retrieveDays: "3",
  bgColor: "#000000",
  fillColor: "#00ff00",
  warnColor: "#ffff00",
  alertColor: "#ff0000",
  reviewsPer: "150",
  apprenticeItems: "100",
  acceptableMisses: "20",
  newKanjiWeight: "0.05",
  excessMissWeight: "0.03",
  reviewSessions: "sessions",
};

// Store #2: the user settings for Ganbarometer
export const gbSettings = writable(
  JSON.parse(localStorage.getItem(SETTINGSKEY)) ?? defaultSettings
);
gbSettings.subscribe((val) =>
  localStorage.setItem(SETTINGSKEY, JSON.stringify(val))
);
