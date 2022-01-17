<script lang= "ts">
  import RangeSlider from "./RangeSlider.svelte";
  import Info from "./Info.svelte";
  import NumberSpinner from "./NumberSpinner.svelte";

  export let values;

  let range_values = [values.gbMinTarget, values.gbMaxTarget];
  $: [values.gbMinTarget, values.gbMaxTarget] = range_values;
</script>

<div class="gbSettingsComp">
  <h4>Target range</h4>
  <RangeSlider 
    id="gbRange" 
    range
    pushy
    float
    min={5}
    max={300}
    step={5}
    bind:values={range_values} />

  <div class="infoIcon" data-testid="gbRangeInfo"><Info type="gbRange" /></div>

  <div data-testid="gbRangeLabel" class="rangeLabel">{values.gbMinTarget} &ndash; {values.gbMaxTarget}</div>

  <hr>

  <table>
    <tbody>
      <tr>
        <th class="col2">Labels</th>
        <td><input 
          type="text" 
          data-testid="belowInput"
          bind:value={values.belowTerm}
        ></td>
        <td><input 
          type="text" 
          data-testid="inRangeInput"
          bind:value={values.inRangeTerm}
        ></td>
        <td><input 
          type="text" 
          data-testid="aboveInput"
          bind:value={values.aboveTerm}
        ></td>
      </tr>
      <div class="infoIcon" data-testid="gbLabelInfo"><Info type="gbLabel" /></div>
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
        <th aria-label="Radical1-2 Weight" class="secondary right-align col2">Radical1-2</th>
        <td><NumberSpinner 
          bind:value={values.newRWeight} 
          min={0} 
          max={5} 
          step={0.001} 
          decimals={3}
        /></td>
        <th class="secondary right-align col4">Appr3-4</th>
        <td><NumberSpinner 
          bind:value={values.apprWeight} 
          min={0} 
          max={5} 
          step={0.001} 
          decimals={3}
        /></td>
      </tr>
      <tr>
        <th aria-label="Kanji1-2 Weight" class="secondary right-align col2">Kanji1-2</th>
        <td><NumberSpinner 
          bind:value={values.newKWeight} 
          min={0} 
          max={5} 
          step={0.001} 
          decimals={3}
        /></td>
        <th class="secondary right-align col4">Guru</th>
        <td><NumberSpinner 
          bind:value={values.guruWeight} 
          min={0} 
          max={5} 
          step={0.001} 
          decimals={3}
        /></td>
      </tr>
      <div class="infoIcon" data-testid="gbWeightInfo"><Info type="gbWeight" /></div>
      <tr>
        <th aria-label="Vocab1-2 Weight" class="secondary right-align col2">Vocab1-2</th>
        <td><NumberSpinner 
          bind:value={values.newVWeight} 
          min={0} 
          max={5} 
          step={0.001} 
          decimals={3}
        /></td>
        <th class="secondary right-align col4">Master</th>
        <td><NumberSpinner 
          bind:value={values.masterWeight} 
          min={0} 
          max={5} 
          step={0.001} 
          decimals={3}
        /></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <th class="secondary right-align col4">Enlightened</th>
        <td><NumberSpinner 
          bind:value={values.enlightenedWeight} 
          min={0} 
          max={5} 
          step={0.001} 
          decimals={3}
        /></td>
      </tr>
    </tbody>
  </table>

  <hr>

  <table>
    <thead>
      <tr>
        <td></td>
        <th aria-label="Radical1-2 Quiz" class="secondary center col3">Radical1-2</th>
        <th aria-label="Kanji1-2 Quiz" class="secondary center">Kanji1-2</th>
        <th aria-label="Vocab1-2 Quiz" class="secondary center">Vocab1-2</th>
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
      <div class="infoIcon" data-testid="gbQuizInfo"><Info type="gbQuiz" /></div>
    </tbody>
  </table>

</div>
        
<style>

  :global(#gbRange),
  .rangeLabel {
    grid-column: 3 / span 3;
    width: 100%;
    margin: 0;
    align-self: center;
    text-align: center;
  }
  h4 {
    font-size: small;
    margin: 0;
    grid-column: 1 / span 2;
    text-align: right;
    align-self: center;
  }

  hr {
    grid-column: 1 / span 6;
    margin: 5px 0;
    padding: 0;
  }

  input[type="text"] {
    width: 3em;
    text-align: center;
    margin: 0;
  }

  .infoIcon {
    grid-column: 6;
    justify-self: center;
    align-self: center;
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