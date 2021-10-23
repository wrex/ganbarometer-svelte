<script lang="ts">
  import ProgressBar from '@okrad/svelte-progressbar';

  export let heading="Title";
  export let series = [20];
  export let valueLabel: string = "";
</script>

<div class={$$props.class}>
  <h1>{heading}</h1>
  <ProgressBar width="50%" valueLabel={valueLabel} style="semicircle" series={series} />
</div>

<style>
  h1 {
    font-size: 1.25rem;
  }
</style>

