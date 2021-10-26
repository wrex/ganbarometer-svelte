<script lang="ts">

  export let values: number[];
  export let labels: string[] = [];
  export let onClickHandlers: {(): void}[] = [];
  export let caption = '';


	const max = Math.max(...values);
	const heights: string[] = [];
	values.forEach(val => {
		heights.push(`${Math.round(val/max * 100)}%`)
	})
</script>

<table class="graph" aria-label="bar-chart" style="--max-label: {max}" >
  <caption>{caption}</caption>
  <thead>
    <tr>
      <th scope="col">Item</th>
      <th scope="col">Value</th>
    </tr>
  </thead>
  <tbody>
    {#each values as val, i}
    <tr aria-label="values" style="height: {heights[i]}">
      <th scope="row" aria-label="label">{labels[i] ? labels[i] : ''}</th>
			{#if onClickHandlers[i]}
				<td aria-label="value" on:click={onClickHandlers[i]} ><span>{val}</span></td>
			{:else}
				<td aria-label="value"><span>{val}</span></td>
			{/if}
    </tr>
    {/each}
  </tbody>
</table>
  
<style>
.graph {
	margin-bottom:1em;
}

.graph caption {
	padding-bottom:0.33em;
}

.graph tbody th {
	text-align:right;
}

@supports (display:grid) {

	@media (min-width:32em) {

		.graph {
			display:block;
			padding: 0 10px;
		}

		.graph caption {
			display:block;
		}

		.graph thead {
			display:none;
		}

		.graph tbody {
			position:relative;
			display:grid;
			grid-template-columns:repeat(auto-fit, minmax(2em, 1fr));
			column-gap:2.5%;
			align-items:end;
			min-height: 90px;
			padding:0 1em;
			border-bottom:2px solid rgba(0,0,0,0.5);
			background:repeating-linear-gradient(
				180deg,
				rgba(170,170,170,0.7) 0,
				rgba(170,170,170,0.7) 1px,
				transparent 1px,
				transparent 20%
			);
		}

		.graph tbody:before,
		.graph tbody:after {
			position:absolute;
			left:-3.2em;
			width:2.8em;
			text-align:right;
		}

		.graph tbody:before {
			counter-reset: label var(--max-label);
			content: counter(label);
			top:-0.6em;
		}

		.graph tbody:after {
			content:"0";
			bottom:-0.6em;
		}

		.graph tr {
			position:relative;
			display:block;
		}

		.graph tr:hover {
			z-index:999;
		}

		.graph th,
		.graph td {
			display:block;
			text-align:center;
		}

		.graph tbody th {
			color:var(--text-color, #004033);
			position:absolute;
			left:0;
			width:100%;
			font-size:10px;
			font-weight:normal;
			text-align:center;
      white-space:nowrap;
			text-indent:0;
      bottom: -2em;
		}

		.graph tbody th:after {
			font-weight: bold;
			content:"";
		}

		.graph td {
			width:100%;
			height:100%;
			background:var(--fill-color, #59c273);
			border-radius:0.5em 0.5em 0 0;
			transition:background 0.5s;
		}

		.graph tr:hover td {
			opacity:0.7;
		}

		.graph td span {
			overflow:hidden;
			position:absolute;
			left:50%;
			top:50%;
			width:0;
			/* padding:0.1em 0; */
			margin:-1.5em 0 0;
			background:white;
			box-shadow:0 0 0.25em rgba(0,0,0,0.6);
			font-weight:bold;
			opacity:0;
			transition:opacity 0.5s;
      color:#333;
		}

		.toggleGraph:checked + table td span,
		.graph tr:hover td span {
			width:4em;
			margin-left:-2em; /* 1/2 the declared width */
			opacity:1;
		}
	} /* min-width:32em */
}

</style>
