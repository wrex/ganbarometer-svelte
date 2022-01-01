<script type= "ts">
  let something = "something";
</script>

<div class="settingsComp">
  <h4>Target value</h4>
  <input id="apprTarget" type="range">
  <label for="apprTarget">100 items</label>

  <hr>

  <h4>Warning Levels</h4>
  <input id="minWarning" type="range">
  <label for="minWarning">20% minimum</label>

  <input id="maxWarning" type="range">
  <label for="maxWarning">80% maximum</label>

  <hr>

  <table>
    <thead>
      <tr>
        <th></th>
        <th class="col3">Weight</th>
        <th></th>
        <th class="col5">Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th class="secondary right-align col2">Radicals12</th>
        <td><input 
          class="col3"
          type="number"
          min={0.2}
          max={5}
          step={0.2}
          value={0.6}
        ></td>
        <th class="secondary right-align col4">Appr34</th>
        <td><input 
          class="col5"
          type="number"
          min={0.2}
          max={5}
          step={0.2}
          value={1}
        ></td>
      </tr>
      <tr>
        <th class="secondary right-align col2">Kanji12</th>
        <td><input 
          class="col3"
          type="number"
          min={0.2}
          max={5}
          step={0.2}
          value={3.0}
        ></td>
        <th class="secondary right-align col4">Guru</th>
        <td><input 
          class="col5"
          type="number"
          min={0.2}
          max={5}
          step={0.2}
          value={0}
        ></td>
      </tr>
      <tr>
        <th class="secondary right-align col2">Vocabulary12</th>
        <td><input 
          class="col3"
          type="number"
          min={0.2}
          max={5}
          step={0.2}
          value={1}
        ></td>
        <th class="secondary right-align col4">Master</th>
        <td><input 
          class="col4"
          type="number"
          min={0.2}
          max={5}
          step={0.2}
          value={0}
        ></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <th class="secondary right-align col4">Enlightened</th>
        <td><input 
          class="col5"
          type="number"
          min={0.2}
          max={5}
          step={0.2}
          value={0}
        ></td>
      </tr>
    </tbody>
  </table>

  <hr>

  <table>
    <thead>
      <tr>
        <td></td>
        <th class="secondary center col3">Radicals12</th>
        <th class="secondary center">Kanji12</th>
        <th class="secondary center">Vocabulary12</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th class="col2">Quiz?</th>
        <td><input 
          type="checkbox" 
          name="quizTypes"
        ></td>
        <td><input 
          type="checkbox" 
          name="quizTypes"
          checked
        ></td>
        <td><input 
          type="checkbox" 
          name="quizTypes"
        ></td>
      </tr>
    </tbody>
  </table>

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

  hr {
    grid-column: 1 / span 6;
  }
  input[type="range"] {
    grid-column: 3 / span 2;
    width: 100%;
    text-align: center;
    vertical-align: middle;
    margin: 0;
  }

  input[type="number"] {
    width: 3em;
    text-align: center;
    margin: 0;
  }


  table {
    grid-column: 1 / span 6;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: max-content;
  }

  thead, tbody, tr {
    display: contents;
  }

  td {
    text-align: center;
  }
  .secondary {
    color: #888888;
    font-weight: normal;
    font-size: small;
    padding: 0;
    vertical-align: middle;
  }

  .right-align {
    text-align: right;
    align-self: center;
  }

  .center {
    text-align: center;
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

</style>