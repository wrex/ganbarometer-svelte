import { writable, readable } from "svelte/store";

// Keys/indexes into localstorage
export const SETTINGSKEY = "gbSettings";

export const display = writable("chart");

const daysToReviewString = localStorage.getItem("daysToReview");
export const daysToReview = writable(
  daysToReviewString ? JSON.parse(daysToReviewString) : [4]
);
daysToReview.subscribe((val) => {
  localStorage.setItem("daysToReview", JSON.stringify(val));
});

// Grr. JSON.stringify() is NOT reversible with JSON.parse()
// because Dates get turned into strings
const unStringify = (summaries) => {
  let withStringDates = JSON.parse(summaries);
  return withStringDates.map((s) => {
    return { ...s, start: new Date(s.start), end: new Date(s.end) };
  });
};

const acString = localStorage.getItem("apprenticeCounts");
export const apprenticeCounts = writable(
  acString
    ? JSON.parse(acString)
    : {
        radicals: [0, 0, 0, 0],
        kanji: [0, 0, 0, 0],
        vocabulary: [0, 0, 0, 0],
      }
);
apprenticeCounts.subscribe((val) => {
  localStorage.setItem("apprenticeCounts", JSON.stringify(val));
});

const ssString = localStorage.getItem("sessionSummaries");
export const sessionSummaries = writable(ssString ? unStringify(ssString) : []);
sessionSummaries.subscribe((val) => {
  localStorage.setItem("sessionSummaries", JSON.stringify(val));
});

const rcString = localStorage.getItem("reviewCounts");
export const reviewCounts = writable(rcString ? unStringify(rcString) : []);
reviewCounts.subscribe((val) => {
  localStorage.setItem("reviewCounts", JSON.stringify(val));
});

export const defaultSettings = {
  position: "Top", // position: "Top" | "Below Forecast" | "Below SRS" | "Below Panels" | "Bottom"
  textColor: "#333333",
  bgColor: "#f4f4f4",
  fillColor: "#b4c0be",
  goodColor: "#59c273",
  warnColor: "#fbb623",
  alertColor: "#ff00aa",
  targetApprentice: 100,
  newRWeight: 0.75,
  newKWeight: 3.0,
  newVWeight: 1.0,
  targetSpeed: 7.0,
  madCutoff: 10.0,
  targetRevDay: 150,
  tzOffset: 0,
};

// Store #2: the user settings for Ganbarometer
export const gbSettings = writable(
  JSON.parse(localStorage.getItem(SETTINGSKEY)) ?? defaultSettings
);
gbSettings.subscribe((val) =>
  localStorage.setItem(SETTINGSKEY, JSON.stringify(val))
);
