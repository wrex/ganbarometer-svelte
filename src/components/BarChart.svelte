<script lang="ts">
  import { validate_component } from "svelte/internal";

  export let values: string;
  export let labels = '';
  export let caption = '';

  let _values: number[] = JSON.parse(values);

  let _labels: string[] = [];
  _labels = labels ? JSON.parse(labels) : [];

</script>

<table aria-label="bar-chart">
  <caption>{caption}</caption>
  <thead>
    <tr>
      <th scope="col">Item</th>
      <th scope="col">Value</th>
    </tr>
  </thead>
  <tbody>
    {#each _values as val, i}
      <tr aria-label="values">
        <th scope="row" aria-label="label">{_labels[i]}</th>
        <td aria-label="value">{val}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
</style>
