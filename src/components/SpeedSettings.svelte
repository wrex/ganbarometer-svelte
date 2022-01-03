<script type= "ts">
  import { validate } from './validation';
  import Errors from './Errors.svelte';

  export let values;
  export let errors;
  export let result;

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
    bind:value={values.targetSpeed}
    on:change={validateField("targetSpeed")}>
  <label for="speedTarget">{values.targetSpeed} seconds</label>
  <Errors {errors} path="targetSpeed" />

  <hr>

  <h4>Warnings</h4>
  <input 
    id="minWarning" 
    type="range"
    min={1}
    max={15}
    step={0.1}
    bind:value={values.speedMin}
    on:change={validateField("speedMin")}>
  <label for="minWarning">below {values.speedMin} seconds</label>
  <Errors {errors} path="speedMin" />

  <input 
    id="maxWarning" 
    type="range"
    min={1}
    max={15}
    step={0.1}
    bind:value={values.speedMax}
    on:change={validateField("speedMax")}>
  <label for="maxWarning">above {values.speedMax} seconds</label>
  <Errors {errors} path="speedMax" />

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
        