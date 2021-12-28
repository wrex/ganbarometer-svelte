<script type="ts">
  import GanbarometerSettings from "./GanbarometerSettings.svelte";
  import SpeedSettings from "./SpeedSettings.svelte";
  import AccuracySettings from "./AccuracySettings.svelte";
  import AppearanceSettings from "./AppearanceSettings.svelte";
  import AdvancedSettings from "./AdvancedSettings.svelte";
  import { defaultSettings, gbSettings } from '../store/stores';

  let values = {...$gbSettings};

  const submit = () => {
    $gbSettings = {...$gbSettings, ...values};
  }

  const reset = () => { 
    values = { ...defaultSettings };
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

  type navState = "Ganbarometer" | "Speed" | "Accuracy" | "Appearance" | "Advanced";

  let current: navState = "Ganbarometer";
  const switchTo = (comp: navState) => {
    return () => current = comp;
  };
</script>

<form on:submit|preventDefault={submit} aria-label="Settings Form" class="settingsForm">
  <h1 class="title">Ganbarometer Settings</h1>
  <div class="menu">
    <nav class="nav">
        <li on:click={switchTo("Ganbarometer")} class:active={current === "Ganbarometer"}>Ganbarometer</li>
        <li on:click={switchTo("Speed")} class:active={current === "Speed"}>Speed</li>
        <li on:click={switchTo("Accuracy")} class:active={current === "Accuracy"}>Accuracy</li>
        <li on:click={switchTo("Appearance")} class:active={current === "Appearance"}>Appearance</li>
        <li on:click={switchTo("Advanced")} class:active={current === "Advanced"}>Advanced</li>
    </nav>
    <div class="actions">
      <button type="submit">Save</button>
      <button type="reset" on:click={reset}>Reset</button>
    </div>
  </div>
  <div class="formInputs">
    {#if current == "Ganbarometer"}
      <GanbarometerSettings />
    {:else if current == "Speed"}
      <SpeedSettings />
    {:else if current == "Accuracy"}
      <AccuracySettings />
    {:else if current == "Appearance"}
      <AppearanceSettings />
    {:else if current == "Advanced"}
      <AdvancedSettings />
    {/if}
  </div>
</form>

<style>
  .settingsForm {
    margin: 0;
    display: grid;
    grid-template-columns: 180px 520px;
    grid-template-areas: 
      "title title"
      "menu formInputs";
  }
  .title {
    background-color: #59c273;
    color: white;
    margin: 0;
    text-align: center;
    padding: 0.1em 0 0.3em;
    grid-area: title;
  }

  .menu {
    grid-area: menu;
    margin: 0.5em 0 0.5em 0.5em;
    border-radius: 0.5em;
    background-color: rgba(87, 194, 115, 0.33);
    padding: 1em;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .nav {
    margin: 0 1em 3em;
    width: 100%;
  }

  .nav li {
    color: rgba(48, 130, 69, 0.5);
    text-decoration: none;
    text-align: center;
    font-size: 20px;
    line-height: 160%;
  }

  .nav li:hover {
    cursor: pointer;
  }

  .nav li.active {
    color: rgba(34, 93, 49, 1);
    text-decoration: underline;
    text-underline-offset: 0.2em;
    font-weight: bold;
    cursor: default;
  }

  .formInputs {
    grid-area: formInputs;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  :global(.settingsComp) {
    width: 100%;
    margin: 0;
    padding: 2em 0;
  }
</style>

<!-- <form on:submit|preventDefault={submit} aria-label="Settings Form" >
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
    >

    <label for="newKWeight">Weighting factor for new kanji</label>
    <input 
      type="number" 
      name="newKWeight" 
      id="newKWeight"
      min="0"
      max="3"
      step="0.25"
      bind:value={values.newKWeight}
    >

    <label for="newVWeight">Weighting factor for new vocabulary</label>
    <input 
      type="number" 
      name="newVWeight" 
      id="newVWeight"
      min="0"
      max="3"
      step="0.25"
      bind:value={values.newVWeight}
    >

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

    <label for="gbPosition">Position:</label>
    <select bind:value={values.position} name="position" id="gbPosition">
      // position: "Top" | "Below Forecast" | "Below SRS" | "Below Panels" | "Bottom"
      <option value="Top">Top</option>
      <option value="Below Forecast">Below Forecast</option>
      <option value="Below SRS">Below SRS</option>
      <option value="Below Panels">Below Panels</option>
      <option value="Bottom">Bottom</option>
    </select>

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
</fieldset>

<button type="submit">Save</button>
<button type="reset" on:click={reset}>Reset</button>
</form> -->
