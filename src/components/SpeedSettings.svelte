<script type= "ts">
  export let values;
</script>


<div class="settingsComp">

  <h4>Speed Target</h4>
  <input 
    id="speedTarget" 
    type="range"
    min="1"
    max="15"
    step="0.2"
    bind:value={values.targetSpeed}>
  <label for="speedTarget">{values.targetSpeed} seconds</label>

  <hr>

  <h4>Warning Levels</h4>
  <input 
    id="minWarning" 
    type="range"
    min={1}
    max={15}
    step={0.1}
    bind:value={values.speedMin}>
  <label for="minWarning">{values.speedMin} seconds</label>

  <input 
    id="maxWarning" 
    type="range"
    min={1}
    max={15}
    step={0.1}
    bind:value={values.speedMax}>
  <label for="maxWarning">{values.speedMax} seconds</label>

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
        