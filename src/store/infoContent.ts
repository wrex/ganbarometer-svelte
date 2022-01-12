export const infoContent = {
  gbRange: `
<p>This controls the desired range of GanbarOmeter values. This is the highlighted area on the dial.</p>
  `,
  gbLabel: `
<p>These three settings control what is displayed in the center when the needle is <em>below</em>
the target range, <em>in range</em>, or <em>above<em> the range</p>
  `,
  gbWeight: `
<p>These weights calculate a <em>figure of merit</em> based on the composition of your assignment
queue. Your assingments are indexed by SRS stage: Stages 1 & 2 are called "early apprentice," 3 & 4 are 
"late apprentice," 5 & 6 are "guru," stage 7 is "master," and lastly, stage 8 is "enlightened."</p>

<p> The default values basically calculate:</p>
<pre>
Apprentice-items + guru-items/10
</pre>

<p>The only extra wrinkle is that you can weight items in the early apprentice stages separately.
The default values make kanji in stages1-2 count 3 times as much as other items, and radicals 0.75 times as much.</p>
  `,
  gbQuiz: `
<p>These three checkboxes control which <em>types</em> (radical/kanji/vocabulary) of items in 
apprentice stages 1 and two are quizzed by the self-study quiz script (if installed) tests</p>
  `,
  retrieveDays: `
<p>How many days of reviews to retrieve to calculate speed/session, and review information.</p>
<p>Setting this to 1 will retrieve just the current day (from midnight last night). Setting it to 7 will 
six full days of reviews plus whatever reviews were performed today.</p>
  `,
  answerSpeed: `
<p>The desired range of answer speeds (in questions per minute). This is the highlighred area on the dial.</p>
  `,
  rpd: `
<p>The desired range of reviews per day. This is the highlighted area on the Reviews bar chart.
  `,
  color: `
<p>Color pickers to override the default theme. Click the "Light theme" or "Dark theme" buttons to set all colors
simultaneously, or click on any individual color picker to override just that color<p>
<p>The color sample at the top of this dialog will reflect your choices.</p>
  `,
  position: `
<p>This controls where on the Wanikani dashboard you would like the GanbarOmeter gauges to display.</p>
  `,
  MAD: `
<p>You should <strong>not</strong> need to adjust this value, but lower values will cause more sessions to be found.</p>
<p>The Wanikani API creates a review record after answering all parts for that item correctly (reading and meaning).
Each review record contains a timestamp for when the review was started.</p>
<p>A session is a string of consecutive reviews. Since only the interval between review records is known, this script 
uses a statistical technique called the <a href="https://en.wikipedia.org/wiki/Median_absolute_deviation">Median Absolute 
Deviation</a> to determine "outlier" intervals between review records (indicating the start of a new session).</p>
  `,
};
