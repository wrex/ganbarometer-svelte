<script lang="ts">
  export let values: number[];
	export let percents: number[] = [];
  export let labels: string[] = [];
	export let target: number = 0;

	$: max = Math.max(...values);
	$: heights = values.map(v => Math.round(v/max * 100));
	$: targetHeight = Math.round(target/max * 100);
</script>

<table class="graph" aria-label="bar-chart" style="--max-label: {max}" >
  <thead>
    <tr>
      <th scope="col">Item</th>
      <th scope="col">Value</th>
    </tr>
  </thead>
  <tbody>
    {#each values as val, i}
    <tr aria-label="values" style="height: {heights[i]}%">
      <th scope="row" aria-label="label">{labels[i] ? labels[i] : ''}</th>
			<td aria-label="value"><span>{val}</span></td>
			{#if (percents?.length)}
			<td aria-label="percents" class="percents" style="height: {heights[i] * percents[i]}%"></td>
			{/if}
		</tr>
    {/each}
		<div hidden={targetHeight === 0} class="target" style="height: {targetHeight}%"></div>
	</tbody>
</table>
  
<style>
.graph {
	margin-bottom:1em;
	padding: 0 1em 0;
}

.graph tbody th {
	text-align:right;
}

@supports (display:grid) {

	@media (min-width:300px) {

		.graph {
			display:block;
		}

		.graph thead {
			display:none;
		}

		.graph tbody {
			position:relative;
			display:grid;
			grid-template-columns:repeat(auto-fit, minmax(1em, 1fr));
			column-gap:2.5%;
			align-items:end;
			min-height: 75px;
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
			z-index: 1;
		}

		.graph tr:hover {
			z-index:999;
		}

		.graph th,
		.graph td {
			display:block;
			text-align:center;
		}

		.target {
			position: absolute;
			border-top: 2px dashed #fbb621;
			width: 100%;
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

		.graph td.percents {
			position: absolute;
			border-radius: 0;
			bottom: 0;
			z-index: 2;
			background-color: darkgreen;
		}

		.graph td.percents:hover {
			opacity: 0;
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
			margin:-1.5em 0 0;
			background:white;
			box-shadow:0 0 0.25em rgba(0,0,0,0.6);
			font-weight:bold;
			opacity:0;
			transition:opacity 0.5s;
      color:#333;
		}

		table td span,
		.graph tr:hover td span {
			width:2em;
			margin-left:-1em; /* 1/2 the declared width */
			opacity:1;
		}
	} /* min-width:32em */
}

</style>
