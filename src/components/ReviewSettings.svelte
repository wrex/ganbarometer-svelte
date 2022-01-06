<script type= "ts">
  import { validate } from './validation';
  import Errors from './Errors.svelte';

  export let values;
  export let result;

  let errors = {};

  const validateField = path => () => {
    result = validate(values, path);
    errors = result.getErrors();
  } 
</script>

<div class="settingsComp">

  <h4>Target Reviews-per-day</h4>
  <input 
    id="rpdMin" 
    type="range"
    min={10}
    max={290}
    step={10}
    bind:value={values.rpdMin}
    on:change={validateField("rpdMin")}>
  <label for="rpdTarget">{values.rpdMin} reviews min</label>
  <Errors {errors} path="rpdMin" />

  <input 
    id="rpdMax" 
    type="range"
    min={20}
    max={300}
    step={10}
    bind:value={values.rpdMax}
    on:change={validateField("rpdMax")}>
  <label for="rpdTarget">{values.rpdMax} reviews max</label>
  <Errors {errors} path="rpdMax" />
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

</style>