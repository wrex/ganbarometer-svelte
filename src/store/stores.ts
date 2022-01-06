import { writable } from "svelte/store";

// Keys/indexes into localstorage
export const SETTINGSKEY = "gbSettings";
const VERSION = "4.0.3"; // Increment whenever incompatible changes made to stuff in localstorage

export const display = writable("chart");

const defaults = {
  daysToReview: [4],
  srsCounts: {
    expectedDaily: 0,
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
  },
  sessionSummaries: [],
  reviewCounts: [],
  gbSettings: {
    version: VERSION,
    position: "Top",
    bgColor: "#f4f4f4",
    trackColor: "#e0e0e0",
    textColor: "#333333",
    hlTextColor: "#fbb623",
    fillColor: "#59c273",
    warnColor: "#fbb623",
    hlTrackColor: "#d1e8d4",
    gbMinTarget: 130,
    gbMaxTarget: 170,
    aboveTerm: "休",
    belowTerm: "努力",
    inRangeTerm: "良",
    newRWeight: 0.6,
    newKWeight: 3.0,
    newVWeight: 1.0,
    apprWeight: 1.0,
    guruWeight: 0.1,
    masterWeight: 0,
    enlightenedWeight: 0,
    targetQPM: 8.5,
    minQPM: 7.0,
    maxQPM: 10.0,
    madCutoff: 10.0,
    rpdMin: 120,
    rpdMax: 180,
    tzOffset: 0,
    rQuiz: false,
    kQuiz: true,
    vQuiz: false,
  },
};

const daysToReviewString = localStorage.getItem("daysToReview");
export const daysToReview = writable(
  daysToReviewString ? JSON.parse(daysToReviewString) : defaults.daysToReview
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
  countString ? JSON.parse(countString) : defaults.srsCounts
);
srsCounts.subscribe((val) => {
  localStorage.setItem("srsCounts", JSON.stringify(val));
});

const ssString = localStorage.getItem("sessionSummaries");
export const sessionSummaries = writable(
  ssString ? unStringify(ssString) : defaults.sessionSummaries
);
sessionSummaries.subscribe((val) => {
  localStorage.setItem("sessionSummaries", JSON.stringify(val));
});

const rcString = localStorage.getItem("reviewCounts");
export const reviewCounts = writable(
  rcString ? unStringify(rcString) : defaults.reviewCounts
);
reviewCounts.subscribe((val) => {
  localStorage.setItem("reviewCounts", JSON.stringify(val));
});

export const defaultSettings = defaults.gbSettings;

export const gbSettings = writable(
  JSON.parse(localStorage.getItem(SETTINGSKEY)) ?? defaultSettings
);
gbSettings.subscribe((val) => {
  if (val.version === VERSION) {
    localStorage.setItem(SETTINGSKEY, JSON.stringify(val));
  } else {
    localStorage.setItem(SETTINGSKEY, JSON.stringify(defaultSettings));
    daysToReview.set(defaults.daysToReview);
    srsCounts.set(defaults.srsCounts);
    sessionSummaries.set(defaults.sessionSummaries);
    reviewCounts.set(defaults.reviewCounts);
  }
});
