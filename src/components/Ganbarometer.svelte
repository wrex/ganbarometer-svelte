<script>
  import GbWidget from "./GbWidget.svelte";
  import SpeedWidget from "./SpeedWidget.svelte";
  import AccuracyWidget from "./AccuracyWidget.svelte";
  import ReviewsDayWidget from "./ReviewsDayWidget.svelte";
  import Modal, {getModal} from './Modal.svelte';
  import SettingsForm from './SettingsForm.svelte';
  import SettingsButton from './SettingsButton.svelte';

  import { display, daysToReview } from '../store/stores';
  import { fade } from  'svelte/transition';
  import { SyncLoader } from 'svelte-loading-spinners';

  let loading = false;

  let reviewStats = {
    targetReviewsPerDay: 150,
    reviews: [
      {count: 113, accuracy: 0.86, start: new Date("11/1/2021 10:18"), end: new Date("11/1/2021 11:46")},
      {count: 128, accuracy: 0.90, start: new Date("11/2/2021 10:08"), end: new Date("11/2/2021 11:12")},
      {count: 158, accuracy: 0.83, start: new Date("11/3/2021 9:27"), end: new Date("11/3/2021 10:31")},
      {count: 98, accuracy: 0.95, start: new Date("11/4/2021 9:05"), end: new Date("11/4/2021 9:43")},
    ],
  };
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

<GbWidget value={0.57} />

<SpeedWidget value={0.42} label="5.2" />

<AccuracyWidget value={0.86} />

<ReviewsDayWidget {reviewStats} />

<Modal>
  <SettingsForm />
</Modal>

<style>

  :global(.gb-header) {
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