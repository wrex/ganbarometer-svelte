<script>
  import Gauge from "./Gauge.svelte";
  export let value=0;
  export let label="0s";
</script>

<div class="speed">
  <h1><slot>Seconds/Question</slot></h1>
  <Gauge {value} {label} />
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
  
  .speed {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: end;
    padding-bottom: 14px;
    min-width: 300px;
  }

  @media (min-width: 1200px) {
    .speed {
      min-width: 370px;
    }
  }

</style>