<script>
  import Gauge from "./Gauge.svelte";
  import {display, daysToReview} from "../store/stores";

  export let reviewDayCounts;

  // save some screen real-estate below
  let revs = reviewDayCounts.reviews;

  const dowString = (date) => { 
    return new Intl.DateTimeFormat('en-US', {weekday: "short"} ).format(date); }
  ;

  let startDayOfWeeks = revs.map(r => dowString(r.start));
  let endDayOfWeeks = revs.map(r => dowString(r.end));

  let totalReviews = revs.reduce((acc,r) => acc += r.count, 0);
  let targetReviews = reviewDayCounts.targetReviewsPerDay * $daysToReview;

  let overallAccuracy = revs.map(r => r.accuracy).reduce((acc, a) => acc += a, 0) / revs.length;
  let readingAccuracy = revs.map(r => r.reading_accuracy).reduce((acc, a) => acc += a, 0) / revs.length;
  let meaningAccuracy = revs.map(r => r.meaning_accuracy).reduce((acc, a) => acc += a, 0) / revs.length;
</script>

<div class="gbWidget">
  <h1 class="gbHeader">Accuracy</h1>
  {#if $display === "chart"}
    <Gauge value={ overallAccuracy } />
    <div class="units">correct first time</div>
  {:else}
    <div data-testid="accuracy-table">
      <table class="gbContent">
        <tr>
          <th>Overall</th>
          <td>{ (100*readingAccuracy).toFixed() }<span
          class="secondary">%r</span> { (100*meaningAccuracy).toFixed() }<span
          class="secondary">%m</span></td>
        </tr>
        <tr>
          <th>Latest ({dowString(revs[revs.length - 1].start)})</th>
          <td>{ 100 * revs[revs.length - 1].reading_accuracy }<span
          class="secondary">%r</span> { 100 * revs[revs.length - 1].meaning_accuracy }<span
          class="secondary">%m</span></td>
        </tr>
        <tr>
          <th>Reading {dowString(revs[0].start)} &ndash; {dowString(revs[revs.length - 2].start)}:</th>
          <td>{revs.slice(0, -1).map(r => r.reading_accuracy * 100).join(" • ")}</td>
        </tr>
        <tr>
          <th>Meaning {dowString(revs[0].start)} &ndash; {dowString(revs[revs.length - 2].start)}:</th>
          <td>{revs.slice(0, -1).map(r => r.meaning_accuracy * 100).join(" • ")}</td>
        </tr>
      </table>
    </div>
  {/if}
</div>