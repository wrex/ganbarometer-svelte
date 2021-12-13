<script>
  import Gauge from "./Gauge.svelte";

  export let value = 0;
</script>

<div class="ganbarometer">
  <slot><h1>GanbarOmeter</h1></slot>
  <Gauge value={value} />
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
    align-self: end;
    padding-bottom: 14px;
    min-width: 300px;
  }

  @media (min-width: 1200px) {
    .ganbarometer {
      min-width: 370px;
    }
  }
</style>