<script type= "ts">
  import { validate } from './validation';
  import Errors from './Errors.svelte';

  export let values;
  export let errors;
  export let result;
  
  let targetQPM = 60 / values.targetSpeed;
  let minQPM = 60 / values.speedMax;
  let maxQPM = 60 / values.speedMin;

  $: values.targetSpeed = 60 / targetQPM;
  $: values.speedMax = 60 / minQPM;
  $: values.speedMin = 60 / maxQPM;

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
    bind:value={targetQPM}>
  <label for="speedTarget">{targetQPM.toFixed(1)} q/m ({values.targetSpeed.toFixed(1)} s/q)</label>
  <!-- <Errors {errors} path="targetSpeed" /> -->

  <hr>

  <h4>Warnings</h4>
  <input 
    id="minWarning" 
    type="range"
    min={1}
    max={15}
    step={0.1}
    bind:value={minQPM}>
    <!-- on:change={validateField("speedMax")}> -->
  <label for="minWarning">below {minQPM.toFixed(1)} q/m ({values.speedMax.toFixed(1)} s/q) </label>
  <!-- <Errors {errors} path="speedMax" /> -->

  <input 
    id="maxWarning" 
    type="range"
    min={1}
    max={15}
    step={0.1}
    bind:value={maxQPM}>
    <!-- on:change={validateField("speedMin")}> -->
  <label for="maxWarning">above {maxQPM.toFixed(1)} q/m ({values.speedMin.toFixed(1)} s/q)</label>
  <!-- <Errors {errors} path="speedMin" /> -->

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
        