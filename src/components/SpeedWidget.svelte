<script>
  import Gauge from "./Gauge.svelte";
  import {display} from "../store/stores";
  export let value=0;
  export let label="0s";
</script>

<div class="speed">
  <h1 class="gb-header">Speed</h1>
  {#if $display === "chart"}
    <Gauge {value} {label} />
    <div class="units">seconds/question</div>
  {:else}
    <div data-testid="speed-table">Table content goes here</div>
  {/if}
</div>

<style>
  .speed {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 14px;
    min-width: 300px;
  }

  @media (min-width: 1200px) {
    .speed {
      min-width: 370px;
    }
  }

</style>