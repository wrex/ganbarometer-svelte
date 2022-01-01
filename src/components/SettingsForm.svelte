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

  const setDefaults = () => { 
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
      <button on:click={setDefaults} class="defaultButton">Defaults</button>
      <button type="submit">Save</button>
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
    min-height: 450px;
    display: grid;
    grid-template-columns: 180px 520px;
    grid-template-rows: min-content;
    grid-template-areas: 
      "title title"
      "menu formInputs";
  }
  .title {
    background-color: #59c273;
    height: fit-content;
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
    background-color: hsl(44.86,46.26%,95%);
    padding: 1em;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .nav {
    margin: 0 1em 3em;
    width: 100%;
    height: 100%;
  }

  .nav li {
    color: hsl(44.86,46.26%,65%);;
    text-decoration: none;
    text-align: center;
    font-size: 20px;
    line-height: 160%;
  }

  .nav li:hover {
    cursor: pointer;
  }

  .nav li.active {
    color: hsl(44.86,46.26%,20%);
    text-decoration: underline;
    text-underline-offset: 0.2em;
    margin-top: -0.2em;
    font-weight: bold;
    cursor: default;
  }

  .formInputs {
    grid-area: formInputs;
    min-height: 570px;

    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
  }

  :global(.settingsComp) {
    width: calc(100% - 20px);
    margin: 30px 10px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: max-content;
    gap: 10px;
  }

  button {
    display: inline-block;
    border: none;
    padding-block: 0.5rem;
    border-radius: 5px;
    margin: 0;
    text-decoration: none;
    background: #4b3f1b;
    color: #ffffff;
    font-family: sans-serif;
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;
    text-align: center;
    transition: background 250ms ease-in-out, transform 150ms ease;
    -webkit-appearance: none;
    -moz-appearance: none;
}

button:hover,
button:focus {
    background: #cfba7c;
}

button:focus {
  outline: 1px solid #fff;
  outline-offset: -4px;
}

button:active {
  transform: scale(0.99);
}

.defaultButton {
  background-color: transparent;
  color: #4b3f1b;
  outline: 2px solid #4b3f1b;
}

.defaultButton:hover,
.defaultButton:focus {
  background-color: #cfba7c;
}

</style>
