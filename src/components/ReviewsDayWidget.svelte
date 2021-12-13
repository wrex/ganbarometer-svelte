<script>
  import BarChart from "./BarChart.svelte";
  import { display } from "../store/stores";

  export let reviewStats = {
    total: 1,
    reviewsPerDay: 1,
    targetRPD: 1,
    accuracy: "100%",
    first: new Date(),
    last: new Date(),
    reviews: [1],
    legends: ["M"],
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