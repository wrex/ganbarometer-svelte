<script lang= "ts">
  import { validate } from './validation';
  import Errors from './Errors.svelte';

  export let values;
  export let errors;
  export let result;

  const spq = (qpm) => (60 /  qpm).toFixed(1);
  
  const validateField = path => () => {
    result = validate(values, path);
    errors = result.getErrors();
  }
</script>


<div class="settingsComp">

  <h4>Speed Target</h4>
  <input 
    id="speedTarget" 
    type="range"
    min="1"
    max="15"
    step="0.2"
    bind:value={values.targetQPM}
    on:change={validateField("targetQPM")}>
  <label for="speedTarget">{values.targetQPM.toFixed(1)} q/m ({spq(values.targetQPM)} s/q)</label>
  <Errors {errors} path="targetQPM" />

  <hr>

  <h4>Warnings</h4>
  <input 
    id="minWarning" 
    type="range"
    min={1}
    max={15}
    step={0.1}
    bind:value={values.minQPM}
    on:change={validateField("minQPM")}>
  <label for="minWarning">below {values.minQPM.toFixed(1)} q/m ({spq(values.minQPM)} s/q) </label>
  <Errors {errors} path="minQPM" />

  <input 
    id="maxWarning" 
    type="range"
    min={1}
    max={15}
    step={0.1}
    bind:value={values.maxQPM}
    on:change={validateField("maxQPM")}>
  <label for="maxWarning">above {values.maxQPM.toFixed(1)} q/m ({spq(values.minQPM)} s/q)</label>
  <Errors {errors} path="minQPM" />

</div>

<style>
  h4 {
    font-size: small;
    margin: 0;
    grid-column: 1;
    text-align: right;
  }

  label {
    grid-column: 4 / span 3;
    align-self: center;
    margin: 0;
  }
  input[type="range"] {
    grid-column: 2 / span 2;
    width: 100%;
    text-align: center;
    vertical-align: middle;
    margin: 0;
  }

  hr {
    grid-column: 1 / span 6;
  }
</style>
        