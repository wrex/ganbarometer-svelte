<script>
  import BarChart from "./BarChart.svelte";
  import { display, daysToReview } from "../store/stores";

  export let reviewStats = {
    targetReviewsPerDay: 150,
    reviews: [
      {count: 113, accuracy: 0.86, start: new Date("11/1/2021 10:18"), end: new Date("11/1/2021 11:46")},
      {count: 128, accuracy: 0.90, start: new Date("11/2/2021 10:08"), end: new Date("11/2/2021 11:12")},
      {count: 158, accuracy: 0.83, start: new Date("11/3/2021 9:27"), end: new Date("11/3/2021 10:31")},
      {count: 98, accuracy: 0.95, start: new Date("11/4/2021 9:05"), end: new Date("11/4/2021 9:43")},
    ],
  };

  // save some screen real-estate below
  let revs = reviewStats.reviews;

  const dowString = (date) => { 
    return new Intl.DateTimeFormat('en-US', {weekday: "short"} ).format(date); }
  ;

  let startDayOfWeeks = revs.map(r => dowString(r.start));
  let endDayOfWeeks = revs.map(r => dowString(r.end));

  let totalReviews = revs.reduce((acc,r) => acc += r.count, 0);
  let targetReviews = reviewStats.targetReviewsPerDay * $daysToReview;
</script>

<div class="reviews-per-day" data-testid="reviews-per-day-gauge">
  <h1 class="gb-header">Reviews/day</h1>
  {#if ($display === "chart")}
    <BarChart 
      values={revs.map(r => r.count)} 
      labels={startDayOfWeeks}
    />
  {:else}
    <div data-testid="reviews-per-day-table">
      <table>
        <tr>
          <th>Total:</th>
          <td>{ totalReviews }
            <span class="secondary">reviews</span>
          </td>
        </tr>
        <tr>
          <th>Target:</th>
          <td>{ targetReviews } 
            <span class="secondary">{((totalReviews/targetReviews) * 100 ).toFixed(1)}% achieved</span></td>
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

<style>

  table {
    border-collapse: collapse;
    font-size: small;
    line-height: 1.2;
    /* width: 100%; */
  }
  th,
  td {
    padding: 0.25em;
    text-align: left;
    font-weight: bold;
  }
  th {
    text-align: right;
    font-weight: 100;
  }

  .secondary {
    opacity: 60%;
    font-size: x-small;
  }


  .reviews-per-day {
    min-width: 220px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  @media (min-width: 1200px ) {
    .reviews-per-day {
      min-width: 275px;
    }
  }

</style>