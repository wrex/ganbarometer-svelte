<script type= "ts">
  let something = "something";
</script>

<div class="settingsComp">
  <div class=slider>
    <h4>Target value</h4>
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
    <td></td>
    <label for="apprTarget">
      <input id="apprTarget" type="range"><span class="value">80% max</span>
    </label>
  </div>

  <hr>

  <table>
    <thead>
      <tr>
        <th></th>
        <th>Weight</th>
        <th></th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Radicals12</th>
        <td><input 
          type="number"
          min={0.2}
          max={5}
          step={0.2}
          value={0.6}
        ></td>
        <th>Appr34</th>
        <td><input 
          type="number"
          min={0.2}
          max={5}
          step={0.2}
          value={1}
        ></td>
      </tr>
      <tr>
        <th>Kanji12</th>
        <td><input 
          type="number"
          min={0.2}
          max={5}
          step={0.2}
          value={3.0}
        ></td>
        <th>Guru</th>
        <td><input 
          type="number"
          min={0.2}
          max={5}
          step={0.2}
          value={0}
        ></td>
      </tr>
      <tr>
        <th>Vocabulary12</th>
        <td><input 
          type="number"
          min={0.2}
          max={5}
          step={0.2}
          value={1}
        ></td>
        <th>Master</th>
        <td><input 
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
        <th>Enlightened</th>
        <td><input 
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

  <div class="quizSection">
    <table>
      <thead>
        <td></td>
        <th>Radicals12</th>
        <th>Kanji12</th>
        <th>Vocabulary12</th>
      </thead>
      <tbody>
        <th>Quiz?</th>
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
      </tbody>
    </table>
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

  input {
    width: 3em;
    text-align: center;
    vertical-align: middle;
    margin: 0;
  }
  thead th:nth-child(1) {
    width: 168px;
  }
  thead th:nth-child(2), thead th:nth-child(4) {
    width: 92px;
  }

  thead th:nth-child(3) {
    width: 74px;
  }

  tbody td {
    padding: 0.2em;
    text-align: center;
    vertical-align: middle;
  }

  .quizSection {
    margin-left: 168px;
  }

  tbody th, .quizSection thead th {
    color: #888888;
    font-weight: normal;
    font-size: small;
    padding: 0;
    text-align: right;
    vertical-align: middle;
  }

  .quizSection tbody th {
    text-align: center;
  }

 .slider input {
   width: 160px;
 }

</style>