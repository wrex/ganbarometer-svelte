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

  $: weightedValue = weightedCount / (2 * $gbSettings.targetItems);
  $: delta = ((weightedValue - 0.5) * 100);
  $: label = (delta < 0 ? "" : "+") + delta.toFixed() + "%";
</script>

<div class="gbWidget">
  {#if $display === "chart" }
    <h1 class="gbHeader">GanbarOmeter</h1>
    <Gauge value={weightedValue} {label} needle={true} />
    <div class="units"><span class="left-aligned">遅</span><span class=right-aligned>速</span></div>
  {:else}
    <h1 class="gbHeader" in:fade >GanbarOmeter: {label}</h1>
    <div data-testid="ganbarometer-table" in:fade >
      <table class="gbContent">
        <tr>
          <th>Apprentice</th>
          <td>{$srsCounts.new.radicals}<span class="secondary">r</span> 
            {$srsCounts.new.kanji}<span class="secondary">k</span> 
            {$srsCounts.new.vocabulary}<span class="secondary">v</span>
            + {$srsCounts.apprentice.late}
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
          <th>Target Value</th>
          <td>{$gbSettings.targetItems}</td>
        </tr>
        <tr>
          <th>Weighted Value</th>
          <td>{weightedCount.toFixed()}</td>
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