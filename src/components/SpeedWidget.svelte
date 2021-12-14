<script>
  import Gauge from "./Gauge.svelte";
  import {display} from "../store/stores";
  export let value=0;
  export let label="0s";
</script>

<div class="gbWidget">
  <h1 class="gbHeader">Speed</h1>
  {#if $display === "chart"}
    <Gauge {value} {label} />
    <div class="units">seconds/question</div>
  {:else}
    <div data-testid="speed-table">Table content goes here</div>
  {/if}
</div>
