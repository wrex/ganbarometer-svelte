import { writable } from "svelte/store";

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

const countString = localStorage.getItem("srsCounts");
export const srsCounts = writable(
  countString
    ? JSON.parse(countString)
    : {
        new: {
          radicals: 0,
          kanji: 0,
          vocabulary: 0,
          total: 0,
        },
        apprentice: {
          early: 0,
          late: 0,
          total: 0,
        },
        lesson: 0,
        guru: 0,
        master: 0,
        enlightened: 0,
        burned: 0,
      }
);
srsCounts.subscribe((val) => {
  localStorage.setItem("srsCounts", JSON.stringify(val));
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
  altColor: "#489c5c",
  goodColor: "#59c273",
  warnColor: "#fbb623",
  alertColor: "#ff00aa",
  gbMinTarget: 130,
  gbMaxTarget: 170,
  belowTerm: "不足",
  inRangeTerm: "良",
  aboveTerm: "休",
  newRWeight: 0.6,
  newKWeight: 3.0,
  newVWeight: 1.0,
  apprWeight: 1.0,
  guruWeight: 0.1,
  masterWeight: 0,
  enlightenedWeight: 0,
  targetSpeed: 7.0,
  speedMin: 0.2,
  speedMax: 0.8,
  madCutoff: 10.0,
  rpdMin: 120,
  rpdMax: 180,
  tzOffset: 0,
  rQuiz: false,
  kQuiz: true,
  vQuiz: false,
};

// Store #2: the user settings for Ganbarometer
export const gbSettings = writable(
  JSON.parse(localStorage.getItem(SETTINGSKEY)) ?? defaultSettings
);
gbSettings.subscribe((val) =>
  localStorage.setItem(SETTINGSKEY, JSON.stringify(val))
);
