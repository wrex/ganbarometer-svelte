<script>
  import Gauge from "./Gauge.svelte";
  import { display } from "../store/stores";

  export let progressCounts = {
    totalApprentice: 105,
    targetApprentice: 100,
    new: {radicals: 4, kanji: 5, vocabulary: 14},
    newWeights: {radicals: 0.75, kanji: 3.0, vocabulary: 1.0},
  };
  const newItems = progressCounts.new;
  const weights = progressCounts.newWeights;
  const weightedCount = progressCounts.totalApprentice 
    - newItems.radicals 
    - newItems.kanji 
    - newItems.vocabulary
    + newItems.radicals * weights.radicals
    + newItems.kanji * weights.kanji
    + newItems.vocabulary * weights.vocabulary;

  const unweightedValue = progressCounts.totalApprentice / (2 * progressCounts.targetApprentice);
  const weightedValue = weightedCount / (2 * progressCounts.targetApprentice);
</script>

<div class="gbWidget">
  <h1 class="gbHeader">GanbarOmeter</h1>
  {#if $display === "chart" }
    <Gauge value={weightedValue} />
    <div class="units">of max difficulty</div>
  {:else}
    <div data-testid="ganbarometer-table">
      <table class="gbContent">
        <tr>
          <th>Apprentice</th>
          <td>{progressCounts.totalApprentice} <span
          class="secondary">target: {progressCounts.targetApprentice}</span></td>
        </tr>
        <tr>
          <th>New</th>
          <td>{progressCounts.new.radicals}<span class="secondary">r</span> 
            {progressCounts.new.kanji}<span class="secondary">k</span> 
            {progressCounts.new.vocabulary}<span class="secondary">v</span>
          </td>
        </tr>
        <tr>
          <th>Weights</th>
          <td>{progressCounts.newWeights.radicals}<span class="secondary">r</span> 
            {progressCounts.newWeights.kanji}<span class="secondary">k</span> 
            {progressCounts.newWeights.vocabulary}<span class="secondary">v</span>
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
  <slot name="footer"></slot>
</div>
