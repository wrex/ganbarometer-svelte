<script>
  import BarChart from "./BarChart.svelte";
</script>

<div class="reviews-per-day" data-testid="reviews-per-day-gauge">
  <h1>Reviews/Day</h1>
  <BarChart values={[119, 153, 98, 122]} labels={["M", "Tu", "W", "Th"]}/>
</div>

<style>
  .reviews-per-day {
    width: 370px;
  }
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

</style>