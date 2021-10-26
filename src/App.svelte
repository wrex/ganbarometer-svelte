<script lang="ts">
  import Gauge from "./components/Gauge.svelte";
  import BarChart from "./components/BarChart.svelte";
</script>


<section data-testid="ganbarometer">
  <div class="difficulty">
    <h1>Difficulty</h1>
    <Gauge value="0.25" />
    <p>Difficulty footer</p>
  </div>

  <div class="reviews-per-day">
    <h1>Reviews/Day</h1>
    <Gauge value="0.65" label="127" />
    <p>Reviews/day footer</p>
  </div>

  <div class="review-intervals">
    <h1>Review Intervals</h1>
    <BarChart values="[247,115,69,20,6,2,0,1,3]" labels='["10s","20s","30s","1m","1.5m","2m","5m","10m",">10m"]'/>
  </div>
</section>

<style>

  /* TODO: media queries to mimic Wanikani */

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

  h1 {
    font-size: 1.25rem;
    margin: 0 0 5px;
    text-align: center;
    display: inline-block;
    color: var(--text-color, #004033);
  }

  p {
    font-size: 10px;
    margin: 5px 0 0 0;
    color: var(--text-color, #004033);
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