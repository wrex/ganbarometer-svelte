<script lang="ts">
  import BarGraph from './bar-graph.js';
  export let heading="Title";
</script>

<div class={$$props.class}>
  <h1>{heading}</h1>
</div>

<style>
  h1 {
    font-size: 1.25rem;
  }
</style>
