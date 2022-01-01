<script lang="ts">
  export let values: number[];
	export let percents: number[] = [];
  export let labels: string[] = [];
	export let expected: number = 0;
	export let minTarget: number = 0;
	export let maxTarget: number = 0;

	$: max = Math.max(...values, expected, maxTarget);
	$: heights = values.map(v => Math.round(v/max * 100));
	$: expectedHeight = Math.round(expected/max * 100);
	$: targetHeight = Math.round((maxTarget-minTarget)/max * 100);
	$: targetBottom = 100 - targetHeight;
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
			<td aria-label="value"></td>
			{#if (percents.length)}
				<td aria-label="percents" class="percents" style="height: {(percents[i]*100).toFixed(1)}%"></td>
			{/if}
			<span class="displayBox" data-testid="displayBox">{val}{#if (percents.length)}<br>{(percents[i]*100).toFixed()}%{/if}</span>
		</tr>
    {/each}
		<div class="minmax" 
			hidden={(minTarget + maxTarget === 0)}
			style="bottom: {targetBottom}%; height: {targetHeight}%"
		></div>
		<div hidden={expectedHeight === 0} class="expected" style="height: {expectedHeight}%"></div>
	</tbody>
</table>
<p hidden>{minTarget} {maxTarget} {expected}</p>
  
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

		.expected {
			position: absolute;
			border-top: 2px dashed #fbb621;
			width: 100%;
			padding:0;
		}

		.minmax {
			position: absolute;
			background-color: #59c273;
			width: 100%;
			opacity: 25%;
			padding: 0;
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
			padding: 0;
		}

		.graph td.percents {
			position: absolute;
			border-radius: 0;
			bottom: 0;
			z-index: 2;
			background-color: black;
			opacity: 0.2;
		}

		

		.graph tr:hover td {
			opacity:0.7;
		}

		.graph tr:hover td.percents {
			opacity: 0;
		}


		.graph .displayBox {
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
			padding: 0.1em;
		}

		.graph tr:hover .displayBox {
			width:2em;
			margin-left:-1em; /* 1/2 the declared width */
			opacity:1;
			z-index: 9999;
		}
	} /* min-width:32em */
}

</style>
