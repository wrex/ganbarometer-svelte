const { mdsvex } = require("mdsvex");
const sveltePreprocess = require("svelte-preprocess");

module.exports = {
  preprocess: [mdsvex(), sveltePreprocess()],
};
