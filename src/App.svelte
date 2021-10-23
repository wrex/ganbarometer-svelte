<script lang="ts">
  import Gauge from "./components/Gauge.svelte";
  import BarChart from "./components/BarChart.svelte";
</script>


<section data-testid="ganbarometer">
  <Gauge class="difficulty" heading="Difficulty" />
  <Gauge class="reviews-per-day" valueLabel="83" heading="Reviews/Day" />
  <BarChart class="review-intervals" heading="Review Intervals" />
</section>

<style>
  section {
    /* border: 1px solid black; */
    background-color: #f4f4f4;
    border-radius: 5px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: 150px auto;
    gap: 30px 20px;
    margin: 0 0 20px;
    align-items: center;
  }

  :global(.difficulty) {
    grid-column: 1 / span 2;
    grid-row: 1 / 2;
    text-align: center;
  }

  :global(.reviews-per-day) {
    grid-column: 3 / span 2;
    grid-row: 1 / 2;
    text-align: center;
  }

  :global(.review-intervals) {
    grid-column: 5 / span 2;
    grid-row: 1 / 2;
    text-align: center;
  }

</style>