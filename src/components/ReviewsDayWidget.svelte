<script type="ts">
  import BarChart from "./BarChart.svelte";
  import { display, gbSettings, daysToReview, reviewCounts } from "../store/stores";

  const dowString = (date) => { 
    return new Intl.DateTimeFormat('en-US', {weekday: "short"} ).format(date); }
  ;

  $: startDayOfWeeks = $reviewCounts.map(r => dowString(r.start));

  $: totalReviews = $reviewCounts.reduce((acc,r) => acc += r.review_count, 0);
  $: targetReviews = $gbSettings.targetRevDay * $daysToReview;

  $: avgReviewsPerDay = (totalReviews / $daysToReview).toFixed();
</script>

<div class="gbWidget" data-testid="reviews-per-day-gauge">
  {#if ($display === "chart")}
    <h1 class="gbHeader">Reviews/day</h1>
    <BarChart 
      values={$reviewCounts.map(r => r.review_count)} 
      labels={startDayOfWeeks}
    />
  {:else}
    <h1 class="gbHeader">{avgReviewsPerDay} Reviews/day</h1>
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
          <th>Latest ({dowString($reviewCounts[$reviewCounts.length - 1].start)}):</th>
          <td>{ $reviewCounts[$reviewCounts.length - 1].review_count } <span
            class="secondary">reviews</span></td>
          </tr>
        {#if ($reviewCounts.length > 2)}
          <tr>
            <th>{dowString($reviewCounts[0].start)} &ndash; {dowString($reviewCounts[$reviewCounts.length - 2].start)}:</th>
            <td>{$reviewCounts.slice(0, -1).map(r => r.review_count).join(" • ")}</td>
          </tr>
        {:else if ($reviewCounts.length === 2)}
          <tr>
            <th>{dowString($reviewCounts[0].start)}:</th>
            <td>{$reviewCounts[0].review_count}</td>
          </tr>
        {/if}
      </table>
    </div>
  {/if}
</div>
