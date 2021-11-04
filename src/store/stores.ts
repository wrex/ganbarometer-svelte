import { writable } from "svelte/store";

export const LOCALSTORAGEKEY = "gbSettings";

export const APITOKENREGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export const validApiToken = (token: string): boolean => {
  return token.match(APITOKENREGEX) !== null;
};

interface Settings {
  apiKey: string;
  retrieveDays: number | string;
  bgColor: string;
  fillColor: string;
  warnColor: string;
  alertColor: string;
  reviewsPer: number | string;
  apprenticeItems: number | string;
  acceptableMisses: number | string;
  newKanjiWeight: number | string;
  excessMissWeight: number | string;
  reviewSessions: string;
}

export const defaults: Settings = {
  apiKey: "",
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

// Grab any settings already stored in browser's local storage
const storedSettings: Settings =
  JSON.parse(window.localStorage.getItem(LOCALSTORAGEKEY)) || {};

// Fallback to apiv2_key from WKOF if present
if (!storedSettings.apiKey) {
  storedSettings.apiKey =
    window.localStorage.getItem("apiv2_key")?.toString() || "";
}

export const settings = writable({ ...defaults, ...storedSettings });

settings.subscribe((value) => {
  window.localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(value));
});
