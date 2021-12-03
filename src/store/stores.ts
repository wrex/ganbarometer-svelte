import { writable, readable } from "svelte/store";
import { getSessions } from "../API/Sessions";

declare var wkof: any;

// Keys/indexes into localstorage
export const SETTINGSKEY = "gbSettings";
export const TOKENKEY = "gbApiToken";

export const APITOKENREGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export const validApiToken = (token: string): boolean => {
  return token.match(APITOKENREGEX) !== null;
};

// If there is already a token for WKOF, use that as a default value
const wkofKey: string = localStorage.getItem("apiv2_key") ?? "";

// Store #1: the API token for https://docs.api.wanikani.com)
export const gbApiToken = writable(localStorage.getItem(TOKENKEY) ?? wkofKey);
gbApiToken.subscribe((val) => localStorage.setItem(TOKENKEY, val));

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
