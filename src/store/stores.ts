import { writable } from "svelte/store";

export const settings = writable({
  apiKey: "",
});

settings.subscribe((value) => {
  window.localStorage.setItem("gbSettings", JSON.stringify(value));
});
