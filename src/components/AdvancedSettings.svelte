<script type= "ts">
  import RangeSlider from "svelte-range-slider-pips";

  export let values;

  let range_value = [values.madCutoff];
  $: [values.madCutoff] = range_value;
</script>

<div class="gbSettingsComp">

  <h4>MAD cutoff</h4>

  <RangeSlider 
    id="madRange" 
    float
    min={1}
    max={15}
    bind:values={range_value} />
  <div class="rangeLabel">{values.madCutoff}</div>


  <!-- Maybe someday, but date manipulation is an utter PITA in Javascript -->
  <!-- 
  <hr>
  <h4>Timezone Offset</h4>
  <input 
    disabled 
    id="tzOffset" 
    type="range"
    min="-23"
    max="23"
    bind:value={values.tzOffset}>
  <label for="tzOffset">{values.tzOffset} hours</label> -->
</div>
        
<style>
:global(#madRange),
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
        