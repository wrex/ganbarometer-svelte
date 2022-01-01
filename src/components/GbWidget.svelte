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
  
  $: target = ($gbSettings.gbMaxTarget + $gbSettings.gbMinTarget) / 2;

  $: rotValue = weightedCount / (2 * target);
  $: delta = (weightedCount - target) / target;
  $: numericLabel = (delta < 0 ? "" : "+") + (delta*100).toFixed();
  $: label = (weightedCount < $gbSettings.gbMinTarget) 
    ? $gbSettings.belowTerm
    : (weightedCount > $gbSettings.gbMinTarget)
      ? $gbSettings.aboveTerm
      : $gbSettings.inRangeTerm;
</script>

<div class="gbWidget">
  {#if $display === "chart" }
    <h1 class="gbHeader">GanbarOmeter</h1>
    <Gauge value={rotValue} {label} needle lowZone hiZone />
    <div class="units"><span class="left-aligned">遅</span><span class=right-aligned>早</span></div>
  {:else}
    <h1 class="gbHeader" in:fade >GanbarOmeter: {numericLabel}</h1>
    <div data-testid="ganbarometer-table" in:fade >
      <table class="gbContent">
        <tr>
          <th>Apprentice</th>
          <td>{$srsCounts.new.radicals}<span class="secondary">r</span> 
            {$srsCounts.new.kanji}<span class="secondary">k</span> 
            {$srsCounts.new.vocabulary}<span class="secondary">v +</span>{$srsCounts.apprentice.late}
          </td>
        </tr>
        <tr>
          <th>Guru'ed</th>
          <td>{$srsCounts.guru}<span class="secondary">g</span>
            {$srsCounts.master}<span class="secondary">m</span>
            {$srsCounts.enlightened}<span class="secondary">e</span>
          </td>
        </tr>
        <tr>
          <th>Target</th>
          <td>{$gbSettings.gbMinTarget}<span class="secondary"> &ndash; </span>{$gbSettings.gbMaxTarget}</td>
        </tr>
        <tr>
          <th>Actual</th>
          <td>{weightedCount.toFixed()} <span class="secondary">({numericLabel}
          on -100 to +100 scale)</span></td>
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