import { writable } from "svelte/store";

const storedSettings = JSON.parse(window.localStorage.getItem("gbSettings"));

export const settings = writable({
  apiKey: storedSettings?.apiKey,
});

settings.subscribe((value) => {
  window.localStorage.setItem("gbSettings", JSON.stringify(value));
});
