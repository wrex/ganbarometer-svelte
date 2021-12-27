# The GanbarOmeter (svelte version)

This is a [tampermonkey](https://www.tampermonkey.net/) user script
intended for people learning to read Japanese kanji characters with
[Wanikani](https://www.wanikani.com/about).

## User interface

![Graph view](./assets/graphs-view.png)

This shows the three primary widgets, the navigation to display graphs or
data-tables, a slider to change the number of days worth of reviews to retrieve,
an icon to launch @rfindley's Self-Study quiz, and an icon to change the
settings.

The GanbarOmeter gauge is based on the number and type of items in the Apprentice queue
(the first four SRS stages). Basically, a value of 50% (straight-up display)
indicates a normal level of difficulty. You may want to slow down doing lessons
if the gauge starts to increase.

The speed gauge show how long on average it takes you to answer an individual
reading or meaning question.

Finally, the review accuracy graph shows the number of reviews each day as well
as the percentage of _items_ answered correctly the first time (both reading and
meaning).

![Range slider](./assets/range-slider.png)

You can retrieve between one and seven days of reviews.

![Hovering over and accuracy bar](./assets/accuracy-hover.png)

If you hover your mouse over an accuracy bar, it displays the number of review
items on that day as well as how many were answered correctly the first time
(both reading and meaning).

![Data view](./assets/data-view.png)

The data view shows the information in tabular form.

Note that the speed gauge displays the number of _sessions_ (consecutive strings
of reviews). It performs a statistical algorithm called the [median absolute
deviation](https://en.wikipedia.org/wiki/Median_absolute_deviation) on the
intervals between review records to find sessions.

Note that the speed table shows the _question_ accuracy (the percentage of individual
reading or writing questions answered correctly) while the review accuracy table
displays _item_ accuracy (the percentage of review items where _both_ the
reading and meaning were answered correctly the first time).

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
Test Driven Development.

The basic CSS for the dial gauges came from [this excellent tutorial by
dcode-software](https://youtu.be/FnUkVcQ_3CQ). I stole the basic layout of the
BarChart from this [Codepen by Ion Emil
Negoita](https://codepen.io/inegoita/pen/YMrJGY).

Shout-out to Basar Buyukkahraman's wonderful course on [TDD
with Svelte](https://www.udemy.com/course/svelte-with-test-driven-development/).

The code leverage @rfindley's wonderful WaniKani Open Framework user script to
retrieve and cache results where possible. He and @kumirei from the Wanikani
community helped me get started with this user script business!

If you want to help with development or simply want to validate that nothing
nefarious is included in the user script:

1. You'll need to enable `Allow access to file URL's` in the Chrome extension
   for tampermonkey. This is conceivably a security risk, so you may want to
   disable the setting again after finishing your development work. See
   [tampermonkey-svelte](https://github.com/lpshanley/tampermonkey-svelte) for details.

2. Download the source from the [github repository](https://github.com/wrex/ganbarometer-svelte).

3. Run `npm install` to install all the dependencies for compilation.

4. Before compiling or running the code, you may want to type `npm run test`. All tests should pass.

5. In one shell window, type `tsc -w` to run the typescript compiler in watch mode.

6. In another shell window, type `npm run dev` to compile a (un-minified) dev version of the code and prepare for "live" updates.

7. Copy the top several lines of the file `./dist/bundle.js`. Just copy the header itself, everything through and including the `// ==/UserScript==` line. Don't copy any actual code.

8. In the tampermonkey dashboard, click the "+" tab and paste in the headers (again, just the headers) from step 6. Save the file. This will install the `ganbarometer-svelte ->dev` script and prepare it for "live" updates. If you browse to the WK dashboard, and enable this version of the script, any changes you make to the source code should show up when you refresh the page.

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
