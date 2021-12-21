<script>
  import Gauge from "./Gauge.svelte";
  import { display, gbSettings, apprenticeCounts } from "../store/stores";
  import { getApprenticeCounts } from "../API/Apprentice";

  $: getApprenticeCounts().then(newCounts => apprenticeCounts.set(newCounts));

  $: totalApprentice = $apprenticeCounts.radicals.reduce((acc, c) => acc += c, 0)
      + $apprenticeCounts.kanji.reduce((acc, c) => acc += c, 0)
      + $apprenticeCounts.vocabulary.reduce((acc, c) => acc += c, 0);

  $: newRadicals = $apprenticeCounts.radicals.slice(0,2).reduce((acc, c) => acc += c, 0);
  $: newKanji = $apprenticeCounts.kanji.slice(0,2).reduce((acc, c) => acc += c, 0);
  $: newVocabulary = $apprenticeCounts.vocabulary.slice(0,2).reduce((acc, c) => acc += c, 0);
  
  $: newItems = newRadicals + newKanji + newVocabulary;
  
  $: weightedCount = totalApprentice
    - newRadicals
    - newKanji
    - newVocabulary
    + newRadicals * $gbSettings.newRWeight
    + newKanji * $gbSettings.newKWeight
    + newVocabulary * $gbSettings.newVWeight

  $: unweightedValue = totalApprentice / (2 * $gbSettings.targetApprentice);
  $: weightedValue = weightedCount / (2 * $gbSettings.targetApprentice);
</script>

<div class="gbWidget">
  {#if $display === "chart" }
    <h1 class="gbHeader">GanbarOmeter</h1>
    <Gauge value={weightedValue} />
    <div class="units">of max difficulty</div>
  {:else}
    <h1 class="gbHeader">{(weightedValue * 100).toFixed()}% GanbarOmeter</h1>
    <div data-testid="ganbarometer-table">
      <table class="gbContent">
        <tr>
          <th>Apprentice</th>
          <td>{totalApprentice} <span
          class="secondary">target: {$gbSettings.targetApprentice}</span></td>
        </tr>
        <tr>
          <th>New</th>
          <td>{newRadicals}<span class="secondary">r</span> 
            {newKanji}<span class="secondary">k</span> 
            {newVocabulary}<span class="secondary">v</span>
          </td>
        </tr>
        <tr>
          <th>Weights</th>
          <td>{$gbSettings.newRWeight}<span class="secondary">r</span> 
            {$gbSettings.newKWeight}<span class="secondary">k</span> 
            {$gbSettings.newVWeight}<span class="secondary">v</span>
          </td>
        </tr>
        <tr>
          <th>Unweighted</th>
          <td>{(unweightedValue * 100).toFixed()}<span class="secondary">%</span></td>
        </tr>
        <tr>
          <th>Weighted</th>
          <td>{(weightedValue * 100).toFixed()}<span class="secondary">%</span></td>
        </tr>
      </table>
    </div>
  {/if}
</div>
