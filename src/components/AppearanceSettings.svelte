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
  </div>
  <div class="colorInputs">
    <label>
      Alert
      <input type="color" bind:value={values.alertColor}>
    </label>
  </div>

  <button class="light">Set light</button>
  <button class="dark">Set dark</button>
    
  <hr>
  <!-- position: "Top" | "Below Forecast" | "Below SRS" | "Below Panels" | "Bottom" -->

  <label for="position-select" class="col2">Position</label>
  <select name="positions" id="position-select" class="position">
    <option value="Top">Top</option>
    <option value="Below Forecast">Below Forecast</option>
    <option value="Below SRS">Below SRS</option>
    <option value="Below Panels">Below Panels</option>
    <option value="Bottom">Bottom</option>
  </select>

</div>

<style>

  .colorSample {
    grid-column: 2 / span 4;
  }

  .colorSample {
    position: relative;
    min-height: 100px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  label {
    align-self: center;
    width: 100px;
    font-size: small;
    text-align: right;
  }

  .position {
    width: 100%;
    grid-column: 3 / span 2;
  }

  input[type="color"] {
    width: 20px;
    height: 20px;
    padding: 0;
    margin: 0;
  }

  .colorInputs {
    grid-column: 2 / span 4;
    display: flex;
    column-gap: 10px;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    text-align: right;
  }

  hr {
    grid-column: 1 / span 6;
  }


  .gaugeBar {
    position: absolute;
    bottom: 20px;
    width: 80%;
    height: 30px;
    margin-left: 1em;
  }

  .gaugeBar > * {
    display: inline-block;
    height: 30px;
  }

  .altBar {
    position: absolute;
    z-index: 1;
    width: 40%;
  }

  .goodBar {
    width: 60%;
  }

  .warnBar {
    width: 15%;
  }

  .errorBar {
    width: 5%;
  }

  .col1 {
    grid-column: 1 / span 1;
  }
  .col2 {
    grid-column: 2 / span 1;
  }
  .col3 {
    grid-column: 3 / span 1;
  }
  .col4 {
    grid-column: 4 / span 1;
  }
  .col5 {
    grid-column: 5 / span 1;
  }

  /* Buttons styles start */
  .light {
    grid-column: 2 / span 2;
  }
  .dark {
    grid-column: 4 / span 2;
  }
button {
    display: inline-block;
    border: none;
    padding-block: 0.5rem;
    border-radius: 5px;
    margin: 0;
    text-decoration: none;
    background: #59c273;
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
    background: #489c5c;
}

button:focus {
    outline: 1px solid #fff;
    outline-offset: -4px;
}

button:active {
    transform: scale(0.99);
}
/* Button styles end */
  

</style>