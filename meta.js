const path = require("path");
const { pathToFileURL, URL } = require("url");
const pkg = require("./package.json");

const distURLBase = `https://github.com/wrex/ganbarometer-svelte/raw/main/published/v5/`;
const packageName = pkg.name;

const production = !process.env.ROLLUP_WATCH;
const baseUrl = path.join(__dirname, "dist");

let meta = {
  name: production ? packageName : packageName + " -> dev",
  version: pkg.version,
  description: pkg.description,
  homepage: pkg.homepage,
  author: pkg.author,
  license: "MIT-0",
  namespace: "https://github.com/wrex/",
  resource: {
    css: pathToFileURL(path.join(baseUrl, "bundle.css")),
  },
  match: [
    "http*://wanikani.com",
    "http*://www.wanikani.com",
    "http*://preview.wanikani.com",
    "http*://wanikani.com/dashboard",
    "http*://www.wanikani.com/dashboard",
    "http*://preview.wanikani.com/dashboard",
  ],
  // include: ["/^https://(www|preview).wanikani.com/(dashboard)?$/"],
  grant: ["GM_addStyle", "GM_getResourceText", "GM_xmlhttpRequest"],
  connect: ["github.com"],
  "run-at": "document-idle",
};

if (!production) {
  meta.require = [pathToFileURL(path.join(baseUrl, "bundle.user.js"))];
}

if (production) {
  meta.downloadURL = new URL("bundle.user.js", distURLBase);
  meta.updateURL = new URL("bundle.user.js", distURLBase);
  meta.resource.css = new URL("bundle.css", distURLBase);
}

module.exports = meta;
