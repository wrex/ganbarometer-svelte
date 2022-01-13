import { writable, get } from "svelte/store";

import type { SessionSummary, ReviewCount } from "../API/API";

// Keys/indexes into localstorage
export const SETTINGSKEY = "gbSettings";
const VERSION = "9.0.5"; // Increment whenever incompatible changes made to stuff in localstorage

export const display = writable("chart");

interface SrsCountsType {
  expectedDaily: number;
  new: {
    radicals: number;
    kanji: number;
    vocabulary: number;
    total: number;
  };
  apprentice: {
    early: number;
    late: number;
    total: number;
  };
  lesson: number;
  guru: number;
  master: number;
  enlightened: number;
  burned: number;
}

interface SettingsType {
  version: string;
  daysToReview: number;
  position: "Top" | "Below Forecast" | "Below SRS" | "Below Panels" | "Bottom";
  bgColor: string;
  trackColor: string;
  textColor: string;
  hlTextColor: string;
  fillColor: string;
  warnColor: string;
  hlTrackColor: string;
  gbMinTarget: number;
  gbMaxTarget: number;
  aboveTerm: string;
  belowTerm: string;
  inRangeTerm: string;
  newRWeight: number;
  newKWeight: number;
  newVWeight: number;
  apprWeight: number;
  guruWeight: number;
  masterWeight: number;
  enlightenedWeight: number;
  minQPM: number;
  maxQPM: number;
  madCutoff: number;
  rpdMin: number;
  rpdMax: number;
  tzOffset: number;
  rQuiz: boolean;
  kQuiz: boolean;
  vQuiz: boolean;
}

interface DefaultsType {
  srsCounts: SrsCountsType;
  sessionSummaries: SessionSummary[];
  reviewCounts: ReviewCount[];
  gbSettings: SettingsType;
}

const defaults: DefaultsType = {
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
    daysToReview: 4,
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

const migrateGbSettings = (stored: SettingsType): void => {
  if (!stored?.version?.match(/^4\.0/)) {
    gbSettings.set(defaults.gbSettings);
    return;
  }

  let newSettings: SettingsType = defaults.gbSettings;

  // Replace settings that have the same key
  Object.keys(defaults.gbSettings).forEach((key) => {
    newSettings[key] = stored[key] ?? defaults.gbSettings[key];
  });
  newSettings.version = VERSION; // update to new VERSION string
  gbSettings.set(newSettings);
};

const migrateSrsCounts = (oldVersion: string): void => {
  if (!oldVersion.match(/^4\.0/)) {
    srsCounts.set(defaults.srsCounts);
    return;
  }

  const stored = get(srsCounts);
  let newCounts: SrsCountsType = defaults.srsCounts;
  // Replace counts that have the same key
  Object.keys(defaults.srsCounts).forEach((key) => {
    newCounts[key] = stored[key] ?? defaults.srsCounts[key];
  });
  srsCounts.set(newCounts);
};

const migrateSessionSummaries = (oldVersion: string): void => {
  if (!oldVersion.match(/^4\.0/)) {
    sessionSummaries.set(defaults.sessionSummaries);
    return;
  }

  const stored = get(sessionSummaries);
  let newSummaries: SessionSummary[] = defaults.sessionSummaries;
  // Replace summaries that have the same key
  Object.keys(defaults.sessionSummaries).forEach((key) => {
    newSummaries[key] = stored[key] ?? defaults.sessionSummaries[key];
  });
  sessionSummaries.set(newSummaries);
};

const migrateReviewCounts = (oldVersion: string): void => {
  if (!oldVersion.match(/^4\.0/)) {
    reviewCounts.set(defaults.reviewCounts);
    return;
  }

  const stored = get(reviewCounts);
  let newCounts: ReviewCount[] = defaults.reviewCounts;
  // Replace counts that have the same key
  Object.keys(defaults.reviewCounts).forEach((key) => {
    newCounts[key] = stored[key] ?? defaults.reviewCounts[key];
  });
  reviewCounts.set(newCounts);
};

const migrateSettings = (stored: SettingsType): void => {
  const old = stored.version;
  migrateGbSettings(stored);
  migrateSrsCounts(old);
  migrateSessionSummaries(old);
  migrateReviewCounts(old);
};

export const gbSettings = writable(
  JSON.parse(localStorage.getItem(SETTINGSKEY)) ?? defaultSettings
);
gbSettings.subscribe((val: SettingsType) => {
  if (val?.version === VERSION) {
    localStorage.setItem(SETTINGSKEY, JSON.stringify(val));
  } else {
    migrateSettings(val);
  }
});
