# The GanbarOmeter (svelte version)

This is intended for people learning to read Japanese kanji characters with
[Wanikani](https://www.wanikani.com/about).

Install as a user script using [tampermonkey](https://www.tampermonkey.net/).

## Beta version installation

1. Navigate to your dashboard, click on the tampermonkey settings, and disable the current ganbarometer script (there is no point in running both).

2. Open the tampermonkey dashboard, click the "Utilities" tab. At the very bottom you will see "Install from URL". Cut and paste this URL into the box, and click "Install": https://raw.githubusercontent.com/wrex/ganbarometer-svelte/main/published/beta0/bundle.js

3. Click "Install" on the next page. Then navigate back to your dashboard and refresh the page. You should see the new version shown in the screenshots in the previous post.

## Notes

I developed this using the [svelte](https://svelte.dev) compiler, using [typescript](https://typescriptlang.org) for
compile-time type checking, [jest](https://jestjs.io) as a testing framework, and [Testing
Library](https://testing-library.com) for additional testing semantics. I used Lucas Shanley's
wonderful [tampermonkey-svelte](https://github.com/lpshanley/tampermonkey-svelte) template to package up my code as a user script.

It uses two primary widgets: a `Gauge.svelte` to display a dial gauge, and
`BarChart.svelte` to render a bar chart. Both were hand developed by me using
Test Driven Development. I stole the basic layout of the BarChart from this [Codepen
by Ion Emil Negoita](https://codepen.io/inegoita/pen/YMrJGY).

Shout-out to Basar Buyukkahraman's wonderful course on [TDD
with Svelte](https://www.udemy.com/course/svelte-with-test-driven-development/).

The code leverage @rfindley's wonderful WaniKani Open Framework user script to
retrieve and cache results where possible. He and @kumirei from the Wanikani
community helped me get started with this user script business!

If you want to help with development or simply want to validate that nothing
nefarious is included in the user script:

1. Download the source from the [github repository](https://github.com/wrex/ganbarometer-svelte).

2. Run `npm install` to install all the dependencies for compilation.

3. Before compiling or running the code, you may want to type `npm run test`. All tests should pass.

4. In one shell window, type `tsc -w` to run the typescript compiler in watch mode.

5. In another shell window, type `npm run dev` to compile a (un-minified) dev version of the code and prepare for "live" updates.

6. Copy the top several lines of the file `./dist/bundle.js`. Just copy the header itself, everything through and including the `// ==/UserScript==` line. Don't copy any actual code.

7. In the tampermonkey dashboard, click the "+" tab and paste in the headers (again, just the headers) from step 6. Save the file. This will install the `ganbarometer-svelte ->dev` script and prepare it for "live" updates. If you browse to the WK dashboard, and enable this version of the script, any changes you make to the source code should show up when you refresh the page.

This is still BETA code: I plan a fair bit of clean-up and refactoring. Please be kind (I'm just an amateur) but any thoughts or comments are quite welcome. Hopefully, it isn't too hard to figure out the current code organization. It's definitely FAR better code than the currently published version of the script.

## TODO

- more tests
- "debounce" changes to retrieval days setting
- clean up Modal stuff for settings screen
- Style the settings dialog
  - use all settings values incl. tz offset
  - add warn/error color ranges to gauges
  - add warn/error color to accuracy bars if % too low
  - use CSS variables everywhere
- single object in localstorage?
- Cache raw reviews (write a replacement for Review Cache)

#### Other attributions

The settings icon is from [Neha
Tyagi](https://thenounproject.com/tyagineha.2112/).
