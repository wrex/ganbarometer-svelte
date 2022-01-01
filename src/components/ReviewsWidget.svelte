<script type="ts">
  import BarChart from "./BarChart.svelte";
  import { fade } from "svelte/transition";
  import { display, gbSettings, daysToReview, reviewCounts } from "../store/stores";

  const dowString = (date) => { 
    return new Intl.DateTimeFormat('en-US', {weekday: "short"} ).format(date); }
  ;

  $: startDayOfWeeks = $reviewCounts.map(r => dowString(r.start));

  $: totalReviews = $reviewCounts.reduce((acc,r) => acc += r.review_count, 0);

  $: avgReviewsPerDay = (totalReviews / $daysToReview[0]).toFixed();

  $: displayValues = $reviewCounts.map(r => r.review_count);
  $: accuracyValues = $reviewCounts.map(r => r.accuracy);
  $: overallAccuracy = 100 * accuracyValues.reduce((acc, v) => acc += v, 0) / accuracyValues.length;
</script>

<div class="gbWidget" data-testid="reviews-per-day-gauge">
  {#if ($display === "chart")}
    <h1 class="gbHeader">Accuracy</h1>
    <BarChart 
      values={displayValues} 
      labels={startDayOfWeeks}
      target={($gbSettings.rpdMin + $gbSettings.rpdMax) / 2}
      percents={accuracyValues}
    />
  {:else}
    <h1 class="gbHeader" in:fade>{totalReviews} Reviews @{overallAccuracy.toFixed()}%</h1>
    <div data-testid="reviews-per-day-table" in:fade>
      <table class="gbContent">
        <tr>
          <th>Average:</th>
          <td>{ avgReviewsPerDay }
            <span class="secondary">reviews @ {overallAccuracy.toFixed()}%</span>
          </td>
        </tr>
        <tr>
          <th>Latest ({dowString($reviewCounts[$reviewCounts.length - 1]?.start)}):</th>
          <td>{ $reviewCounts[$reviewCounts.length - 1]?.review_count } <span
            class="secondary">reviews @ {(100*accuracyValues[accuracyValues.length-1]).toFixed()}%</span></td>
          </tr>
        {#if ($reviewCounts.length > 2)}
          <tr>
            <th>{dowString($reviewCounts[0].start)} &ndash; {dowString($reviewCounts[$reviewCounts.length - 2].start)}:</th>
            <td>{$reviewCounts.slice(0, -1).map(r => r.review_count).join(" • ")} <span class="secondary">reviews</span></td>
          </tr>
          <tr>
            <th></th>
            <td>{accuracyValues.slice(0, -1).map(a => (100*a).toFixed()).join("% • ")}% <span class="secondary">accuracy</span></td>
          </tr>
        {:else if ($reviewCounts.length === 2)}
          <tr>
            <th>{dowString($reviewCounts[0].start)}:</th>
            <td>{$reviewCounts[0].review_count} <span class="secondary">reviews</span></td>
          </tr>
        {/if}
      </table>
    </div>
  {/if}
</div>
