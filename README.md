# The GanbarOmeter (svelte version)

This is intended for people learning to read Japanese kanji characters with
[Wanikani](https://www.wanikani.com/about).

This is installed as a user script using tampermonkey.

TODO: Installation instructions

I developed this using the [svelte](#TODO) compiler, using [typescript](#TODO) for
compile-time type checking, [babel](#TODO) to "transpile" from typescript and
ES6 syntax to ES5 javascript, [jest](#TODO) as a testing framework, and [Testing
Library](#TODO) for additional testing semantics. I used Lucas Shanley's
wonderful [tampermonkey-svelte] template to package up my code as a user script.

It uses two primary widgets: a `Gauge.svelte` to display a dial gauge, and
`BarChart.svelte` to render a bar chart. Both were hand developed by me using
Test Driven Development. I stole the layout of the BarChart from this [Codepen
by Ion Emil Negoita](https://codepen.io/inegoita/pen/YMrJGY).

Shout-out to Basar Buyukkahraman's wonderful course on [TDD
with Svelte](https://www.udemy.com/course/svelte-with-test-driven-development/).

The code leverage rfindley's wonderful WaniKani Open Framework user script to
retrieve and cache results where possible. He and kumirei from the Wanikani
community helped me get started with this user script business!

If you want to help with development or simply want to validate that nothing
nefarious is included in the user script:

1. Download the code from [github](https://github.com/wrex/ganbarometer-svelte).
2. Run `npm install`;
3. Run `npm run test` to ensure all the tests are passing.
4. Run `npm run build` to create the bundle.user.js userscript in the `dist`
   subdirectory. This should be identical to the distributed version.

## TODO

- Change getSessions to use Median Absolute Deviation to find sessions

- Wire everything up to fetch without caching (add caching later)

- Modify settings to use vest instead of yup, and eliminate forms library.

- Change reviews/day to a bar graph

- Change speed to a dial gauge

- get reviews at app startup and asynch re-render when new data returned.

- Create components for difficulty/workload/speed that display Graphs OR data
