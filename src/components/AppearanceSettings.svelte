<script type= "ts">
  import Gauge from "./Gauge.svelte";
  import BarChart from "./BarChart.svelte";
  import Info from "./Info.svelte";
  export let values;

  const setLightTheme = () => {
      values.bgColor = "#f4f4f4";
      values.hlTrackColor = "#d1e8d4",
      values.trackColor = "#e0e0e0";
      values.textColor = "#333333";
      values.hlTextColor = "#fbb623";
      values.fillColor = "#59c273";
      values.warnColor = "#fbb623";
  };

  const setDarkTheme = () => {
      values.bgColor = "#232629";
      values.trackColor = "#e0e0e0",
      values.textColor = "#bcbcbc";
      values.hlTextColor = "#fcbd4b";
      values.fillColor = "#59c273";
      values.warnColor = "#fcbd4b";
      values.hlTrackColor = "#aad4b0";
  };
</script>

<div class="gbSettingsComp">
  <div data-testid="colorSample" class="colorSample" style={` 
      background-color: ${values.bgColor};
      --bgColor: ${values.bgColor}; 
      --trackColor: ${values.hlTrackColor}; 
      --textColor: ${values.textColor}; 
      --hlTextColor: ${values.hlTextColor}; 
      --fillColor: ${values.fillColor}; 
      --warnColor: ${values.warnColor}; 
      --hlTrackColor: ${values.trackColor};` 
    }>
    <div class="warnBox">Warning Color</div>
    <Gauge value={0.4} label="Sample" indicator="needle" lowZone hiZone />
    <BarChart 
      values={[7, 10, 8]} 
      labels={["Mon", "Tue", "Wed"]}
      expected={7}
      minTarget={2}
      maxTarget={9}
      percents={[0.66, 0.8, 0.75]}
    />
  </div>

  <button class="light" on:click|preventDefault={setLightTheme}>Light theme</button>
  <button class="dark" on:click|preventDefault={setDarkTheme}>Dark theme</button>
    
  <h3>Individual overrides</h3>
  <div class="colorInputs">
    <label>
      Bgnd
      <input type="color" bind:value={values.bgColor}>
    </label>
    <label>
      Track
    <input type="color" bind:value={values.trackColor}>
    </label>
    <label>
      Text
      <input type="color" bind:value={values.textColor}>
    </label>
    <label>
      hlText
      <input type="color" bind:value={values.hlTextColor}>
    </label>
  </div>
  <div class="infoIcon" data-testid="colorInfo"><Info type="color" /></div>
  <div class="colorInputs">
    <label>
      Fill
      <input type="color" bind:value={values.fillColor}>
    </label>
    <label>
      Warn
      <input type="color" bind:value={values.warnColor}>
    </label>
    <label>
      hlTrack
      <input type="color" bind:value={values.hlTrackColor}>
    </label>
  </div>

  <hr>


  <div class="position">
    <label for="position-select">Position</label>
    <select name="positions" id="position-select" bind:value={values.position}>
      <option value="Top">Top</option>
      <option value="Below Forecast">Below Forecast</option>
      <option value="Below SRS">Below SRS</option>
      <option value="Below Panels">Below Panels</option>
      <option value="Bottom">Bottom</option>
    </select>
  </div>
  <div class="infoIcon" data-testid="positionInfo"><Info type="position" /></div>

</div>

<style>
  h3 {
    grid-column: 1 / span 6;
    text-align: center;
    text-decoration: underline;
    margin: 30px 0 5px;
  }
  .warnBox {
    text-align: center;
    height: 20px;
    grid-column: 1 / span 6;
    color: #ffffff;
    background-color: var(--warnColor);
  }
  .colorSample {
    grid-column: 1 / span 6;
    position: relative;
    min-height: 100px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    margin: -22px 10px 30px;
  }

  label {
    display: inline-block;
    align-self: center;
    font-size: small;
    text-align: right;
  }

  .position {
    width: 100%;
    grid-column: 2 / span 4;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .position label {
    width: 100%;
    grid-column: 1;
  }

  .position select {
    width: 100%;
    grid-column: 2 / span 3;
  }

  input[type="color"] {
    width: 20px;
    height: 20px;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }

  .colorInputs {
    grid-column: 2 / span 4;
    text-align: right;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  hr {
    grid-column: 1 / span 6;
  }


  /* Buttons styles start */
  .light {
    grid-column: 2 / span 2;
    color: #4b3f1b;
    background-color: white;
    border: 2px solid #4b3f1b;
  }
  .dark {
    grid-column: 4 / span 2;
    color: white;
    background-color: #4b3f1b;
  }
button {
    display: inline-block;
    border: none;
    padding-block: 0.5rem;
    border-radius: 5px;
    margin: 0;
    text-decoration: none;
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
  background-color: rgba(75, 63, 27, 0.4);
}

button:focus {
    outline: 1px solid #fff;
    outline-offset: -4px;
}

button:active {
    transform: scale(0.99);
}
/* Button styles end */

.infoIcon {
    grid-column: 6;
    justify-self: center;
    align-self: center;
}

</style>