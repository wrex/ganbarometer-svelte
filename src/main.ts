import App from "./App.svelte";
import { gbSettings } from "./store/stores";

let position: string;
const unsubSettings = gbSettings.subscribe((val) => (position = val.position));

// let progressDivParent = document.querySelector(".dashboard .container .row .span12");
// let progressDivParent = document.querySelector(
//   ".dashboard .container .row .span12"
// );

const targetElement = document.querySelector(".dashboard .span12");

let options = { target: targetElement, anchor: null };
switch (position) {
  // position: "Top" | "Below Forecast" | "Below SRS" | "Below Panels" | "Bottom"
  case "Top":
    options.anchor = targetElement.querySelector(".progress-and-forecast");
    break;
  case "Below Forecast":
    options.anchor = targetElement.querySelector(".srs-progress");
    break;
  case "Below SRS":
    options.anchor = targetElement.querySelector(".row");
    break;
  case "Below Panels":
    options.anchor = targetElement.querySelector(".row:last-of-type");
    break;
  default:
    // Bottom
    options.anchor = null;
}

const app = new App(options);

export default app;
