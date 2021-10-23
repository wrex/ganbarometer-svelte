<script lang="ts">
  import Gauge from "./components/Gauge.svelte";
</script>


<section data-testid="ganbarometer">
  <Gauge class="difficulty" heading="Difficulty" />
</section>

<style>
  section {
    border: 1px solid black;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: 150px auto;
    gap: 30px 20px;
    margin: 0;
    align-items: center;
  }
  :global(.difficulty) {
    grid-column: 1 / span 2;
    grid-row: 1 / 2;
    text-align: center;
  }

</style>