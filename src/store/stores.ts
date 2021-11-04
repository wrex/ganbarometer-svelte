import { writable } from "svelte/store";
import type { string } from "yup";

interface Settings {
  apiKey: string;
  retrieveDays: string;
  bgColor: string;
  fillColor: string;
  warnColor: string;
  alertColor: string;
  reviewsPer: string;
  apprenticeItems: string;
  acceptableMisses: string;
  newKanjiWeight: string;
  excessMissWeight: string;
  reviewSessions: string;
}

const storedSettings: Settings =
  JSON.parse(window.localStorage.getItem("gbSettings")) || {};

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
  window.localStorage.setItem("gbSettings", JSON.stringify(value));
});
