<script type= "ts">
  export let values;
</script>

<div class="settingsComp">

  <h4>Target Reviews-per-day</h4>
  <input 
    id="rpdMin" 
    type="range"
    min={10}
    max={290}
    step={10}
    bind:value={values.rpdMin}>
  <label for="rpdTarget">{values.rpdMin} reviews min</label>

  <input 
    id="rpdMax" 
    type="range"
    min={20}
    max={300}
    step={10}
    bind:value={values.rpdMax}>
  <label for="rpdTarget">{values.rpdMax} reviews max</label>
</div>
        
<style>
  h4 {
    font-size: small;
    margin: 0;
    grid-column: 1 / span 2;
    text-align: right;
  }

  label {
    grid-column: 5 / span 2;
    margin: 0;
  }
  input[type="range"] {
    grid-column: 3 / span 2;
    width: 100%;
    text-align: center;
    vertical-align: middle;
    margin: 0;
  }

  hr {
    grid-column: 1 / span 6;
  }
</style>