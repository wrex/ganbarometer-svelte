<script context="module" type="ts">
  declare var ss_quiz: any;
  declare var wkof: any;
</script>

<script type="ts">
  import RangeSlider from "svelte-range-slider-pips";
  import GbWidget from "./GbWidget.svelte";
  import SpeedWidget from "./SpeedWidget.svelte";
  import ReviewsWidget from "./ReviewsWidget.svelte";
  import Modal, {getModal} from './Modal.svelte';
  import SettingsForm from './SettingsForm.svelte';
  import QuizButton from './QuizButton.svelte';
  import SettingsButton from './SettingsButton.svelte';
  import { getReviews, parseSessions } from '../API/Sessions';

  import { display, daysToReview, sessionSummaries, reviewCounts } from '../store/stores';
  import { fade } from  'svelte/transition';
  import { SyncLoader } from 'svelte-loading-spinners';

  import type { Review, Session, SessionSummary, ReviewCount} from "../API/API";

  let loading = false;

  const inSameDay = (x: Date, ref: Date): boolean => {
    return x.getDate() === ref.getDate() 
      && x.getMonth() === ref.getMonth() 
      && x.getFullYear() === ref.getFullYear() 
  }

  const updateSummaries = async (days: number): Promise<void> => {
    
    let reviews: Review[];
    loading = true;
    try {
      reviews = await getReviews(days);
    } catch (error) {
      console.warn(error);
    }
    loading = false;

    const reviewsEachDay: Review[][] = reviews
      // first filter to one review per unique day
      .filter((r, i) => (i > 0) ? !inSameDay(r.started, reviews[i-1].started) : true)
      // convert those reviews to just a date
      .map(r => r.started)
      // finally, convert those dates to array of reviews on that date
      .map(date => reviews.filter(r => inSameDay(r.started, date)));

    let counts: ReviewCount[] = [];
    reviewsEachDay.forEach((reviewAry, i) => {
      const readingCorrect = reviewAry
        .filter(r => r.reading_incorrect === 0)
        .reduce((acc, r) => acc += 1, 0);
      const meaningCorrect = reviewAry
        .filter(r => r.meaning_incorrect === 0)
        .reduce((acc, r) => acc += 1, 0);
      const bothCorrect = reviewAry
        .filter(r => r.meaning_incorrect + r.reading_incorrect === 0 )
        .reduce((acc, r) => acc += 1, 0);


      const questionCount = reviewAry.reduce((acc,r) => acc += r.questions, 0);
      const itemCount = reviewAry.length;
      const count: ReviewCount = {
        start: reviewAry[0].started,
        end: reviewAry[reviewAry.length - 1].started,
        review_count: reviewAry.length,
        question_count: questionCount,
        accuracy: bothCorrect / itemCount,
        reading_accuracy: readingCorrect / itemCount,
        meaning_accuracy: meaningCorrect / itemCount,
      };
      counts.push(count);
    });
    $reviewCounts = counts;

    const sessions: Session[] = parseSessions(reviews);

    let summaries = [];
    sessions.forEach(s => {
      const totalQuestions = s.reviews.reduce((acc,r) => acc += r.questions, 0);
      const incorrectAnswers = s.reviews.reduce((acc, r) => acc += r.meaning_incorrect + r.reading_incorrect, 0);
      const correctAnswers = totalQuestions - incorrectAnswers;
      
      const summary: SessionSummary = {
        start: s.startTime,
        end: s.endTime,
        reviewCount: s.reviews.length,
        questionCount: totalQuestions,
        correctAnswerCount: correctAnswers,
      }
      summaries.push(summary);
    });
    sessionSummaries.set(summaries);
  };

  $: updateSummaries(+$daysToReview[0]);

  $: suffix = $daysToReview[0] > 1 ? " days" : " day";

  let ssQuizPresent = false;
  wkof.wait_state('ss_quiz', 'ready').then(() => {
    if (typeof ss_quiz?.open === 'function')
      ssQuizPresent = true;
  });

  const ss_options = {
    ipreset: {
      name: 'New Kanji', 
      content: {
        wk_items: {
          enabled: true, 
          filters: {
            srs: { enabled: true, value: { appr1: true, appr2: true, } },
            item_type: { enabled: true, value: 'kanji' },
          },
        },
      },
    },
  };

  const ssQuizLauncher = async () => {
    await wkof.wait_state('ss_quiz', 'ready');
    ss_quiz.open(ss_options);
  };

