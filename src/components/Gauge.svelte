<script lang="ts">
  export let value = 0.5;
  export let label = null;
  export let indicator = "slidefill"; // "slidefill" | "needle" | "short-needle"
  export let lowZone = false; 
  export let hiZone = false; 

  $: clampedValue = (+value <= 0 ? 0.02 : +value >= 1 ? 0.98 : +value);

  $: rotate = `transform: rotate(${(clampedValue / 2).toFixed(4)}turn)`;
</script>

<div class="gauge" data-testid="gauge">
  <div class="gauge__body">
    <div class="gauge__fill {indicator}" style="{rotate}"></div>
    {#if lowZone}
      <div class="gauge__fill lowZone"></div>
    {/if}
    {#if hiZone}
      <div class="gauge__fill hiZone"></div>
    {/if}
    {#if label !== null}
      <div class="gauge__cover">{label}</div>
    {:else}
      <div class="gauge__cover" >{(value * 100).toFixed()}%</div>
    {/if}
  </div>
</div>

<style>
  div.gauge {
    display: flex;
    flex-direction: column;
    text-align: center;
    overflow: hidden;
    width: 100%;
    min-width: 120px;
    max-width: 150px;
    padding: 0 10px;
    margin: 0 auto;
  }

  .gauge__body {
    width: 100%;
    height: 0;
    padding-bottom: 50%;
    background: var(--trackColor);
    position: relative;
    border-top-left-radius: 100% 200%;
    border-top-right-radius: 100% 200%;
    overflow: hidden;
  }
  
  .gauge__fill {
    position: absolute;
    top: 100%;
    left: 0;
    width: inherit;
    height: 100%;
    background: var(--fillColor);
    transform-origin: center top;
    transform: rotate(0.25turn);
  }
  
  .gauge__cover {
    width: 75%;
    height: 150%;
    background-color: var(--bgColor);
    border-radius: 50%;
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 25%;
    box-sizing: border-box;
    font-size: 25px;
    color: var(--textColor);
  }

  .needle,
  .short-needle {
    background-color: transparent;
    border-top: 2px solid var(--fillColor);
    z-index: 2;
  }

  .short-needle {
    z-index: 0;
  }

  .lowZone {
    background-color: var(--hlTrackColor);
    transform: rotate(0.167turn);
  }
  .hiZone {
    background-color: var(--hlTrackColor);
    transform: rotate(-0.167turn);
  }
</style>

