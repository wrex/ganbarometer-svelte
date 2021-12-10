<script>
  import Gauge from "../components/Gauge.svelte";
  import ReviewsPerDayGauge from "../components/ReviewsPerDayGauge.svelte";
  import Modal, {getModal} from '../components/Modal.svelte';
  import SettingsForm from '../components/SettingsForm.svelte';
  import { SyncLoader } from 'svelte-loading-spinners';

  let loading = true;
</script>


<div class="controls">
  <div class="retrieval">
    <label for="review-days">Days to retrieve:</label>
    <input type="number" id="review-days" name="review-days" min="1" max="4">
  </div>
  
  {#if loading}
    <div class="spinner">
      <SyncLoader size="25" unit="px" />
    </div>
  {/if}

  <nav class="navigation">
    <li class="active">Graphs</li>
    <li>Data</li>
  </nav>

  <button aria-label="settings" class="settings" on:click={() => getModal().open()}>
    <svg xmlns="http://www.w3.org/2000/svg" 
      height="24px" 
      viewBox="0 0 24 24" 
      width="24px" 
      ><path 
        d="M0 0h24v24H0V0z" 
        fill="none"
      /><path 
        d="M19.43 12.98c.04-.32.07-.64.07-.98
        0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06
        0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18
        14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38
        2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17
        0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11
        1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11
        1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0
        .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38
        2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59
        1.69-.98l2.49 1c.06.02.12.03.18.03.17 0
        .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73
        0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7
        1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2
        1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21
        1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21
        1.27.51 1.04.42.9-.68c.43-.32.84-.56
        1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13
        1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7
        1.21-1.07.85-.89.7.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79
        4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
    /></svg>
  </button>
</div>

<div class="ganbarometer">
  <h1>GanbarOmeter</h1>
  <Gauge value={0.25} />
  <!-- <p>Difficulty footer</p> -->
</div>

<div class="review-intervals">
  <h1>Review Intervals</h1>
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

  .retrieval {
    display: flex;
  }

  .settings {
    background-color: inherit;
    border: none;
    margin-top: -0.5em;
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
  .review-intervals {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: end;
    padding-bottom: 14px;
    min-width: 300px;
  }

  @media (min-width: 1200px) {
    .ganbarometer,
    .review-intervals {
      min-width: 370px;
    }
  }

</style>