</script>


<div class="controls">
  

  <nav class="chart-data-nav">
    <li class:active="{$display === 'chart'}" on:click|preventDefault="{() => $display = 'chart'}">Graphs</li>
    <li class:active="{$display === 'data'}" on:click|preventDefault="{() => $display = 'data'}">Data</li>
  </nav>

  {#if loading}
    <div transition:fade class="spinner">
      <SyncLoader size="25" unit="px" />
    </div>
  {/if}

  <div class="dayRange">
    <RangeSlider bind:values={$daysToReview} float pips {suffix} min={1} max={7} />
  </div>


  <div class="action-buttons">
    {#if ssQuizPresent}
      <QuizButton on:click={ssQuizLauncher} />
    {/if}
    <SettingsButton on:click="{() => getModal().open()}" />
  </div>
</div>

<div data-testid="gbwidgets" class="gbwidgets">
  <GbWidget />
  <SpeedWidget />
  <ReviewsWidget />
</div>
  
<Modal>
  <SettingsForm />
</Modal>

<style>

.dayRange {
  display: flex;
  justify-content: center;
  width: 100%;
  --range-slider:          #d7dada; /* slider main background color */
  --range-handle-inactive: #99a2a2; /* inactive handle color */
  --range-handle:          green; /* non-focussed handle color */
  --range-handle-focus:    var(--fill-color, #59c273); /* focussed handle color */
  --range-handle-border:   var(--range-handle);
  --range-range-inactive:  var(--range-handle-inactive); /* inactive range bar background color */
  --range-range:           var(--range-handle-focus); /* active range bar background color */
  --range-float-inactive:  var(--range-handle-inactive); /* inactive floating label background color */
  --range-float:           var(--range-handle-focus); /* floating label background color */
  --range-float-text:      white; /* text color on floating label */
}
:global(.rangeSlider) {
  width: 7em;
}
.gbwidgets {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 100%;
    align-items: flex-start;
    column-gap: 20px;

    background-color: #f4f4f4;
    border-radius: 5px;
    padding: 0.5em 0 0;
  }

  :global(.gbHeader) {
    font-size: 1.25rem;
    font-weight: normal;
    margin: 0;
    text-align: center;
    display: inline-block;
    color: var(--text-color, #004033);
  }

  :global(.units) {
    font-size: x-small;
    margin: auto;
  }

  :global(.gbContent) {
    border-collapse: collapse;
    font-size: small;
    line-height: 1.2;
    width: 100%;
    outline: 1px solid black;
    padding: 0.5rem;
    overflow-y: scroll;
    overflow-x: hidden;
    height: 8rem;
  }
  :global(.gbContent th,
   .gbContent td) {
    padding: 0.25em;
    text-align: left;
    font-weight: bold;
  }
  :global(.gbContent th) {
    text-align: right;
    font-weight: 100;
  }

  :global(.secondary) {
    opacity: 60%;
    font-size: x-small;
    font-weight: 200;
  }

  :global(.gbWidget) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 220px;
    max-height: 200px;
    margin-bottom: 0.5em;
  }

  @media (min-width: 1200px) {
    :global(.gbWidget) {
      min-width: 275px;
    }
  }

  .spinner {
    margin-inline: 0.5em;
    position: absolute;
    left: 37em;
  }

  .controls {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 2em;
  }

  .chart-data-nav {
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }

  .chart-data-nav li {
    text-decoration: none;
    display: inline;
    margin-inline: 1rem;
    height: fit-content;
  }

  .chart-data-nav li:hover {
    cursor: pointer;
    transform: scale(1.1);
  }

  .chart-data-nav .active {
    font-weight: 900;
    border-bottom: 2px solid black;
  }
  .action-buttons {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }

</style>