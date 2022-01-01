<script context="module" type="ts">
  declare var ss_quiz: any;
  declare var wkof: any;
</script>

<script type="ts">
  import RangeSlider from "./RangeSlider.svelte";
  import GbWidget from "./GbWidget.svelte";
  import SpeedWidget from "./SpeedWidget.svelte";
  import ReviewsWidget from "./ReviewsWidget.svelte";
  import Modal, {getModal} from './Modal.svelte';
  import SettingsForm from './SettingsForm.svelte';
  import QuizButton from './QuizButton.svelte';
  import SettingsButton from './SettingsButton.svelte';

  import { findSessSummaries } from '../API/Sessions';
  import { getReviews, calculateCounts } from "../API/Reviews"; 

  import { display, daysToReview, sessionSummaries, reviewCounts } from '../store/stores';

  import { fade } from  'svelte/transition';
  import { SyncLoader } from 'svelte-loading-spinners';

  import type { Review } from "../API/API";

  let loading = false;

  const updateSummaries = async (days: number): Promise<void> => {
    loading = true;

    let reviews: Review[];
    try {
      reviews = await getReviews(days);
    } catch (error) {
      console.warn(error);
    }

    $reviewCounts = calculateCounts(reviews);
    $sessionSummaries = findSessSummaries(reviews);

    loading = false;
  };

  $: updateSummaries($daysToReview[0]);

  $: suffix = $daysToReview[0] > 1 ? " days" : " day";

  let ssQuizPresent = false;
  wkof.wait_state('ss_quiz', 'ready').then(() => {
    if (typeof ss_quiz?.open === 'function')
      ssQuizPresent = true;
  });

  const ssQuizLauncher = async () => {
    await wkof.wait_state('ss_quiz', 'ready');
    ss_quiz.open({
      ipreset: {
        name: 'New Kanji', 
        content: {
          wk_items: {
            enabled: true, 
            filters: {
              srs: { enabled: true, value: { appr1: true, appr2: true, } },
              item_type: { enabled: true, value: 'kan' },
            },
          },
        },
      },
    });
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

  <div class="dayRange" data-testid="daySlider">
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
  z-index: 0; /* prevent range-slider thumb from sliding over the main nav */
  --range-slider:          #e0e0e0; /* slider main background color */
  --range-handle-inactive: #b1b1b1; /* inactive handle color */
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
    min-height: 155px;
    align-items: flex-start;
    column-gap: 20px;

    background-color: #f4f4f4;
    border-radius: 5px;
    padding: 2em 0 0.5em;
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
    font-size: small;
    font-weight: 200;
    margin: 0 62px;
    text-align: center;
  }

  :global(.gbContent) {
    border-collapse: collapse;
    font-size: small;
    line-height: 1.2;
    width: 100%;
    border-top: 2px solid #eeeeee;
    padding: 0.5rem;
    overflow-y: scroll;
    overflow-x: hidden;
    height: 8em;
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
    align-items: center;
    width: calc(100% - 2em);
    border-bottom: 2px solid #eeeeee;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .chart-data-nav {
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }

  .chart-data-nav li {
    font-weight: 200;
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
    font-weight: normal;
    border-bottom: 1px solid black;
  }
  .action-buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
  }

</style>