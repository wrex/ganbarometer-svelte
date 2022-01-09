<script>
  let shown = false;
  export function show() {
    shown = true;
  }
  export function hide() {
    shown = false;
  }
</script>

<svelte:window
  on:keydown={e => {
    if (e.key === "Escape") {
      hide();
    }
  }} />

{#if shown}
  <div class="modal-wrapper">
    <div class="modal">
			<svg class="closeIcon" on:click={() => hide()} viewBox="0 0 12 12">
				<circle cx=6 cy=6 r=6 />
				<line x1=3 y1=3 x2=9 y2=9 />
				<line x1=9 y1=3 x2=3 y2=9 />
			</svg>
      <slot />
    </div>
  </div>
{/if}

<style>
  .modal-wrapper {
		z-index: 9999;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #4448;
		display: flex;
		align-items: flex-start;
		justify-content: center;
  }

  .modal {
		position: relative;
		left: 0;
		width: auto;
		border-radius: 6px;
		background: white;
    border: 2px solid #000;
		filter: drop-shadow(5px 5px 5px #555);
  }

	.closeIcon {
		position: absolute;
		top:-12px;
		right:-12px;
		width:24px;
		height:24px;
		cursor: pointer;
		fill:#F44;
		transition: transform 0.3s;
	}	
	.closeIcon:hover {
		transform: scale(2);
	}
	.closeIcon line {
		stroke:#FFF;
		stroke-width:2;
	}
</style>