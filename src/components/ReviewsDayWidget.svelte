<script>
  import BarChart from "./BarChart.svelte";
  import { display, daysToReview } from "../store/stores";

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
</script>

<div class="gbWidget" data-testid="reviews-per-day-gauge">
  <h1 class="gbHeader">Reviews/day</h1>
  {#if ($display === "chart")}
    <BarChart 
      values={revs.map(r => r.count)} 
      labels={startDayOfWeeks}
    />
  {:else}
    <div data-testid="reviews-per-day-table">
      <table class="gbContent">
        <tr>
          <th>Total:</th>
          <td>{ totalReviews }
            <span class="secondary">reviews</span>
          </td>
        </tr>
        <tr>
          <th>Target:</th>
          <td>{ targetReviews } 
            <span class="secondary">{((totalReviews/targetReviews) * 100 ).toFixed()}% achieved</span></td>
        </tr>
        <tr>
          <th>Latest ({dowString(revs[revs.length - 1].start)}):</th>
          <td>{ revs[revs.length - 1].count } <span
          class="secondary">reviews</span></td>
        </tr>
        <tr>
          <th>{dowString(revs[0].start)} &ndash; {dowString(revs[revs.length - 2].start)}:</th>
          <td>{revs.slice(0, -1).map(r => r.count).join(" • ")}</td>
        </tr>
      </table>
    </div>
  {/if}
</div>
