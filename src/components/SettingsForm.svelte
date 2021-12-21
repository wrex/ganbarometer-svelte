<script type="ts">
  import { defaultSettings, gbSettings } from '../store/stores';
  import Errors from './Errors.svelte'
  import { validate } from './validation';

  let values = {...$gbSettings};
  let errors = {};

  const validateField = path => () => {
    console.log("validating {path}")
    const res = validate(values, path);
    errors = res.getErrors();
    console.log(errors);
  }

  const submit = () => {
    const res = validate(values);
    if (res.hasErrors()) {
      // flatten all errors messages to one array 
      errors = res.getErrors();
      return; 
    }
    errors = {};
    $gbSettings = {...$gbSettings, ...values};
  }

  const reset = () => { 
    // TODO figure out weird problem with warning about empty color values and
    // empty weights whenever reset button is clicked
    values = { ...defaultSettings };
    errors = {};
  };

  const setLightTheme = () => {
      values.textColor = "#333333";
      values.bgColor = "#f4f4f4";
      values.fillColor = "#b4c0be";
      values.goodColor = "#59c273";
      values.warnColor = "#fbb623";
      values.alertColor = "#ff00aa";
  };

  const setDarkTheme = () => {
      values.textColor = "#ffffff";
      values.bgColor = "#232629";
      values.fillColor = "#747474";
      values.goodColor = "#59c273";
      values.warnColor = "#fcbd4b";
      values.alertColor = "#d94353";
  };

</script>

<form on:submit|preventDefault={submit} aria-label="Settings Form" >
  <fieldset>
    <legend>Behavior Settings</legend>
    <label for="apprenticeItems">Desired number of apprentice items</label>
    <input 
      type="range" 
      name="apprenticeItems" 
      id="apprenticeItems"
      min="0"
      max="200"
      step="10"
      bind:value={values.targetApprentice}
    >
    <p>{values.targetApprentice}</p>

    <label for="newRWeight">Weighting factor for new radicals</label>
    <input 
      type="number" 
      name="newRWeight" 
      id="newRWeight"
      min="0"
      max="3"
      step="0.25"
      bind:value={values.newRWeight}
      on:change={validateField('newRWeight')}
    >
    <Errors {errors} path="newRWeight" />

    <label for="newKWeight">Weighting factor for new kanji</label>
    <input 
      type="number" 
      name="newKWeight" 
      id="newKWeight"
      min="0"
      max="3"
      step="0.25"
      bind:value={values.newKWeight}
      on:change={validateField('newKWeight')}
    >
    <Errors {errors} path="newKWeight" />

    <label for="newVWeight">Weighting factor for new vocabulary</label>
    <input 
      type="number" 
      name="newVWeight" 
      id="newVWeight"
      min="0"
      max="3"
      step="0.25"
      bind:value={values.newVWeight}
      on:change={validateField('newVWeight')}
    >
    <Errors {errors} path="newVWeight" />

    <hr>

    <label for="targetSpeed">Target speed (seconds-per-question)</label>
    <input 
      type="range" 
      min="3" 
      max="15" 
      step="0.5" 
      name="targetSpeed" 
      id="targetSpeed" 
      bind:value={values.targetSpeed}
    >
    <p>{values.targetSpeed}</p>

    <label for="targetRevDay">Target reviews-per-day</label>
    <input 
      type="range" 
      min="1"
      max="300"
      name="targetRevDay" 
      id="targetRevDay" 
      bind:value={values.targetRevDay}
    >
    <p>{values.targetRevDay}</p>

  </fieldset>


  <fieldset>
    <legend>General Settings</legend>

    <div class="colorSample" style="background-color: {values.bgColor}">
      <h3 style="color: {values.textColor}">Sample Text</h3>
      <div class="gaugeBar" style="background-color: {values.fillColor}">
        <div 
          class="goodBar" 
          style="background-color: {values.goodColor}"
        ></div
        ><div 
          class="warnBar"
          style="background-color: {values.warnColor}"
        ></div><div 
          class="errorBar"
          style="background-color: {values.errorColor}"
        ></div>
      </div>
    </div>

    <label for="textColor">
      Text
    </label>
    <input 
      type="color" 
      name="textColor" 
      id="textColor" 
      bind:value={values.textColor}
    >

    <label for="bgColor">
      Background
    </label>
    <input 
      type="color" 
      name="bgColor" 
      id="bgColor" 
      bind:value={values.bgColor}
    >

    <label for="fillColor">
      Fill
    </label>
    <input 
      type="color" 
      name="fillColor" 
      id="fillColor" 
      bind:value={values.fillColor}
    >

    <div>
      <label for="goodColor">
        Good
      </label>
      <input 
        type="color" 
        name="goodColor" 
        id="goodColor" 
        bind:value={values.goodColor}
      >
      
      <label for="warnColor">
        Warning
      </label>
      <input 
        type="color" 
        name="warnColor" 
        id="warnColor" 
        bind:value={values.warnColor}
      >
      
      <label for="alertColor">
        Alert
      </label>
      <input 
        type="color" 
        name="alertColor" 
        id="alertColor"
        bind:value={values.alertColor}
      >
    </div>
    Theme:
    <!-- TODO: Wire up default theme colors -->
    <button on:click={setLightTheme} >Light</button>
    <button on:click={setDarkTheme} >dark</button>
  </fieldset>

<fieldset>
  <legend>Advanced Settings</legend>
  <label for="madCutoff">MAD cutoff</label>
  <input 
    type="range" 
    min="1"
    max="20"
    step="0.1"
    name="madCutoff" 
    id="madCutoff" 
    bind:value={values.madCutoff}
  >
  <p>{values.madCutoff}</p>
  <Errors {errors} path="madCutoff" />

  <label for="tzOffset">Time zone offset for start-of-day calculations</label>
  <input 
    type="range" 
    min="-23"
    max="23"
    name="tzOffset" 
    id="tzOffset" 
    bind:value={values.tzOffset}
  >
  <p>{values.tzOffset}</p>
  <Errors {errors} path="tzOffset" />
</fieldset>

<button type="submit">Save</button>
<button type="reset" on:click={reset}>Reset</button>
</form>

<style>
  :global(.invalid) {
    border-color: red;
    border-width: 10px;
  }
  .colorSample {
    background-color: var(--bg-color, #f4f4f4);
    padding: 2em;
  }
  .gaugeBar {
    position: relative;
    background-color: var(--fill-color, #cccccc);
    width: 10em;
    line-height: 0;
    margin: 0;
    padding: 0;
  }

  .goodBar,
  .warnBar,
  .errorBar {
    display: inline-block;
    height: 1em;
    z-index: 1;
    margin: 0;
    padding: 0;
  }

  .goodBar {
    width: 4em;
    background-color: var(--good-color, #00aa00);
  }

  .warnBar {
    width: 2em;
    background-color: var(--warn-color, #ffcc00);
  }

  .errorBar {
    width: 1em;
    background-color: var(--warn-color, #ff0000);
  }

  form {
    display: flex;
    flex-direction: column;
    width: 600px;
    height: 80vh;
    overflow-y: scroll;
  }
  label {
    display: inline-block;
    text-align: right;
  }
  button {
    padding: 0 1em;
  }
  input[type="color"] {
    display: inline-block;
    width: 3rem;
    min-height: 20px;
    padding: 0;
    margin: 5px;
}
</style>