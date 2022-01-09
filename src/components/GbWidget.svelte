<script lang="ts">
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
  
  // 0.5 is needle straight up, want needle to be 2/3rds of the way to vertical
  // at low target
  const lowTurns = 2/3 * 0.5;
  $: scaling = lowTurns / ($gbSettings.gbMaxTarget - $gbSettings.gbMinTarget);
  $: rawValue = lowTurns + (weightedCount - $gbSettings.gbMinTarget) * scaling;
  $: rotValue = (rawValue < 0)
    ? 0
    : (rawValue > 1)
      ? 1
      : rawValue;

  
  // rotValue is between 0 and 1
  // want the label to be +/- from 0.5
  $: rawLabel = (rotValue - 0.5).toFixed(2);
  $: numericLabel = (rotValue > 0.5) ? "+" + rawLabel : rawLabel;
  $: label = (weightedCount < $gbSettings.gbMinTarget) 
    ? $gbSettings.belowTerm
    : (weightedCount > $gbSettings.gbMaxTarget)
      ? $gbSettings.aboveTerm
      : $gbSettings.inRangeTerm;

  </script>

  <div class="gbWidget" style="--trackColor: {$gbSettings.hlTrackColor}; --hlTrackColor: {$gbSettings.trackColor};">
    {#if $display === "chart" }
      <h1 class="gbHeader">GanbarOmeter</h1>
      <Gauge value={rotValue} {label} needle lowZone hiZone />
      <div class="units"><span class="left-aligned">遅</span><span class=right-aligned>早</span></div>
    {:else}
      <h1 class="gbHeader" in:fade >GanbarOmeter: {numericLabel}</h1>
      <div data-testid="ganbarometer-table" in:fade >
        <table class="gbContent">
          <tr>
            <th>Early Apprentice</th>
            <td>{$srsCounts.new.radicals}<span class="secondary">r</span> 
              {$srsCounts.new.kanji}<span class="secondary">k</span> 
              {$srsCounts.new.vocabulary}<span class="secondary">v</span>
            </td>
          </tr>
          <tr>
            <th>Apprentice</th>
            <td>{$srsCounts.apprentice.total} <span class="secondary">items
            ({$srsCounts.apprentice.early} early-stage)</span>
            </td>
        </tr>
        <tr>
          <th>Learned</th>
          <td>{$srsCounts.guru}<span class="secondary">g</span>
            {$srsCounts.master}<span class="secondary">m</span>
            {$srsCounts.enlightened}<span class="secondary">e</span>
          </td>
        </tr>
        <tr>
          <th>Weighted count</th>
          <td>{weightedCount.toFixed()} <span class="secondary">(target {$gbSettings.gbMinTarget}&ndash;{$gbSettings.gbMaxTarget})</span></td>
        </tr>
      </table>
    </div>
  {/if}
</div>

<style>

.units {
  font-size: small;
  margin: 0 65px;
  text-align: center;
  display: flex;
}
.left-aligned {
  text-align: left;
  width: 100%;
}
.right-aligned {
  text-align: right;
  width: 100%;
}
</style>