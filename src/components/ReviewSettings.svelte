<script type= "ts">
  import RangeSlider from "./RangeSlider.svelte";
  import Info from "./Info.svelte";

  export let values;

  let rpdValues = [values.rpdMin, values.rpdMax];
  let speedValues = [values.minQPM, values.maxQPM];
  let daysToReview = [values.daysToReview];

  $: [
    values.daysToReview, 
    values.rpdMin, 
    values.rpdMax, 
    values.minQPM, 
    values.maxQPM
  ] = [...daysToReview, ...rpdValues, ...speedValues];
</script>

<div class="gbSettingsComp">

  <h4>Reviews to examine</h4>
  <RangeSlider 
    id="daysToRetrieve"
    bind:values={daysToReview} 
    float 
    min={1} 
    max={7} />
  <div class="infoIcon" data-testid="retrieveDaysInfo"><Info type="retrieveDays" /></div>
  <div class="rangeLabel">past {values.daysToReview} day{values.daysToReview > 1 ? "s" : ""}</div>

  <hr>

  <h4>Target answer speed</h4>
  <RangeSlider 
    id="speedRange" 
    range
    pushy
    float
    min={1}
    max={30}
    bind:values={speedValues} />
  <div class="infoIcon" data-testid="answerSpeedInfo"><Info type="answerSpeed" /></div>
  <div class="rangeLabel">{values.minQPM} &ndash; {values.maxQPM} qpm</div>
  
  <hr>

  <h4>Target daily load</h4>
  <RangeSlider 
    id="rpdRange" 
    range
    pushy
    float
    min={2}
    max={300}
    bind:values={rpdValues} />
  <div class="infoIcon" data-testid="rpdInfo"><Info type="rpd" /></div>
  <div class="rangeLabel">{values.rpdMin} &ndash; {values.rpdMax} rpd</div>

</div>
        
<style>

  :global(#daysToRetrieve),
  :global(#rpdRange),
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

  hr {
    grid-column: 1 / span 6;
    margin: 10px;
  }

  .infoIcon {
    grid-column: 6;
    justify-self: center;
    align-self: center;
  }

</style>