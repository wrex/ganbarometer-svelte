import { writable } from "svelte/store";

export const LOCALSTORAGEKEY = "gbSettings";
export const APITOKENREGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export const validApiToken = (token) => {
  return token.match(APITOKENREGEX) !== null;
};

// If there is already a token for WKOF, use that as a default value
const wkofKey = localStorage.getItem("apiv2_key") ?? "";

// Store #1: the API token for https://docs.api.wanikani.com)
export const gbApiToken = writable(
  localStorage.getItem("gbApiToken") ?? wkofKey
);
gbApiToken.subscribe((val) => localStorage.setItem("gbApiToken", val));

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
  localStorage.getItem("gbSettings") ?? defaultSettings
);
gbSettings.subscribe((val) =>
  localStorage.setItem("gbSettings", JSON.stringify(val))
);
