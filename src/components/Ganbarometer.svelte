<script>
  import Gauge from "./Gauge.svelte";
  import ReviewsPerDayGauge from "./ReviewsPerDayGauge.svelte";
  import Modal, {getModal} from './Modal.svelte';
  import SettingsForm from './SettingsForm.svelte';
  import SettingsButton from './SettingsButton.svelte';

  import { display, daysToReview } from '../store/stores';
  import { fade } from  'svelte/transition';
  import { SyncLoader } from 'svelte-loading-spinners';

  let loading = false;
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

  <SettingsButton handler={getModal()} />
</div>

<div class="ganbarometer">
  <h1>GanbarOmeter</h1>
  <Gauge value={0.95} />
  <!-- <p>Difficulty footer</p> -->
</div>

<div class="speed">
  <h1>Seconds/Question</h1>
  <Gauge value={0.47} label="5.2s" />
</div>

<ReviewsPerDayGauge />

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

  /* .settings {
    background-color: inherit;
    border: none;
    margin-top: -0.5em;
  } */

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

  h1 {
    font-size: 1.25rem;
    font-weight: normal;
    margin: 0;
    text-align: center;
    display: inline-block;
    color: var(--text-color, #004033);
  }

  .ganbarometer,
  .speed {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: end;
    padding-bottom: 14px;
    min-width: 300px;
  }

  @media (min-width: 1200px) {
    .ganbarometer,
    .speed {
      min-width: 370px;
    }
  }

</style>