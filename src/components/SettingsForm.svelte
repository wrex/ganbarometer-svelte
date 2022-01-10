<script lang="ts">
  import GanbarometerSettings from "./GanbarometerSettings.svelte";
  import ReviewSettings from "./ReviewSettings.svelte";
  import AppearanceSettings from "./AppearanceSettings.svelte";
  import AdvancedSettings from "./AdvancedSettings.svelte";
  import { defaultSettings, gbSettings } from '../store/stores';

  export let modal;

  let values = {...$gbSettings};

  const submit = () => {
    $gbSettings = {...$gbSettings, ...values};
    modal.hide();
  }

  const setDefaults = () => { 
    values = { ...defaultSettings };
  };

  type navState = "Ganbarometer" | "Reviews" | "Appearance" | "Advanced";

  let current: navState = "Ganbarometer";
  const switchTo = (comp: navState) => {
    return () => current = comp;
  };

</script>

<form on:submit|preventDefault={submit} aria-label="Settings Form" class="settingsForm">
  <h1 class="title">Ganbarometer Settings</h1>
  <div class="menu">
    <nav class="nav">
        <li aria-label="Ganbarometer" on:click={switchTo("Ganbarometer")} class:active={current === "Ganbarometer"}>Ganbarometer</li>
        <li aria-label="Speed/Reviews" on:click={switchTo("Reviews")} class:active={current === "Reviews"}>Speed/Reviews</li>
        <li aria-label="Appearance" on:click={switchTo("Appearance")} class:active={current === "Appearance"}>Appearance</li>
        <li aria-label="Advanced" on:click={switchTo("Advanced")} class:active={current === "Advanced"}>Advanced</li>
    </nav>

    <div class="actions">
      <button on:click|preventDefault={setDefaults} class="defaultButton">Defaults</button>
      <button type="submit">Save</button>
    </div>
  </div>
  <div class="formInputs">
    {#if current === "Ganbarometer"}
      <GanbarometerSettings {values} />
    {:else if current === "Reviews"}
      <ReviewSettings {values} />
    {:else if current === "Appearance"}
      <AppearanceSettings {values} />
    {:else if current === "Advanced"}
      <AdvancedSettings {values} />
    {/if}
  </div>
</form>

<style>
  :global(.gbSettingsComp) {
    --range-slider:          #d7dada; /* slider main background color */
    --range-handle-inactive: #99a2a2; /* inactive handle color */
    --range-handle:          #59c273; /* non-focussed handle color */
    --range-handle-focus:    #489c5c; /* focussed handle color */
    --range-handle-border:   var(--range-handle);
    --range-range-inactive:  var(--range-handle-inactive); /* inactive range bar background color */
    --range-range:           var(--range-handle-focus); /* active range bar background color */
    --range-float-inactive:  var(--range-handle-inactive); /* inactive floating label background color */
    --range-float:           var(--range-handle-focus); /* floating label background color */
    --range-float-text:      white; /* text color on floating label */
    width: calc(100% - 20px);
    margin: 30px 10px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: max-content;
    gap: 5px 10px;
  }

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
    height: auto;
    color: white;
    margin: 0;
    text-align: center;
    padding: 0.5em 0;
    grid-area: title;
    border-radius: 5px 5px 0 0;
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
    min-height: 500px;

    display: flex;
    flex-direction: column;
    align-items: center;
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
  outline: 1px solid #fff;
  outline-offset: -4px;
}
button:disabled {
  cursor: default;
  background-color: #e0e0e0 !important;
}

.defaultButton, 
.defaultButton:hover,
.defaultButton:focus  {
  background-color: transparent;
  color: #4b3f1b;
  outline: 2px solid #4b3f1b;
  outline-offset: -2px;
}

.defaultButton:focus,
.defaultButton:hover {
  outline: 4px solid #4b3f1b;
}
</style>
