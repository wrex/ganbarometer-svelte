<script lang="ts">
  export let value = 0.5;
  export let label = null;

  $: rotate = `transform: rotate(${value / 2}turn)`;
</script>

<div class="gauge" data-testid="gauge">
  <div class="gauge__body">
    <div class="gauge__fill" style="{rotate}"></div>
    {#if label !== null}
      <div class="gauge__cover">{label}</div>
    {:else}
      <div class="gauge__cover">{(value * 100).toFixed()}%</div>
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
    background: var(--body-color, #e0e0e0);
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
    background: var(--fill-color, #59c273);
    transform-origin: center top;
    transform: rotate(0.25turn);
  }
  
  .gauge__cover {
    width: 75%;
    height: 150%;
    background-color: var(--bg-color, #f4f4f4);
    border-radius: 50%;
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translateX(-50%);
  
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 25%;
    box-sizing: border-box;
    font-size: 25px;
    color: var(--text-color, #004033);
  }
</style>

