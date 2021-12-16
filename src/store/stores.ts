import { writable, readable } from "svelte/store";

declare var wkof: any;

// Keys/indexes into localstorage
export const SETTINGSKEY = "gbSettings";

export const display = writable("chart");

export const daysToReview = writable("4");

export const sessionSummaries = writable([]);

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

const checkForNewReviews = () => false;

// sessionsStore: array of 0 or more cached sessions
// asynchronously updates in the background as new reviews are found

// Look into this: https://github.com/cdellacqua/svelte-async-readable
export const sessionsStore = readable([], (set) => {
  const sessions = [];
  set(sessions);

  const interval = setInterval(() => {
    const reviews = checkForNewReviews();
    if (reviews) {
      console.log("parse new reviews and set(sessions)");
    }
  }, 30000);

  return () => clearInterval(interval);
});
