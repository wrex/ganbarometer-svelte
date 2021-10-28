import App from "./App.svelte";
// let progressDivParent = document.querySelector(".dashboard .container .row .span12");
let progressDivParent = document.querySelector(".dashboard .container .row .span12");
const app = new App({
    target: progressDivParent,
    anchor: progressDivParent.querySelector(".progress-and-forecast"),
});
export default app;
//# sourceMappingURL=main.js.map