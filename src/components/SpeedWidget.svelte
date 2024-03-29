<script type="ts">
  import Gauge from "./Gauge.svelte";
  import { fade } from "svelte/transition";
  import {display, sessionSummaries, gbSettings} from "../store/stores";

  $: totalReviews = $sessionSummaries.reduce((acc, s) => acc += +s.reviewCount, 0);
  $: totalQuestions = $sessionSummaries.reduce((acc, s) => acc += +s.questionCount, 0);

  const durationS = (sess) => {
    return (sess.end - sess.start) / 1000;
  };

  let totalDuration: number; // seconds
  $: totalDuration = ($sessionSummaries.reduce((acc, s) => acc += s.duration, 0)) / 1000;

  $: secondsPerQ = (totalQuestions > 0)
    ? (totalDuration / totalQuestions)
    : 0;
  
  $: qPerMinute = 60 / secondsPerQ;
  
  $: gauge_label = `${qPerMinute.toFixed(1)}`;

  // 0.5 is needle straight up, want needle to be 2/3rds of the way to vertical
  // at low target
  const lowTurns = 2/3 * 0.5;
  $: scaling = lowTurns / ($gbSettings.maxQPM - $gbSettings.minQPM);
  $: gauge_value = lowTurns + (qPerMinute - $gbSettings.minQPM) * scaling;

  const fmtDayTime = (date) => Intl.DateTimeFormat('en-US', {dateStyle: "short", timeStyle: "short"}).format(date);
  const fmtTime = (date) => Intl.DateTimeFormat('en-US', {timeStyle: "short"}).format(date);
  
  const percentCorrect = (summary) => {
    let percent = 100 * summary.correctAnswerCount / summary.questionCount;
    return percent.toFixed(1);
  };

  const spq = (duration: number, count: number): string => (duration/count).toFixed(1);
  const qpm = (duration: number, count: number): string => (60*count/duration).toFixed(1);

</script>

<div class="gbWidget" data-testid="speedWidget" style="--trackColor: {$gbSettings.hlTrackColor}; --hlTrackColor: {$gbSettings.trackColor};">
  {#if $display === "chart"}
    <h1 class="gbHeader">Speed</h1>
    <Gauge value={gauge_value} label={gauge_label} indicator="needle" lowZone hiZone />
    <div class="units">qpm</div>
  {:else}
    <h1 class="gbHeader" in:fade>Speed: {secondsPerQ.toFixed(1)} spq • {qPerMinute.toFixed(1)} qpm</h1>
    <div data-testid="speed-table" in:fade>
      <div class="gbContent scrollbox">
        <h4>{$sessionSummaries.length} sessions • {totalReviews} items • {totalQuestions} questions</h4>
        {#each $sessionSummaries.reverse() as summary, i}
          <article>
            <h5>{i+1}: {fmtDayTime(summary.start)} &ndash; {fmtTime(summary.end)}
            ({(summary.duration / 60000).toFixed(2)}m)</h5>
            <p>{summary.reviewCount} items • {summary.questionCount} questions •
            {spq(summary.duration / 1000, summary.questionCount)} spq •
            {qpm(summary.duration / 1000, summary.questionCount)} qpm<br>
            {summary.correctAnswerCount}/{summary.questionCount} =
            {percentCorrect(summary)}% correct </p>
          </article>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>

  h4,
  h5 {
    font-size: x-small;
    font-weight: normal;
    margin: 0;
    padding-left: 0.5em;
  }

  h4 {
    text-decoration: underline;
  }

  article p {
    font-weight: bolder;
    font-size: x-small;
    padding-left: 2em;
  }


.gbWidget {
  --scrollbarBG: var(--hlTrackColor);
  --thumbBG: var(--textColor);
}

.scrollbox::-webkit-scrollbar {
  width: 1em;
}
.scrollbox {
  padding: 0;
  border: 2px solid var(--scrollbarBG);
  scrollbar-width: thin;
  scrollbar-color: var(--thumbBG) var(--scrollbarBG);
}
.scrollbox::-webkit-scrollbar-track {
  background: var(--scrollbarBG);
}
.scrollbox::-webkit-scrollbar-thumb {
  background-color: var(--thumbBG) ;
  border-radius: 6px;
  border: 3px solid var(--scrollbarBG);
}
</style>