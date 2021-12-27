const path = require("path");
const { pathToFileURL, URL } = require("url");
const pkg = require("./package.json");

const distURLBase = `https://raw.githubusercontent.com/wrex/ganbarometer-svelte/main/published/beta0/`;
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
  // match: ["https://www.wanikani.com/dashboard"],
  include: ["/^https://(www|preview).wanikani.com/(dashboard)?$/"],
  grant: ["GM_addStyle", "GM_getResourceText", "GM_xmlhttpRequest"],
  connect: ["github.com"],
  "run-at": "document-idle",
};

if (!production) {
  meta.require = [pathToFileURL(path.join(baseUrl, "bundle.js"))];
}

if (production) {
  meta.downloadURL = new URL("bundle.js", distURLBase);
  meta.updateURL = new URL("bundle.js", distURLBase);
  meta.resource.css = new URL("bundle.css", distURLBase);
}

module.exports = meta;
