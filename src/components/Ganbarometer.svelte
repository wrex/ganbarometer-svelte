<script>
  import GbWidget from "./GbWidget.svelte";
  import SpeedWidget from "./SpeedWidget.svelte";
  import AccuracyWidget from "./AccuracyWidget.svelte";
  import ReviewsDayWidget from "./ReviewsDayWidget.svelte";
  import Modal, {getModal} from './Modal.svelte';
  import SettingsForm from './SettingsForm.svelte';
  import SettingsButton from './SettingsButton.svelte';
  import { getSessions } from '../API/Sessions';

  import { display, daysToReview } from '../store/stores';
  import { fade } from  'svelte/transition';
  import { SyncLoader } from 'svelte-loading-spinners';

  let loading = false;

  let progressCounts = {
    totalApprentice: 105,
    targetApprentice: 100,
    new: {radicals: 4, kanji: 5, vocabulary: 14},
    newWeights: {radicals: 0.75, kanji: 3.0, vocabulary: 1.0},
  };

  let reviewDayCounts = {
    targetReviewsPerDay: 150,
    reviews: [
      {count: 113, accuracy: 0.86, reading_accuracy: 0.81, meaning_accuracy: 0.89, start: new Date("11/1/2021 10:18"), end: new Date("11/1/2021 11:46")},
      {count: 129, accuracy: 0.91, reading_accuracy: 0.93, meaning_accuracy: 0.90, start: new Date("11/2/2021 9:37"), end: new Date("11/2/2021 10:18")},
      {count: 228, accuracy: 0.93, reading_accuracy: 0.91, meaning_accuracy: 0.83, start: new Date("11/3/2021 11:04"), end: new Date("11/3/2021 11:57")},
      {count: 143, accuracy: 0.80, reading_accuracy: 0.94, meaning_accuracy: 0.83, start: new Date("11/4/2021 10:19"), end: new Date("11/4/2021 11:09")},
    ],
  };

  let sessions = [
      { start: new Date("11/1/2021 10:18"), end: new Date("11/1/2021 11:46"), reviewCount: 113, questionCount: 226, correctAnswerCount: 207, },      
      { start: new Date("11/2/2021 9:37"), end: new Date("11/2/2021 10:18"), reviewCount: 129, questionCount: 258, correctAnswerCount: 232, },
      { start: new Date("11/3/2021 11:04"), end: new Date("11/3/2021 11:21"), reviewCount: 150, questionCount: 300, correctAnswerCount: 284, },
      { start: new Date("11/3/2021 11:24"), end: new Date("11/3/2021 11:34"), reviewCount: 52, questionCount: 104, correctAnswerCount: 100, },
      { start: new Date("11/3/2021 11:38"), end: new Date("11/3/2021 11:57"), reviewCount: 26, questionCount: 52, correctAnswerCount: 42, },
      { start: new Date("11/4/2021 10:19"), end: new Date("11/4/2021 10:27"), reviewCount: 63, questionCount: 126, correctAnswerCount: 113, },
      { start: new Date("11/4/2021 10:30"), end: new Date("11/4/2021 10:48"), reviewCount: 37, questionCount: 74, correctAnswerCount: 71, },
      { start: new Date("11/4/2021 10:51"), end: new Date("11/4/2021 11:09"), reviewCount: 43, questionCount: 86, correctAnswerCount: 75, },
  ];
  
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

<GbWidget {progressCounts} />

<SpeedWidget {sessions} />

<AccuracyWidget {reviewDayCounts} />

<ReviewsDayWidget {reviewDayCounts} />

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
  :global(.gbTable th,
   .gbTable td) {
    padding: 0.25em;
    text-align: left;
    font-weight: bold;
  }
  :global(.gbTable th) {
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