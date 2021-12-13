<script>
  import Gauge from "./Gauge.svelte";
  import {display} from "../store/stores";
  export let value=0;
</script>

<div class="accuracy">
  <h1 class="gb-header">Accuracy</h1>
  {#if $display === "chart"}
    <Gauge {value} />
    <div class="units">correct first time</div>
  {:else}
    <div data-testid="accuracy-table">Table content goes here</div>
  {/if}
</div>

<style>
  .accuracy {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 220px;
  }

  @media (min-width: 1200px) {
    .accuracy {
      min-width: 275px;
    }
  }

</style>