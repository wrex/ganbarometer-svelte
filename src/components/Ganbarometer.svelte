<script type="ts">
  import GbWidget from "./GbWidget.svelte";
  import SpeedWidget from "./SpeedWidget.svelte";
  import AccuracyWidget from "./AccuracyWidget.svelte";
  import ReviewsDayWidget from "./ReviewsDayWidget.svelte";
  import Modal, {getModal} from './Modal.svelte';
  import SettingsForm from './SettingsForm.svelte';
  import SettingsButton from './SettingsButton.svelte';
  import { getReviews, parseSessions } from '../API/Sessions';

  import { display, daysToReview, sessionSummaries, reviewCounts } from '../store/stores';
  import { fade } from  'svelte/transition';
  import { SyncLoader } from 'svelte-loading-spinners';

  import type { Review, Session, SessionSummary, ReviewCount} from "../API/API";

  // $reviewCounts = [
  //     {count: 113, accuracy: 0.86, reading_accuracy: 0.81, meaning_accuracy: 0.89, start: new Date("11/1/2021 10:18"), end: new Date("11/1/2021 11:46")},
  //     {count: 129, accuracy: 0.91, reading_accuracy: 0.93, meaning_accuracy: 0.90, start: new Date("11/2/2021 9:37"), end: new Date("11/2/2021 10:18")},
  //     {count: 228, accuracy: 0.93, reading_accuracy: 0.91, meaning_accuracy: 0.83, start: new Date("11/3/2021 11:04"), end: new Date("11/3/2021 11:57")},
  //     {count: 143, accuracy: 0.80, reading_accuracy: 0.94, meaning_accuracy: 0.83, start: new Date("11/4/2021 10:19"), end: new Date("11/4/2021 11:09")},
  //   ];

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

    let current: ReviewCount = {
      start: reviews[0].started,
      end: reviews[0].started,
      count: 0,
      accuracy: 0.93,
      reading_accuracy: 0.86,
      meaning_accuracy: 0.94,
    }

    let counts: ReviewCount[] = [];
    let qCount = 0;
    let riCount = 0;
    let miCount = 0;

    reviews.forEach(r => {
      if (inSameDay(r.started, current.start)) {
        current.end = r.started;
        current.count += 1;
        qCount += r.questions;
        riCount += r.reading_incorrect;
        miCount += r.meaning_incorrect;
      } else {
        // starting a new day
        console.log(`${qCount} questions ${riCount} r-inc ${miCount} m-inc`);
        current.reading_accuracy = (qCount - riCount) / qCount;
        current.meaning_accuracy = (qCount - miCount) / qCount;
        current.accuracy = (current.reading_accuracy + current.meaning_accuracy) / 2;
        counts.push(current);
        current = {
          start: r.started,
          end: r.started,
          count: 1,
          accuracy: 0,
          reading_accuracy: 0,
          meaning_accuracy: 0,
        }
        qCount = 0;
        riCount = 0;
        miCount = 0;
      }
    });
    current.reading_accuracy = (qCount - riCount) / qCount;
    current.meaning_accuracy = (qCount - miCount) / qCount;
    current.accuracy = (current.reading_accuracy + current.meaning_accuracy) / 2;
    counts.push(current);
    $reviewCounts = counts;

    const sessions: Session[] = parseSessions(reviews);

    let summaries = [];
    sessions.forEach(s => {
      const totalQuestions = s.reviews.reduce((acc,r) => acc += r.questions, 0);
      const correctFirstTime = s.reviews.filter(r => r.meaning_incorrect + r.reading_incorrect === 0 );
      const correctAnswers = correctFirstTime.reduce((acc,r) => acc += r.questions, 0);
      
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


  $: updateSummaries(+$daysToReview);
</script>


<div class="controls">
  <div class="retrieval">
    <label for="review-days">Days to display:</label>
    <input type="number" id="review-days" name="review-days" min="1" max="7" bind:value={$daysToReview}>
  </div>
  
  {#if loading}
    <div transition:fade class="spinner">
      <SyncLoader size="25" unit="px" />
    </div>
  {/if}

  <nav class="navigation">
    <li class:active="{$display === 'chart'}" on:click|preventDefault="{() => $display = 'chart'}">Graphs</li>
    <li class:active="{$display === 'data'}" on:click|preventDefault="{() => $display = 'data'}">Data</li>
  </nav>

  <SettingsButton on:click="{() => getModal().open()}" />
</div>

<GbWidget />

<SpeedWidget />

<AccuracyWidget />

<ReviewsDayWidget />

<Modal>
  <SettingsForm />
</Modal>

<style>

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
  }

  .controls {
    display: flex;
    justify-content: right;
    width: 100%;
    padding: 0 1em;
  }

  .navigation li {
    text-decoration: none;
    display: inline;
    margin-inline: 1rem;
    height: fit-content;
  }

  .navigation li:hover {
    cursor: pointer;
    transform: scale(1.1);
  }

  .navigation .active {
    font-weight: 900;
    border-bottom: 2px solid black;
  }

  .retrieval {
    display: flex;
  }
  .retrieval > label {
    display: inline;
    padding: 0 0.2em;
  }
  .retrieval > input {
    padding: 0 0.2em;
    width: 2em;
  }

</style>