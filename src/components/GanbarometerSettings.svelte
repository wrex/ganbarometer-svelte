<script type= "ts">
  import { validate } from './validation';
  import Errors from './Errors.svelte';

  export let values;
  export let result;

  let errors = {};

  const validateField = path => () => {
    result = validate(values, path);
    errors = result.getErrors();
  }

</script>

<div class="settingsComp">
  <h4>Target minimum</h4>
  <input 
    id="targetMin" 
    type="range"
    min={10}
    max={300}
    step={10}
    bind:value={values.gbMinTarget}
    on:change={validateField("gbMinTarget")}>
  <label for="targetMin">{values.gbMinTarget}</label>
  <Errors {errors} path="gbMinTarget" />

  <h4>Target maximum</h4>
  <input 
    id="targetMax" 
    type="range"
    min={10}
    max={300}
    step={10}
    bind:value={values.gbMaxTarget}
    on:change={validateField("gbMaxTarget")}>
  <label for="targetMax">{values.gbMaxTarget}</label>
  <Errors {errors} path="gbMaxTarget" />

  <hr>

  <table>
    <tbody>
      <tr>
        <th class="col2">Labels</th>
        <td><input 
          type="text" 
          bind:value={values.belowTerm}
        ></td>
        <td><input 
          type="text" 
          bind:value={values.inRangeTerm}
        ></td>
        <td><input 
          type="text" 
          bind:value={values.aboveTerm}
        ></td>
      </tr>
    </tbody>
    <thead>
      <tr>
        <td></td>
        <th class="secondary center col3">Below</th>
        <th class="secondary center">In range</th>
        <th class="secondary center">Above</th>
      </tr>
    </thead>
  </table>

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
          min={0}
          max={5}
          step={0.1}
          bind:value={values.newRWeight}
        ></td>
        <th class="secondary right-align col4">Appr34</th>
        <td><input 
          class="col5"
          type="number"
          min={0}
          max={5}
          step={0.1}
          bind:value={values.apprWeight}
        ></td>
      </tr>
      <tr>
        <th class="secondary right-align col2">Kanji12</th>
        <td><input 
          class="col3"
          type="number"
          min={0}
          max={5}
          step={0.1}
          bind:value={values.newKWeight}
        ></td>
        <th class="secondary right-align col4">Guru</th>
        <td><input 
          class="col5"
          type="number"
          min={0}
          max={5}
          step={0.1}
          bind:value={values.guruWeight}
        ></td>
      </tr>
      <tr>
        <th class="secondary right-align col2">Vocabulary12</th>
        <td><input 
          class="col3"
          type="number"
          min={0}
          max={5}
          step={0.1}
          bind:value={values.newVWeight}
        ></td>
        <th class="secondary right-align col4">Master</th>
        <td><input 
          class="col4"
          type="number"
          min={0}
          max={5}
          step={0.1}
          bind:value={values.masterWeight}
        ></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <th class="secondary right-align col4">Enlightened</th>
        <td><input 
          class="col5"
          type="number"
          min={0}
          max={5}
          step={0.1}
          bind:value={values.enlightenedWeight}
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
          bind:checked={values.rQuiz}
        ></td>
        <td><input 
          type="checkbox" 
          name="quizTypes"
          bind:checked={values.kQuiz}
        ></td>
        <td><input 
          type="checkbox" 
          name="quizTypes"
          bind:checked={values.vQuiz}
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
    grid-column: 5 / span 1;
    margin: 0;
    text-align: left;
  }

  hr {
    grid-column: 1 / span 6;
    margin: 5px 0;
    padding: 0;
  }
  input[type="range"] {
    grid-column: 3 / span 2;
    width: 80%;
    justify-self: center;
    text-align: center;
    vertical-align: middle;
    margin: 0;
  }

  input[type="number"] {
    width: 3em;
    text-align: center;
    margin: 0;
  }

  input[type="text"] {
    width: 3em;
    text-align: center;
    margin: 0;
  }


  table {
    grid-column: 1 / span 6;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: max-content;
    gap: 5px 10px;
  }

  thead, tbody, tr {
    display: contents;
  }

  tbody th {
    align-self: center;
    text-align: right;
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