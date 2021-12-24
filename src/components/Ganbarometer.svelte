<script type="ts">
  import GbWidget from "./GbWidget.svelte";
  import SpeedWidget from "./SpeedWidget.svelte";
  import ReviewsWidget from "./ReviewsWidget.svelte";
  import Modal, {getModal} from './Modal.svelte';
  import SettingsForm from './SettingsForm.svelte';
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

<ReviewsWidget />

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