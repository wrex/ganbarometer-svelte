<script>
  import GbWidget from "./GbWidget.svelte";
  import SpeedWidget from "./SpeedWidget.svelte";
  import ReviewsDayWidget from "./ReviewsDayWidget.svelte";
  import Modal, {getModal} from './Modal.svelte';
  import SettingsForm from './SettingsForm.svelte';
  import SettingsButton from './SettingsButton.svelte';

  import { display, daysToReview } from '../store/stores';
  import { fade } from  'svelte/transition';
  import { SyncLoader } from 'svelte-loading-spinners';

  let loading = false;

  let reviewStats = {
    total: 584,
    reviewsPerDay: 146,
    targetRPD: 150,
    accuracy: "86%",
    first: new Date("11/1/2021 10:18"),
    last: new Date("11/4/2021 15:32"),
    reviews: [113, 147, 113, 113],
    legends: ["M", "Tu", "W", "Th"],
  };
</script>


<div class="controls">
  <div class="retrieval">
    <label for="review-days">Days to retrieve:</label>
    <input type="number" id="review-days" name="review-days" min="1" max="4" bind:value={$daysToReview}>
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

<GbWidget value={0.25} />

<SpeedWidget value={0.42} label="5.2s" />

<ReviewsDayWidget {reviewStats} />

<Modal>
  <SettingsForm />
</Modal>

<style>

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