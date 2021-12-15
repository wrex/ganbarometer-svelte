<script>
  import Gauge from "./Gauge.svelte";
  import {display} from "../store/stores";

  export let sessions = [
      { start: new Date("11/1/2021 10:18"), end: new Date("11/1/2021 11:46"), reviewCount: 113, questionCount: 226, correctAnswerCount: 207, },      
      { start: new Date("11/2/2021 9:37"), end: new Date("11/2/2021 10:18"), reviewCount: 129, questionCount: 258, correctAnswerCount: 232, },
      { start: new Date("11/3/2021 11:04"), end: new Date("11/3/2021 11:21"), reviewCount: 150, questionCount: 300, correctAnswerCount: 284, },
      { start: new Date("11/3/2021 11:24"), end: new Date("11/3/2021 11:34"), reviewCount: 52, questionCount: 104, correctAnswerCount: 100, },
      { start: new Date("11/3/2021 11:38"), end: new Date("11/3/2021 11:57"), reviewCount: 26, questionCount: 52, correctAnswerCount: 42, },
      { start: new Date("11/4/2021 10:19"), end: new Date("11/4/2021 10:27"), reviewCount: 63, questionCount: 126, correctAnswerCount: 113, },
      { start: new Date("11/4/2021 10:30"), end: new Date("11/4/2021 10:48"), reviewCount: 37, questionCount: 74, correctAnswerCount: 71, },
      { start: new Date("11/4/2021 10:51"), end: new Date("11/4/2021 11:09"), reviewCount: 43, questionCount: 86, correctAnswerCount: 75, },
  ];

  const totalReviews = sessions.reduce((acc, s) => acc += s.reviewCount, 0);
  const totalQuestions = sessions.reduce((acc, s) => acc += s.questionCount, 0);
  const totalCorrect = sessions.reduce((acc, s) => acc += s.correctAnswerCount, 0);
  const durationS = (sess) => {
    return (sess.end - sess.start) / 1000;
  };
  const totalDuration = sessions.reduce((acc, s) => acc += durationS(s), 0);

  const secondsPerQ = (totalDuration / totalQuestions).toFixed(1).toString();

  const fmtDayTime = (date) => Intl.DateTimeFormat('en-US', {dateStyle: "short", timeStyle: "short"}).format(date);
  const fmtTime = (date) => Intl.DateTimeFormat('en-US', {timeStyle: "short"}).format(date);
  
  const percentCorrect = (sess) => {
    let percent = 100 * sess.correctAnswerCount / sess.questionCount;
    return percent.toFixed(1);
  };


</script>

<div class="gbWidget">
  {#if $display === "chart"}
    <h1 class="gbHeader">Speed</h1>
    <Gauge value={0.5} label={secondsPerQ} />
    <div class="units">seconds/question</div>
  {:else}
    <h1 class="gbHeader">{secondsPerQ}s Speed</h1>
    <div data-testid="speed-table">
      <div class="gbContent scrollbox">
        <h4>{sessions.length} sessions • {totalReviews} items • {totalQuestions} questions</h4>
        {#each sessions as session}
          <article>
            <h5>{fmtDayTime(session.start)} &ndash; {fmtTime(session.end)}
            ({(durationS(session) / 60).toFixed()}m)</h5>
            <p>{session.reviewCount} items • {session.questionCount} questions •
            {(durationS(session) / session.questionCount).toFixed(1)} s/q <br>
            {session.correctAnswerCount}/{session.questionCount} =
            {percentCorrect(session)}% correct </p>
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