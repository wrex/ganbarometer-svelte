<script>
  import BarChart from "./BarChart.svelte";
  import { display } from "../store/stores";

  const reviewStats = {
    total: 584,
    reviewsPerDay: 146,
    targetRPD: 150,
    accuracy: "86%",
    first: new Date("11/1/2021 10:18"),
    last: new Date("11/4/2021 15:32"),
    reviews: [113, 147, 113, 113],
    legends: ["M", "Tu", "W", "Th"],
  };
</script>

<div class="reviews-per-day" data-testid="reviews-per-day-gauge">
  <h1>Reviews/Day</h1>
  {#if ($display === "chart")}
    <BarChart values={reviewStats.reviews} labels={reviewStats.legends}/>
  {:else}
    <div data-testid="reviews-per-day-table">Review data goes here. Table?</div>
  {/if}
</div>

<style>
  h1 {
    font-size: 1.25rem;
    font-weight: normal;
    margin: 0;
    text-align: center;
    display: inline-block;
    color: var(--text-color, #004033);
  }

  .reviews-per-day {
    min-width: 300px;
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  @media (min-width: 1200px ) {
    .reviews-per-day {
      min-width: 370px;
    }
  }

</style>