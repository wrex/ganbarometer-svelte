<script>
  import Gauge from "./Gauge.svelte";
  import { display } from "../store/stores";

  export let value = 0;
</script>

<div class="ganbarometer">
  <slot><h1>GanbarOmeter</h1></slot>
  {#if $display === "chart" }
    <Gauge value={value} />
    <div class="units">of max effort</div>
  {:else}
    <div data-testid="ganbarometer-table">Table data goes here</div>
  {/if}
  <slot name="footer"></slot>
</div>


<style>
    h1 {
    font-size: 1.25rem;
    font-weight: normal;
    margin: 0;
    text-align: center;
    display: inline-block;
    color: var(--text-color, #004033);
  }

  .ganbarometer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 220px;
  }

  @media (min-width: 1200px) {
    .ganbarometer {
      min-width: 275px;
    }
  }
</style>