<script type=ts>
  import Gauge from "./Gauge.svelte";
  import {display, reviewCounts} from "../store/stores";

  const dowString = (date) => { 
    const weekday = new Intl.DateTimeFormat('en-US', {weekday: "short"} ).format(date); 
    return weekday;
  };

  $: overallAccuracy = $reviewCounts.map(r => r.accuracy).reduce((acc, a) => acc += a, 0) / $reviewCounts.length;
  $: readingAccuracy = $reviewCounts.map(r => r.reading_accuracy).reduce((acc, a) => acc += a, 0) / $reviewCounts.length;
  $: meaningAccuracy = $reviewCounts.map(r => r.meaning_accuracy).reduce((acc, a) => acc += a, 0) / $reviewCounts.length;
</script>

<div class="gbWidget">
  {#if $display === "chart"}
    <h1 class="gbHeader">Accuracy</h1>
    <Gauge value={ overallAccuracy } />
    <div class="units">correct first time</div>
  {:else}
    <h1 class="gbHeader">{(overallAccuracy * 100).toFixed()}% Accuracy</h1>
    <div data-testid="accuracy-table">
      <table class="gbContent">
        <tr>
          <th>Overall</th>
          <td>{ (100*readingAccuracy).toFixed() }<span
          class="secondary">%r</span> { (100*meaningAccuracy).toFixed() }<span
          class="secondary">%m</span></td>
        </tr>
        <tr>
          <th>Latest ({dowString($reviewCounts[$reviewCounts.length - 1].start)})</th>
          <td>{ (100 * $reviewCounts[$reviewCounts.length - 1].reading_accuracy).toFixed(1) }<span
          class="secondary">%r</span> { (100 * $reviewCounts[$reviewCounts.length - 1].meaning_accuracy).toFixed(1) }<span
          class="secondary">%m</span></td>
        </tr>
        {#if ($reviewCounts.length > 2)}
          <tr>
            <th>Reading {dowString($reviewCounts[0].start)} &ndash; {dowString($reviewCounts[$reviewCounts.length - 2].start)}:</th>
            <td>{$reviewCounts.slice(0, -1).map(r => (r.reading_accuracy * 100).toFixed(1)).join(" • ")}</td>
          </tr>
          <tr>
            <th>Meaning {dowString($reviewCounts[0].start)} &ndash; {dowString($reviewCounts[$reviewCounts.length - 2].start)}:</th>
            <td>{$reviewCounts.slice(0, -1).map(r => (r.meaning_accuracy * 100).toFixed(1)).join(" • ")}</td>
          </tr>
        {:else if ($reviewCounts.length === 2)}
          <tr>
            <th>Reading {dowString($reviewCounts[0].start)}:</th>
            <td>{($reviewCounts[0].reading_accuracy * 100).toFixed(1)}</td>
          </tr>
          <tr>
            <th>Meaning {dowString($reviewCounts[0].start)}:</th>
            <td>{($reviewCounts[0].meaning_accuracy * 100).toFixed(1)}</td>
          </tr>
        {/if}
      </table>
    </div>
  {/if}
</div>