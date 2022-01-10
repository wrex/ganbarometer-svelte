<script lang= "ts">
  import RangeSlider from "svelte-range-slider-pips";

  export let values;

  const spq = (qpm) => (60 /  qpm).toFixed(1);

  let range_values = [values.minQPM, values.maxQPM];
  $: [values.minQPM, values.maxQPM] = range_values;
</script>


<div class="gbSettingsComp">

  <h4>Target range</h4>
  <RangeSlider 
    id="speedRange" 
    range
    pushy
    float
    min={1}
    max={30}
    bind:values={range_values} />
  <div class="rangeLabel">{values.minQPM} &ndash; {values.maxQPM} questions/minute</div>

</div>

<style>
  
  
  :global(#speedRange),
  .rangeLabel {
    grid-column: 3 / span 3;
    width: 100%;
    margin: 0;
    align-self: center;
    text-align: center;
  }
  h4 {
    font-size: small;
    margin: 0;
    grid-column: 1 / span 2;
    text-align: right;
  }
</style>
        