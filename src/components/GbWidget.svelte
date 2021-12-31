<script>
  import Gauge from "./Gauge.svelte";
  import { fade } from "svelte/transition";
  import { display, gbSettings, srsCounts } from "../store/stores";
  import { getSrsCounts } from "../API/Assignments";

  $: getSrsCounts().then(counts => srsCounts.set(counts));

  $: weightedCount = $srsCounts.new.radicals * $gbSettings.newRWeight
    + $srsCounts.new.kanji * $gbSettings.newKWeight
    + $srsCounts.new.vocabulary * $gbSettings.newVWeight
    + $srsCounts.apprentice.late;

  $: unweightedValue = $srsCounts.apprentice.total / (2 * $gbSettings.targetApprentice);
  $: weightedValue = weightedCount / (2 * $gbSettings.targetApprentice);
</script>

<div class="gbWidget">
  {#if $display === "chart" }
    <h1 class="gbHeader">GanbarOmeter</h1>
    <Gauge value={weightedValue} />
    <div class="units">of max difficulty</div>
  {:else}
    <h1 class="gbHeader" in:fade >GanbarOmeter: {(weightedValue * 100).toFixed()}%</h1>
    <div data-testid="ganbarometer-table" in:fade >
      <table class="gbContent">
        <tr>
          <th>Apprentice</th>
          <td>{$srsCounts.apprentice.total} <span
          class="secondary">target: {$gbSettings.targetApprentice}</span></td>
        </tr>
        <tr>
          <th>New</th>
          <td>{$srsCounts.new.radicals}<span class="secondary">r</span> 
            {$srsCounts.new.kanji}<span class="secondary">k</span> 
            {$srsCounts.new.vocabulary}<span class="secondary">v</span>
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
