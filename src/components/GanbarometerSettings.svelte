<script type= "ts">
  let something = "something";
</script>

<div class="settingsComp">
  <table>
    <thead>
      <tr>
        <th></th>
        <th>Weighting</th>
        <th>Quiz?</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Radicals</th>
        <td><input 
          type="number"
          min={0.2}
          max={5}
          step={0.2}
        ></td>
        <td><input 
          type="checkbox" 
          value="qRadicals" 
          name="quizTypes"
          ></td>
      </tr>
      <tr>
        <th>Kanji</th>
        <td><input 
          type="number"
          min={0.2}
          max={5}
          step={0.2}
        ></td>
        <td><input 
          type="checkbox" 
          value="qKanji" 
          name="quizTypes"
          checked
          ></td>
      </tr>
      <tr>
        <th>Vocabulary</th>
        <td><input 
          type="number"
          min={0.2}
          max={5}
          step={0.2}
        ></td>
        <td><input 
          type="checkbox" 
          value="qVocabulary" 
          name="quizTypes"
          ></td>
      </tr>
    </tbody>
  </table>

  <hr>

  <div class=slider>
    <h4>Apprentice Target</h4>
    <label>
      <input id="apprTarget" type="range"><span class="value">100 items</span>
    </label>
  </div>

  <hr>

  <div class=slider>
    <h4>Warning Levels</h4>
    <label for="apprTarget">
      <input id="apprTarget" type="range"><span class="value">20% min</span>
    </label>
    <h4></h4>
    <label for="apprTarget">
      <input id="apprTarget" type="range"><span class="value">80% max</span>
    </label>

  </div>
</div>
        
<style>
  .slider {
    display: grid;
    margin-inline: 10px;
    grid-template-columns: repeat(6, 1fr);
    column-gap: 10px;
  }

  .slider h4 {
    font-size: small;
    margin: 0;
    grid-column: 1 / span 2;
    text-align: right;
  }

  .slider label {
    grid-column: 3 / span 4;
  }

  .value {
    font-size: small;
    padding-left: 10px;
  }

  hr {
    margin-inline: 2em;
  }

  /* table {
    margin: auto;
  } */

  input {
    width: 3em;
    text-align: center;
    vertical-align: middle;
    margin: 0;
  }
  thead th:nth-child(1) {
    width: 175px;
  }
  thead th:nth-child(2), thead th:nth-child(3) {
    width: 80px;
  }

  tbody td {
    padding: 0.5em;
    text-align: center;
    vertical-align: middle;
  }

  tbody th {
    color: #888888;
    font-weight: normal;
    padding: 0.5em;
    text-align: right;
    vertical-align: middle;
  }

 .slider input {
   width: 160px;
 }

</style>