<script>
  import Gauge from "./Gauge.svelte";
  import { fade } from "svelte/transition";
  import { display, gbSettings, srsCounts } from "../store/stores";
  import { getSrsCounts } from "../API/Assignments";

  $: getSrsCounts().then(counts => srsCounts.set(counts));

  $: weightedCount = $srsCounts.new.radicals * $gbSettings.newRWeight
    + $srsCounts.new.kanji * $gbSettings.newKWeight
    + $srsCounts.new.vocabulary * $gbSettings.newVWeight
    + $srsCounts.apprentice.late * $gbSettings.apprWeight
    + $srsCounts.guru * $gbSettings.guruWeight
    + $srsCounts.master * $gbSettings.masterWeight
    + $srsCounts.enlightened * $gbSettings.enlightenedWeight;

  $: unweightedValue = $srsCounts.apprentice.total / (2 * $gbSettings.targetItems);
  $: weightedValue = weightedCount / (2 * $gbSettings.targetItems);
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
          <th>New</th>
          <td>{$srsCounts.new.radicals}<span class="secondary">r</span> 
            {$srsCounts.new.kanji}<span class="secondary">k</span> 
            {$srsCounts.new.vocabulary}<span class="secondary">v</span>
          </td>
        </tr>
        <tr>
          <th>Late Apprentice</th>
          <td>{$srsCounts.apprentice.late} <span class="secondary">items</span></td>
        </tr>
        <tr>
          <th>Guru</th>
          <td>{$srsCounts.guru} <span class="secondary">items</span></td>
        </tr>
        <tr>
          <th>Master</th>
          <td>{$srsCounts.master} <span class="secondary">items</span></td>
        </tr>
        <tr>
          <th>Enlightened</th>
          <td>{$srsCounts.enlightened} <span class="secondary">items</span></td>
        </tr>
      </table>
    </div>
  {/if}
</div>