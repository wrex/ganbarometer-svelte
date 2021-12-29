<script type= "ts">
  let values = {
    bgColor: "#f4f4f4",
    textColor: "#333333",
    fillColor: "#b4c0be",
    goodColor: "#59c273",
    altColor: "#489c5c",
    warnColor: "#fbb623",
    alertColor: "#ff00aa",
  };
</script>

<div class="settingsComp">
  <div class="colorSample" style="background-color: {values.bgColor}">
    <h3 style="color: {values.textColor}">Sample Text <small>small</small> and <strong>STRONG</strong></h3>
    <div class="gaugeBar" style="background-color: {values.fillColor}">
      <div 
        class="altBar" 
        style="background-color: {values.altColor}"
      ></div><div
        class="goodBar" 
        style="background-color: {values.goodColor}"
      ></div><div
        class="warnBar"
        style="background-color: {values.warnColor}"
      ></div><div
        class="errorBar"
        style="background-color: {values.alertColor}"
      ></div>
    </div>
  </div>
  <div class="colorInputs">
    <label>
      Background
      <input type="color" bind:value={values.bgColor}>
    </label>
    <label>
      Fill
      <input type="color" bind:value={values.fillColor}>
    </label>
    <label>
      Text
      <input type="color" bind:value={values.textColor}>
    </label>
  </div>
  <div class="colorInputs">
    <label>
      Alt
      <input type="color" bind:value={values.altColor}>
    </label>
    <label>
      Good
      <input type="color" bind:value={values.goodColor}>
    </label>
    <label>
      Warn
      <input type="color" bind:value={values.warnColor}>
    </label>
    <label>
      Alert
      <input type="color" bind:value={values.alertColor}>
    </label>
  </div>
    
  <div class="themes">
    <button>Light</button>
    <button>Dark</button>
  </div>

  <hr>
  <!-- position: "Top" | "Below Forecast" | "Below SRS" | "Below Panels" | "Bottom" -->

  <div class="position">
    <label for="position-select">Position 
      <select name="positions" id="position-select">
        <option value="Top">Top</option>
        <option value="Below Forecast">Below Forecast</option>
        <option value="Below SRS">Below SRS</option>
        <option value="Below Panels">Below Panesl</option>
        <option value="Bottom">Bottom</option>
      </select>
    </label>
  </div>

</div>

<style>

  .position {
    margin-inline: 20px;
  }

  .themes {
    display: flex;
    justify-content: center;
  }

  input[type="color"] {
    width: 20px;
    height: 20px;
    padding: 0;
    margin: 0;
  }

  .colorInputs {
    display: flex;
    column-gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    text-align: right;
    width: 91%;
    margin: 10px auto;
  }

  .colorSample {
    position: relative;
    min-height: 100px;
    display: flex;
    flex-wrap: wrap;
    padding: 2em;
    margin-inline: 20px;
  }

  .gaugeBar {
    position: absolute;
    bottom: 20px;
    width: 425px;
    height: 45px;
  }

  .gaugeBar > * {
    display: inline-block;
    height: 45px;
  }

  .altBar {
    position: absolute;
    z-index: 1;
    width: 120px;
  }

  .goodBar {
    width: 180px;
  }

  .warnBar {
    width: 80px;
  }

  .errorBar {
    width: 40px;
  }
  

</style>