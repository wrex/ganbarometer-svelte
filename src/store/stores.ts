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
  bgColor: "",
  fillColor: "",
  warnColor: "",
  alertColor: "",
  reviewsPer: "150",
  apprenticeItems: "100",
  acceptableMisses: "20",
  newKanjiWeight: "0.05",
  excessMissWeight: "0.03",
  reviewSessions: "sessions",
};

const storedSettings: Settings =
  JSON.parse(window.localStorage.getItem(LOCALSTORAGEKEY)) || {};

// Fallback to apiv2_key from WKOF if present
if (!storedSettings.apiKey) {
  storedSettings.apiKey =
    window.localStorage.getItem("apiv2_key")?.toString() || "";
}

export const settings = writable({
  apiKey: storedSettings.apiKey ? storedSettings.apiKey : "",
  retrieveDays: storedSettings.retrieveDays ? storedSettings.retrieveDays : "",
  bgColor: storedSettings.bgColor ? storedSettings.bgColor : "",
  fillColor: storedSettings.fillColor ? storedSettings.fillColor : "",
  warnColor: storedSettings.warnColor ? storedSettings.warnColor : "",
  alertColor: storedSettings.alertColor ? storedSettings.alertColor : "",
  reviewsPer: storedSettings.reviewsPer ? storedSettings.reviewsPer : "",
  apprenticeItems: storedSettings.apprenticeItems
    ? storedSettings.apprenticeItems
    : "",
  acceptableMisses: storedSettings.acceptableMisses
    ? storedSettings.acceptableMisses
    : "",
  newKanjiWeight: storedSettings.newKanjiWeight
    ? storedSettings.newKanjiWeight
    : "",
  excessMissWeight: storedSettings.excessMissWeight
    ? storedSettings.excessMissWeight
    : "",
  reviewSessions: storedSettings.reviewSessions
    ? storedSettings.reviewSessions
    : "",
});

settings.subscribe((value) => {
  window.localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(value));
});
