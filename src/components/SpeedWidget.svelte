<script type="ts">
  import Gauge from "./Gauge.svelte";
  import {display, sessionSummaries} from "../store/stores";

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

  $: gauge_label = `${secondsPerQ.toFixed(1)}`;

  // TODO: add targetSecodsPerQ to settings
  const targetSecondsPerQ = 10;
  $: gauge_value = secondsPerQ / (2 * targetSecondsPerQ);

  const fmtDayTime = (date) => Intl.DateTimeFormat('en-US', {dateStyle: "short", timeStyle: "short"}).format(date);
  const fmtTime = (date) => Intl.DateTimeFormat('en-US', {timeStyle: "short"}).format(date);
  
  const percentCorrect = (summary) => {
    let percent = 100 * summary.correctAnswerCount / summary.questionCount;
    return percent.toFixed(1);
  };

</script>

<div class="gbWidget" data-testid="speedWidget">
  {#if $display === "chart"}
    <h1 class="gbHeader">Speed</h1>
    <Gauge value={gauge_value} label={gauge_label} />
    <div class="units">seconds/question</div>
  {:else}
    <h1 class="gbHeader">{gauge_label} Speed</h1>
    <div data-testid="speed-table">
      <div class="gbContent scrollbox">
        <h4>{$sessionSummaries.length} sessions • {totalReviews} items • {totalQuestions} questions</h4>
        {#each $sessionSummaries as summary, i}
          <article>
            <h5>{i+1}: {fmtDayTime(summary.start)} &ndash; {fmtTime(summary.end)}
            ({(durationS(summary) / 60).toFixed()}m)</h5>
            <p>{summary.reviewCount} items • {summary.questionCount} questions •
            {(durationS(summary) / summary.questionCount).toFixed(1)} s/q <br>
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
  --scrollbarBG: #CFD8DC;
  --thumbBG: #90A4AE;
}

.scrollbox::-webkit-scrollbar {
  width: 1em;
}
.scrollbox {
  padding: 0;
  outline: 1px solid black;
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