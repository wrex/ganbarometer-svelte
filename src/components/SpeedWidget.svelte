<script type="ts">
  import Gauge from "./Gauge.svelte";
  import { fade } from "svelte/transition";
  import {display, sessionSummaries, gbSettings} from "../store/stores";

  $: totalReviews = $sessionSummaries.reduce((acc, s) => acc += +s.reviewCount, 0);
  $: totalQuestions = $sessionSummaries.reduce((acc, s) => acc += +s.questionCount, 0);

  const durationS = (sess) => {
    return (sess.end - sess.start) / 1000;
  };

  let totalDuration: number;
  $: totalDuration = $sessionSummaries.reduce((acc, s) => acc += durationS(s), 0);

  $: secondsPerQ = (totalQuestions > 0)
    ? (totalDuration / totalQuestions)
    : 0;
  
  $: qPerMinute = 60 / secondsPerQ;
  
  $: gauge_label = `${qPerMinute.toFixed(1)}`;
  $: gauge_value = qPerMinute / (2 * $gbSettings.targetQPM);

  const fmtDayTime = (date) => Intl.DateTimeFormat('en-US', {dateStyle: "short", timeStyle: "short"}).format(date);
  const fmtTime = (date) => Intl.DateTimeFormat('en-US', {timeStyle: "short"}).format(date);
  
  const percentCorrect = (summary) => {
    let percent = 100 * summary.correctAnswerCount / summary.questionCount;
    return percent.toFixed(1);
  };

  $: dialColor = (qPerMinute < $gbSettings.minQPM || secondsPerQ > $gbSettings.maxQPM) ? $gbSettings.warnColor : $gbSettings.fillColor;

  const spq = (duration: number, count: number): string => (duration/count).toFixed(1);
  const qpm = (duration: number, count: number): string => (60*count/duration).toFixed(1);

</script>

<div class="gbWidget" data-testid="speedWidget" style="--fillColor: {dialColor}; ">
  {#if $display === "chart"}
    <h1 class="gbHeader">Speed</h1>
    <Gauge value={gauge_value} label={gauge_label} />
    <div class="units">questions/min</div>
  {:else}
    <h1 class="gbHeader" in:fade>Speed: {secondsPerQ.toFixed(1)} s/q • {qPerMinute.toFixed(1)} q/m</h1>
    <div data-testid="speed-table" in:fade>
      <div class="gbContent scrollbox">
        <h4>{$sessionSummaries.length} sessions • {totalReviews} items • {totalQuestions} questions</h4>
        {#each $sessionSummaries as summary, i}
          <article>
            <h5>{i+1}: {fmtDayTime(summary.start)} &ndash; {fmtTime(summary.end)}
            ({(durationS(summary) / 60).toFixed()}m)</h5>
            <p>{summary.reviewCount} items • {summary.questionCount} questions •
            {spq(durationS(summary), summary.questionCount)} s/q •
            {qpm(durationS(summary), summary.questionCount)} q/m<br>
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
  --scrollbarBG: var(--trackColor);
  --thumbBG: var(--fillColor);
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