<script lang="ts">
import { validate_component } from "svelte/internal";


  export let values: string;
  export let labels = '';

  let _values: number[] = JSON.parse(values);

  let _labels: string[] = [];
  _labels = labels ? JSON.parse(labels) : [];

</script>

<table aria-label="bar-chart">
  <thead>
    <tr>
    {#each _labels as label}
      <th aria-label="label">{label}</th>
    {/each}
    </tr>
  </thead>
  <tbody>
    <tr aria-label="values">
      {#each _values as val}
        <td aria-label="value">{val}</td>
      {/each}
    </tr>
  </tbody>
</table>

<style>
</style>
