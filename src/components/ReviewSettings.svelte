<script type= "ts">
  import RangeSlider from "./RangeSlider.svelte";

  export let values;

  let range_values = [values.rpdMin, values.rpdMax];
  $: [values.rpdMin, values.rpdMax] = range_values;
</script>

<div class="gbSettingsComp">

  <h4>Target range</h4>
  <RangeSlider 
    id="rpdRange" 
    range
    pushy
    float
    min={1}
    max={300}
    bind:values={range_values} />
  <div class="rangeLabel">{values.rpdMin} &ndash; {values.rpdMax} reviews/day</div>

</div>
        
<style>

:global(#rpdRange),
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