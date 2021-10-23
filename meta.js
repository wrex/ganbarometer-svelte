const path = require("path");
const { pathToFileURL } = require("url");
const pkg = require("./package.json");

const distURLBase = `https://github.com/wrex/ganbarometer-svelte/dist`;
const packageName = pkg.name;

const production = !process.env.ROLLUP_WATCH;
const baseUrl = !production ? path.join(__dirname, "dist") : distURLBase;

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
  match: ["https://www.wanikani.com/dashboard"],
  grant: ["GM_addStyle", "GM_getResourceText", "GM_xmlhttpRequest"],
  connect: ["github.com"],
  copyright: "©2021 Rex Robert Walters",
  "run-at": "document-idle",
};

if (!production) {
  meta.require = [pathToFileURL(path.join(baseUrl, "bundle.js"))];
}

if (production) {
  meta.downloadURL = pathToFileURL(path.join(baseUrl, "bundle.js"));
  meta.updateURL = pathToFileURL(path.join(baseUrl, "bundle.js"));
}

module.exports = meta;
