<script>
  import Gauge from "../components/Gauge.svelte";
  import BarChart from "../components/BarChart.svelte";
</script>

<div class="difficulty">
  <h1>Difficulty</h1>
  <Gauge value={0.25} />
  <p>Difficulty footer</p>
</div>

<div class="reviews-per-day">
  <h1>Reviews/Day</h1>
  <Gauge value={0.65} label="127" />
  <p>Reviews/day footer</p>
</div>

<div class="review-intervals">
  <h1>Review Intervals</h1>
  <BarChart values={[247,115,69,20,6,2,0,1,3]} labels={["10s","20s","30s","1m","1.5m","2m","5m","10m",">10m"]}/>
</div>

<style>
  h1 {
    font-size: 1.25rem;
    font-weight: normal;
    margin: 0 0 5px;
    text-align: center;
    display: inline-block;
    color: var(--text-color, #004033);
  }

  p {
    color: var(--text-color, #004033);
  }

  :global(.difficulty) {
    grid-column: 1 / span 3;
    grid-row: 1 / 2;
    text-align: center;
  }
  
  :global(.reviews-per-day) {
    grid-column: 4 / span 3;
    grid-row: 1 / 2;
    text-align: center;
  }
  
  :global(.review-intervals) {
    grid-column: 1 / span 6;
    grid-row: 2 / 3;
    text-align: center;
    padding-right: 2em;
  }

  @media (min-width: 768px) {
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
      padding-right: 2em;
    }
  }
</style>