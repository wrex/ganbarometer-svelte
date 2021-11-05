<script>
  import Gauge from "./Gauge.svelte";
</script>

<div class="reviews-per-day" data-testid="reviews-per-day-gauge">
  <h1>Reviews/Day</h1>
  <Gauge value={0.65} label="127" />
  <p>Reviews/day footer</p>
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

</style>